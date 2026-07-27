from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.environ.get("OPENROUTER_API_KEY"),
)


def get_gemini_response(prompt):
    response = client.chat.completions.create(
        model="deepseek/deepseek-v4-flash",
        messages=[{"role": "user", "content": prompt}],
    )
    return response.choices[0].message.content
