import os

from dotenv import load_dotenv
from groq import Groq


load_dotenv()

api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    raise ValueError("GROQ_API_KEY is missing from .env")


client = Groq(api_key=api_key)

print("=" * 70)
print("MODELS AVAILABLE FOR THIS GROQ API KEY")
print("=" * 70)

models = client.models.list()

for model in models.data:
    print(
        f"{model.id} | "
        f"active={model.active}"
    )