from src.retrieval.vector_search import VectorRetriever
from src.retrieval.bm25_search import BM25Retriever


RRF_K = 60


class HybridRetriever:

    def __init__(self):

        print("Initializing Hybrid Retriever...")

        self.vector_retriever = VectorRetriever()
        self.bm25_retriever = BM25Retriever()

        print("Hybrid Retriever ready")


    def search(self, query, limit=5, retrieval_limit=20):

        # ---------------------------------------------------------
        # 1. Vector Search
        # ---------------------------------------------------------

        vector_results = self.vector_retriever.search(
            query,
            limit=retrieval_limit
        )

        # ---------------------------------------------------------
        # 2. BM25 Search
        # ---------------------------------------------------------

        bm25_results = self.bm25_retriever.search(
            query,
            limit=retrieval_limit
        )

        # ---------------------------------------------------------
        # 3. Reciprocal Rank Fusion (RRF)
        # ---------------------------------------------------------

        rrf_scores = {}
        documents = {}

        # Vector ranking
        for rank, result in enumerate(vector_results, start=1):

            chunk_id = result["chunk_id"]

            rrf_scores[chunk_id] = rrf_scores.get(
                chunk_id, 0
            ) + 1 / (RRF_K + rank)

            documents[chunk_id] = result

        # BM25 ranking
        for rank, result in enumerate(bm25_results, start=1):

            chunk_id = result["chunk_id"]

            rrf_scores[chunk_id] = rrf_scores.get(
                chunk_id, 0
            ) + 1 / (RRF_K + rank)

            # Keep the document if it wasn't already found
            if chunk_id not in documents:
                documents[chunk_id] = result

        # ---------------------------------------------------------
        # 4. Sort by RRF score
        # ---------------------------------------------------------

        ranked_chunks = sorted(
            rrf_scores.items(),
            key=lambda x: x[1],
            reverse=True
        )

        # ---------------------------------------------------------
        # 5. Build final results
        # ---------------------------------------------------------

        output = []

        for chunk_id, rrf_score in ranked_chunks[:limit]:

            result = documents[chunk_id].copy()

            result["rrf_score"] = rrf_score

            output.append(result)

        return output


if __name__ == "__main__":

    retriever = HybridRetriever()

    query = "My docker container loses data after restart"

    print()
    print("=" * 70)
    print(f"QUERY: {query}")
    print("=" * 70)

    results = retriever.search(
        query,
        limit=5,
        retrieval_limit=20
    )

    print()
    print(f"Found {len(results)} hybrid results")
    print()

    for i, result in enumerate(results, start=1):

        print("-" * 70)
        print(f"RESULT {i}")
        print("-" * 70)

        print(f"Chunk ID   : {result['chunk_id']}")
        print(f"Source     : {result['source']}")
        print(f"Category   : {result['category']}")
        print(f"RRF score  : {result['rrf_score']:.6f}")

        print()
        print("Text:")
        print(result["text"][:500])
        print()
