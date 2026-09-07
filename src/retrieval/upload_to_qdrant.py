import json
import os

import numpy as np
from dotenv import load_dotenv
from qdrant_client import QdrantClient, models


# ============================================================
# Configuration
# ============================================================

CHUNKS_FILE = "data/processed/chunks.json"
EMBEDDINGS_FILE = "data/processed/embeddings.npy"

COLLECTION_NAME = "devops_docs"
BATCH_SIZE = 100


# ============================================================
# Environment
# ============================================================

load_dotenv()

QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")

if not QDRANT_URL:
    raise ValueError("QDRANT_URL is missing from .env")

if not QDRANT_API_KEY:
    raise ValueError("QDRANT_API_KEY is missing from .env")


# ============================================================
# Load chunks
# ============================================================

print("Loading chunks...")

with open(CHUNKS_FILE, "r", encoding="utf-8") as f:
    chunks = json.load(f)

print(f"Loaded {len(chunks)} chunks")


# ============================================================
# Load embeddings
# ============================================================

print("Loading embeddings...")

embeddings = np.load(EMBEDDINGS_FILE)

print(f"Embeddings shape: {embeddings.shape}")


# ============================================================
# Validate
# ============================================================

if len(chunks) != len(embeddings):
    raise ValueError(
        f"Mismatch: {len(chunks)} chunks "
        f"vs {len(embeddings)} embeddings"
    )

vector_size = embeddings.shape[1]

print(f"Vector dimension: {vector_size}")


# ============================================================
# Connect to Qdrant Cloud
# ============================================================

print("Connecting to Qdrant Cloud...")

client = QdrantClient(
    url=QDRANT_URL,
    api_key=QDRANT_API_KEY,
)

print("Connected successfully")


# ============================================================
# Create collection
# ============================================================

if client.collection_exists(COLLECTION_NAME):
    print(f"Collection '{COLLECTION_NAME}' already exists.")
    print("Deleting existing collection...")

    client.delete_collection(COLLECTION_NAME)

print(f"Creating collection '{COLLECTION_NAME}'...")

client.create_collection(
    collection_name=COLLECTION_NAME,
    vectors_config=models.VectorParams(
        size=vector_size,
        distance=models.Distance.COSINE,
    ),
)

print("Collection created")


# ============================================================
# Upload vectors
# ============================================================

total = len(chunks)

print(f"Uploading {total} vectors...")

for start in range(0, total, BATCH_SIZE):

    end = min(start + BATCH_SIZE, total)

    points = []

    for i in range(start, end):

        chunk = chunks[i]

        point = models.PointStruct(
            id=int(chunk["chunk_id"]),
            vector=embeddings[i].tolist(),
            payload={
                "chunk_id": chunk["chunk_id"],
                "text": chunk["text"],
                "source": chunk["source"],
                "category": chunk["category"],
            },
        )

        points.append(point)

    client.upsert(
        collection_name=COLLECTION_NAME,
        points=points,
        wait=True,
    )

    print(f"Uploaded {end}/{total}")


# ============================================================
# Verify
# ============================================================

info = client.get_collection(COLLECTION_NAME)

print()
print("=" * 60)
print("UPLOAD COMPLETE")
print("=" * 60)
print(f"Collection : {COLLECTION_NAME}")
print(f"Vectors    : {info.points_count}")
print(f"Dimension  : {vector_size}")
print("=" * 60)