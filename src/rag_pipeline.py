from src.retrieval.query_rewriter import QueryRewriter
from src.retrieval.hybrid_search import HybridRetriever
from src.retrieval.reranker import Reranker
from src.llm.prompt_builder import PromptBuilder
from src.llm.generator import LLMGenerator


class RAGPipeline:
    def __init__(self):
        print("Initializing RAG Pipeline...")

        self.query_rewriter = QueryRewriter()
        self.hybrid_retriever = HybridRetriever()
        self.reranker = Reranker()
        self.prompt_builder = PromptBuilder()
        self.generator = LLMGenerator()

        print("RAG Pipeline initialized successfully")

    def run(self, query, retrieval_limit=20, final_limit=5):
        # 1. Rewrite the user's query
        rewritten_query = self.query_rewriter.rewrite(query)

        # 2. Hybrid retrieval: Vector + BM25 + RRF
        hybrid_results = self.hybrid_retriever.search(
            rewritten_query,
            limit=retrieval_limit,
            retrieval_limit=retrieval_limit
        )

        # 3. Rerank the retrieved documents
        reranked_results = self.reranker.rerank(
            rewritten_query,
            hybrid_results,
            limit=final_limit
        )

        # 4. Build the grounded prompt
        prompt = self.prompt_builder.build(
            query,
            reranked_results
        )

        # 5. Generate the final answer
        answer = self.generator.generate(prompt)

        return {
            "query": query,
            "rewritten_query": rewritten_query,
            "answer": answer,
            "sources": reranked_results
        }


if __name__ == "__main__":
    pipeline = RAGPipeline()

    test_query = "My Docker container loses data after restart."

    result = pipeline.run(test_query)

    print("\n" + "=" * 70)
    print("ORIGINAL QUERY")
    print("=" * 70)
    print(result["query"])

    print("\n" + "=" * 70)
    print("REWRITTEN QUERY")
    print("=" * 70)
    print(result["rewritten_query"])

    print("\n" + "=" * 70)
    print("ANSWER")
    print("=" * 70)
    print(result["answer"])

    print("\n" + "=" * 70)
    print("SOURCES")
    print("=" * 70)

    for i, source in enumerate(result["sources"], 1):
        print(
            f"{i}. {source['source']} "
            f"(rerank={source.get('rerank_score', 0):.4f})"
        )
