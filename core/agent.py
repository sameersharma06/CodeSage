from core.model_manager import manager
from core.chunker import chunk_repo
from core.ingestion import parse_repo
from core.rule_engine import run_rules
from core.memory import store_review, get_top_patterns
from collections import defaultdict

MAX_FILES = 20
MAX_CODE_LENGTH = 2500

SKIP_PATTERNS = [
    "test_", "tests/", "spec/", "conftest",
    "fixture", "mock", "stub", ".pyc",
    "migration", "seed", "changelog"
]

HIGH_PRIORITY = [
    "auth", "login", "password", "token", "secret",
    "payment", "billing", "admin", "user", "permission",
    "database", "db", "model", "api", "route", "view",
    "main", "app", "server", "config", "settings"
]

# ----------------------------
# PROMPTS
# ----------------------------

FAST_PROMPT = """Find real bugs only.

File: {filename}
Code:
{code}

Reply:
ISSUE: <bug or None>
SEVERITY: <HIGH / MEDIUM / LOW or None>
FIX: <one line fix or None>
"""

DEEP_PROMPT = """Deep review.

File: {filename}
Fast result: {fast}

Code:
{code}

Reply:
CONFIRMED: <yes/no>
IMPACT: <what breaks>
FIX: <exact fix>
CONFIDENCE: <0-100>
"""

# ----------------------------
# FILE SELECTION
# ----------------------------

def should_skip(filename: str) -> bool:
    lower = filename.lower()
    return any(p in lower for p in SKIP_PATTERNS)

def priority_score(filename: str) -> int:
    lower = filename.lower()
    if should_skip(lower):
        return -1

    score = 0

    for keyword in HIGH_PRIORITY:
        if keyword in lower:
            score += 10

    if "src/" in lower or "core/" in lower:
        score += 5

    if "util" in lower or "helper" in lower:
        score -= 3

    return score

def group_by_file(chunks: list) -> dict:
    grouped = defaultdict(list)
    for chunk in chunks:
        grouped[chunk["filename"]].append(chunk["content"])
    return {f: "\n".join(parts) for f, parts in grouped.items()}

def pick_best_files(files: dict) -> list[tuple]:
    scored = [
        (filename, code, priority_score(filename))
        for filename, code in files.items()
    ]

    scored = [(f, c, s) for f, c, s in scored if s >= 0]
    scored.sort(key=lambda x: x[2], reverse=True)

    return [(f, c) for f, c, s in scored[:MAX_FILES]]

# ----------------------------
# MODEL PASSES
# ----------------------------

def fast_pass(filename: str, code: str):
    if len(code.strip()) < 80:
        return None

    if len(code) > MAX_CODE_LENGTH:
        code = code[:MAX_CODE_LENGTH] + "\n...(truncated)"

    return manager.run(
        FAST_PROMPT.format(filename=filename, code=code),
        mode="fast"
    )

def deep_pass(filename: str, code: str, fast_result: str):
    if len(code) > MAX_CODE_LENGTH:
        code = code[:MAX_CODE_LENGTH] + "\n...(truncated)"

    return manager.run(
        DEEP_PROMPT.format(
            filename=filename,
            fast=fast_result,
            code=code
        ),
        mode="smart"
    )

# ----------------------------
# SCORING SYSTEM
# ----------------------------

SEVERITY_SCORE = {
    "CRITICAL": 5,
    "HIGH": 4,
    "MEDIUM": 3,
    "LOW": 2
}

def score_issue(issue):
    return SEVERITY_SCORE.get(issue.get("severity", "LOW"), 1)

# ----------------------------
# CONFIDENCE SYSTEM
# ----------------------------

def add_confidence(issue):
    if issue["source"] == "RULE":
        issue["confidence"] = 90
    else:
        issue["confidence"] = 60

    if issue["severity"] == "CRITICAL":
        issue["confidence"] += 10

    return issue

