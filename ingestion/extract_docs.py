import json
import os
import shutil


CONFIG_FILE = "config/sources.json"


def load_sources():
    with open(CONFIG_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def extract_markdown(category, config):
    source_dir = config["raw_dir"]
    destination_dir = config["processed_dir"]

    os.makedirs(destination_dir, exist_ok=True)

    count = 0

    for root, dirs, files in os.walk(source_dir):

        # Ignore Git metadata
        dirs[:] = [
            d for d in dirs
            if d != ".git"
        ]

        for file in files:

            if not file.endswith((".md", ".adoc")):
                continue

            source_file = os.path.join(root, file)

            # Preserve directory structure to avoid filename collisions
            relative_path = os.path.relpath(
                source_file,
                source_dir
            )

            destination = os.path.join(
                destination_dir,
                relative_path
            )

            os.makedirs(
                os.path.dirname(destination),
                exist_ok=True
            )

            shutil.copy2(
                source_file,
                destination
            )

            count += 1

    print(
        f"[OK] {category}: {count} Markdown files extracted"
    )


def main():
    sources = load_sources()

    for category, config in sources.items():
        extract_markdown(category, config)


if __name__ == "__main__":
    main()