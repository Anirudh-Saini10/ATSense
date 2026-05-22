"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Briefcase, Zap, AlertCircle, Sparkles, ArrowRight, CheckCircle2, XCircle, Loader2 } from "lucide-react";
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

function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99,102,241,0.15), transparent),
            radial-gradient(ellipse 60% 40% at 80% 50%, rgba(139,92,246,0.08), transparent),
            radial-gradient(ellipse 50% 60% at 20% 80%, rgba(99,102,241,0.06), transparent)
          `,
        }}
      />
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />
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

  const handleFileUpload = useCallback(
    async (file: File) => {
      // Mobile browsers sometimes report empty or non-standard MIME types,
      // so also accept by file extension.
      const isPdf =
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf");
      if (!isPdf) {
        setError("Please upload a PDF file.");
        return;
      }
      setFileName(file.name);
      setError("");
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/extract-pdf", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Extraction failed.");
        }
        setResumeText(data.text);
      } catch (err) {
        console.error("PDF extraction error:", err);
        setError("Failed to extract text from PDF. You can paste it manually.");
      }
    },
    []
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
    <main className="relative min-h-screen bg-[#02040a] text-white overflow-x-hidden selection:bg-[#6366F1]/30 selection:text-white">
      <AnimatedBackground />
      
      <div className="relative mx-auto max-w-[1100px] px-5 py-10 md:px-6 md:py-16">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#6366F1]/20 bg-[#6366F1]/5 px-4 py-1.5 text-xs font-medium text-[#A5B4FC] backdrop-blur-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Powered by Gemini AI
          </motion.div>
          
          <h1 className="mb-5 text-[clamp(48px,8vw,80px)] font-black leading-[0.95] tracking-tight">
            <span className="bg-gradient-to-r from-white via-[#C7D2FE] to-[#A78BFA] bg-clip-text text-transparent">
              ATSense
            </span>
          </h1>
          
          <p className="mx-auto max-w-[480px] text-base leading-relaxed text-[#64748B] md:text-lg">
            AI-powered resume analyzer. Get your ATS match score, skill gap analysis, and optimized bullets in seconds.
          </p>
        </motion.div>

        {/* Inputs */}
        <div className="grid gap-5 md:grid-cols-2">
          {/* Resume */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur-2xl transition-all duration-500 hover:border-white/[0.1] hover:bg-white/[0.04]"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#6366F1]/5 via-transparent to-[#8B5CF6]/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            
            <div className="relative">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#6366F1]/20 to-[#8B5CF6]/20">
                  <FileText className="h-4 w-4 text-[#A5B4FC]" />
                </div>
                <span className="text-sm font-bold tracking-wide text-[#CBD5E1]">YOUR RESUME</span>
              </div>

              <div
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                className={`mb-4 cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all duration-300 ${
                  isDragging
                    ? "border-[#6366F1] bg-[#6366F1]/5 scale-[1.02]"
                    : "border-white/[0.08] bg-white/[0.02] hover:border-[#6366F1]/30 hover:bg-white/[0.04]"
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
                  <motion.div animate={isDragging ? { y: [0, -4, 0] } : {}} transition={{ repeat: Infinity, duration: 1.2 }}>
                    <Upload className={`mx-auto mb-3 h-7 w-7 ${isDragging ? "text-[#6366F1]" : "text-[#475569]"}`} />
                  </motion.div>
                  <p className="text-sm font-medium text-[#94A3B8]">
                    {fileName ? fileName : "Drop PDF here or click to browse"}
                  </p>
                  <p className="mt-1 text-[11px] text-[#334155]">
                    {fileName ? "Ready for analysis" : "Maximum file size: 200MB"}
                  </p>
                </label>
              </div>

              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Or paste resume text directly..."
                className="min-h-[240px] w-full resize-none rounded-xl border border-white/[0.06] bg-black/20 p-4 text-sm leading-relaxed text-[#E2E8F0] placeholder:text-[#334155] focus:border-[#6366F1]/40 focus:outline-none focus:ring-2 focus:ring-[#6366F1]/10 transition-all"
              />
            </div>
          </motion.div>

          {/* Job Description */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur-2xl transition-all duration-500 hover:border-white/[0.1] hover:bg-white/[0.04]"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#EF4444]/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            
            <div className="relative">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#EF4444]/20 to-[#F87171]/10">
                  <Briefcase className="h-4 w-4 text-[#FCA5A5]" />
                </div>
                <span className="text-sm font-bold tracking-wide text-[#CBD5E1]">JOB DESCRIPTION</span>
              </div>

              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                className="min-h-[360px] w-full resize-none rounded-xl border border-white/[0.06] bg-black/20 p-4 text-sm leading-relaxed text-[#E2E8F0] placeholder:text-[#334155] focus:border-[#6366F1]/40 focus:outline-none focus:ring-2 focus:ring-[#6366F1]/10 transition-all"
              />
            </div>
          </motion.div>
        </div>

        {/* Analyze Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-8"
        >
          <Button
            onClick={handleAnalyze}
            disabled={isLoading}
            className="relative w-full overflow-hidden rounded-xl py-4 text-base font-bold tracking-wide"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5" />
                  Analyze Resume
                </>
              )}
            </span>
            {!isLoading && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                animate={{ x: ["-200%", "200%"] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
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
              <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-red-300">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-12 space-y-5"
            >
              <Skeleton className="h-[300px] w-full rounded-2xl" />
              <div className="grid gap-5 md:grid-cols-2">
                <Skeleton className="h-[180px] w-full rounded-2xl" />
                <Skeleton className="h-[180px] w-full rounded-2xl" />
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
              className="mt-14 space-y-8"
            >
              <ScoreRing score={result.match_score} />

              <div className="grid gap-5 md:grid-cols-2">
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur-2xl"
                >
                  <div className="mb-5 flex items-center gap-3 text-sm font-bold tracking-wide text-emerald-400">
                    <CheckCircle2 className="h-5 w-5" />
                    MATCHING SKILLS
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
                      <span className="text-[#475569]">None found</span>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur-2xl"
                >
                  <div className="mb-5 flex items-center gap-3 text-sm font-bold tracking-wide text-red-400">
                    <XCircle className="h-5 w-5" />
                    MISSING SKILLS
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
                      <span className="text-[#475569]">None detected</span>
                    )}
                  </div>
                </motion.div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}>
                  <div className="mb-5 flex items-center gap-3 text-sm font-bold tracking-wide text-[#A5B4FC]">
                    <Sparkles className="h-5 w-5" />
                    RESUME STRENGTHS
                  </div>
                  <div className="space-y-3">
                    {result.resume_strengths.map((s, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.06 }}>
                        <Card className="border-l-[3px] border-l-[#6366F1] border-white/[0.06] bg-white/[0.03] backdrop-blur-2xl transition-all duration-300 hover:bg-white/[0.05]">
                          <CardContent className="flex items-start gap-3 py-4">
                            <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-[#818CF8]" />
                            <span className="text-sm leading-relaxed text-[#CBD5E1]">{s}</span>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}>
                  <div className="mb-5 flex items-center gap-3 text-sm font-bold tracking-wide text-amber-400">
                    <Zap className="h-5 w-5" />
                    IMPROVEMENTS
                  </div>
                  <div className="space-y-3">
                    {result.improvement_suggestions.map((s, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.06 }}>
                        <Card className="border-l-[3px] border-l-amber-500 border-white/[0.06] bg-white/[0.03] backdrop-blur-2xl transition-all duration-300 hover:bg-white/[0.05]">
                          <CardContent className="flex items-start gap-3 py-4">
                            <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                            <span className="text-sm leading-relaxed text-[#CBD5E1]">{s}</span>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.6 }}>
                <div className="mb-5 flex items-center gap-3 text-sm font-bold tracking-wide text-emerald-400">
                  <Sparkles className="h-5 w-5" />
                  AI-OPTIMIZED BULLETS
                </div>
                <div className="space-y-3">
                  {result.rewritten_bullets.map((b, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 + i * 0.06 }}>
                      <Card className="border-l-[3px] border-l-emerald-500 border-white/[0.06] bg-white/[0.03] backdrop-blur-2xl transition-all duration-300 hover:bg-white/[0.05]">
                        <CardContent className="flex items-start gap-3 py-4">
                          <span className="mt-0.5 text-lg leading-none text-emerald-400">•</span>
                          <span className="text-sm leading-relaxed text-[#CBD5E1]">{b}</span>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur-2xl"
              >
                <div className="mb-4 flex items-center gap-3 text-sm font-bold tracking-wide text-[#A5B4FC]">
                  <Sparkles className="h-5 w-5" />
                  MATCH EXPLANATION
                </div>
                <p className="text-sm leading-[1.85] text-[#94A3B8]">{result.match_explanation}</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="mt-20 pb-8 text-center">
          <div className="mx-auto mb-4 h-px w-48 bg-gradient-to-r from-transparent via-[#1E293B] to-transparent" />
          <p className="text-[11px] text-[#334155]">ATS scoring is AI-generated for educational purposes.</p>
          <p className="mt-1 text-[11px] font-medium text-[#475569]">ATSense • Anirudh Saini</p>
        </div>
      </div>
    </main>
  );
}
