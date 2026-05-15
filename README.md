# ATSense — AI-Powered Resume Analyzer





**Live Demo → https://atsense-wheat.vercel.app/https://atsense-wheat.vercel.app/

ATSense is an LLM-powered ATS (Applicant Tracking System) resume analyzer that compares your resume against a job description and gives you an instant match score, skill gap breakdown, and AI-rewritten bullet points — in seconds.

---

## What It Does

Paste your resume and a job description. ATSense runs a full analysis and returns:

- **ATS Match Score** (0–100) with a Strong / Moderate / Weak classification
- **Matching Skills** — skills your resume already has that the JD requires
- **Missing Skills** — critical gaps between your resume and the role
- **Resume Strengths** — what's working in your favor
- **Improvement Suggestions** — specific, actionable fixes
- **AI-Optimized Bullets** — your existing bullets rewritten to better match the JD
- **Match Explanation** — a plain-English breakdown of the full analysis

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Streamlit |
| LLM | Google Gemini 1.5 Flash |
| Prompt Engineering | Structured JSON output via custom prompt |
| Parsing | Custom JSON parser with error handling |
| Deployment | Streamlit Cloud |

---

## How It Works

```
User Input (Resume + JD)
        ↓
build_prompt() → structured prompt with JSON schema
        ↓
Gemini 1.5 Flash API call
        ↓
parse_response() → extracts JSON from LLM output
        ↓
Streamlit UI renders score, chips, cards, bullets
```

The prompt instructs Gemini to return **only valid JSON** with a fixed schema — no markdown, no preamble. The parser strips any formatting artifacts and loads the result.

---

## Project Structure

```
ATSense/
├── app.py              # Main Streamlit app + UI
├── gemini_utils.py     # Gemini API wrapper
├── prompt.py           # Prompt builder
├── parser.py           # JSON response parser
├── styles.py           # Custom CSS
├── requirements.txt
└── .env                # GEMINI_API_KEY (local only)
```

---

## Running Locally

```bash
git clone https://github.com/yourusername/atsense
cd atsense
python -m venv venv
venv\Scripts\activate       # Windows
pip install -r requirements.txt
```

Create a `.env` file:

```
GEMINI_API_KEY=your_key_here
```

Run:

```bash
streamlit run app.py
```

Get a free Gemini API key at [aistudio.google.com](https://aistudio.google.com)

---

## Prompt Engineering

The core of ATSense is the prompt. It instructs Gemini to:

- Score based on skill overlap, keyword alignment, tools, and experience relevance
- Penalize missing critical skills
- Return a strict JSON schema — no deviation

This makes the output deterministic and parseable every time.

---

## Limitations

- ATS scoring is simulated — real ATS systems vary significantly by vendor
- Results depend on Gemini's interpretation of the resume and JD
- Not a substitute for human resume review

---

## Built By

**Anirudh Saini** — B.Tech CS (AI/ML), Manipal University Jaipur

[LinkedIn](https://linkedin.com/in/anirudh-saini) · [GitHub](https://github.com/anirudh-saini)
