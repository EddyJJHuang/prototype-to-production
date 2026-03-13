"""
Resume ingestion layer.

Accepts .txt or .pdf and returns the extracted text plus structured metadata.

Extraction strategy:
  .txt          → direct UTF-8 read
  .pdf          → pdfplumber direct extraction  (always attempted first)
  .pdf + --ocr  → pytesseract OCR fallback       (only if direct quality is poor)

Quality scoring (0.0 – 1.0) checks three things:
  - printable character ratio   (low → garbled or binary content)
  - average word length         (very high → ligature mess or no spaces)
  - word volume                 (very low  → image-only PDF)

Thresholds:
  >= 0.6   good  — proceed normally
  0.3–0.6  warn  — proceed but note potential gaps
  < 0.3    bad   — strongly suggest OCR; still proceeds so the LLM can try
"""

import os
import unicodedata
from typing import Optional

from pydantic import BaseModel

# ── Quality thresholds ───────────────────────────────────────────────────────
_QUALITY_WARN = 0.4   # warn in output below this
_QUALITY_FAIL = 0.25  # suggest OCR below this


# ── Ingestion result schema ──────────────────────────────────────────────────

class IngestionResult(BaseModel):
    text: str
    source_path: str
    file_type: str           # "txt" or "pdf"
    method_used: str         # "txt_read" | "pdf_direct" | "pdf_ocr"
    page_count: Optional[int] = None
    char_count: int
    word_count: int
    quality_score: float     # 0.0 – 1.0
    warnings: list[str] = []


# ── Quality scoring ──────────────────────────────────────────────────────────

def _quality_score(text: str) -> float:
    """
    Heuristic quality score for extracted text.
    Returns a float in [0.0, 1.0].
    """
    stripped = text.strip()
    if not stripped:
        return 0.0

    chars = list(stripped)
    char_count = len(chars)
    words = stripped.split()
    word_count = len(words)

    # 1. Printable ratio — low means binary/garbled content
    printable = sum(1 for c in chars if c.isprintable() or c in "\n\r\t")
    printable_ratio = printable / char_count

    # 2. Average word length — good resumes have avg 4–12 chars per word
    avg_word_len = sum(len(w) for w in words) / word_count if word_count else 0
    if 4 <= avg_word_len <= 12:
        word_len_score = 1.0
    elif avg_word_len > 12:
        # Likely garbled (e.g. "ExperienceatGoogle" with no spaces)
        word_len_score = max(0.0, 1.0 - (avg_word_len - 12) / 20)
    else:
        word_len_score = max(0.0, avg_word_len / 4)

    # 3. Volume — expect at least 150 words for a useful resume
    volume_score = min(1.0, word_count / 150)

    score = (printable_ratio * 0.4) + (word_len_score * 0.35) + (volume_score * 0.25)
    return round(min(1.0, max(0.0, score)), 3)


def _normalize(text: str) -> str:
    """Normalize Unicode (handles PDF ligatures like ﬁ → fi, ﬀ → ff)."""
    return unicodedata.normalize("NFKC", text)


# ── Extractors ───────────────────────────────────────────────────────────────

def _read_txt(path: str) -> str:
    with open(path, "r", encoding="utf-8", errors="replace") as f:
        return f.read()


def _extract_pdf_direct(path: str) -> tuple[str, int]:
    """
    Direct text extraction via pdfplumber.
    Returns (text, page_count).
    Raises ImportError if pdfplumber is not installed.
    """
    try:
        import pdfplumber
    except ImportError:
        raise ImportError(
            "pdfplumber is required for PDF support.\n"
            "Install with: pip install pdfplumber"
        )

    pages: list[str] = []
    with pdfplumber.open(path) as pdf:
        page_count = len(pdf.pages)
        for page in pdf.pages:
            pages.append(page.extract_text() or "")

    return _normalize("\n\n".join(pages)), page_count


def _extract_pdf_ocr(path: str) -> tuple[str, int]:
    """
    OCR fallback via pdf2image + pytesseract.
    Returns (text, page_count).

    System prerequisites (macOS):
        brew install tesseract poppler

    Python prerequisites:
        pip install pdf2image pytesseract
    """
    try:
        from pdf2image import convert_from_path
        import pytesseract
    except ImportError:
        raise ImportError(
            "OCR fallback requires pdf2image and pytesseract.\n"
            "Install with: pip install pdf2image pytesseract\n"
            "System deps (macOS): brew install tesseract poppler"
        )

    images = convert_from_path(path, dpi=300)
    pages = [pytesseract.image_to_string(img) for img in images]
    return _normalize("\n\n".join(pages)), len(images)


# ── Public API ────────────────────────────────────────────────────────────────

def ingest_resume(path: str, use_ocr: bool = False) -> IngestionResult:
    """
    Ingest a resume from a .txt or .pdf file.

    Args:
        path:    Absolute or relative path to the resume file.
        use_ocr: If True, falls back to OCR when direct PDF extraction
                 quality is below the failure threshold.

    Returns:
        IngestionResult with extracted text and ingestion metadata.

    Raises:
        FileNotFoundError  — file does not exist
        ValueError         — unsupported extension, or no text extracted at all
        RuntimeError       — PDF extraction encountered an unexpected error
    """
    if not os.path.exists(path):
        raise FileNotFoundError(f"Resume file not found: {path}")

    ext = os.path.splitext(path)[1].lower()
    warnings: list[str] = []
    page_count: Optional[int] = None
    method: str

    # ── Extract raw text ─────────────────────────────────────────────────────
    if ext == ".txt":
        text = _read_txt(path)
        method = "txt_read"

    elif ext == ".pdf":
        try:
            text, page_count = _extract_pdf_direct(path)
            method = "pdf_direct"
        except ImportError as e:
            raise
        except Exception as e:
            raise RuntimeError(f"PDF extraction failed: {e}") from e

        direct_quality = _quality_score(text)

        if direct_quality < _QUALITY_FAIL:
            if use_ocr:
                warnings.append(
                    f"Direct extraction quality low ({direct_quality:.2f}) — "
                    "switching to OCR."
                )
                text, page_count = _extract_pdf_ocr(path)
                method = "pdf_ocr"
            else:
                warnings.append(
                    f"Direct extraction quality is very low ({direct_quality:.2f}). "
                    "This may be a scanned/image-only PDF. "
                    "Re-run with --ocr to attempt OCR extraction."
                )
        elif direct_quality < _QUALITY_WARN:
            warnings.append(
                f"Extraction quality is moderate ({direct_quality:.2f}). "
                "Some content may be missing or garbled."
            )

    else:
        raise ValueError(
            f"Unsupported file type '{ext}'. Supported formats: .txt, .pdf"
        )

    # ── Validate output ──────────────────────────────────────────────────────
    if not text.strip():
        hint = " Try --ocr for scanned PDFs." if ext == ".pdf" and not use_ocr else ""
        raise ValueError(f"No text could be extracted from: {path}.{hint}")

    quality = _quality_score(text)
    words = text.split()

    return IngestionResult(
        text=text,
        source_path=os.path.abspath(path),
        file_type=ext.lstrip("."),
        method_used=method,
        page_count=page_count,
        char_count=len(text),
        word_count=len(words),
        quality_score=quality,
        warnings=warnings,
    )
