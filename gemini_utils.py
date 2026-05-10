from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

def get_gemini_response(prompt):
    try:
        response = client.models.generate_content(
            model="gemini-1.5-flash-latest",
            contents=prompt
        )
        return response.text
    except Exception as e:
        return str(e)