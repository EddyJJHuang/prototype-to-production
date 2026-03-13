"""
Step 3+4: Load the H-1B CSV, aggregate by employer, and score each employer
against the candidate's resume profile.

Expected CSV columns (flexible naming, detected automatically):
    employer_name, initial_approvals, continuing_approvals, total_approvals,
    city, state, industry, year

All recommendations come exclusively from rows in the CSV — no hallucination possible.
"""

import math
import re
from typing import Optional

import pandas as pd

from schemas import H1bSignal, JobClassification, RecommendedCompany, ResumeData

# ── Scoring weights — edit these to retune the ranking ──────────────────────
#   All weights must sum to 1.0
WEIGHTS = {
    "volume":    0.35,  # H-1B sponsorship volume (log-scaled total approvals)
    "industry":  0.30,  # employer industry ↔ candidate sector alignment
    "role":      0.20,  # target role / SOC keywords found in employer profile
    "seniority": 0.10,  # company scale fitness for candidate's seniority level
    "location":  0.05,  # candidate location ↔ employer state/city
}

# ── Sector → industry substring keywords ────────────────────────────────────
#   Used to match the CSV's free-text 'industry' column against candidate sectors.
#   Add synonyms here if your dataset uses unusual industry names.
SECTOR_INDUSTRY_KEYWORDS: dict[str, list[str]] = {
    "software":      ["software", "computer systems", "internet", "information technology",
                      "it services", "tech", "web", "application"],
    "data":          ["data processing", "data", "analytics", "business intelligence",
                      "information services", "database"],
    "ai_ml":         ["artificial intelligence", "machine learning", "research",
                      "software", "computer", "technology"],
    "cybersecurity": ["security", "cyber", "defense", "surveillance", "government",
                      "consulting"],
    "cloud_devops":  ["cloud", "infrastructure", "managed services", "internet",
                      "computer", "networking"],
    "product":       ["software", "internet", "consumer", "mobile", "platform",
                      "technology"],
    "design":        ["design", "media", "advertising", "creative", "marketing"],
    "finance_tech":  ["finance", "financial", "banking", "insurance", "investment",
                      "securities", "capital", "asset management"],
    "health_tech":   ["health", "medical", "hospital", "pharmaceutical", "biotech",
                      "life sciences", "clinical", "healthcare"],
    "it_support":    ["information technology", "consulting", "staffing", "services",
                      "managed", "outsourcing"],
    "other":         [],
}

# ── Seniority → preferred approval thresholds ───────────────────────────────
#   Large approval counts are used as a proxy for company scale.
#   Larger companies tend to have structured programs for juniors;
#   seniors can thrive anywhere.
SENIORITY_THRESHOLDS = {
    "student":     {"high": 500,  "medium": 100},  # strongly prefer large
    "new_grad":    {"high": 500,  "medium": 100},
    "entry_level": {"high": 200,  "medium": 50},
    "mid_level":   {"high": 100,  "medium": 20},   # size matters less
    "senior":      {"high": 50,   "medium": 10},   # even small companies fine
    "unknown":     {"high": 200,  "medium": 50},
}

# ── US state name → abbreviation lookup (for location matching) ─────────────
_STATE_ABBR: dict[str, str] = {
    "alabama": "AL", "alaska": "AK", "arizona": "AZ", "arkansas": "AR",
    "california": "CA", "colorado": "CO", "connecticut": "CT", "delaware": "DE",
    "florida": "FL", "georgia": "GA", "hawaii": "HI", "idaho": "ID",
    "illinois": "IL", "indiana": "IN", "iowa": "IA", "kansas": "KS",
    "kentucky": "KY", "louisiana": "LA", "maine": "ME", "maryland": "MD",
    "massachusetts": "MA", "michigan": "MI", "minnesota": "MN", "mississippi": "MS",
    "missouri": "MO", "montana": "MT", "nebraska": "NE", "nevada": "NV",
    "new hampshire": "NH", "new jersey": "NJ", "new mexico": "NM", "new york": "NY",
    "north carolina": "NC", "north dakota": "ND", "ohio": "OH", "oklahoma": "OK",
    "oregon": "OR", "pennsylvania": "PA", "rhode island": "RI", "south carolina": "SC",
    "south dakota": "SD", "tennessee": "TN", "texas": "TX", "utah": "UT",
    "vermont": "VT", "virginia": "VA", "washington": "WA", "west virginia": "WV",
    "wisconsin": "WI", "wyoming": "WY", "district of columbia": "DC",
}

# ── Column name detection ────────────────────────────────────────────────────

_COL_CANDIDATES = {
    "employer":      ["employer_name", "employer", "company", "company_name", "petitioner_name"],
    "total":         ["total_approvals", "total", "approvals", "count"],
    "initial":       ["initial_approvals", "initial"],
    "continuing":    ["continuing_approvals", "continuing"],
    "state":         ["state", "employer_state", "worksite_state"],
    "city":          ["city", "employer_city", "worksite_city"],
    "industry":      ["industry", "naics_industry", "industry_name", "sector"],
    "year":          ["year", "fiscal_year", "fy"],
}


