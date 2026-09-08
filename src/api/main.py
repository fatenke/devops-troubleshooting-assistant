import time
import json
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from src.rag_pipeline import RAGPipeline
from src.monitoring.logger import get_metrics, log_request, log_feedback


app = FastAPI(
    title="DevOps Troubleshooting Assistant API",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Initialize the RAG pipeline once
pipeline = RAGPipeline()
EVALUATION_DIR = Path(__file__).resolve().parents[2] / "data" / "evaluation"


class ChatRequest(BaseModel):
    query: str


class FeedbackRequest(BaseModel):
    query: str
    rating: str
    comment: str | None = None


@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "service": "DevOps Troubleshooting Assistant",
    }


@app.post("/api/chat")
def chat(request: ChatRequest):
    # Start measuring the complete RAG execution time
    start_time = time.perf_counter()

    # Run the real RAG pipeline
    result = pipeline.run(request.query)

    # Calculate latency in seconds
    latency = time.perf_counter() - start_time

    # Extract scores from the retrieved documents
    retrieval_scores = [
        source.get("rrf_score", 0.0)
        for source in result.get("sources", [])
    ]

    rerank_scores = [
        source.get("rerank_score", 0.0)
        for source in result.get("sources", [])
    ]

    # Log the request
    log_request(
        query=request.query,
        rewritten_query=result.get("rewritten_query"),
        latency=latency,
        retrieval_scores=retrieval_scores,
        rerank_scores=rerank_scores,
    )

    # Add latency to the response for the frontend
    result["latency"] = round(latency, 4)

    return result


@app.post("/api/feedback")
def feedback(request: FeedbackRequest):
    log_feedback(
        query=request.query,
        rating=request.rating,
        comment=request.comment,
    )

    return {
        "status": "success",
        "message": "Feedback recorded successfully",
    }


@app.get("/api/metrics")
def metrics():
    return get_metrics()


@app.get("/api/evaluation/retrieval")
def retrieval_evaluation():
    results_path = EVALUATION_DIR / "retrieval_results.json"
    if not results_path.exists():
        return []

    with results_path.open(encoding="utf-8") as results_file:
        results = json.load(results_file)

    return [
        {
            "method": method,
            "recall_at_5": metrics["average"]["recall_at_5"],
            "precision_at_5": metrics["average"]["precision_at_5"],
            "mrr": metrics["average"]["mrr"],
        }
        for method, metrics in results.items()
        if "average" in metrics
    ]


@app.get("/api/evaluation/llm")
def llm_evaluation():
    results_path = EVALUATION_DIR / "llm_results.json"
    if not results_path.exists():
        return []

    with results_path.open(encoding="utf-8") as results_file:
        results = json.load(results_file)

    summary = results.get("summary", {})
    return [
        {
            "strategy": strategy,
            "relevance": metrics["relevance"],
            "groundedness": metrics["groundedness"],
            "correctness": metrics["correctness"],
        }
        for strategy, metrics in summary.items()
    ]
