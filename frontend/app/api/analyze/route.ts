import { NextRequest, NextResponse } from "next/server";

function buildPrompt(resume: string, jobDescription: string): string {
  return `
You are an advanced ATS (Applicant Tracking System) analyzer.

Analyze the given resume against the provided job description.

You MUST return ONLY valid JSON.

Do not include markdown.
Do not include explanations outside JSON.
Do not use code blocks.

Required JSON structure:

{
  "match_score": integer,
  "matching_skills": [],
  "missing_skills": [],
  "resume_strengths": [],
  "improvement_suggestions": [],
  "rewritten_bullets": [],
  "match_explanation": ""
}

Scoring Rules:
- Score should be between 0 and 100.
- Consider skill overlap, tools, technologies, role relevance, and experience alignment.
- Penalize missing critical skills.
- Reward strong keyword alignment.

Resume:
${resume}

Job Description:
${jobDescription}
`;
}

function parseResponse(responseText: string): Record<string, unknown> | null {
  try {
    let cleaned = responseText.trim();
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.replace("```json", "").replace("```", "");
    }
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { resume, jobDescription } = await request.json();

    if (!resume?.trim() || !jobDescription?.trim()) {
      return NextResponse.json(
        { error: "Both resume and job description are required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENROUTER_API_KEY is not configured." },
        { status: 500 }
      );
    }

    const prompt = buildPrompt(resume, jobDescription);
    const aiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-v4-flash",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!aiResponse.ok) {
      const detail = await aiResponse.text();
      return NextResponse.json(
        { error: `OpenRouter request failed: ${aiResponse.status}`, detail },
        { status: 502 }
      );
    }

    const payload = await aiResponse.json();
    const text = payload.choices?.[0]?.message?.content ?? "";

    const data = parseResponse(text);

    if (!data) {
      return NextResponse.json(
        { error: "Failed to parse AI response.", raw: text },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error occurred." },
      { status: 500 }
    );
  }
}
