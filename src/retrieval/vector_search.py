from fastembed import TextEmbedding
from qdrant_client import QdrantClient

from src.config import require_env, get_env


MODEL_NAME = "BAAI/bge-small-en-v1.5"
COLLECTION_NAME = get_env("QDRANT_COLLECTION", "devops_docs")


class VectorRetriever:

    def __init__(self):

        qdrant_url = require_env("QDRANT_URL")
        qdrant_api_key = require_env("QDRANT_API_KEY")
        collection_name = get_env("QDRANT_COLLECTION", "devops_docs")

        print("Connecting to Qdrant Cloud...")

        self.client = QdrantClient(
            url=qdrant_url,
            api_key=qdrant_api_key
        )

        self.collection_name = collection_name

        print("Connected to Qdrant Cloud")

        # FastEmbed instead of SentenceTransformer
        print(f"Loading embedding model: {MODEL_NAME}")

        self.model = TextEmbedding(
            model_name=MODEL_NAME
        )

        print("Embedding model loaded")


    def search(self, query, limit=5):

        # Generate embedding for the query
        query_embedding = list(
            self.model.embed([query])
        )[0]

        # Search Qdrant
        results = self.client.query_points(
            collection_name=self.collection_name,
            query=query_embedding.tolist(),
            limit=limit
        )

        output = []

        for point in results.points:

            output.append(
                {
                    "chunk_id": point.payload.get("chunk_id"),
                    "source": point.payload.get("source"),
                    "category": point.payload.get("category"),
                    "text": point.payload.get("text"),
                    "score": point.score
                }
            )

        return output


if __name__ == "__main__":

    retriever = VectorRetriever()

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
