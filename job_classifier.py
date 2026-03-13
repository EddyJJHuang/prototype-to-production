"""
Step 2: Infer the user's job family and sector from their parsed resume.
Also produces SOC keyword hints used to filter the H-1B CSV.
"""

from llm import call_llm_structured
from schemas import JobClassification, ResumeData

SYSTEM_PROMPT = """
You are a career classification expert. Given structured resume data, determine:
1. The specific job family (e.g. "Machine Learning Engineer", "Frontend Software Engineer",
   "Data Analyst", "DevOps Engineer", "Product Manager")
2. The broad sector (e.g. "Technology / AI", "Finance / FinTech", "Healthcare IT")
3. A list of 3-6 SOC (Standard Occupational Classification) keywords that would appear
   in job titles for H-1B visa petitions for this role.
   Examples: ["software developer", "data scientist", "systems analyst", "engineer"]
4. A one-line summary of your reasoning.

Be specific. Prefer the most precise job family that fits the evidence.
""".strip()


def classify_job(resume: ResumeData) -> JobClassification:
    resume_summary = resume.model_dump_json(indent=2)
    return call_llm_structured(
        system_prompt=SYSTEM_PROMPT,
        user_prompt=f"Classify this candidate's job family:\n\n{resume_summary}",
        schema=JobClassification,
    )
