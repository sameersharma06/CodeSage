# core/model_manager.py

import gc
import re
from mlx_lm import load, generate

# ----------------------------
# MODEL CONFIG
# ----------------------------

MODELS = {
    "fast": "Qwen/Qwen2.5-Coder-1.5B-Instruct",
    "smart": "mlx-community/DeepSeek-Coder-V2-Lite-Instruct-4bit",
}

MAX_TOKENS = {
    "fast": 180,
    "smart": 320,
}

# ----------------------------
# OUTPUT CLEANING (STRONG)
# ----------------------------

def clean_output(text: str) -> str:
    if not text:
        return ""

    # remove markdown/code blocks
    text = text.replace("```json", "").replace("```", "")

    # remove JSON-style junk
    text = re.sub(r"\{.*?\}", "", text, flags=re.DOTALL)

    lines = text.splitlines()

    cleaned = []
    seen = set()

    for line in lines:
        line = line.strip()

        if not line:
            continue

        # remove explanation
        if line.lower().startswith("explanation"):
            break

        # remove placeholders / hallucination patterns
        if "<" in line and ">" in line:
            continue

        if line in seen:
            continue

        seen.add(line)
        cleaned.append(line)

    # fallback if model gives garbage
    if not cleaned:
        return "BUG: Unable to analyze\nFIX: Review manually"

    return "\n".join(cleaned[:6])


# ----------------------------
# MODEL MANAGER
# ----------------------------

class ModelManager:
    def __init__(self):
        self._model = None
        self._tokenizer = None
        self._current = None
        self._last_used = None  # prevents switching loops

    # ----------------------------
    # SAFE UNLOAD
    # ----------------------------
    def unload(self):
        if self._model is not None:
            print(f"  Unloading {self._current}...")
            try:
                del self._model
                del self._tokenizer
            except:
                pass

            self._model = None
            self._tokenizer = None
            self._current = None
            gc.collect()

    # ----------------------------
    # SMART LOAD (OPTIMIZED)
    # ----------------------------
    def load(self, name: str):
        if self._current == name:
            return

        # avoid unnecessary switching
        if self._current == name:
            return

        # keep smart model loaded (performance boost)
        if self._current == "smart" and name == "fast":
            return

        self.unload()

        print(f"  Loading {name} model...")
        self._model, self._tokenizer = load(MODELS[name])
        self._current = name
        print(f"  {name} ready.")

    # ----------------------------
    # RUN MODEL (STABLE + CLEAN)
    # ----------------------------
    def run(self, prompt: str, mode: str = "fast") -> str:
        try:
            self.load(mode)
            self._last_used = mode

            # ----------------------------
            # STRICT PROMPT (ANTI-HALLUCINATION)
            # ----------------------------
            formatted_prompt = f"""
You are a senior software engineer.

Analyze the code and find REAL issues only.

Code:
{prompt}

Rules:
- Only report real bugs
- No repetition
- No examples
- No JSON
- No placeholders

Output ONLY:

BUG: <one real bug>
FIX: <one fix>
"""

            result = generate(
                self._model,
                self._tokenizer,
                prompt=formatted_prompt,
                max_tokens=MAX_TOKENS[mode],
                verbose=False
            )

            return clean_output(result)

        except Exception as e:
            print(f"  ❌ Model error: {e}")
            return "BUG: Model failed\nFIX: Retry or review manually"

    # ----------------------------
    # ROUTING LOGIC
    # ----------------------------
    def route(self, complexity: str) -> str:
        if complexity == "simple":
            return "fast"
        return "smart"


# ----------------------------
# GLOBAL INSTANCE
# ----------------------------

manager = ModelManager()