def _find_col(df: pd.DataFrame, key: str) -> Optional[str]:
    lower_map = {c.lower().strip(): c for c in df.columns}
    for candidate in _COL_CANDIDATES[key]:
        if candidate in lower_map:
            return lower_map[candidate]
    return None


# ── Data loading & aggregation ───────────────────────────────────────────────

def load_h1b_csv(csv_path: str) -> pd.DataFrame:
    df = pd.read_csv(csv_path, low_memory=False)
    df.columns = df.columns.str.strip()
    return df


def _aggregate_by_employer(df: pd.DataFrame, cols: dict) -> pd.DataFrame:
    """
    Collapse multiple rows for the same employer (e.g. different fiscal years)
    into a single row. Approvals are summed; categorical fields take the mode.
    If the CSV already has one row per employer this is a no-op.
    """
    emp_col = cols["employer"]

    # Normalize employer name for grouping (strip, collapse whitespace, upper)
    key_col = "__emp_key__"
    df[key_col] = df[emp_col].fillna("").str.strip().str.upper()
    df[key_col] = df[key_col].str.replace(r"\s+", " ", regex=True)

    agg: dict = {emp_col: "first"}  # keep original casing of first occurrence

    for field in ("total", "initial", "continuing"):
        c = cols.get(field)
        if c:
            df[c] = pd.to_numeric(df[c], errors="coerce")
            agg[c] = "sum"

    for field in ("state", "city", "industry"):
        c = cols.get(field)
        if c:
            agg[c] = lambda s: s.dropna().mode().iloc[0] if not s.dropna().empty else None

    if cols.get("year"):
        agg[cols["year"]] = "max"

    grouped = df.groupby(key_col, sort=False).agg(agg).reset_index(drop=True)
    return grouped


# ── Scoring helpers ──────────────────────────────────────────────────────────

def _volume_score(total_approvals: Optional[float], max_approvals: float) -> float:
    """Log-scale score so top companies don't completely dominate."""
    if not total_approvals or max_approvals <= 0:
        return 0.5  # neutral if data is missing
    return math.log1p(total_approvals) / math.log1p(max_approvals)


def _industry_score(
    industry: Optional[str],
    candidate_sectors: list[str],
) -> tuple[float, list[str]]:
    """
    Returns (score, matched_sector_names).
    Score = fraction of candidate's sectors that matched the employer's industry.
    """
    if not industry or not candidate_sectors:
        return 0.5, []  # neutral when data is absent

    industry_lower = industry.lower()
    matched = []

    for sector in candidate_sectors:
        keywords = SECTOR_INDUSTRY_KEYWORDS.get(sector, [])
        if any(kw in industry_lower for kw in keywords):
            matched.append(sector)

    score = len(matched) / len(candidate_sectors) if candidate_sectors else 0.5
    return score, matched


def _role_score(
    employer_name: str,
    industry: Optional[str],
    target_roles: list[str],
    soc_keywords: list[str],
) -> tuple[float, list[str]]:
    """
    Returns (score, matched_role_strings).
    Checks if meaningful tokens from target roles / SOC keywords appear
    in the employer name or industry string.
    Ignores tokens shorter than 5 chars to reduce noise.
    """
    haystack = f"{employer_name} {industry or ''}".lower()

    # Collect candidate phrases: full multi-word phrases first, then individual words
    candidates: list[tuple[str, str]] = []  # (display_label, search_token)
    for role in target_roles + soc_keywords:
        role_lower = role.lower().strip()
        candidates.append((role, role_lower))          # full phrase
        for word in role_lower.split():
            if len(word) >= 5:
                candidates.append((role, word))        # individual meaningful word

    matched_labels: list[str] = []
    seen_labels: set[str] = set()

    for label, token in candidates:
        if token in haystack and label not in seen_labels:
            matched_labels.append(label)
            seen_labels.add(label)

    score = min(1.0, len(matched_labels) * 0.4) if matched_labels else 0.0
    return score, matched_labels


def _seniority_score(
    total_approvals: Optional[float],
    seniority: Optional[str],
) -> float:
    """
    Companies with high approval counts are preferred for early-career candidates
    (structured programs, brand recognition, large intern pipelines).
    Experienced candidates can do well at any company size.
    """
    if not total_approvals:
        return 0.5

    level = seniority or "unknown"
    thresholds = SENIORITY_THRESHOLDS.get(level, SENIORITY_THRESHOLDS["unknown"])

    if total_approvals >= thresholds["high"]:
        return 1.0 if level in ("student", "new_grad", "entry_level") else 0.8
    elif total_approvals >= thresholds["medium"]:
        return 0.6
    else:
        return 0.3 if level in ("student", "new_grad") else 0.7


