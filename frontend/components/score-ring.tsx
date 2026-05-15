"use client";

import { motion } from "framer-motion";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

export function ScoreRing({ score, size = 220, strokeWidth = 14 }: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = (score / 100) * circumference;

  const getColor = () => {
    if (score >= 75) return "#22C55E";
    if (score >= 50) return "#D97706";
    return "#DC2626";
  };

  const getTag = () => {
    if (score >= 75) return "Strong Match";
    if (score >= 50) return "Moderate Match";
    return "Weak Match";
  };

  const getGradient = () => {
    if (score >= 75) return "linear-gradient(135deg, #065F46, #059669)";
    if (score >= 50) return "linear-gradient(135deg, #92400E, #D97706)";
    return "linear-gradient(135deg, #7F1D1D, #DC2626)";
  };

  return (
    <div
      className="flex flex-col items-center justify-center rounded-[20px] p-10"
      style={{ background: getGradient() }}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={getColor()}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-[72px] font-black leading-none text-white"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {score}
          </motion.span>
        </div>
      </div>
      <div className="mt-4 text-center">
        <p className="text-[13px] font-medium uppercase tracking-[3px] text-white/75">
          ATS Match Score
        </p>
        <motion.span
          className="mt-3 inline-block rounded-full bg-white/15 px-5 py-1.5 text-lg font-bold text-white"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          {score >= 75 ? "✅" : score >= 50 ? "⚠️" : "❌"} {getTag()}
        </motion.span>
      </div>
    </div>
  );
}
