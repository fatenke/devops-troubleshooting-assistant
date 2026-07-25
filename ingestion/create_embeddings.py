import json
from sentence_transformers import SentenceTransformer
from tqdm import tqdm


INPUT_FILE = "../data/processed/chunks.json"


MODEL_NAME = "BAAI/bge-small-en-v1.5"


def load_chunks():

    with open(
        INPUT_FILE,
        "r",
        encoding="utf-8"
    ) as f:
        return json.load(f)



def generate_embeddings(chunks):

    model = SentenceTransformer(
        MODEL_NAME
    )


    texts = [
        chunk["text"]
        for chunk in chunks
    ]


    embeddings = model.encode(
        texts,
        batch_size=32,
        show_progress_bar=True
    )


    return embeddings



if __name__ == "__main__":

    chunks = load_chunks()

    print(
        f"Loaded {len(chunks)} chunks"
    )


    embeddings = generate_embeddings(
        chunks
    )


    print(
        "Embeddings generated"
    )


    print(
        embeddings[0][:5]
    )