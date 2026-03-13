# CLAUDE.md — Hackathon Project Context

## Project Overview

A single-page web app for international students (F-1/OPT/H1B) to search jobs and instantly see how likely a company is to sponsor visas. Fills the UX gap left by myvisajobs.com — same public data, but integrated with real job listings and an intuitive interface.

**Pitch:** "The first job search tool built for the 1.1 million international students in the US — LinkedIn shows you jobs, this shows you jobs you can actually get."

---

## Team & Roles

| Person | Role | Owns |
|---|---|---|
| Person 1 | Data | Python script → `companies.json` |
| Person 2 | Frontend | React app, company cards, search UI |
| Person 3 | Integrations | JSearch API hook, E-Verify filter, this CLAUDE.md |

All three are vibe coding with Claude in parallel. **Do not block each other** — frontend starts with hardcoded dummy data and swaps in real JSON when ready.

---

## Shared Data Contract

All three Claude sessions must use this exact shape. Do not deviate without telling the team.

```json
{
  "company": "Google",
  "lca_count": 12400,
  "approval_rate": 0.97,
  "avg_salary": 178000,
  "everify": true,
  "score": 95
}
```

- `score` is 0–100, derived from lca_count + approval_rate + recency
- `everify: true` means the company is E-Verify certified (required for OPT)
- Color coding: score ≥ 75 = green, 40–74 = yellow, < 40 = red

---

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend | React + Tailwind CSS |
| Backend | FastAPI server (`resume_matcher/api.py`) — runs locally on `localhost:8000` |
| Data | `companies.json` — 24,362 USCIS FY2026 H-1B employers, loaded by the backend |
| Job Listings | JSearch via RapidAPI (free Basic plan — 500 req/month), called from frontend |
| Data Sources | USCIS FY2026 H-1B petition data |

**No database. No auth.** Backend must be running locally for the demo (`python api.py`).

---

## User Flow

1. User uploads their resume (PDF or .txt) on the frontend
2. Frontend `POST`s the file to `http://localhost:8000/analyze`
3. Backend LLM pipeline parses the resume, infers job family, and scores all 24K H-1B employers → returns top N companies
4. Frontend takes the `companyName` list and calls JSearch API to fetch active job listings at those companies
5. Frontend renders each listing with the sponsorship score badge attached

---

## Backend API (Person 1 — running)

Start the server: `cd resume_matcher && python api.py`

### `GET /health`
Returns `{ "status": "ok", "employers_loaded": 24362 }` — use this to confirm the server is up.

### `POST /analyze`
**Form fields:**
| Field | Type | Default | Description |
|---|---|---|---|
| `resume` | file | required | .pdf or .txt resume |
| `top` | int | 10 | max companies to return |
| `state` | string | "" | optional state filter e.g. "CA" |

**Response shape:**
```json
{
  "recommendations": [
    {
      "companyName": "Google LLC",
      "scoreDisplay": 87,
      "score": 0.87,
      "reasons": ["Large H-1B sponsor (10,000+ approvals)", "Strong industry match: software"],
      "matchedSectors": ["software", "ai_ml"],
      "matchedRoles": ["software engineer", "machine learning"],
      "h1bSignal": { "totalApprovals": 10432, "year": "2026" }
    }
  ],
  "candidate": { "candidateName": "...", "jobTitles": ["..."], "skills": ["..."], ... },
  "classification": { "job_family": "Software Engineer", "sector": "Technology", ... },
  "ingestion": { "quality_score": 0.95, "word_count": 412, ... }
}
```

**Key fields for the frontend:**
- `companyName` — use this to query JSearch
- `scoreDisplay` — 0–100, use for color-coded badge (≥75 green, 40–74 yellow, <40 red)
- `h1bSignal.totalApprovals` — show as "X H-1B approvals" on the card

**JavaScript fetch example:**
```js
const form = new FormData()
form.append("resume", fileInput.files[0])
form.append("top", "10")
const res = await fetch("http://localhost:8000/analyze", { method: "POST", body: form })
const { recommendations } = await res.json()
```

---

## Frontend (Person 2)

- Resume upload UI (file input, drag-and-drop optional)
- While loading: spinner (LLM call takes ~5–10s)
- Results: job listing cards, each showing job title, company, location, apply link
- Each card gets a sponsorship score badge from our API (`scoreDisplay` + color coding)
- Score color coding: ≥75 green, 40–74 yellow, <40 red
- Start with hardcoded dummy data matching the response shape above; swap in real API call when backend is confirmed running

---

## Integrations (Person 3)

- **JSearch hook:** after `/analyze` returns `recommendations[]`, call JSearch for each `companyName` to fetch active listings. Query format: `"{jobTitle} at {companyName}"`. Use simple `.toLowerCase().includes()` for fuzzy name matching since JSearch employer names may vary slightly.
- **Note:** Free Basic plan allows 500 requests/month — batch queries or limit to top 5 companies to stay within quota.
- **E-Verify filter toggle:** our API does not include `everify` data. Either skip this feature or cross-reference the USCIS E-Verify employer list separately.

---

## 3-Hour Schedule

| Time | Milestone |
|---|---|
| 0:00–0:30 | Person 1: process DOL CSV → `companies.json` |
| 0:30–1:15 | Person 2: React UI with dummy data; Person 3: JSearch API integration |
| 1:15–2:00 | Swap in real JSON; wire up search to API results |
| 2:00–2:30 | Add E-Verify filter toggle |
| 2:30–3:00 | Polish UI, prep pitch |

---

## What's Explicitly Out of Scope (Do Not Build)

- Alumni LinkedIn data
- Auto-apply / form-filling
- User auth or accounts
- A real backend or database
- Live scraping of any site

---

## Key References

- DOL H1B LCA data: https://www.dol.gov/agencies/eta/foreign-labor/performance
- E-Verify employer list: https://www.e-verify.gov
- Inspiration / competitor: https://www.myvisajobs.com/reports/h1b/occupation//it-math-15/
- Prior art (browser extension): F1 Hire (validates demand)
- JSearch API on RapidAPI: https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch
