# core/memory.py

import json
import os
from datetime import datetime

MEMORY_FILE = "memory/patterns.json"
MAX_REVIEWS = 100  # prevent unlimited growth


def _load() -> dict:
    os.makedirs("memory", exist_ok=True)

    if not os.path.exists(MEMORY_FILE):
        return {"reviews": [], "patterns": {}, "total_issues": 0}

    try:
        with open(MEMORY_FILE, encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        # corrupted file fallback
        return {"reviews": [], "patterns": {}, "total_issues": 0}


def _save(data: dict):
    with open(MEMORY_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)


def store_review(url: str, issues: list[dict]):
    data = _load()

    # limit stored reviews
    if len(data["reviews"]) >= MAX_REVIEWS:
        data["reviews"].pop(0)

    data["reviews"].append({
        "url": url,
        "date": datetime.now().isoformat(),
        "issue_count": len(issues)
    })

    for issue in issues:
        # ----------------------------
        # CLEAN RULE ID (NO GARBAGE)
        # ----------------------------
        rule_id = issue.get("rule_id")

        if not rule_id:
            if issue.get("source") == "MODEL":
                rule_id = "MODEL_VALIDATED"
            else:
                continue  # skip unknown garbage

        data["patterns"][rule_id] = data["patterns"].get(rule_id, 0) + 1

    data["total_issues"] += len(issues)

    _save(data)

    print(f"  Memory updated. Total issues tracked: {data['total_issues']}")

    
def get_top_patterns() -> list[tuple]:
    data = _load()

    sorted_patterns = sorted(
        data["patterns"].items(),
        key=lambda x: x[1],
        reverse=True
    )

    return sorted_patterns[:5]


def get_stats() -> dict:
    data = _load()

    return {
        "total_reviews": len(data["reviews"]),
        "total_issues": data["total_issues"],
        "top_patterns": get_top_patterns()
    }

