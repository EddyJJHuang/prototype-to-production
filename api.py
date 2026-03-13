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
_DEFAULT_DATA = os.path.join(_HERE, "companies.json")
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


# ── JSearch proxy config ─────────────────────────────────────────────────────

_JSEARCH_KEY = os.environ.get("JSEARCH_API_KEY", "")
_JSEARCH_HOST = os.environ.get("JSEARCH_API_HOST", "jsearch.p.rapidapi.com")
_JSEARCH_URL = f"https://{_JSEARCH_HOST}/search"


@app.get("/jobs")
async def search_jobs(
    q: str = "software engineer",
    page: int = 1,
    num_pages: int = 1,
    country: str = "us",
    date_posted: str = "all",
    sponsorship: bool = False,
    location: str = "",
    experience: str = "",
):
    """
    Proxy to JSearch RapidAPI.  Keeps the API key server-side.
    The frontend calls GET /jobs?q=react+developer&page=1
    """
    import httpx

    if not _JSEARCH_KEY:
        raise HTTPException(status_code=503, detail="JSEARCH_API_KEY not configured")

    query = q
    if location and location != "All":
        query = f"{q} in {location}"

    params = {
        "query": query,
        "page": str(page),
        "num_pages": str(num_pages),
        "country": country,
        "date_posted": date_posted,
    }
    headers = {
        "x-rapidapi-host": _JSEARCH_HOST,
        "x-rapidapi-key": _JSEARCH_KEY,
        "Content-Type": "application/json",
    }

    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.get(_JSEARCH_URL, params=params, headers=headers)
        resp.raise_for_status()
        raw = resp.json()

    # Map JSearch response to the frontend Job interface
    jobs = []
    for item in raw.get("data", []):
        min_sal = item.get("job_min_salary")
        max_sal = item.get("job_max_salary")
        if min_sal and max_sal:
            salary_range = f"${int(min_sal/1000)}k - ${int(max_sal/1000)}k"
        elif min_sal:
            salary_range = f"${int(min_sal/1000)}k+"
        else:
            salary_range = "Not disclosed"

        highlights = item.get("job_highlights", {}) or {}
        qualifications = highlights.get("Qualifications", [])
        responsibilities = highlights.get("Responsibilities", [])

        description = item.get("job_description", "") or ""
        if len(description) > 500:
            description = description[:500] + "..."

        jobs.append({
            "id": item.get("job_id", ""),
            "companyId": item.get("employer_name", "").lower().replace(" ", "-"),
            "companyName": item.get("employer_name", "Unknown"),
            "companyLogo": item.get("employer_logo", "") or "",
            "title": item.get("job_title", ""),
            "location": item.get("job_location", "United States"),
            "salaryRange": salary_range,
            "sponsorship": True,   # Assume all results are sponsorship-eligible for now
            "greencardSupport": False,
            "matchScore": 75 + hash(item.get("job_id", "")) % 25,  # 75-99 cosmetic score
            "postedDate": item.get("job_posted_at", "Recently"),
            "description": description,
            "requirements": qualifications[:5] if qualifications else ["See full job posting for details"],
            "matchReasons": responsibilities[:3] if responsibilities else [],
            "experienceLevel": _infer_experience_level(item.get("job_title", "")),
            "industry": "Technology",
            "applyLink": item.get("job_apply_link", ""),
            "isRemote": item.get("job_is_remote", False),
        })

    return {
        "data": jobs,
        "total": len(jobs),
        "page": page,
        "status": raw.get("status", "OK"),
    }


def _infer_experience_level(title: str) -> str:
    """Map job title keywords to an approximate experience level."""
    t = title.lower()
    if "intern" in t:
        return "Intern"
    if "senior" in t or "sr." in t or "sr " in t:
        return "Senior"
    if "staff" in t or "principal" in t or "lead" in t:
        return "Staff"
    if "junior" in t or "entry" in t or "associate" in t:
        return "Entry Level"
    return "Mid Level"


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
