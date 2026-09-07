import os
import shutil


SOURCE = "../data/raw/docker"
DEST = "../data/processed/docker"


def extract_markdown():

    os.makedirs(DEST, exist_ok=True)

    for root, dirs, files in os.walk(SOURCE):

        for file in files:

            if file.endswith(".md"):

                source_file = os.path.join(root,file)

                destination = os.path.join(
                    DEST,
                    file
                )

                shutil.copy(
                    source_file,
                    destination
                )


if __name__ == "__main__":
    extract_markdown()