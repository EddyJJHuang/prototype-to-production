"""
Orchestrates the full resume → company recommendation pipeline.
"""

from typing import Optional

from h1b_matcher import load_h1b_csv, recommend_companies
from job_classifier import classify_job
from resume_parser import parse_resume
from schemas import JobClassification, RecommendedCompany, ResumeData


def run_pipeline(
    resume_text: str,
    h1b_csv_path: str,
    top_n: int = 10,
    state_filter: Optional[str] = None,
) -> dict:
    """
    Full pipeline. Returns a dict with all intermediate results plus final recommendations.
    """
    print("Step 1/3  Parsing resume...")
    resume: ResumeData = parse_resume(resume_text)
    recent_title = resume.jobTitles[0] if resume.jobTitles else "unknown title"
    print(f"          → {recent_title} | {len(resume.skills)} skills | seniority: {resume.seniority}")

    print("Step 2/3  Classifying job family...")
    classification: JobClassification = classify_job(resume)
    print(f"          → {classification.job_family} ({classification.sector})")
    print(f"          → SOC keywords: {classification.soc_keywords}")

    print("Step 3/3  Scoring H-1B employers...")
    df = load_h1b_csv(h1b_csv_path)
    print(f"          → Loaded {len(df):,} rows from CSV")
    recommendations: list[RecommendedCompany] = recommend_companies(
        df,
        resume=resume,
        classification=classification,
        top_n=top_n,
        state_filter=state_filter,
    )
    print(f"          → Scored {len(recommendations)} recommendations")

    return {
        "resume": resume,
        "classification": classification,
        "recommendations": recommendations,
    }
