"""
Step 1: Extract structured information from raw resume text.

Uses a strongly-worded prompt to enforce JSON-only output, with a
multi-layer fallback parser for resilience during demos.
"""

import json
import re
from typing import Any

from llm import call_llm
from schemas import ResumeData

# ── Prompt ────────────────────────────────────────────────────────────────────

SYSTEM_PROMPT = """
You are a precise resume data extraction engine. Your only job is to read a resume
and return a single JSON object — no prose, no explanation, no markdown fences.

Extract the following fields. Follow these rules exactly:

FIELD RULES
-----------
candidateName       : Full name as written. null if not found.
email               : Email address. null if not found.
currentLocation     : City/state or country if mentioned. null if not found.
educationLevel      : Highest degree. One of: "High School", "Associate's",
                      "Bachelor's", "Master's", "PhD", "Bootcamp", "Other". null if unclear.
universities        : List of university/college names. Empty list if none.
graduationYears     : List of graduation years as strings (e.g. ["2021", "2023"]).
                      Empty list if none.
skills              : Deduplicated list of ALL technical skills mentioned anywhere in the
                      resume. Normalize to canonical names (e.g. "Javascript" → "JavaScript",
                      "postgres" → "PostgreSQL"). Do NOT include soft skills.
programmingLanguages: Subset of skills that are programming/scripting languages only.
                      (e.g. Python, Java, TypeScript, SQL, Bash)
frameworksAndTools  : Subset of skills that are frameworks, libraries, or dev tools.
                      (e.g. React, FastAPI, PyTorch, Docker, Kubernetes, Airflow)
cloudPlatforms      : Subset of skills that are cloud platforms or cloud-native services.
                      (e.g. AWS, GCP, Azure, S3, SageMaker, BigQuery)
jobTitles           : All job titles held or mentioned, most recent first.
                      Include internship titles.
yearsOfExperienceEstimate : Total years of professional work experience as a number.
                      Count only post-graduation full-time work. null if cannot be estimated.
internshipExperience: true if any internship is mentioned. false if explicitly no internships.
                      null if unknown.
sectors             : List of 1-3 sectors this candidate belongs to. Use ONLY these values:
                      "software", "data", "ai_ml", "cybersecurity", "product", "design",
                      "cloud_devops", "it_support", "finance_tech", "health_tech", "other"
seniority           : One of: "student", "new_grad", "entry_level", "mid_level", "senior",
                      "unknown". Base this on titles + years of experience.
                      Use "new_grad" if <1 year post-graduation. "student" if still in school.
workAuthorizationNeedsSponsorship : true if resume mentions OPT, CPT, H-1B, F-1, visa
                      sponsorship required, or non-US citizenship indicators.
                      false if mentions "US Citizen", "Permanent Resident", "Green Card".
                      null if no work authorization info found.
targetRoles         : 1-3 role titles the candidate is most likely targeting based on their
                      trajectory. Infer if not stated explicitly.

OUTPUT FORMAT
-------------
Return ONLY a valid JSON object. No markdown. No explanation. No extra keys.
Start your response with { and end with }.
""".strip()

USER_PROMPT_TEMPLATE = "Extract structured data from this resume:\n\n{resume_text}"

# ── Fallback parser ───────────────────────────────────────────────────────────

def _extract_json_block(text: str) -> str:
    """
    Best-effort extraction of the first {...} block from a string.
    Handles accidental markdown fences and leading/trailing prose.
    """
    # Strip markdown fences
    text = re.sub(r"```(?:json)?", "", text).strip()

    # Find the first { ... } block by brace matching
    start = text.find("{")
    if start == -1:
        return text  # no braces found, let downstream fail with a clear error

    depth = 0
    for i, ch in enumerate(text[start:], start):
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                return text[start : i + 1]

    # Unclosed brace — return what we found and hope for the best
    return text[start:]


def _safe_list(value: Any) -> list:
    if isinstance(value, list):
        return value
    if isinstance(value, str) and value:
        return [value]
    return []


