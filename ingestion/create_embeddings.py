import json
import os

import numpy as np
from fastembed import TextEmbedding
from tqdm import tqdm


INPUT_FILE = "data/processed/chunks.json"
OUTPUT_FILE = "data/processed/embeddings.npy"

MODEL_NAME = "BAAI/bge-small-en-v1.5"

# Nombre de textes envoyés au modèle à chaque fois
BATCH_SIZE = 64


def load_chunks():
    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def generate_embeddings(chunks):
    print(f"Loading model: {MODEL_NAME}")

    model = TextEmbedding(
        model_name=MODEL_NAME
    )

    texts = [chunk["text"] for chunk in chunks]

    print(f"Generating embeddings for {len(texts)} chunks...")
    print(f"Batch size: {BATCH_SIZE}")

    all_embeddings = []

    # Traitement par batches
    for start in tqdm(
        range(0, len(texts), BATCH_SIZE),
        desc="Embedding batches"
    ):
        end = min(start + BATCH_SIZE, len(texts))

        batch_texts = texts[start:end]

        batch_embeddings = list(
            model.embed(batch_texts)
        )

        all_embeddings.extend(batch_embeddings)

    return np.array(
        all_embeddings,
        dtype=np.float32
    )


def main():
    chunks = load_chunks()

    print(f"Loaded {len(chunks)} chunks")

    embeddings = generate_embeddings(chunks)

    print(f"Embeddings shape: {embeddings.shape}")

    os.makedirs(
        os.path.dirname(OUTPUT_FILE),
        exist_ok=True
    )

    np.save(
        OUTPUT_FILE,
        embeddings
    )

    print()
    print("=" * 60)
    print("EMBEDDINGS GENERATED SUCCESSFULLY")
    print("=" * 60)
    print(f"Chunks:     {len(chunks)}")
    print(f"Embeddings: {embeddings.shape}")
    print(f"Saved to:   {OUTPUT_FILE}")
    print(f"First 5 values: {embeddings[0][:5]}")
    print("=" * 60)


if __name__ == "__main__":
    main()