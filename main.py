#!/usr/bin/env python3
"""
CLI entry point for the resume → H-1B company matcher.

Usage:
    python main.py --resume path/to/resume.txt --data companies.json
    python main.py --resume resume.txt --data companies.json --top 15 --state CA
    python main.py --resume resume.txt --data h1b.csv --top 15 --state CA
"""

import argparse
import json
import sys

from dotenv import load_dotenv
load_dotenv()  # loads .env if present

from pipeline import run_pipeline


def main():
    parser = argparse.ArgumentParser(
        description="Match a resume to H-1B sponsoring companies."
    )
    parser.add_argument("--resume", required=True, help="Path to resume text file (.txt)")
    parser.add_argument("--data",   required=True, help="Path to H-1B employers file (.json or .csv)")
    parser.add_argument("--top",    type=int, default=10, help="Number of companies to return (default: 10)")
    parser.add_argument("--state",  default=None, help="Optional: filter by US state abbreviation (e.g. CA, NY)")
    parser.add_argument("--json",   action="store_true", help="Output results as JSON instead of pretty-print")
    args = parser.parse_args()

    # Read resume
    try:
        with open(args.resume, "r", encoding="utf-8") as f:
            resume_text = f.read()
    except FileNotFoundError:
        print(f"Error: resume file not found: {args.resume}", file=sys.stderr)
        sys.exit(1)

    if not resume_text.strip():
        print("Error: resume file is empty.", file=sys.stderr)
        sys.exit(1)

    # Run pipeline
    print("\n=== Resume → H-1B Company Matcher ===\n")
    result = run_pipeline(
        resume_text=resume_text,
        h1b_data_path=args.data,
        top_n=args.top,
        state_filter=args.state,
    )

    # Output
    if args.json:
        output = {
            "resume": result["resume"].model_dump(),
            "classification": result["classification"].model_dump(),
            "recommendations": [r.model_dump() for r in result["recommendations"]],
        }
        print(json.dumps(output, indent=2))
    else:
        _pretty_print(result)


def _pretty_print(result: dict):
    resume = result["resume"]
    clf = result["classification"]
    recs = result["recommendations"]

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
    needs_sponsorship = resume.workAuthorizationNeedsSponsorship
    sponsorship_str = {True: "Yes", False: "No", None: "Unknown"}[needs_sponsorship]
    print(f"  Sponsorship: {sponsorship_str}")

    print("\n── Job Classification ─────────────────────────────────")
    print(f"  Job Family : {clf.job_family}")
    print(f"  Sector     : {clf.sector}")
    print(f"  Rationale  : {clf.summary}")
    print(f"  SOC Match  : {', '.join(clf.soc_keywords)}")

    print(f"\n── Top {len(recs)} Recommended Companies ────────────────────────")
    for i, rec in enumerate(recs, 1):
        approvals = rec.h1bSignal.totalApprovals
        year = rec.h1bSignal.year
        approval_str = f"{approvals:,}" if approvals else "N/A"
        year_str = f" ({year})" if year else ""
        print(f"  {i:>2}. {rec.companyName}  [score: {rec.score:.3f}]")
        print(f"      H-1B approvals: {approval_str}{year_str}")
        for reason in rec.reasons:
            print(f"      • {reason}")
    print()


if __name__ == "__main__":
    main()
