# core/rule_engine.py

import ast
import re

# ----------------------------
# PRE-COMPILED RULES (REGEX FALLBACK ONLY)
# ----------------------------

RULES = [
    {
        "id": "HARDCODED_SECRET",
        "severity": "HIGH",
        "pattern": re.compile(r"(?i)(password|secret|api_key|token)\s*=\s*['\"][^'\"]{4,}['\"]"),
        "message": "Hardcoded secret or credential detected"
    },
    {
        "id": "PRINT_DEBUG",
        "severity": "LOW",
        "pattern": re.compile(r"\bprint\s*\("),
        "message": "Debug print statement in production code"
    },
    {
        "id": "SQL_INJECTION",
        "severity": "HIGH",
        "pattern": re.compile(r"(execute\s*\(|SELECT .* \+ .*|INSERT .* \+ .*|UPDATE .* \+ .*)", re.IGNORECASE),
        "message": "Possible SQL injection — avoid string concatenation"
    },
    {
        "id": "SHELL_INJECTION",
        "severity": "HIGH",
        "pattern": re.compile(r"os\.system\s*\(|subprocess\..*shell\s*=\s*True"),
        "message": "Shell injection risk — unsafe command execution"
    }
]


# ----------------------------
# AST ANALYZER (PRIMARY ENGINE)
# ----------------------------

def analyze_ast(filename: str, code: str) -> list[dict]:
    findings = []

    if not filename.endswith(".py"):
        return findings

    try:
        tree = ast.parse(code)
    except:
        return findings

    for node in ast.walk(tree):

        # ---------------- DIVISION ----------------
        if isinstance(node, ast.BinOp) and isinstance(node.op, ast.Div):
            findings.append({
                "rule_id": "DIV_BY_ZERO",
                "severity": "HIGH",
                "line": node.lineno,
                "message": "Division operation detected — ensure divisor is not zero"
            })

        # ---------------- BARE EXCEPT ----------------
        if isinstance(node, ast.ExceptHandler):
            if node.type is None:
                findings.append({
                    "rule_id": "BARE_EXCEPT",
                    "severity": "MEDIUM",
                    "line": node.lineno,
                    "message": "Bare except clause detected"
                })

        # ---------------- EVAL ----------------
        if isinstance(node, ast.Call):
            if isinstance(node.func, ast.Name) and node.func.id == "eval":
                # Skip safe/internal usage (framework-level)
                if "flask" in filename or "site-packages" in filename:
                    continue
                findings.append({
                    "rule_id": "EVAL_USAGE",
                    "severity": "CRITICAL",
                    "line": node.lineno,
                    "message": "Use of eval() — extremely dangerous"
                })

        # ---------------- EXEC ----------------
        if isinstance(node, ast.Call):
            if isinstance(node.func, ast.Name) and node.func.id == "exec":
                # Skip safe/internal usage (framework-level)
                if "flask" in filename or "site-packages" in filename:
                    continue
                findings.append({
                    "rule_id": "EXEC_USAGE",
                    "severity": "CRITICAL",
                    "line": node.lineno,
                    "message": "Use of exec() — arbitrary code execution risk"
                })

        # ---------------- OPEN WITHOUT CONTEXT ----------------
        if isinstance(node, ast.Call):
            if isinstance(node.func, ast.Name) and node.func.id == "open":
                # Ignore framework/internal usage
                if "flask" in filename:
                    continue
                findings.append({
                    "rule_id": "NO_CONTEXT_MANAGER",
                    "severity": "MEDIUM",
                    "line": node.lineno,
                    "message": "File opened — consider using 'with open(...)'"
                })

    return findings


# ----------------------------
# SYNTAX CHECK
# ----------------------------

def check_syntax(filename: str, code: str) -> dict | None:
    if not filename.endswith(".py"):
        return None

    try:
        ast.parse(code)
        return None
    except SyntaxError as e:
        return {
            "rule_id": "SYNTAX_ERROR",
            "severity": "CRITICAL",
            "line": e.lineno,
            "message": f"Syntax error: {e.msg}"
        }


# ----------------------------
# HELPER: STRING LINE CHECK
# ----------------------------

def is_string_line(line: str) -> bool:
    stripped = line.strip()
    return (
        (stripped.startswith('"') and stripped.endswith('"')) or
        (stripped.startswith("'") and stripped.endswith("'"))
    )


# ----------------------------
# MAIN RULE ENGINE
# ----------------------------

def run_rules(filename: str, code: str) -> list[dict]:
    findings = []

    # ---------------- SYNTAX ----------------
    syntax = check_syntax(filename, code)
    if syntax:
        findings.append(syntax)

    # ---------------- AST ANALYSIS ----------------
    ast_findings = analyze_ast(filename, code)
    findings.extend(ast_findings)

    # ---------------- REGEX FALLBACK ----------------
    lines = code.splitlines()
    seen = set()

    for i, line in enumerate(lines, 1):

        if not line.strip():
            continue

        if is_string_line(line):
            continue

        if line.strip().startswith("#"):
            continue

        for rule in RULES:
            if rule["pattern"].search(line):

                key = (filename, rule["id"], line.strip())

                if key in seen:
                    continue
                seen.add(key)

                findings.append({
                    "rule_id": rule["id"],
                    "severity": rule["severity"],
                    "line": i,
                    "message": rule["message"],
                    "code": line.strip()
                })

    # ---------------- FINAL DEDUP ----------------
    unique = []
    seen = set()

    for f in findings:
        key = (f.get("rule_id"), f.get("line"))
        if key in seen:
            continue
        seen.add(key)
        unique.append(f)

    return unique
