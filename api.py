"""
FastAPI server — wraps the resume matcher pipeline as an HTTP API.

Endpoints:
    GET  /health    — liveness check, confirms data is loaded
    POST /analyze   — upload a resume file, get ranked company recommendations

Run:
    python api.py
    # or, with auto-reload during development:
    uvicorn api:app --reload --port 8000

Configuration (set in .env or shell):
    H1B_DATA_PATH   path to companies.json or CSV  (default: ../companies.json)
    LLM_API_KEY     your OpenAI / provider key
    LLM_BASE_URL    optional provider override
    LLM_MODEL       optional model override (default: gpt-4o-mini)

Frontend usage (JavaScript fetch example):
    const form = new FormData()
    form.append("resume", fileInput.files[0])
    form.append("top", "10")
    const res = await fetch("http://localhost:8000/analyze", { method: "POST", body: form })
    const data = await res.json()
"""

import os
import tempfile
from contextlib import asynccontextmanager
from typing import Optional

import pandas as pd
from dotenv import load_dotenv
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

from h1b_matcher import load_employers, recommend_companies
from job_classifier import classify_job
from resume_ingestor import ingest_resume
from resume_parser import parse_resume

# ── Config ────────────────────────────────────────────────────────────────────

_HERE = os.path.dirname(os.path.abspath(__file__))
_DEFAULT_DATA = os.path.join(_HERE, "..", "companies.json")
_DATA_PATH = os.environ.get("H1B_DATA_PATH", _DEFAULT_DATA)

# ── Startup: load employer data once ─────────────────────────────────────────

_df: Optional[pd.DataFrame] = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global _df
    print(f"  Loading employer data from {_DATA_PATH} ...")
    _df = load_employers(_DATA_PATH)
    print(f"  Ready — {len(_df):,} employers loaded.")
    yield
    # nothing to tear down


app = FastAPI(title="Resume Matcher API", version="0.1.0", lifespan=lifespan)

# CORS — allow any localhost origin so the React dev server can call this freely
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # tighten this if you deploy beyond a demo
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# ── Endpoints ─────────────────────────────────────────────────────────────────


@app.get("/health")
def health():
    """Quick check that the server is up and data is loaded."""
    return {
        "status": "ok",
        "employers_loaded": len(_df) if _df is not None else 0,
    }


@app.post("/analyze")
async def analyze(
    resume: UploadFile = File(...,        description="Resume file — .pdf or .txt"),
    top:    int         = Form(10,         description="Max companies to return"),
    state:  str         = Form("",         description="Optional state filter, e.g. CA"),
    ocr:    bool        = Form(False,      description="Enable OCR for scanned PDFs"),
):
    """
    Upload a resume and receive ranked H-1B sponsoring company recommendations.

    Response shape:
        ingestion        — file metadata + extraction quality score
        candidate        — structured resume fields
        classification   — inferred job family, sector, SOC keywords
        recommendations  — ranked companies, each with:
                             score         (0.0–1.0 internal)
                             scoreDisplay  (0–100, use this for color coding)
                             reasons       (human-readable explanation)
                             h1bSignal     (totalApprovals, year)
    """
    if _df is None:
        raise HTTPException(status_code=503, detail="Employer data not loaded yet.")

    # Validate extension
    filename = resume.filename or ""
    ext = os.path.splitext(filename)[1].lower()
    if ext not in (".pdf", ".txt"):
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{ext}'. Please upload a .pdf or .txt file.",
        )

    # Save upload to a temp file — ingestor needs a real path on disk
    tmp_path: Optional[str] = None
    try:
        with tempfile.NamedTemporaryFile(suffix=ext, delete=False) as tmp:
            tmp.write(await resume.read())
            tmp_path = tmp.name

        # Step 0 — ingest (extract text + quality check)
        try:
            ingestion = ingest_resume(tmp_path, use_ocr=ocr)
        except (FileNotFoundError, ValueError, RuntimeError) as e:
            raise HTTPException(status_code=422, detail=str(e))

        # Step 1 — parse resume text into structured data
        candidate = parse_resume(ingestion.text)

        # Step 2 — classify job family + generate SOC keywords
        classification = classify_job(candidate)

        # Step 3 — score pre-loaded employer DataFrame, return top N
        recommendations = recommend_companies(
            _df,
            resume=candidate,
            classification=classification,
            top_n=top,
            state_filter=state.strip() or None,
        )

    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.unlink(tmp_path)

    return {
        "ingestion": ingestion.model_dump(),
        "candidate": candidate.model_dump(),
        "classification": classification.model_dump(),
        "recommendations": [
            {
                **rec.model_dump(),
                "scoreDisplay": round(rec.score * 100),  # 0–100 for frontend color coding
            }
            for rec in recommendations
        ],
    }


# ── Dev entrypoint ────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
