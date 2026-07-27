from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.environ.get("OPENROUTER_API_KEY"),
)

models = client.models.list()
for model in models.data:
    if "deepseek" in model.id.lower():
        print(model.id)
