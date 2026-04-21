# CodeSage ⚡

> Local AI code reviewer. No cloud. No API keys. Your code never leaves your machine.

![CodeSage UI](assets/demo.png)

## What it does

Paste any GitHub repo URL → CodeSage reviews it like a senior engineer.
Finds bugs, security issues, and performance problems with exact file names and line numbers.
Everything runs on your Mac. Zero internet required after setup.

## Why CodeSage

| | Cursor / Copilot / GitHub Actions | CodeSage |
|---|---|---|
| Runs 100% locally | ❌ | ✅ |
| Code stays private | ❌ | ✅ |
| No API key needed | ❌ | ✅ |
| Works offline | ❌ | ✅ |
| Free forever | ❌ | ✅ |

## How it works

GitHub URL → Ingestion → Chunking → Rule Engine → Fast Pass (Qwen 1.5B) → Deep Pass (DeepSeek 6.7B) → Structured Report

1. **Ingestion** — clones repo, parses all code files
2. **Rule Engine** — deterministic checks for SQL injection, hardcoded secrets, bare excepts
3. **Fast Pass** — Qwen2.5-Coder-1.5B scans every file for issues
4. **Deep Pass** — DeepSeek-Coder-6.7B-4bit analyzes files with issues in detail
5. **Memory** — stores patterns across reviews, gets smarter over time

## Setup

```bash
git clone https://github.com/sameersharma06/CodeSage.git
cd CodeSage
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 -m api.main
```

Open http://localhost:8000

Models download automatically on first run (~4GB total).

## Requirements

- macOS (Apple Silicon recommended)
- Python 3.10+
- 8GB RAM minimum, 16GB recommended
- Git installed

## Tech Stack

- **Models** — Qwen2.5-Coder-1.5B (fast pass) + DeepSeek-Coder-6.7B-4bit (deep pass)
- **Inference** — MLX (Apple Silicon optimized)
- **Backend** — FastAPI
- **Rule Engine** — AST + regex (deterministic, never hallucinates)
- **Memory** — local JSON store, tracks patterns across reviews
- **Frontend** — vanilla HTML/CSS/JS

## Architecture

codesage/
├── core/
│   ├── ingestion.py      # clone + parse repos
│   ├── chunker.py        # smart code splitting
│   ├── agent.py          # multi-pass review pipeline
│   ├── model_manager.py  # lazy load / unload models
│   ├── rule_engine.py    # deterministic bug detection
│   └── memory.py         # pattern memory across reviews
├── api/
│   └── main.py           # FastAPI server
└── ui/
├── index.html
├── style.css
└── app.js

## Performance

- Reviewed 80 file repo in ~3 minutes on M-series Mac
- Peak RAM: ~7GB (well within 16GB)
- No GPU cloud costs

## Roadmap

- [ ] GitHub Actions integration
- [ ] VS Code extension
- [ ] Multi-language support (Go, Rust, Java)
- [ ] Team workspace (self-hosted)
- [ ] PR review mode

## Built by

Sameer Sharma — First year CS & AI student, Haryana India
Building local AI systems on Apple Silicon.

[GitHub](https://github.com/sameersharma06) · [LinkedIn](https://linkedin.com/in/sameersharma0028)
