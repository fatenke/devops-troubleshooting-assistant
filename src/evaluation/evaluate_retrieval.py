import json
import os

from src.retrieval.vector_search import VectorRetriever
from src.retrieval.bm25_search import BM25Retriever
from src.retrieval.hybrid_search import HybridRetriever
from src.retrieval.reranker import Reranker

from src.evaluation.metrics import (
    recall_at_k,
    precision_at_k,
    reciprocal_rank
)


QUESTIONS_FILE = "data/evaluation/retrieval_questions.json"
RESULTS_FILE = "data/evaluation/retrieval_results.json"

K = 5


def evaluate_method(method_name, retriever_function, questions):
    results = []

    print(f"\n{'=' * 70}")
    print(f"EVALUATING: {method_name}")
    print(f"{'=' * 70}")

    for item in questions:

        question = item["question"]
        relevant_sources = item["relevant_sources"]

        retrieved = retriever_function(question)

        recall = recall_at_k(
            retrieved,
            relevant_sources,
            K
        )

        precision = precision_at_k(
            retrieved,
            relevant_sources,
            K
        )

        mrr = reciprocal_rank(
            retrieved,
            relevant_sources
        )

        results.append({
            "id": item["id"],
            "question": question,
            "recall_at_5": recall,
            "precision_at_5": precision,
            "mrr": mrr,
            "retrieved_sources": [
                result["source"]
                for result in retrieved[:K]
            ]
        })

        print(
            f"Q{item['id']:02d} | "
            f"Recall={recall:.2f} | "
            f"Precision={precision:.2f} | "
            f"MRR={mrr:.2f}"
        )

    return results


def calculate_average(results):
    if not results:
        return {
            "recall_at_5": 0,
            "precision_at_5": 0,
            "mrr": 0
        }

    return {
        "recall_at_5": sum(
            x["recall_at_5"] for x in results
        ) / len(results),

        "precision_at_5": sum(
            x["precision_at_5"] for x in results
        ) / len(results),

        "mrr": sum(
            x["mrr"] for x in results
        ) / len(results)
    }


def main():

    with open(QUESTIONS_FILE, "r", encoding="utf-8") as f:
        questions = json.load(f)

    print("Loading retrieval systems...")

    vector = VectorRetriever()
    bm25 = BM25Retriever()
    hybrid = HybridRetriever()
    reranker = Reranker()

    all_results = {}

    # --------------------------------------------------
    # BM25
    # --------------------------------------------------

    bm25_results = evaluate_method(
        "BM25",
        lambda q: bm25.search(q, limit=K),
        questions
    )

    all_results["bm25"] = {
        "queries": bm25_results,
        "average": calculate_average(bm25_results)
    }

    # --------------------------------------------------
    # Vector Search
    # --------------------------------------------------

    vector_results = evaluate_method(
        "Vector Search",
        lambda q: vector.search(q, limit=K),
        questions
    )

    all_results["vector"] = {
        "queries": vector_results,
        "average": calculate_average(vector_results)
    }

    # --------------------------------------------------
    # Hybrid Search
    # --------------------------------------------------

    hybrid_results = evaluate_method(
        "Hybrid Search",
        lambda q: hybrid.search(
            q,
            limit=K,
            retrieval_limit=20
        ),
        questions
    )

    all_results["hybrid"] = {
        "queries": hybrid_results,
        "average": calculate_average(hybrid_results)
    }

    # --------------------------------------------------
    # Hybrid + Reranking
    # --------------------------------------------------

    def hybrid_reranked(q):
        candidates = hybrid.search(
            q,
            limit=20,
            retrieval_limit=20
        )

        return reranker.rerank(
            q,
            candidates,
            limit=K
        )

    reranked_results = evaluate_method(
        "Hybrid + Reranking",
        hybrid_reranked,
        questions
    )

    all_results["hybrid_reranking"] = {
        "queries": reranked_results,
        "average": calculate_average(reranked_results)
    }

    # --------------------------------------------------
    # Save results
    # --------------------------------------------------

    os.makedirs(
        os.path.dirname(RESULTS_FILE),
        exist_ok=True
    )

    with open(
        RESULTS_FILE,
        "w",
        encoding="utf-8"
    ) as f:

        json.dump(
            all_results,
            f,
            indent=2,
            ensure_ascii=False
        )

    # --------------------------------------------------
    # Final comparison
    # --------------------------------------------------

    print("\n")
    print("=" * 80)
    print("RETRIEVAL EVALUATION SUMMARY")
    print("=" * 80)

    print(
        f"{'Method':<25}"
        f"{'Recall@5':<15}"
        f"{'Precision@5':<15}"
        f"{'MRR':<15}"
    )

    print("-" * 80)

    for method, data in all_results.items():

        avg = data["average"]

        print(
            f"{method:<25}"
            f"{avg['recall_at_5']:<15.3f}"
            f"{avg['precision_at_5']:<15.3f}"
            f"{avg['mrr']:<15.3f}"
        )


if __name__ == "__main__":
    main()