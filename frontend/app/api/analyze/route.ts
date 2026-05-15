import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

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

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "models/gemini-flash-latest" });

    const prompt = buildPrompt(resume, jobDescription);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

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
