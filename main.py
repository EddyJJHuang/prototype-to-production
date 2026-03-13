#!/usr/bin/env python3
"""
CLI entry point for the resume → H-1B company matcher.

Usage:
    python main.py --resume resume.txt   --data companies.json
    python main.py --resume resume.pdf   --data companies.json
    python main.py --resume resume.pdf   --data companies.json --ocr
    python main.py --resume resume.pdf   --data companies.json --top 15 --state CA --json
"""

import argparse
import json
import sys

from dotenv import load_dotenv
load_dotenv()  # loads .env if present

from pipeline import run_pipeline
from resume_ingestor import ingest_resume


def main():
    parser = argparse.ArgumentParser(
        description="Match a resume to H-1B sponsoring companies."
    )
    parser.add_argument("--resume", required=True, help="Path to resume file (.txt or .pdf)")
    parser.add_argument("--data",   required=True, help="Path to H-1B employers file (.json or .csv)")
    parser.add_argument("--top",    type=int, default=10, help="Number of companies to return (default: 10)")
    parser.add_argument("--state",  default=None, help="Optional: filter by US state abbreviation (e.g. CA, NY)")
    parser.add_argument("--ocr",    action="store_true", help="Enable OCR fallback for scanned/image PDFs")
    parser.add_argument("--json",   action="store_true", help="Output results as JSON instead of pretty-print")
    args = parser.parse_args()

    # ── Ingest resume ────────────────────────────────────────────────────────
    try:
        ingestion = ingest_resume(args.resume, use_ocr=args.ocr)
    except (FileNotFoundError, ValueError) as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
    except RuntimeError as e:
        print(f"PDF extraction error: {e}", file=sys.stderr)
        sys.exit(1)

    # Print any ingestion warnings immediately so the user sees them
    for w in ingestion.warnings:
        print(f"[warn] {w}", file=sys.stderr)

    # ── Run pipeline ─────────────────────────────────────────────────────────
    print("\n=== Resume → H-1B Company Matcher ===\n")
    result = run_pipeline(
        resume_text=ingestion.text,
        h1b_data_path=args.data,
        top_n=args.top,
        state_filter=args.state,
    )
    result["ingestion"] = ingestion  # attach metadata for output

    # ── Output ───────────────────────────────────────────────────────────────
    if args.json:
        output = {
            "ingestion": ingestion.model_dump(),
            "resume": result["resume"].model_dump(),
            "classification": result["classification"].model_dump(),
            "recommendations": [r.model_dump() for r in result["recommendations"]],
        }
        print(json.dumps(output, indent=2))
    else:
        _pretty_print(result)


def _pretty_print(result: dict):
    ingestion = result["ingestion"]
    resume    = result["resume"]
    clf       = result["classification"]
    recs      = result["recommendations"]

    # ── Ingestion metadata ───────────────────────────────────────────────────
    print("\n── Resume Ingestion ──────────────────────────────────")
    print(f"  File       : {ingestion.source_path}")
    print(f"  Format     : {ingestion.file_type.upper()}")
    print(f"  Method     : {ingestion.method_used}")
    if ingestion.page_count is not None:
        print(f"  Pages      : {ingestion.page_count}")
    print(f"  Words      : {ingestion.word_count:,}")
    print(f"  Quality    : {ingestion.quality_score:.2f} / 1.00")
    if ingestion.warnings:
        for w in ingestion.warnings:
            print(f"  ⚠  {w}")

    # ── Candidate profile ────────────────────────────────────────────────────
    print("\n── Candidate Profile ─────────────────────────────────")
    print(f"  Name       : {resume.candidateName or 'N/A'}")
    print(f"  Location   : {resume.currentLocation or 'N/A'}")
    print(f"  Title      : {resume.jobTitles[0] if resume.jobTitles else 'N/A'}")
    print(f"  Seniority  : {resume.seniority or 'N/A'}")
    print(f"  Experience : {resume.yearsOfExperienceEstimate or 'N/A'} years")
    print(f"  Education  : {resume.educationLevel or 'N/A'} — {', '.join(resume.universities) or 'N/A'}")
    print(f"  Languages  : {', '.join(resume.programmingLanguages[:6]) or 'N/A'}")
    print(f"  Tools      : {', '.join(resume.frameworksAndTools[:6]) or 'N/A'}")
    print(f"  Cloud      : {', '.join(resume.cloudPlatforms) or 'N/A'}")
    print(f"  Sectors    : {', '.join(resume.sectors) or 'N/A'}")
    sponsorship_str = {True: "Yes", False: "No", None: "Unknown"}[resume.workAuthorizationNeedsSponsorship]
    print(f"  Sponsorship: {sponsorship_str}")

    # ── Job classification ───────────────────────────────────────────────────
    print("\n── Job Classification ─────────────────────────────────")
    print(f"  Job Family : {clf.job_family}")
    print(f"  Sector     : {clf.sector}")
    print(f"  Rationale  : {clf.summary}")
    print(f"  SOC Match  : {', '.join(clf.soc_keywords)}")

    # ── Recommendations ──────────────────────────────────────────────────────
    print(f"\n── Top {len(recs)} Recommended Companies ────────────────────────")
    for i, rec in enumerate(recs, 1):
        approvals   = rec.h1bSignal.totalApprovals
        year        = rec.h1bSignal.year
        approval_str = f"{approvals:,}" if approvals else "N/A"
        year_str     = f" ({year})" if year else ""
        print(f"  {i:>2}. {rec.companyName}  [score: {rec.score:.3f}]")
        print(f"      H-1B approvals: {approval_str}{year_str}")
        for reason in rec.reasons:
            print(f"      • {reason}")
    print()


if __name__ == "__main__":
    main()
