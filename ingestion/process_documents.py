import os
import json
from tqdm import tqdm


SOURCE_DIR = "../data/processed/docker"
OUTPUT_FILE = "../data/processed/documents.json"


def clean_text(text):

    # supprimer espaces inutiles
    text = text.replace("\n\n\n", "\n\n")

    return text.strip()


def load_documents():

    documents = []

    doc_id = 1

    for root, dirs, files in os.walk(SOURCE_DIR):

        for file in files:

            if file.endswith(".md"):

                path = os.path.join(root, file)

                with open(
                    path,
                    "r",
                    encoding="utf-8",
                    errors="ignore"
                ) as f:

                    content = f.read()

                content = clean_text(content)

                if len(content) > 200:

                    documents.append(
                        {
                            "id": doc_id,
                            "text": content,
                            "source": file,
                            "category": "docker"
                        }
                    )

                    doc_id += 1


    return documents



def save_documents(documents):

    os.makedirs(
        "../data/processed",
        exist_ok=True
    )

    with open(
        OUTPUT_FILE,
        "w",
        encoding="utf-8"
    ) as f:

        json.dump(
            documents,
            f,
            indent=2,
            ensure_ascii=False
        )



if __name__ == "__main__":

    docs = load_documents()

    print(
        f"{len(docs)} documents extracted"
    )

    save_documents(docs)

    print(
        "Saved to documents.json"
    )