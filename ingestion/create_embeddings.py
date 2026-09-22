import json
import os
import time

import numpy as np
from fastembed import TextEmbedding
from tqdm import tqdm


INPUT_FILE = "data/processed/chunks.json"
OUTPUT_FILE = "data/processed/embeddings.npy"

MODEL_NAME = "BAAI/bge-small-en-v1.5"

BATCH_SIZE = 64
MAX_CHUNKS = None


def load_chunks():

    with open(
        INPUT_FILE,
        "r",
        encoding="utf-8"
    ) as f:

        chunks = json.load(f)

    if MAX_CHUNKS is not None:
        chunks = chunks[:MAX_CHUNKS]

    return chunks


def generate_embeddings(chunks):

    print()
    print("=" * 60)
    print("LOADING EMBEDDING MODEL")
    print("=" * 60)

    print(f"Model: {MODEL_NAME}")

    model = TextEmbedding(
        model_name=MODEL_NAME
    )

    texts = [
        chunk["text"]
        for chunk in chunks
    ]

    print()
    print(f"Texts: {len(texts)}")
    print(f"Batch size: {BATCH_SIZE}")

    all_embeddings = []

    start_time = time.time()

    for start in tqdm(
        range(
            0,
            len(texts),
            BATCH_SIZE
        ),
        desc="Embedding batches"
    ):

        end = min(
            start + BATCH_SIZE,
            len(texts)
        )

        batch_texts = texts[start:end]

        batch_embeddings = list(
            model.embed(batch_texts)
        )

        all_embeddings.extend(
            batch_embeddings
        )

    elapsed = time.time() - start_time

    embeddings = np.array(
        all_embeddings,
        dtype=np.float32
    )

    print()
    print(f"Embedding time: {elapsed / 60:.2f} minutes")

    return embeddings


def main():

    if not os.path.exists(INPUT_FILE):

        raise FileNotFoundError(
            f"Input file not found: {INPUT_FILE}"
        )

    chunks = load_chunks()

    print()
    print("=" * 60)
    print("EMBEDDING GENERATION")
    print("=" * 60)

    print(f"Loaded chunks: {len(chunks)}")

    embeddings = generate_embeddings(
        chunks
    )

    print()
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
    print("=" * 60)


if __name__ == "__main__":
    main()