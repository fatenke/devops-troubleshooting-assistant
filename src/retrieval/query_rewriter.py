import os

from dotenv import load_dotenv
from groq import Groq

MODEL_NAME = "openai/gpt-oss-20b"


class QueryRewriter:

    def __init__(self):

        load_dotenv()

        api_key = os.getenv("GROQ_API_KEY")

        if not api_key:
            raise ValueError(
                "GROQ_API_KEY is missing from .env"
            )

        self.client = Groq(
            api_key=api_key
        )

        print("Query Rewriter initialized")


    def rewrite(self, query):

        prompt = f"""
You are a search query optimizer for a DevOps troubleshooting
assistant specialized in Docker.

Rewrite the user's question into a clear and precise search query
that will retrieve relevant information from official Docker
documentation.

Keep the query focused on the technical problem.

Do not answer the question.
Do not add explanations.
Return only the rewritten search query.

User question:
{query}
"""

        response = self.client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0
        )

        rewritten_query = response.choices[0].message.content.strip()

        return rewritten_query


if __name__ == "__main__":

    rewriter = QueryRewriter()

    query = "My docker container loses data after restart"

    print()
    print("=" * 70)
    print("ORIGINAL QUERY")
    print("=" * 70)
    print(query)

    rewritten_query = rewriter.rewrite(query)

    print()
    print("=" * 70)
    print("REWRITTEN QUERY")
    print("=" * 70)
    print(rewritten_query)
