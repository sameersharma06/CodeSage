from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
import uvicorn

from core.agent import review_repo
from core.memory import get_stats

app = FastAPI(title="CodeSage", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class ReviewRequest(BaseModel):
    github_url: str


@app.get("/", response_class=HTMLResponse)
def root():
    with open("ui/index.html") as f:
        return f.read()


@app.get("/style.css")
def css():
    from fastapi.responses import FileResponse
    return FileResponse("ui/style.css", media_type="text/css")


@app.get("/app.js")
def js():
    from fastapi.responses import FileResponse
    return FileResponse("ui/app.js", media_type="application/javascript")


@app.post("/review")
def review(request: ReviewRequest):
    url = request.github_url.strip()
    if not url.startswith("https://github.com/"):
        raise HTTPException(
            status_code=400,
            detail="Only GitHub URLs supported. Format: https://github.com/user/repo"
        )
    try:
        result = review_repo(url)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Review failed: {str(e)}")


@app.get("/stats")
def stats():
    return get_stats()


@app.get("/health")
def health():
    return {"status": "ok", "model": "CodeSage v1.0"}


if __name__ == "__main__":
    uvicorn.run("api.main:app", host="0.0.0.0", port=8000, reload=False)
    