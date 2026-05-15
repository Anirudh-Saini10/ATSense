"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Briefcase, Zap, AlertCircle, Sparkles, ArrowRight, CheckCircle2, XCircle } from "lucide-react";
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

function BackgroundGlow() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute -left-[20%] -top-[10%] h-[500px] w-[500px] rounded-full bg-[#6366F1]/10 blur-[120px]" />
      <div className="absolute -right-[20%] top-[20%] h-[400px] w-[400px] rounded-full bg-[#8B5CF6]/8 blur-[100px]" />
      <div className="absolute bottom-[10%] left-[30%] h-[300px] w-[300px] rounded-full bg-[#6366F1]/5 blur-[80px]" />
    </div>
  );
}

export default function Home() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [extractPdf, setExtractPdf] = useState<((file: File) => Promise<string>) | null>(null);

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
    <main className="relative min-h-screen bg-[#050816] text-white overflow-x-hidden">
      <BackgroundGlow />
      <div className="relative mx-auto max-w-[1100px] px-6 py-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center md:text-left"
        >
          <h1
            className="mb-4 text-[clamp(40px,6vw,64px)] font-extrabold leading-[1.05] tracking-tight"
            style={{
              background: "linear-gradient(90deg, #ffffff 20%, #A5B4FC 55%, #8B5CF6 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            ATSense
          </h1>
          <p className="mx-auto max-w-[520px] text-[17px] leading-relaxed text-[#9CA3AF] md:mx-0">
            Paste your resume and a job description. Get an instant ATS match score, skill gap breakdown, and AI-rewritten bullets.
          </p>
        </motion.div>

        {/* Inputs */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Resume */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-[20px] border border-[#1E293B]/60 bg-[#0F172A]/60 p-6 backdrop-blur-xl"
          >
            <div className="mb-5 flex items-center gap-2.5 text-base font-bold">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6366F1]/15">
                <FileText className="h-4 w-4 text-[#818CF8]" />
              </div>
              Your Resume
            </div>

            <div
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              className={`mb-4 cursor-pointer rounded-[14px] border-2 border-dashed p-8 text-center transition-all duration-300 ${
                isDragging
                  ? "border-[#6366F1] bg-[#6366F1]/10 scale-[1.02]"
                  : "border-[#1E293B] bg-[#0B1120] hover:border-[#6366F1]/40 hover:bg-[#0B1120]/80"
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
                <motion.div
                  animate={isDragging ? { y: [-2, 2, -2] } : {}}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <Upload className={`mx-auto mb-3 h-8 w-8 transition-colors ${isDragging ? "text-[#6366F1]" : "text-[#4B5563]"}`} />
                </motion.div>
                <p className="text-sm font-medium text-[#CBD5E1]">
                  {fileName ? fileName : "Drag & drop your PDF here"}
                </p>
                <p className="mt-1.5 text-xs text-[#4B5563]">
                  {fileName ? "Uploaded successfully" : "200MB max • PDF only"}
                </p>
              </label>
            </div>

            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Or paste your resume text here..."
              className="min-h-[260px] w-full resize-none rounded-[14px] border border-[#1E293B] bg-[#0B1120] p-4 text-sm text-[#F1F5F9] placeholder:text-[#374151] focus:border-[#6366F1] focus:outline-none focus:ring-[3px] focus:ring-[rgba(99,102,241,0.2)] transition-all"
            />
          </motion.div>

          {/* Job Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-[20px] border border-[#1E293B]/60 bg-[#0F172A]/60 p-6 backdrop-blur-xl"
          >
            <div className="mb-5 flex items-center gap-2.5 text-base font-bold">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EF4444]/10">
                <Briefcase className="h-4 w-4 text-[#FCA5A5]" />
              </div>
              Job Description
            </div>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              className="min-h-[380px] w-full resize-none rounded-[14px] border border-[#1E293B] bg-[#0B1120] p-4 text-sm text-[#F1F5F9] placeholder:text-[#374151] focus:border-[#6366F1] focus:outline-none focus:ring-[3px] focus:ring-[rgba(99,102,241,0.2)] transition-all"
            />
          </motion.div>
        </div>

        {/* Analyze Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8"
        >
          <Button
            onClick={handleAnalyze}
            disabled={isLoading}
            className="relative w-full overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center">
              <Sparkles className="mr-2 h-5 w-5" />
              {isLoading ? "Analyzing with AI..." : "Analyze Resume"}
            </span>
            {!isLoading && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              />
            )}
          </Button>
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="mt-6 overflow-hidden"
            >
              <div className="flex items-center gap-3 rounded-[14px] border border-[#7F1D1D]/50 bg-[#7F1D1D]/10 p-4 text-[#FCA5A5]">
                <XCircle className="h-5 w-5 shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Skeletons */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-12 space-y-6"
            >
              <Skeleton className="h-[320px] w-full rounded-[20px]" />
              <div className="grid gap-6 md:grid-cols-2">
                <Skeleton className="h-[220px] w-full rounded-[16px]" />
                <Skeleton className="h-[220px] w-full rounded-[16px]" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {result && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="mt-12 space-y-8"
            >
              <ScoreRing score={result.match_score} />

              <div className="grid gap-6 md:grid-cols-2">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-[20px] border border-[#1E293B]/60 bg-[#0F172A]/60 p-6 backdrop-blur-xl"
                >
                  <div className="mb-5 flex items-center gap-2.5 text-base font-bold text-[#86EFAC]">
                    <CheckCircle2 className="h-5 w-5" />
                    Matching Skills
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.matching_skills.length > 0 ? (
                      result.matching_skills.map((skill, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 + i * 0.04 }}
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
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-[20px] border border-[#1E293B]/60 bg-[#0F172A]/60 p-6 backdrop-blur-xl"
                >
                  <div className="mb-5 flex items-center gap-2.5 text-base font-bold text-[#FCA5A5]">
                    <XCircle className="h-5 w-5" />
                    Missing Skills
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.missing_skills.length > 0 ? (
                      result.missing_skills.map((skill, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 + i * 0.04 }}
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

              <div className="grid gap-6 md:grid-cols-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="mb-5 flex items-center gap-2.5 text-base font-bold">
                    <Sparkles className="h-5 w-5 text-[#818CF8]" />
                    Resume Strengths
                  </div>
                  <div className="space-y-3">
                    {result.resume_strengths.map((s, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + i * 0.07 }}
                      >
                        <Card className="border-l-[3px] border-l-[#6366F1]/60">
                          <CardContent className="flex items-start gap-3 py-4">
                            <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-[#818CF8]" />
                            <span className="text-sm leading-relaxed text-[#CBD5E1]">{s}</span>
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
                  <div className="mb-5 flex items-center gap-2.5 text-base font-bold">
                    <Zap className="h-5 w-5 text-[#FCD34D]" />
                    Improvement Suggestions
                  </div>
                  <div className="space-y-3">
                    {result.improvement_suggestions.map((s, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + i * 0.07 }}
                      >
                        <Card className="border-l-[3px] border-l-[#D97706]/60">
                          <CardContent className="flex items-start gap-3 py-4">
                            <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-[#FCD34D]" />
                            <span className="text-sm leading-relaxed text-[#CBD5E1]">{s}</span>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="mb-5 flex items-center gap-2.5 text-base font-bold">
                  <Sparkles className="h-5 w-5 text-[#6EE7B7]" />
                  AI-Optimized Resume Bullets
                </div>
                <div className="space-y-3">
                  {result.rewritten_bullets.map((b, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + i * 0.07 }}
                    >
                      <Card className="border-l-[3px] border-l-[#22C55E]/60">
                        <CardContent className="flex items-start gap-3 py-4">
                          <span className="mt-0.5 text-lg leading-none text-[#6EE7B7]">•</span>
                          <span className="text-sm leading-relaxed text-[#CBD5E1]">{b}</span>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="rounded-[20px] border border-[#1E293B]/60 bg-[#0F172A]/60 p-6 backdrop-blur-xl"
              >
                <div className="mb-4 flex items-center gap-2.5 text-base font-bold">
                  <Sparkles className="h-5 w-5 text-[#6366F1]" />
                  Match Explanation
                </div>
                <p className="text-sm leading-[1.8] text-[#CBD5E1]">
                  {result.match_explanation}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="mt-20 pb-8 text-center">
          <div className="mb-3 h-px w-full bg-gradient-to-r from-transparent via-[#1E293B] to-transparent" />
          <p className="text-xs text-[#4B5563]">
            ATS scoring is AI-generated and simulated for educational/demo purposes.
          </p>
          <p className="mt-1.5 text-xs font-medium text-[#6B7280]">
            ATSense • Built by Anirudh Saini
          </p>
        </div>
      </div>
    </main>
  );
}
