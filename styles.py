custom_css = """
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

html, body, [class*="css"] {
    font-family: 'Inter', sans-serif;
    background-color: #050816;
    color: #ffffff;
}

.block-container {
    padding-top: 3rem;
    padding-bottom: 3rem;
    max-width: 1100px;
}

/* HERO */
.hero-wrap { margin-bottom: 2.5rem; }

.hero-title {
    font-size: 56px;
    font-weight: 800;
    background: linear-gradient(90deg, #ffffff 30%, #A5B4FC 70%, #8B5CF6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1.1;
    margin-bottom: 0.5rem;
}

.hero-sub {
    color: #9CA3AF;
    font-size: 17px;
    max-width: 600px;
}

/* INPUTS */
.stTextArea textarea {
    background-color: #0F172A !important;
    color: #F1F5F9 !important;
    border: 1px solid #1E293B !important;
    border-radius: 14px !important;
    padding: 14px !important;
    font-size: 14px !important;
    font-family: 'Inter', sans-serif !important;
}

.stTextArea textarea:focus {
    border-color: #6366F1 !important;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.25), 0 0 20px rgba(99,102,241,0.1) !important;
}

/* BUTTON */
.stButton > button {
    width: 100%;
    background: linear-gradient(90deg, #6366F1, #8B5CF6) !important;
    color: white !important;
    border: none !important;
    border-radius: 14px !important;
    padding: 0.85rem 2rem !important;
    font-size: 16px !important;
    font-weight: 600 !important;
    transition: all 0.2s ease !important;
    margin-top: 0.5rem;
}

.stButton > button:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 8px 20px rgba(99,102,241,0.4) !important;
}

/* SCORE */
.score-wrap {
    border-radius: 20px;
    padding: 2.5rem;
    text-align: center;
    margin: 1.5rem 0 2rem 0;
}

.score-num {
    font-size: 88px;
    font-weight: 900;
    line-height: 1;
    color: white;
}

.score-label {
    font-size: 13px;
    letter-spacing: 3px;
    text-transform: uppercase;
    opacity: 0.75;
    margin-top: 6px;
}

.score-tag {
    display: inline-block;
    margin-top: 14px;
    font-size: 18px;
    font-weight: 700;
    color: white;
    background: rgba(255,255,255,0.15);
    padding: 6px 20px;
    border-radius: 999px;
}

/* SECTION HEADERS */
.sec-head {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 14px;
    padding-bottom: 8px;
    border-bottom: 1px solid #1E293B;
}

/* CHIPS */
.chip-green {
    display: inline-block;
    padding: 7px 14px;
    border-radius: 999px;
    margin: 4px;
    background: rgba(34,197,94,0.15);
    border: 1px solid rgba(34,197,94,0.35);
    color: #86EFAC;
    font-size: 13px;
    font-weight: 500;
}

.chip-red {
    display: inline-block;
    padding: 7px 14px;
    border-radius: 999px;
    margin: 4px;
    background: rgba(239,68,68,0.12);
    border: 1px solid rgba(239,68,68,0.3);
    color: #FCA5A5;
    font-size: 13px;
    font-weight: 500;
}

/* BULLET CARDS */
.bcard {
    background: #0F172A;
    border: 1px solid #1E293B;
    border-radius: 12px;
    padding: 14px 18px;
    margin-bottom: 10px;
    color: #CBD5E1;
    font-size: 14px;
    line-height: 1.6;
}

.bcard-accent { color: #818CF8; font-weight: 600; margin-right: 8px; }
.bcard-yellow { color: #FCD34D; font-weight: 600; margin-right: 8px; }
.bcard-green  { color: #6EE7B7; font-weight: 600; margin-right: 8px; }

/* EXPLANATION BOX */
.explain-box {
    background: #0F172A;
    border: 1px solid #1E293B;
    border-left: 3px solid #6366F1;
    border-radius: 12px;
    padding: 20px 24px;
    color: #CBD5E1;
    font-size: 14px;
    line-height: 1.75;
}

/* FOOTER */
.footer {
    text-align: center;
    color: #374151;
    font-size: 13px;
    margin-top: 3rem;
}
</style>
"""