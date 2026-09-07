
import json
import sys
from pathlib import Path
from statistics import mean

# ============================================================
# Project root
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(PROJECT_ROOT))

from dotenv import load_dotenv

from src.retrieval.query_rewriter import QueryRewriter
from src.retrieval.hybrid_search import HybridRetriever
from src.retrieval.reranker import Reranker
from src.llm.generator import LLMGenerator


# ============================================================
# Configuration
# ============================================================

QUESTIONS_FILE = (
    PROJECT_ROOT
    / "data"
    / "evaluation"
    / "llm_questions.json"
)

RESULTS_FILE = (
    PROJECT_ROOT
    / "data"
    / "evaluation"
    / "llm_results.json"
)

TOP_K = 5

# Retrieve more candidates before reranking.
# This is important because the reranker needs a candidate set.
RETRIEVAL_K = 20


# ============================================================
# Prompt A — Basic
# ============================================================

def build_basic_prompt(question: str, contexts: list[dict]) -> str:
    """
    Basic prompt:
    Question + retrieved documentation.
    No strict grounding instructions.
    """

    context_text = "\n\n".join(
        [
            f"Source: {item.get('source', 'unknown')}\n"
            f"{item.get('text', '')}"
            for item in contexts
        ]
    )

    return f"""
You are a DevOps technical assistant.

Answer the user's question using the documentation provided below.

Question:
{question}

Documentation:
{context_text}

Give a clear and useful technical answer.
""".strip()


# ============================================================
# Prompt B — Grounded
# ============================================================

def build_grounded_prompt(
    question: str,
    contexts: list[dict],
) -> str:
    """
    Grounded prompt:
    Strictly restricts the LLM to the retrieved documentation.
    """

    context_text = "\n\n".join(
        [
            f"Source: {item.get('source', 'unknown')}\n"
            f"{item.get('text', '')}"
            for item in contexts
        ]
    )

    return f"""
You are a DevOps troubleshooting assistant.

Your answer MUST be grounded ONLY in the documentation provided below.

Rules:
- Use only information supported by the provided documentation.
- Do not invent commands, configuration options, or explanations.
- If the documentation does not contain enough information to answer the question,
  explicitly say that the provided documentation is insufficient.
- Prefer precise and practical technical guidance.
- Include commands only when they are supported by the documentation.
- Explain the likely cause when the documentation supports it.
- Mention the relevant documentation sources.

Question:
{question}

Documentation:
{context_text}

Provide a concise, technically accurate answer.
""".strip()


# ============================================================
# LLM generation
# ============================================================

def generate_with_prompt(
    generator: LLMGenerator,
    prompt: str,
) -> str:
    """
    Generate an answer using the existing LLMGenerator.
    """

    response = generator.generate(prompt)

    if isinstance(response, str):
        return response

    if isinstance(response, dict):

        if "answer" in response:
            return response["answer"]

        if "content" in response:
            return response["content"]

        if "text" in response:
            return response["text"]

    return str(response)


# ============================================================
# Automatic evaluation
# ============================================================

def tokenize(text: str) -> set[str]:
    """
    Simple tokenizer used for the heuristic metrics.
    """

    import re

    return set(
        re.findall(
            r"\b[a-zA-Z0-9_-]{4,}\b",
            text.lower(),
        )
    )


def evaluate_answer(
    question: str,
    answer: str,
    contexts: list[dict],
) -> dict:
    """
    Lightweight automatic evaluation.

    Metrics:
        relevance
        groundedness
        correctness

    Scores are between 0 and 1.

    IMPORTANT:
    These are heuristic metrics.
    They are not equivalent to human evaluation.
    """

    question_words = tokenize(question)
    answer_words = tokenize(answer)

    # --------------------------------------------------------
    # Relevance
    # --------------------------------------------------------

    if question_words and answer_words:

        question_answer_overlap = (
            len(question_words & answer_words)
            / len(question_words)
        )

        relevance = min(
            question_answer_overlap * 2,
            1.0,
        )

    else:
        relevance = 0.0

    # --------------------------------------------------------
    # Groundedness
    # --------------------------------------------------------

    context_text = " ".join(
        item.get("text", "")
        for item in contexts
    )

    context_words = tokenize(context_text)

    if answer_words:

        grounded_overlap = (
            len(answer_words & context_words)
            / len(answer_words)
        )

        groundedness = min(
            grounded_overlap,
            1.0,
        )

    else:
        groundedness = 0.0

    # --------------------------------------------------------
    # Correctness proxy
    # --------------------------------------------------------

    correctness = (
        relevance + groundedness
    ) / 2

    return {
        "relevance": round(relevance, 3),
        "groundedness": round(groundedness, 3),
        "correctness": round(correctness, 3),
    }