def _normalize_skills(skills: list[str]) -> list[str]:
    """Lowercase-dedup preserving original casing of first occurrence."""
    seen: set[str] = set()
    result: list[str] = []
    for s in skills:
        key = s.strip().lower()
        if key and key not in seen:
            seen.add(key)
            result.append(s.strip())
    return result


def _partial_resume_from_dict(data: dict) -> ResumeData:
    """
    Build a ResumeData from a raw dict, coercing types leniently.
    Falls back field-by-field so a bad value in one field doesn't drop everything.
    """
    def get_str(key: str):
        v = data.get(key)
        return str(v).strip() if v is not None and str(v).strip() else None

    def get_float(key: str):
        v = data.get(key)
        try:
            return float(v) if v is not None else None
        except (TypeError, ValueError):
            return None

    def get_bool(key: str):
        v = data.get(key)
        if isinstance(v, bool):
            return v
        if isinstance(v, str):
            return v.lower() in ("true", "yes", "1")
        return None

    # Skills: deduplicate across all skill lists
    all_skills = _normalize_skills(_safe_list(data.get("skills", [])))

    # Sectors: filter to valid values only
    valid_sectors = {
        "software", "data", "ai_ml", "cybersecurity", "product",
        "design", "cloud_devops", "it_support", "finance_tech", "health_tech", "other",
    }
    raw_sectors = [s for s in _safe_list(data.get("sectors", [])) if s in valid_sectors]

    valid_seniorities = {"student", "new_grad", "entry_level", "mid_level", "senior", "unknown"}
    raw_seniority = data.get("seniority")
    seniority = raw_seniority if raw_seniority in valid_seniorities else "unknown"

    return ResumeData(
        candidateName=get_str("candidateName"),
        email=get_str("email"),
        currentLocation=get_str("currentLocation"),
        educationLevel=get_str("educationLevel"),
        universities=_normalize_skills(_safe_list(data.get("universities", []))),
        graduationYears=_safe_list(data.get("graduationYears", [])),
        skills=all_skills,
        programmingLanguages=_normalize_skills(_safe_list(data.get("programmingLanguages", []))),
        frameworksAndTools=_normalize_skills(_safe_list(data.get("frameworksAndTools", []))),
        cloudPlatforms=_normalize_skills(_safe_list(data.get("cloudPlatforms", []))),
        jobTitles=_safe_list(data.get("jobTitles", [])),
        yearsOfExperienceEstimate=get_float("yearsOfExperienceEstimate"),
        internshipExperience=get_bool("internshipExperience"),
        sectors=raw_sectors,
        seniority=seniority,
        workAuthorizationNeedsSponsorship=get_bool("workAuthorizationNeedsSponsorship"),
        targetRoles=_safe_list(data.get("targetRoles", [])),
    )


# ── Public API ────────────────────────────────────────────────────────────────

def parse_resume(resume_text: str) -> ResumeData:
    """
    Call the LLM to extract structured resume data.

    Parsing strategy (most to least strict):
      1. Direct Pydantic validation of the LLM response
      2. Extract first JSON block, then validate
      3. Partial field-by-field coercion with sane defaults
    """
    raw = call_llm(
        system_prompt=SYSTEM_PROMPT,
        user_prompt=USER_PROMPT_TEMPLATE.format(resume_text=resume_text),
    )

    # Layer 1: try direct parse
    try:
        return ResumeData.model_validate_json(raw)
    except Exception:
        pass

    # Layer 2: extract JSON block, then parse
    json_block = _extract_json_block(raw)
    try:
        return ResumeData.model_validate_json(json_block)
    except Exception:
        pass

    # Layer 3: parse to plain dict, coerce field-by-field
    try:
        data = json.loads(json_block)
        return _partial_resume_from_dict(data)
    except Exception as e:
        raise ValueError(
            f"Resume parsing failed: could not extract valid JSON from LLM response.\n"
            f"Raw response (first 500 chars):\n{raw[:500]}\n"
            f"Error: {e}"
        ) from e
