import json
import os

from langchain_text_splitters import RecursiveCharacterTextSplitter


INPUT_FILE = "data/processed/documents.json"
OUTPUT_FILE = "data/processed/chunks.json"

# Chunking configuration
CHUNK_SIZE = 1200
CHUNK_OVERLAP = 100


def load_documents():
    with open(
        INPUT_FILE,
        "r",
        encoding="utf-8"
    ) as f:
        return json.load(f)


def create_chunks(documents):

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        separators=["\n\n", "\n", " ", ""]
    )

    chunks = []

    chunk_id = 1

    for doc in documents:

        texts = splitter.split_text(doc["text"])

        for text in texts:

            chunks.append(
                {
                    "chunk_id": chunk_id,
                    "text": text,
                    "source": doc["source"],
                    "category": doc["category"]
                }
            )

            chunk_id += 1

    return chunks


def save_chunks(chunks):

    os.makedirs(
        "data/processed",
        exist_ok=True
    )

    with open(
        OUTPUT_FILE,
        "w",
        encoding="utf-8"
    ) as f:

        json.dump(
            chunks,
            f,
            indent=2,
            ensure_ascii=False
        )


def main():

    documents = load_documents()

    print(f"Loaded {len(documents)} documents")
    print(f"Chunk size: {CHUNK_SIZE}")
    print(f"Chunk overlap: {CHUNK_OVERLAP}")

    chunks = create_chunks(documents)

    print(f"Created {len(chunks)} chunks")

    save_chunks(chunks)

    print(f"Saved to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()