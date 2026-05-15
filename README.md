# ATSense — AI-Powered Resume Analyzer

<<<<<<< HEAD
**Live Demo →** https://atsense-wheat.vercel.app
=======

<img width="1355" height="611" alt="image" src="https://github.com/user-attachments/assets/69ed9f58-1809-4792-a6ef-92f6627f3c69" />

<img width="1255" height="620" alt="image" src="https://github.com/user-attachments/assets/a37d3abc-f538-4941-a549-e0fa23dfb33f" />



**Live Demo → https://atsense-wheat.vercel.app/
>>>>>>> origin/main

ATSense is an LLM-powered ATS (Applicant Tracking System) resume analyzer that compares your resume against a job description and gives you an instant match score, skill gap breakdown, and AI-rewritten bullet points — in seconds.

---

## What It Does

Upload or paste your resume alongside a job description. ATSense runs a full analysis and returns:

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
| Frontend | Next.js 16 + TypeScript + Tailwind CSS v4 |
| UI Components | shadcn/ui + Framer Motion |
| PDF Extraction | pdfjs-dist (client-side) |
| LLM | Google Gemini Flash via Node.js SDK |
| Prompt Engineering | Structured JSON output via custom prompt |
| Parsing | Custom JSON parser with error handling |
| Deployment | Vercel |

---

## How It Works

```
User Input (Resume PDF/text + JD)
        ↓
Client-side PDF extraction (pdfjs-dist)
        ↓
POST /api/analyze → Next.js API route
        ↓
build_prompt() → structured prompt with JSON schema
        ↓
Gemini Flash API call (@google/generative-ai)
        ↓
parse_response() → extracts JSON from LLM output
        ↓
Glassmorphism UI renders animated score ring, skill chips, cards
```

The prompt instructs Gemini to return **only valid JSON** with a fixed schema — no markdown, no preamble. The parser strips any formatting artifacts and loads the result.

---

## Project Structure

```
ATSense/
├── frontend/           # Next.js 16 app (deployed)
│   ├── app/
│   │   ├── page.tsx            # Main UI
│   │   ├── layout.tsx          # Root layout
│   │   ├── globals.css         # Tailwind theme
│   │   └── api/
│   │       └── analyze/
│   │           └── route.ts    # Gemini API route
│   ├── components/
│   │   ├── score-ring.tsx      # Animated score ring
│   │   └── ui/                 # shadcn/ui components
│   ├── lib/
│   │   ├── pdf-extractor.ts    # Client-side PDF text extraction
│   │   └── utils.ts            # Tailwind class merge
│   ├── public/
│   │   └── pdf.worker.min.mjs  # PDF.js worker (bundled)
│   └── package.json
│
├── app.py              # Original Streamlit app (preserved)
├── gemini_utils.py     # Python Gemini wrapper (preserved)
├── prompt.py           # Prompt builder (preserved)
├── parser.py           # JSON parser (preserved)
├── styles.py           # Streamlit CSS (preserved)
└── requirements.txt    # Python deps (preserved)
```

---

## Deploy on Vercel

### 1. Fork / Clone the repo

```bash
git clone https://github.com/Anirudh-Saini10/ATSense
cd ATSense
```

### 2. Vercel Project Settings

- **Framework Preset**: Next.js
- **Root Directory**: `frontend`
- **Install Command**: `npm install`
- **Build Command**: `npm run build`

### 3. Environment Variables

Add this in Vercel dashboard → Project Settings → Environment Variables:

| Key | Value |
|-----|-------|
| `GEMINI_API_KEY` | Your Google AI Studio API key |

### 4. Deploy

Push to `main` branch — Vercel auto-deploys on every push.

---

## Running Locally (Frontend)

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```
GEMINI_API_KEY=your_key_here
```

```bash
npm run dev
```

Open http://localhost:3000

---

## Running Locally (Original Streamlit)

```bash
python -m venv venv
venv\Scripts\activate       # Windows
pip install -r requirements.txt
```

Create `.env`:

```
GEMINI_API_KEY=your_key_here
```

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
