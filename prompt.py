def build_prompt(resume, job_description):

    return f"""
You are an advanced ATS (Applicant Tracking System) analyzer.

Analyze the given resume against the provided job description.

You MUST return ONLY valid JSON.

Do not include markdown.
Do not include explanations outside JSON.
Do not use code blocks.

Required JSON structure:

{{
  "match_score": integer,
  "matching_skills": [],
  "missing_skills": [],
  "resume_strengths": [],
  "improvement_suggestions": [],
  "rewritten_bullets": [],
  "match_explanation": ""
}}

Scoring Rules:
- Score should be between 0 and 100.
- Consider skill overlap, tools, technologies, role relevance, and experience alignment.
- Penalize missing critical skills.
- Reward strong keyword alignment.

Resume:
{resume}

Job Description:
{job_description}
"""