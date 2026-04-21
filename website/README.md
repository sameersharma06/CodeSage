# CodeSage ⚡

**Your Code. Your Machine. Your Power.**

Senior-level code reviews that run **100% locally**.  
No cloud. No API keys. No data ever leaves your Mac.

![Hero](https://github.com/sameersharma06/CodeSage/raw/main/website/dist/assets/hero.png) <!-- We'll update this later -->

## Why CodeSage

Most AI coding tools send your code to the cloud.  
CodeSage brings the senior engineer to **your machine**.

| Feature                    | Cursor / Copilot / GitHub Copilot | CodeSage ⚡ |
|---------------------------|-----------------------------------|-------------|
| Runs 100% locally         | ❌                                | ✅          |
| Code stays completely private | ❌                            | ✅          |
| No API keys or billing    | ❌                                | ✅          |
| Works fully offline       | ❌                                | ✅          |
| Free forever              | ❌                                | ✅          |
| Exact file + line numbers | Sometimes                         | ✅          |
| Deterministic rule engine | ❌                                | ✅          |

## What It Does

Paste any GitHub repo URL → CodeSage reviews it like a senior engineer.

- Finds bugs, security vulnerabilities, performance bottlenecks
- Gives **exact file names + line numbers**
- Combines deterministic rules + local AI models
- Everything runs on your Apple Silicon with MLX

## How It Works

```mermaid
flowchart TD
    A[GitHub Repo URL] --> B[Ingestion + Parsing]
    B --> C[Rule Engine<br/>Deterministic Checks]
    C --> D[Fast Pass<br/>Qwen2.5-Coder-1.5B]
    D --> E[Deep Pass<br/>DeepSeek-Coder-6.7B]
    E --> F[Structured Report + Memory]

Ingestion — Clones and parses the repository
Rule Engine — AST + regex for security, bugs, and anti-patterns
Fast Pass — Quick scan with Qwen2.5-Coder-1.5B
Deep Pass — Detailed analysis with DeepSeek-Coder-6.7B (4-bit)
Memory — Learns patterns across reviews (local JSON)

Quick Start
Bashgit clone https://github.com/sameersharma06/CodeSage.git
cd CodeSage

# Backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python -m api.main
Open http://localhost:8000
Models (~4GB) will download automatically on first run.
Requirements:

macOS (Apple Silicon strongly recommended)
Python 3.10+
8GB RAM minimum (16GB+ recommended)
Git

Performance

80-file repo reviewed in ~3 minutes on M-series Mac
Peak RAM usage: ~7GB
Zero cloud cost. Zero latency after model load.

Tech Stack

Models: Qwen2.5-Coder-1.5B + DeepSeek-Coder-6.7B-4bit
Inference: MLX (Apple Silicon optimized)
Backend: FastAPI
Rule Engine: AST + regex (never hallucinates)
Frontend: Cinematic React + Tailwind + Framer Motion + GSAP
Memory: Local JSON pattern store

Built With ❤️ by
Sameer Sharma
First-year CS & AI student from Haryana, India.
Building sovereign AI systems that run on your machine.