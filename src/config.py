import os
from pathlib import Path

from dotenv import load_dotenv


ROOT_DIR = Path(__file__).resolve().parents[1]
ENV_FILE = ROOT_DIR / ".env"

# Load local .env for development runs. In Docker Compose, env_file injects
# variables into the environment directly, but this keeps local startup convenient.
load_dotenv(ENV_FILE, override=False)


def get_env(name: str, default: str | None = None) -> str | None:
    value = os.getenv(name, default)
    if value is None:
        return default
    return value.strip() if isinstance(value, str) else value


def require_env(name: str) -> str:
    value = get_env(name)
    if value is None or value == "":
        raise RuntimeError(
            f"Missing required environment variable: {name}. "
            "Set it in your local .env file or provide it to the container runtime."
        )
    return value


def validate_backend_env() -> None:
    required = ["QDRANT_URL", "QDRANT_API_KEY", "GROQ_API_KEY"]
    missing = [name for name in required if not get_env(name)]

    if missing:
        joined = ", ".join(missing)
        raise RuntimeError(
            "Missing required backend environment variables: "
            f"{joined}. Add them to your .env file or Docker env configuration."
        )

    # Keep collection name safe and reusable across local/dev environments.
    if not get_env("QDRANT_COLLECTION"):
        os.environ["QDRANT_COLLECTION"] = "devops_docs"


__all__ = ["get_env", "require_env", "validate_backend_env"]
