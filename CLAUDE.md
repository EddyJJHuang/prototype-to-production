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
| Backend | None — static JSON lookup, no server needed |
| Data | Pre-processed `companies.json` bundled with app |
| Job Listings | Active Jobs DB via RapidAPI (free tier) |
| Data Sources | DOL H1B LCA disclosure CSVs + USCIS E-Verify employer list |

**No database. No auth. No live scraping.** Everything runs locally from the bundled JSON for the demo.

---

## Data Pipeline (Person 1)

Python script should:
1. Download the DOL H1B LCA disclosure CSV from `dol.gov`
2. Filter for CS/IT job titles
3. Output top 500 companies as `companies.json` with the shared data shape above
4. Script runs **once** before the demo — output is committed to the repo

Prompt to use with Claude:
> "Write a Python script that downloads the DOL H1B LCA disclosure data CSV, filters for CS/IT job titles, and outputs a JSON of top 500 companies with name, total LCA count, approval rate, and average salary."

---

## Frontend (Person 2)

- Single search bar: user types a job title (e.g. "Software Engineer Intern")
- Results: company cards ranked by sponsorship score
- Each card shows: company name, score badge (color-coded), LCA count, avg salary, E-Verify badge
- Start with hardcoded dummy data (2–3 companies using the shared shape above)
- Swap in real `companies.json` once Person 1 is done

---

## Integrations (Person 3)

- **Active Jobs DB hook:** takes the user's job title query, hits Active Jobs DB API (RapidAPI), returns real job listings sourced directly from employer ATS platforms (Workday, Greenhouse, Lever, etc.), cross-references employer name against `companies.json` to inject sponsorship data. Preferred over JSearch because ATS-sourced employer names are canonical and match the DOL LCA data more reliably.
- **Note:** Active Jobs DB recommends pre-fetching rather than ad-hoc queries. For the demo, pre-fetch a batch of CS/SWE listings and bundle alongside `companies.json`.
- **E-Verify filter toggle:** a UI toggle that filters results to only `everify: true` companies — this is the "wow factor" differentiator vs myvisajobs

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
- Active Jobs DB API: https://rapidapi.com/fantastic-jobs-fantastic-jobs-default/api/active-jobs-db