def _location_score(
    employer_state: Optional[str],
    employer_city: Optional[str],
    candidate_location: Optional[str],
) -> tuple[float, Optional[str]]:
    """
    Returns (score, match_description).
    Tries to extract a state abbreviation from the candidate's free-text location.
    """
    if not candidate_location or not employer_state:
        return 0.0, None

    loc_lower = candidate_location.lower()

    # Try two-letter state code directly
    direct_match = re.search(r"\b([A-Z]{2})\b", candidate_location)
    candidate_state = direct_match.group(1) if direct_match else None

    # Try full state name
    if not candidate_state:
        for name, abbr in _STATE_ABBR.items():
            if name in loc_lower:
                candidate_state = abbr
                break

    if not candidate_state:
        return 0.0, None

    if str(employer_state).upper().strip() == candidate_state:
        desc = f"{employer_city}, {employer_state}" if employer_city else employer_state
        return 1.0, desc

    return 0.0, None


# ── Main recommendation function ─────────────────────────────────────────────

def recommend_companies(
    df: pd.DataFrame,
    resume: ResumeData,
    classification: JobClassification,
    top_n: int = 10,
    state_filter: Optional[str] = None,
) -> list[RecommendedCompany]:
    """
    Score every employer in the CSV against the candidate profile and return
    the top_n results sorted by composite score (descending).

    Only companies present in the CSV are ever returned.
    """
    # Detect columns
    cols = {key: _find_col(df, key) for key in _COL_CANDIDATES}

    emp_col = cols["employer"]
    if not emp_col:
        raise ValueError(
            f"No employer column found. Columns available: {list(df.columns)}"
        )

    # Aggregate multi-year rows into one row per employer
    agg = _aggregate_by_employer(df, cols)

    # Optional hard state filter (applied before scoring)
    if state_filter and cols["state"]:
        mask = agg[cols["state"]].fillna("").str.upper() == state_filter.upper()
        filtered = agg[mask]
        if not filtered.empty:
            agg = filtered
        else:
            print(f"  [warn] state_filter={state_filter} matched 0 rows, ignoring.")

    # Compute max approvals for log-normalization
    total_col = cols["total"]
    max_approvals: float = 1.0
    if total_col and total_col in agg.columns:
        max_approvals = float(agg[total_col].max() or 1.0)

    results: list[RecommendedCompany] = []

    for _, row in agg.iterrows():
        name = str(row[emp_col]).strip()
        if not name or name.lower() in ("nan", ""):
            continue

        total = float(row[total_col]) if total_col and pd.notna(row.get(total_col)) else None
        industry = str(row[cols["industry"]]).strip() if cols["industry"] and pd.notna(row.get(cols["industry"])) else None
        state = str(row[cols["state"]]).strip() if cols["state"] and pd.notna(row.get(cols["state"])) else None
        city  = str(row[cols["city"]]).strip()  if cols["city"]  and pd.notna(row.get(cols["city"]))  else None
        year  = str(int(row[cols["year"]])) if cols["year"] and pd.notna(row.get(cols["year"])) else None

        # ── Score each dimension ──────────────────────────────────────────

        v_score = _volume_score(total, max_approvals)

        i_score, matched_sectors = _industry_score(industry, resume.sectors)

        r_score, matched_roles = _role_score(
            name, industry, resume.targetRoles, classification.soc_keywords
        )

        s_score = _seniority_score(total, resume.seniority)

        l_score, loc_desc = _location_score(state, city, resume.currentLocation)

        # ── Weighted composite ────────────────────────────────────────────
        composite = (
            WEIGHTS["volume"]    * v_score
            + WEIGHTS["industry"]  * i_score
            + WEIGHTS["role"]      * r_score
            + WEIGHTS["seniority"] * s_score
            + WEIGHTS["location"]  * l_score
        )

        # ── Build human-readable reasons ──────────────────────────────────
        reasons: list[str] = []

        if total:
            reasons.append(f"Active H-1B sponsor: {int(total):,} total approvals")
        else:
            reasons.append("H-1B approval count not available")

        if matched_sectors:
            reasons.append(
                f"Industry '{industry}' aligns with your "
                f"{', '.join(matched_sectors)} background"
            )
        elif industry:
            reasons.append(f"Industry: {industry}")

        if matched_roles:
            reasons.append(
                f"Role keywords matched: {', '.join(matched_roles[:3])}"
            )

        reasons.append(
            f"Company scale {_seniority_label(total)} — fits {resume.seniority or 'unknown'} candidates"
        )

        if loc_desc:
            reasons.append(f"Located in your area: {loc_desc}")

        results.append(
            RecommendedCompany(
                companyName=name,
                score=round(composite, 4),
                reasons=reasons,
                matchedSectors=matched_sectors,
                matchedRoles=matched_roles,
                h1bSignal=H1bSignal(
                    totalApprovals=int(total) if total else None,
                    year=year,
                ),
            )
        )

    results.sort(key=lambda r: r.score, reverse=True)
    return results[:top_n]


def _seniority_label(total_approvals: Optional[float]) -> str:
    if not total_approvals:
        return "(unknown size)"
    if total_approvals >= 500:
        return "(large company)"
    if total_approvals >= 100:
        return "(mid-size company)"
    return "(small company)"
