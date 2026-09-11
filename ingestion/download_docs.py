import json
import os
import subprocess


CONFIG_FILE = "config/sources.json"


def load_sources():
    with open(CONFIG_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def clone_source(category, config):
    repo_url = config["repo"]
    output_dir = config["raw_dir"]

    if os.path.exists(output_dir) and os.listdir(output_dir):
        print(f"[SKIP] {category} documentation already exists")
        return

    os.makedirs(os.path.dirname(output_dir), exist_ok=True)

    print(f"[DOWNLOAD] {category}")
    print(f"Repository: {repo_url}")

    subprocess.run(
        [
            "git",
            "clone",
            repo_url,
            output_dir
        ],
        check=True
    )

    print(f"[OK] {category} documentation downloaded")


def main():
    sources = load_sources()

    for category, config in sources.items():
        clone_source(category, config)


if __name__ == "__main__":
    main()