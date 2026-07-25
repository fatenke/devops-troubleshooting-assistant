import os
import subprocess


REPO_URL = "https://github.com/docker/docs.git"

OUTPUT_DIR = "../data/raw/docker"


def clone_docker_docs():

    if os.path.exists(OUTPUT_DIR):
        print("Docker documentation already exists")
        return

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    subprocess.run(
        [
            "git",
            "clone",
            REPO_URL,
            OUTPUT_DIR
        ],
        check=True
    )

    print("Docker documentation downloaded")


if __name__ == "__main__":
    clone_docker_docs()