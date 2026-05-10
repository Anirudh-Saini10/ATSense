import streamlit as st
from gemini_utils import get_gemini_response
from prompt import build_prompt
from parser import parse_response
from styles import custom_css

st.set_page_config(page_title="ATSense", page_icon="📄", layout="wide")
st.markdown(custom_css, unsafe_allow_html=True)

# HERO
st.markdown("""
<div style='padding: 2rem 0 1.5rem 0;'>
    <div style='font-size:56px; font-weight:800; line-height:1.1; margin-bottom:0.75rem;
                background: linear-gradient(90deg, #ffffff 30%, #A5B4FC 70%, #8B5CF6 100%);
                -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                background-clip: text; display: inline-block;'>ATSense</div>
    <div style='color:#9CA3AF; font-size:17px; max-width:600px; margin-top:4px;'>
        Paste your resume and a job description. Get an instant ATS match score,
        skill gap breakdown, and AI-rewritten bullets.
    </div>
</div>
""", unsafe_allow_html=True)

# INPUTS
col1, col2 = st.columns(2, gap="large")
with col1:
    st.markdown("<div class='sec-head'>📄 Your Resume</div>", unsafe_allow_html=True)
    resume = st.text_area("resume", placeholder="Paste your full resume here...",
                          height=360, label_visibility="collapsed")
with col2:
    st.markdown("<div class='sec-head'>💼 Job Description</div>", unsafe_allow_html=True)
    job_description = st.text_area("jd", placeholder="Paste the job description here...",
                                   height=360, label_visibility="collapsed")

st.markdown("<br>", unsafe_allow_html=True)
analyze = st.button("⚡ Analyze Resume")

if analyze:
    if not resume.strip() or not job_description.strip():
        st.warning("Fill in both fields before analyzing.")
        st.stop()

    with st.spinner("Analyzing..."):
        prompt = build_prompt(resume, job_description)
        response = get_gemini_response(prompt)
        data = parse_response(response)

    if not data:
        st.error("Failed to parse AI response.")
        st.write(response)
        st.stop()

    score = data.get("match_score", 0)

    if score >= 75:
        bg = "linear-gradient(135deg, #065F46, #059669)"
        tag = "✅ Strong Match"
    elif score >= 50:
        bg = "linear-gradient(135deg, #92400E, #D97706)"
        tag = "⚠️ Moderate Match"
    else:
        bg = "linear-gradient(135deg, #7F1D1D, #DC2626)"
        tag = "❌ Weak Match"

    # SCORE
    st.markdown(f"""
    <div style='background: {bg}; border-radius: 20px; padding: 2.5rem;
                text-align: center; margin: 1.5rem 0 2rem 0;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);'>
        <div style='font-size:88px; font-weight:900; line-height:1; color:white;'>{score}</div>
        <div style='font-size:13px; letter-spacing:3px; text-transform:uppercase;
                    opacity:0.75; margin-top:6px; color:white;'>ATS Match Score</div>
        <div style='display:inline-block; margin-top:14px; font-size:18px; font-weight:700;
                    color:white; background:rgba(255,255,255,0.15);
                    padding:6px 20px; border-radius:999px;'>{tag}</div>
    </div>
    """, unsafe_allow_html=True)

    # SKILLS
    col3, col4 = st.columns(2, gap="large")

    with col3:
        st.markdown("<div class='sec-head' style='color:#86EFAC;'>✅ Matching Skills</div>",
                    unsafe_allow_html=True)
        matching = data.get("matching_skills", [])
        if matching:
            st.markdown("".join([f"<span class='chip-green'>{s}</span>"
                                 for s in matching]), unsafe_allow_html=True)
        else:
            st.markdown("<span style='color:#4B5563;'>None found</span>",
                        unsafe_allow_html=True)

    with col4:
        st.markdown("<div class='sec-head' style='color:#FCA5A5;'>❌ Missing Skills</div>",
                    unsafe_allow_html=True)
        missing = data.get("missing_skills", [])
        if missing:
            st.markdown("".join([f"<span class='chip-red'>{s}</span>"
                                 for s in missing]), unsafe_allow_html=True)
        else:
            st.markdown("<span style='color:#4B5563;'>None detected</span>",
                        unsafe_allow_html=True)

    st.markdown("<br>", unsafe_allow_html=True)

    # STRENGTHS + IMPROVEMENTS
    col5, col6 = st.columns(2, gap="large")

    with col5:
        st.markdown("<div class='sec-head'>💪 Resume Strengths</div>",
                    unsafe_allow_html=True)
        for s in data.get("resume_strengths", []):
            st.markdown(f"<div class='bcard'><span class='bcard-accent'>→</span>{s}</div>",
                        unsafe_allow_html=True)

    with col6:
        st.markdown("<div class='sec-head'>🎯 Improvement Suggestions</div>",
                    unsafe_allow_html=True)
        for s in data.get("improvement_suggestions", []):
            st.markdown(f"<div class='bcard'><span class='bcard-yellow'>→</span>{s}</div>",
                        unsafe_allow_html=True)

    st.markdown("<br>", unsafe_allow_html=True)

    # OPTIMIZED BULLETS
    st.markdown("<div class='sec-head'>✍️ AI-Optimized Resume Bullets</div>",
                unsafe_allow_html=True)
    for b in data.get("rewritten_bullets", []):
        st.markdown(f"<div class='bcard'><span class='bcard-green'>•</span>{b}</div>",
                    unsafe_allow_html=True)

    st.markdown("<br>", unsafe_allow_html=True)

    # EXPLANATION
    st.markdown("<div class='sec-head'>🧠 Match Explanation</div>",
                unsafe_allow_html=True)
    st.markdown(f"<div class='explain-box'>{data.get('match_explanation', '')}</div>",
                unsafe_allow_html=True)

    # FOOTER
    st.markdown(
    """
    <div style="
        text-align:center;
        color:#6B7280;
        margin-top:40px;
        font-size:14px;
    ">
        ATS scoring is AI-generated and simulated for educational/demo purposes.
        <br><br>
        ATSense • Built by Anirudh Saini
    </div>
    """,
    unsafe_allow_html=True
)