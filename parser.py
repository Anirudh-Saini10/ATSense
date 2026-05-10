import json


def parse_response(response_text):

    try:
        cleaned = response_text.strip()

        if cleaned.startswith("```json"):
            cleaned = cleaned.replace("```json", "").replace("```", "")

        return json.loads(cleaned)

    except Exception:
        return None