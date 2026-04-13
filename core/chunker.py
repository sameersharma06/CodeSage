from pathlib import Path

MAX_CHUNK_TOKENS = 600
CHARS_PER_TOKEN = 4


def estimate_tokens(text: str) -> int:
    return len(text) // CHARS_PER_TOKEN


def split_by_functions(content: str) -> list[str]:
    chunks = []
    current_chunk = []
    current_tokens = 0

    for line in content.splitlines():
        stripped = line.strip()
        is_boundary = (
            stripped.startswith("def ")
            or stripped.startswith("async def ")
            or stripped.startswith("class ")
        )

        line_tokens = estimate_tokens(line)

        if is_boundary and current_tokens > 0:
            if current_tokens + line_tokens > MAX_CHUNK_TOKENS:
                chunks.append("\n".join(current_chunk))
                current_chunk = [line]
                current_tokens = line_tokens
            else:
                current_chunk.append(line)
                current_tokens += line_tokens
        else:
            current_chunk.append(line)
            current_tokens += line_tokens

        if current_tokens >= MAX_CHUNK_TOKENS:
            chunks.append("\n".join(current_chunk))
            current_chunk = []
            current_tokens = 0

    if current_chunk:
        chunks.append("\n".join(current_chunk))

    return [c for c in chunks if c.strip()]


def chunk_file(filename: str, content: str) -> list[dict]:
    ext = Path(filename).suffix
    tokens = estimate_tokens(content)

    if tokens <= MAX_CHUNK_TOKENS:
        return [{
            "filename": filename,
            "chunk_index": 0,
            "total_chunks": 1,
            "content": content
        }]

    if ext == ".py":
        raw_chunks = split_by_functions(content)
    else:
        lines = content.splitlines()
        raw_chunks = []
        current = []
        current_tokens = 0
        for line in lines:
            t = estimate_tokens(line)
            if current_tokens + t > MAX_CHUNK_TOKENS:
                raw_chunks.append("\n".join(current))
                current = [line]
                current_tokens = t
            else:
                current.append(line)
                current_tokens += t
        if current:
            raw_chunks.append("\n".join(current))

    return [
        {
            "filename": filename,
            "chunk_index": i,
            "total_chunks": len(raw_chunks),
            "content": chunk
        }
        for i, chunk in enumerate(raw_chunks)
        if chunk.strip()
    ]


def chunk_repo(parsed_repo: dict) -> list[dict]:
    all_chunks = []
    for filename, content in parsed_repo["files"].items():
        chunks = chunk_file(filename, content)
        all_chunks.extend(chunks)
    return all_chunks