# ----------------------------
# MAIN PIPELINE
# ----------------------------

def review_repo(github_url: str) -> dict:
    print(f"\nCodeSage reviewing: {github_url}\n")

    print("Step 1/4: Parsing repository...")
    parsed = parse_repo(github_url)

    print("Step 2/4: Selecting important files...")
    chunks = chunk_repo(parsed)
    all_files = group_by_file(chunks)
    selected = pick_best_files(all_files)

    print(f"Selected {len(selected)} files\n")

    all_issues = []

    for i, (filename, code) in enumerate(selected, 1):
        print(f"\n[{i}/{len(selected)}] {filename}")

        # ---------------- RULE ENGINE ----------------
        rule_hits = run_rules(filename, code)

        for hit in rule_hits:
            hit["filename"] = filename
            hit["source"] = "RULE"
            hit = add_confidence(hit)
            all_issues.append(hit)

            print(f"  RULE [{hit['severity']}] {hit['message']}")

        # ---------------- MODEL PASS ----------------
        has_high_rule = any(hit["severity"] in ["HIGH", "CRITICAL"] for hit in rule_hits)

        if not has_high_rule and len(rule_hits) == 0:
            print("  Running fast pass...")
            fast_result = fast_pass(filename, code)

            if fast_result and "None" not in str(fast_result):

                deep_result = deep_pass(filename, code, fast_result)

                # ---------------- STRONG VERIFICATION ----------------
                confirmed = False

                if deep_result:
                    text = str(deep_result).lower()

                    if "confirmed: yes" in text or "confidence" in text:
                        confirmed = True

                if confirmed:
                    severity = "MEDIUM"
                    if "HIGH" in str(fast_result):
                        severity = "HIGH"

                    issue = {
                        "filename": filename,
                        "source": "MODEL",
                        "severity": severity,
                        "message": str(fast_result)[:200],
                        "details": str(deep_result)[:400]
                    }

                    issue = add_confidence(issue)
                    all_issues.append(issue)

        else:
            print("  Skipping model (strong rule found)")

    # ---------------- GLOBAL DEDUP (FIXED) ----------------
    unique = []
    seen = set()

    for issue in all_issues:
        key = (
            issue.get("filename"),
            issue.get("rule_id"),
            issue.get("line"),
        )

        if key in seen:
            continue

        seen.add(key)
        unique.append(issue)

    all_issues = unique

    # ---------------- FILTER LOW QUALITY ----------------
    all_issues = [i for i in all_issues if i.get("confidence", 0) >= 70]

    # ---------------- SORT (SMART) ----------------
    all_issues.sort(
        key=lambda x: (x.get("confidence", 0), score_issue(x)),
        reverse=True
    )

    # ---------------- LIMIT OUTPUT (OPTIONAL BOOST) ----------------
    all_issues = all_issues[:30]

    print(f"\nFinal issues: {len(all_issues)}")

    # ---------------- MEMORY ----------------
    store_review(github_url, all_issues)

    # ---------------- HEALTH (FIXED) ----------------
    critical = [i for i in all_issues if i.get("severity") == "CRITICAL"]
    high = [i for i in all_issues if i.get("severity") == "HIGH"]
    medium = [i for i in all_issues if i.get("severity") == "MEDIUM"]
    low = [i for i in all_issues if i.get("severity") == "LOW"]

    if len(critical) > 2 or len(high) > 5:
        health = "CRITICAL"
    elif high or len(medium) > 10:
        health = "NEEDS WORK"
    else:
        health = "GOOD"

    return {
        "url": github_url,
        "file_count": parsed["file_count"],
        "health": health,
        "issue_counts": {
            "critical": len(critical),
            "high": len(high),
            "medium": len(medium),
            "low": len(low),
            "total": len(all_issues)
        },
        "issues": all_issues[:20],
        "top_patterns": get_top_patterns()
    }
