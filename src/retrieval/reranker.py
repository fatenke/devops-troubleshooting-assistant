from fastembed.rerank.cross_encoder import TextCrossEncoder


MODEL_NAME = "Xenova/ms-marco-MiniLM-L-6-v2"


class Reranker:

    def __init__(self):

        print(f"Loading reranker model: {MODEL_NAME}")

        self.model = TextCrossEncoder(
            model_name=MODEL_NAME
        )

        print("Reranker loaded successfully")


    def rerank(self, query, results, limit=5):

        if not results:
            return []

        documents = [
            result["text"]
            for result in results
        ]

        # Calculate relevance score for each
        # query/document pair.
        scores = list(
            self.model.rerank(
                query,
                documents
            )
        )

        reranked = []

        for result, score in zip(results, scores):

            item = result.copy()

            item["rerank_score"] = float(score)

            reranked.append(item)

        # Highest relevance first
        reranked.sort(
            key=lambda x: x["rerank_score"],
            reverse=True
        )

        return reranked[:limit]


if __name__ == "__main__":

    from src.retrieval.hybrid_search import HybridRetriever

    print("=" * 70)
    print("TESTING HYBRID SEARCH + RERANKING")
    print("=" * 70)

    query = "My docker container loses data after restart"

    # First retrieve candidates with hybrid search
    hybrid = HybridRetriever()

    results = hybrid.search(
        query,
        limit=5,
        retrieval_limit=20
    )

    print()
    print("Hybrid results before reranking:")
    print()

    for i, result in enumerate(results, start=1):

        print(
            f"{i}. {result['source']} "
            f"(RRF: {result['rrf_score']:.6f})"
        )

    # Rerank the candidates
    reranker = Reranker()

    reranked_results = reranker.rerank(
        query,
        results,
        limit=5
    )

    print()
    print("=" * 70)
    print("RESULTS AFTER RERANKING")
    print("=" * 70)

    for i, result in enumerate(reranked_results, start=1):

        print("-" * 70)
        print(f"RESULT {i}")
        print("-" * 70)

        print(f"Chunk ID      : {result['chunk_id']}")
        print(f"Source        : {result['source']}")
        print(f"RRF score     : {result['rrf_score']:.6f}")
        print(f"Rerank score  : {result['rerank_score']:.6f}")

        print()
        print("Text:")
        print(result["text"][:500])
        print()