# ============================================================
# Main
# ============================================================

def main():

    load_dotenv(
        PROJECT_ROOT / ".env"
    )

    if not QUESTIONS_FILE.exists():

        raise FileNotFoundError(
            f"Questions file not found: {QUESTIONS_FILE}"
        )

    with open(
        QUESTIONS_FILE,
        "r",
        encoding="utf-8",
    ) as f:

        questions = json.load(f)

    print("=" * 70)
    print("LLM EVALUATION")
    print("=" * 70)

    print(
        f"Questions: {len(questions)}"
    )

    print(
        "Retrieval: Hybrid + Reranking"
    )

    print(
        f"Retrieval candidates: {RETRIEVAL_K}"
    )

    print(
        f"Final documents: {TOP_K}"
    )

    print("=" * 70)

    # --------------------------------------------------------
    # Initialize components
    # --------------------------------------------------------

    print("\nInitializing components...")

    query_rewriter = QueryRewriter()

    hybrid_retriever = HybridRetriever()

    reranker = Reranker()

    generator = LLMGenerator()

    print("Components initialized.")

    results = []

    # ========================================================
    # Questions
    # ========================================================

    for index, item in enumerate(
        questions,
        start=1,
    ):

        question = item["question"]

        print("\n" + "-" * 70)

        print(
            f"Question {index}/{len(questions)}"
        )

        print(question)

        print("-" * 70)

        # ====================================================
        # Query rewriting
        # ====================================================

        print("Rewriting query...")

        rewritten_query = (
            query_rewriter.rewrite(question)
        )

        print(
            f"Rewritten query: {rewritten_query}"
        )

        # ====================================================
        # Hybrid retrieval
        # ====================================================

        print(
            f"Running Hybrid Retrieval ({RETRIEVAL_K} candidates)..."
        )

        hybrid_results = hybrid_retriever.search(
            rewritten_query,
            limit=RETRIEVAL_K,
        )

        print(
            f"Hybrid candidates: {len(hybrid_results)}"
        )

        # ====================================================
        # Reranking
        # ====================================================

        print(
            f"Running Reranking (top {TOP_K})..."
        )

        retrieved = reranker.rerank(
            rewritten_query,
            hybrid_results,
            limit=TOP_K,
        )

        print(
            f"Final documents: {len(retrieved)}"
        )

        # ====================================================
        # Prompt A
        # ====================================================

        print(
            "Generating Prompt A (Basic)..."
        )

        basic_prompt = build_basic_prompt(
            question,
            retrieved,
        )

        basic_answer = generate_with_prompt(
            generator,
            basic_prompt,
        )

        basic_scores = evaluate_answer(
            question,
            basic_answer,
            retrieved,
        )

        # ====================================================
        # Prompt B
        # ====================================================

        print(
            "Generating Prompt B (Grounded)..."
        )

        grounded_prompt = build_grounded_prompt(
            question,
            retrieved,
        )

        grounded_answer = generate_with_prompt(
            generator,
            grounded_prompt,
        )

        grounded_scores = evaluate_answer(
            question,
            grounded_answer,
            retrieved,
        )

        # ====================================================
        # Save result
        # ====================================================

        result = {

            "id": item.get(
                "id",
                index,
            ),

            "question": question,

            "rewritten_query": rewritten_query,

            "retrieval_method": (
                "hybrid_reranking"
            ),

            "retrieval": [

                {
                    "chunk_id": doc.get(
                        "chunk_id"
                    ),

                    "source": doc.get(
                        "source"
                    ),

                    "category": doc.get(
                        "category"
                    ),

                    "rerank_score": doc.get(
                        "rerank_score"
                    ),

                    "rrf_score": doc.get(
                        "rrf_score"
                    ),
                }

                for doc in retrieved
            ],

            "basic": {

                "answer": basic_answer,

                "scores": basic_scores,
            },

            "grounded": {

                "answer": grounded_answer,

                "scores": grounded_scores,
            },
        }

        results.append(result)

        # ====================================================
        # Display scores
        # ====================================================

        print("\nScores:")

        print(
            f"  Basic    -> "
            f"Relevance={basic_scores['relevance']:.3f}, "
            f"Groundedness={basic_scores['groundedness']:.3f}, "
            f"Correctness={basic_scores['correctness']:.3f}"
        )

        print(
            f"  Grounded -> "
            f"Relevance={grounded_scores['relevance']:.3f}, "
            f"Groundedness={grounded_scores['groundedness']:.3f}, "
            f"Correctness={grounded_scores['correctness']:.3f}"
        )

    # ========================================================
    # Calculate averages
    # ========================================================

    basic_relevance = mean(
        result["basic"]["scores"]["relevance"]
        for result in results
    )

    basic_groundedness = mean(
        result["basic"]["scores"]["groundedness"]
        for result in results
    )

    basic_correctness = mean(
        result["basic"]["scores"]["correctness"]
        for result in results
    )

    grounded_relevance = mean(
        result["grounded"]["scores"]["relevance"]
        for result in results
    )

    grounded_groundedness = mean(
        result["grounded"]["scores"]["groundedness"]
        for result in results
    )

    grounded_correctness = mean(
        result["grounded"]["scores"]["correctness"]
        for result in results
    )

    summary = {

        "basic": {

            "relevance": round(
                basic_relevance,
                3,
            ),

            "groundedness": round(
                basic_groundedness,
                3,
            ),

            "correctness": round(
                basic_correctness,
                3,
            ),
        },

        "grounded": {

            "relevance": round(
                grounded_relevance,
                3,
            ),

            "groundedness": round(
                grounded_groundedness,
                3,
            ),

            "correctness": round(
                grounded_correctness,
                3,
            ),
        },
    }

    # ========================================================
    # Save JSON
    # ========================================================

    output = {

        "evaluation": {

            "llm_model": (
                "openai/gpt-oss-20b"
            ),

            "retrieval_method": (
                "hybrid_reranking"
            ),

            "retrieval_candidates": (
                RETRIEVAL_K
            ),

            "top_k": TOP_K,

            "num_questions": len(
                results
            ),

            "prompt_strategies": [

                "basic",

                "grounded",
            ],

            "metrics": [

                "relevance",

                "groundedness",

                "correctness",
            ],

            "note": (
                "The scores are heuristic "
                "automatic indicators. "
                "They should be complemented "
                "with manual evaluation or "
                "reference answers for a stronger "
                "LLM evaluation."
            ),
        },

        "summary": summary,

        "results": results,
    }

    with open(
        RESULTS_FILE,
        "w",
        encoding="utf-8",
    ) as f:

        json.dump(
            output,
            f,
            indent=2,
            ensure_ascii=False,
        )

    # ========================================================
    # Final summary
    # ========================================================

    print("\n")

    print("=" * 70)

    print("LLM EVALUATION SUMMARY")

    print("=" * 70)

    print(
        f"{'Metric':<20}"
        f"{'Basic':<15}"
        f"{'Grounded':<15}"
    )

    print("-" * 50)

    print(
        f"{'Relevance':<20}"
        f"{basic_relevance:<15.3f}"
        f"{grounded_relevance:<15.3f}"
    )

    print(
        f"{'Groundedness':<20}"
        f"{basic_groundedness:<15.3f}"
        f"{grounded_groundedness:<15.3f}"
    )

    print(
        f"{'Correctness':<20}"
        f"{basic_correctness:<15.3f}"
        f"{grounded_correctness:<15.3f}"
    )

    print("=" * 70)

    # --------------------------------------------------------
    # Determine best strategy
    # --------------------------------------------------------

    if grounded_correctness > basic_correctness:

        print(
            "Best strategy: GROUNDED PROMPT"
        )

    elif basic_correctness > grounded_correctness:

        print(
            "Best strategy: BASIC PROMPT"
        )

    else:

        print(
            "Best strategy: EQUAL"
        )

    print("=" * 70)

    print(
        "\nResults saved to:"
    )

    print(RESULTS_FILE)


if __name__ == "__main__":
    main()
