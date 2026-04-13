import os
import subprocess
import shutil
import tempfile
from pathlib import Path

SUPPORTED_EXTENSIONS = {
    ".py", ".js", ".ts", ".jsx", ".tsx",
    ".java", ".cpp", ".c", ".go", ".rs"
}

SKIP_DIRS = {
    "node_modules", ".git", "__pycache__",
    "venv", ".venv", "dist", "build", ".next"
}

SKIP_FILES = {
    "package-lock.json", "yarn.lock",
    "poetry.lock", "requirements.lock"
}

MAX_FILE_SIZE_KB = 100


def clone_repo(github_url: str) -> str:
    tmp_dir = tempfile.mkdtemp(prefix="codesage_")
    print(f"Cloning {github_url}...")
    result = subprocess.run(
        ["git", "clone", "--depth=1", github_url, tmp_dir],
        capture_output=True,
        text=True
    )
    if result.returncode != 0:
        raise ValueError(f"Clone failed: {result.stderr.strip()}")
    print("Clone complete.")
    return tmp_dir


def is_valid_file(path: Path) -> bool:
    if path.suffix not in SUPPORTED_EXTENSIONS:
        return False
    if path.name in SKIP_FILES:
        return False
    if any(skip in path.parts for skip in SKIP_DIRS):
        return False
    size_kb = path.stat().st_size / 1024
    if size_kb > MAX_FILE_SIZE_KB:
        return False
    return True


def read_file_safe(path: Path) -> str | None:
    try:
        return path.read_text(encoding="utf-8", errors="ignore")
    except Exception:
        return None


def parse_repo(github_url: str) -> dict:
    tmp_dir = clone_repo(github_url)
    repo_path = Path(tmp_dir)
    files = {}

    try:
        all_files = list(repo_path.rglob("*"))
        code_files = [f for f in all_files if f.is_file() and is_valid_file(f)]

        if not code_files:
            raise ValueError("No supported code files found in this repository.")

        for file_path in code_files:
            content = read_file_safe(file_path)
            if content and content.strip():
                relative = str(file_path.relative_to(repo_path))
                files[relative] = content

        print(f"Parsed {len(files)} files.")
        return {
            "url": github_url,
            "files": files,
            "file_count": len(files)
        }

    finally:
        shutil.rmtree(tmp_dir, ignore_errors=True)
        