"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Briefcase, Zap, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScoreRing } from "@/components/score-ring";

interface AnalysisResult {
  match_score: number;
  matching_skills: string[];
  missing_skills: string[];
  resume_strengths: string[];
  improvement_suggestions: string[];
  rewritten_bullets: string[];
  match_explanation: string;
}

export default function Home() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [extractPdf, setExtractPdf] = useState<
    ((file: File) => Promise<string>) | null
  >(null);

  useEffect(() => {
    import("@/lib/pdf-extractor").then((mod) => {
      setExtractPdf(() => mod.extractTextFromPDF);
    });
  }, []);

  const handleFileUpload = useCallback(
    async (file: File) => {
      if (file.type !== "application/pdf") {
        setError("Please upload a PDF file.");
        return;
      }
      setFileName(file.name);
      setError("");

      if (extractPdf) {
        try {
          const text = await extractPdf(file);
          setResumeText(text);
        } catch {
          setError("Failed to extract text from PDF. You can paste it manually.");
        }
      } else {
        setError("PDF extractor not ready yet. Please paste text manually.");
      }
    },
    [extractPdf]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFileUpload(file);
    },
    [handleFileUpload]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleAnalyze = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      setError("Please fill in both resume and job description.");
      return;
    }
    setError("");
    setIsLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume: resumeText, jobDescription }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Analysis failed.");
        setIsLoading(false);
        return;
      }

      setResult(data as AnalysisResult);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto max-w-[1100px] px-6 py-12">
        {/* Hero */}
        <div className="mb-10">
          <h1
            className="mb-3 text-[56px] font-extrabold leading-[1.1]"
            style={{
              background: "linear-gradient(90deg, #ffffff 30%, #A5B4FC 70%, #8B5CF6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            ATSense
          </h1>
          <p className="max-w-[600px] text-[17px] text-[#9CA3AF]">
            Paste your resume and a job description. Get an instant ATS match
            score, skill gap breakdown, and AI-rewritten bullets.
          </p>
        </div>

        {/* Inputs */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Resume */}
          <div>
            <div className="mb-4 flex items-center gap-2 border-b border-[#1E293B] pb-2 text-base font-bold">
              <FileText className="h-4 w-4 text-[#A5B4FC]" />
              Your Resume
            </div>

            {/* Upload Zone */}
            <div
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              className={`mb-4 cursor-pointer rounded-[14px] border-2 border-dashed p-6 text-center transition-colors ${
                isDragging
                  ? "border-[#6366F1] bg-[#6366F1]/10"
                  : "border-[#1E293B] bg-[#0F172A] hover:border-[#6366F1]/50"
              }`}
            >
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
                className="hidden"
                id="resume-upload"
              />
              <label htmlFor="resume-upload" className="cursor-pointer">
                <Upload className="mx-auto mb-2 h-6 w-6 text-[#9CA3AF]" />
                <p className="text-sm text-[#9CA3AF]">
                  {fileName ? fileName : "Drag & drop PDF or click to upload"}
                </p>
                <p className="mt-1 text-xs text-[#4B5563]">
                  200MB per file • PDF
                </p>
              </label>
            </div>

            {/* Editable Text Area */}
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Or paste your resume text here..."
              className="min-h-[280px] w-full resize-none rounded-[14px] border border-[#1E293B] bg-[#0F172A] p-4 text-sm text-[#F1F5F9] placeholder:text-[#4B5563] focus:border-[#6366F1] focus:outline-none focus:ring-[3px] focus:ring-[rgba(99,102,241,0.25)]"
            />
          </div>

          {/* Job Description */}
          <div>
            <div className="mb-4 flex items-center gap-2 border-b border-[#1E293B] pb-2 text-base font-bold">
              <Briefcase className="h-4 w-4 text-[#FCA5A5]" />
              Job Description
            </div>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              className="min-h-[380px] w-full resize-none rounded-[14px] border border-[#1E293B] bg-[#0F172A] p-4 text-sm text-[#F1F5F9] placeholder:text-[#4B5563] focus:border-[#6366F1] focus:outline-none focus:ring-[3px] focus:ring-[rgba(99,102,241,0.25)]"
            />
          </div>
        </div>

        {/* Analyze Button */}
        <div className="mt-6">
          <Button
            onClick={handleAnalyze}
            disabled={isLoading}
            className="w-full"
          >
            <Zap className="mr-2 h-4 w-4" />
            {isLoading ? "Analyzing..." : "Analyze Resume"}
          </Button>
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex items-center gap-2 rounded-[12px] border border-[#7F1D1D] bg-[#7F1D1D]/20 p-4 text-[#FCA5A5]"
          >
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-sm">{error}</p>
          </motion.div>
        )}

        {/* Loading Skeletons */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-10 space-y-6"
            >
              <Skeleton className="h-[300px] w-full rounded-[20px]" />
              <div className="grid gap-6 md:grid-cols-2">
                <Skeleton className="h-[200px] w-full rounded-[12px]" />
                <Skeleton className="h-[200px] w-full rounded-[12px]" />
              </div>
              <Skeleton className="h-[250px] w-full rounded-[12px]" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {result && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-10 space-y-8"
            >
              {/* Score */}
              <ScoreRing score={result.match_score} />

              {/* Skills */}
              <div className="grid gap-6 md:grid-cols-2">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="mb-4 flex items-center gap-2 border-b border-[#1E293B] pb-2 text-base font-bold text-[#86EFAC]">
                    <span>✅</span> Matching Skills
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.matching_skills.length > 0 ? (
                      result.matching_skills.map((skill, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 + i * 0.05 }}
                        >
                          <Badge variant="green">{skill}</Badge>
                        </motion.div>
                      ))
                    ) : (
                      <span className="text-[#4B5563]">None found</span>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="mb-4 flex items-center gap-2 border-b border-[#1E293B] pb-2 text-base font-bold text-[#FCA5A5]">
                    <span>❌</span> Missing Skills
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.missing_skills.length > 0 ? (
                      result.missing_skills.map((skill, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 + i * 0.05 }}
                        >
                          <Badge variant="red">{skill}</Badge>
                        </motion.div>
                      ))
                    ) : (
                      <span className="text-[#4B5563]">None detected</span>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Strengths + Improvements */}
              <div className="grid gap-6 md:grid-cols-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="mb-4 flex items-center gap-2 border-b border-[#1E293B] pb-2 text-base font-bold">
                    <span>💪</span> Resume Strengths
                  </div>
                  <div className="space-y-2">
                    {result.resume_strengths.map((s, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + i * 0.08 }}
                      >
                        <Card>
                          <CardContent className="flex items-start gap-3 py-4">
                            <span className="mt-0.5 text-[#818CF8] font-semibold">
                              →
                            </span>
                            <span className="text-sm leading-relaxed">{s}</span>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="mb-4 flex items-center gap-2 border-b border-[#1E293B] pb-2 text-base font-bold">
                    <span>🎯</span> Improvement Suggestions
                  </div>
                  <div className="space-y-2">
                    {result.improvement_suggestions.map((s, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + i * 0.08 }}
                      >
                        <Card>
                          <CardContent className="flex items-start gap-3 py-4">
                            <span className="mt-0.5 text-[#FCD34D] font-semibold">
                              →
                            </span>
                            <span className="text-sm leading-relaxed">{s}</span>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Rewritten Bullets */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="mb-4 flex items-center gap-2 border-b border-[#1E293B] pb-2 text-base font-bold">
                  <span>✍️</span> AI-Optimized Resume Bullets
                </div>
                <div className="space-y-2">
                  {result.rewritten_bullets.map((b, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + i * 0.08 }}
                    >
                      <Card>
                        <CardContent className="flex items-start gap-3 py-4">
                          <span className="mt-0.5 text-[#6EE7B7] font-semibold">
                            •
                          </span>
                          <span className="text-sm leading-relaxed">{b}</span>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Match Explanation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div className="mb-4 flex items-center gap-2 border-b border-[#1E293B] pb-2 text-base font-bold">
                  <span>🧠</span> Match Explanation
                </div>
                <div className="rounded-[12px] border border-[#1E293B] border-l-[3px] border-l-[#6366F1] bg-[#0F172A] p-5 text-sm leading-[1.75] text-[#CBD5E1]">
                  {result.match_explanation}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="mt-16 pb-8 text-center text-sm text-[#6B7280]">
          <p>
            ATS scoring is AI-generated and simulated for educational/demo
            purposes.
          </p>
          <p className="mt-2">
            ATSense • Built by Anirudh Saini
          </p>
        </div>
      </div>
    </main>
  );
}
