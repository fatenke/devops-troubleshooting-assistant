import json
import os


CONFIG_FILE = "config/sources.json"
OUTPUT_FILE = "data/processed/documents.json"


def load_sources():
    with open(CONFIG_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def clean_text(text):
    text = text.replace("\n\n\n", "\n\n")
    return text.strip()


def load_documents():

    sources = load_sources()

    documents = []

    doc_id = 1

    for category, config in sources.items():

        source_dir = config["processed_dir"]

        print(f"\nProcessing category: {category}")

        for root, dirs, files in os.walk(source_dir):

            for file in files:

                if not file.endswith(".md"):
                    continue

                path = os.path.join(root, file)

                with open(
                    path,
                    "r",
                    encoding="utf-8",
                    errors="ignore"
                ) as f:
                    content = f.read()

                content = clean_text(content)

                if len(content) <= 200:
                    continue

                relative_source = os.path.relpath(
                    path,
                    source_dir
                )

                documents.append(
                    {
                        "id": doc_id,
                        "text": content,
                        "source": relative_source,
                        "category": category
                    }
                )

                doc_id += 1

        print(
            f"[OK] {category} processed"
        )

    return documents


def save_documents(documents):

    os.makedirs(
        os.path.dirname(OUTPUT_FILE),
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


def main():

    documents = load_documents()

    print()
    print("=" * 60)
    print(f"Documents extracted: {len(documents)}")
    print("=" * 60)

    save_documents(documents)

    print(
        f"Saved to: {OUTPUT_FILE}"
    )


if __name__ == "__main__":
    main()