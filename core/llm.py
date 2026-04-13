from mlx_lm import load, generate

MODEL_ID = "Qwen/Qwen2.5-Coder-1.5B-Instruct"

_model = None
_tokenizer = None

def get_model():
    global _model, _tokenizer
    if _model is None:
        print("Loading CodeSage model...")
        _model, _tokenizer = load(MODEL_ID)
        print("Model ready.")
    return _model, _tokenizer

def run_prompt(prompt: str, max_tokens: int = 1024) -> str:
    model, tokenizer = get_model()
    result = generate(
        model,
        tokenizer,
        prompt=prompt,
        max_tokens=max_tokens,
        verbose=False
    )
    return result
