from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from src.rag_pipeline import RAGPipeline


app = FastAPI(
    title="DevOps Troubleshooting Assistant API",
    version="1.0.0",
)


# Allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Initialize the RAG pipeline once when the API starts
pipeline = RAGPipeline()


class ChatRequest(BaseModel):
    query: str


@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "service": "DevOps Troubleshooting Assistant",
    }


@app.post("/api/chat")
def chat(request: ChatRequest):
    result = pipeline.run(request.query)

    return result
