import google.generativeai as genai
import os

from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("models/gemini-flash-latest")


def get_gemini_response(prompt):

    try:
        response = model.generate_content(prompt)
        return response.text

    except Exception as e:
        return str(e)