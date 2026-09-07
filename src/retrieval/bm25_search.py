import json
import re


CHUNKS_FILE = "data/processed/chunks.json"


class BM25Retriever:

    def __init__(self):

        print("Loading chunks...")

        with open(CHUNKS_FILE, "r", encoding="utf-8") as f:
            self.chunks = json.load(f)

        print(f"Loaded {len(self.chunks)} chunks")

        # Import here so the dependency error is clear
        # if rank-bm25 is not installed.
        from rank_bm25 import BM25Okapi

        self.BM25Okapi = BM25Okapi

        # Tokenize all documents
        print("Building BM25 index...")

        tokenized_documents = [
            self._tokenize(chunk["text"])
            for chunk in self.chunks
        ]

        self.bm25 = self.BM25Okapi(tokenized_documents)

        print("BM25 index built successfully")


    @staticmethod
    def _tokenize(text):

        # Lowercase + keep words and useful Docker terms
        return re.findall(r"\b\w+\b", text.lower())


    def search(self, query, limit=5):

        # Tokenize query
        tokenized_query = self._tokenize(query)

        # Calculate BM25 scores
        scores = self.bm25.get_scores(tokenized_query)

        # Get indexes sorted by descending score
        ranked_indexes = sorted(
            range(len(scores)),
            key=lambda i: scores[i],
            reverse=True
        )

        output = []

        for index in ranked_indexes[:limit]:

            chunk = self.chunks[index]

            output.append(
                {
                    "chunk_id": chunk["chunk_id"],
                    "source": chunk["source"],
                    "category": chunk["category"],
                    "text": chunk["text"],
                    "score": float(scores[index])
                }
            )

        return output


if __name__ == "__main__":

    retriever = BM25Retriever()

    query = "My docker container loses data after restart"

    print()
    print("=" * 70)
    print(f"QUERY: {query}")
    print("=" * 70)

    results = retriever.search(query, limit=5)

    print()
    print(f"Found {len(results)} results")
    print()

    for i, result in enumerate(results, start=1):

        print("-" * 70)
        print(f"RESULT {i}")
        print("-" * 70)

        print(f"Chunk ID : {result['chunk_id']}")
        print(f"Source   : {result['source']}")
        print(f"Category : {result['category']}")
        print(f"Score    : {result['score']:.4f}")

        print()
        print("Text:")
        print(result["text"][:500])
        print()