from typing import Literal, Optional

from pydantic import BaseModel

# ── Controlled vocabularies ──────────────────────────────────────────────────

SectorType = Literal[
    "software",
    "data",
    "ai_ml",
    "cybersecurity",
    "product",
    "design",
    "cloud_devops",
    "it_support",
    "finance_tech",
    "health_tech",
    "other",
]

SeniorityType = Literal[
    "student",
    "new_grad",
    "entry_level",
    "mid_level",
    "senior",
    "unknown",
]

# ── Resume extraction schema ─────────────────────────────────────────────────

class ResumeData(BaseModel):
    candidateName: Optional[str] = None
    email: Optional[str] = None
    currentLocation: Optional[str] = None

    # Education
    educationLevel: Optional[str] = None        # e.g. "Bachelor's", "Master's", "PhD"
    universities: list[str] = []
    graduationYears: list[str] = []             # strings to handle ranges like "2022-2024"

    # Skills (deduplicated, normalized)
    skills: list[str] = []                      # all technical skills, deduplicated
    programmingLanguages: list[str] = []
    frameworksAndTools: list[str] = []
    cloudPlatforms: list[str] = []

    # Work history
    jobTitles: list[str] = []                   # all titles, most recent first
    yearsOfExperienceEstimate: Optional[float] = None
    internshipExperience: Optional[bool] = None

    # Classification hints
    sectors: list[SectorType] = []             # from controlled vocabulary
    seniority: Optional[SeniorityType] = None  # from controlled vocabulary

    # Sponsorship signal
    workAuthorizationNeedsSponsorship: Optional[bool] = None  # True if OPT/CPT/H-1B mentioned

    # Inferred intent
    targetRoles: list[str] = []                # roles the candidate seems to be targeting


# ── Downstream schemas ───────────────────────────────────────────────────────

class JobClassification(BaseModel):
    job_family: str          # e.g. "Machine Learning Engineer"
    sector: str              # e.g. "Technology / AI"
    soc_keywords: list[str]  # keywords to match against H-1B SOC titles
    summary: str             # one-line rationale


class H1bSignal(BaseModel):
    totalApprovals: Optional[int] = None
    year: Optional[str] = None


class RecommendedCompany(BaseModel):
    companyName: str
    sector: str               # primary sector for JSearch query
    score: float              # 0.0 – 1.0, weighted composite
    reasons: list[str]        # human-readable explanation of each score component
    matchedSectors: list[str] # candidate sectors that matched this employer's industry
    matchedRoles: list[str]   # target role keywords that matched
    h1bSignal: H1bSignal
