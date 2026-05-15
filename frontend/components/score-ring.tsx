"use client";

import { motion } from "framer-motion";

interface ScoreRingProps {
  score: number;
}

export function ScoreRing({ score }: ScoreRingProps) {
  const radius = 90;
  const strokeWidth = 10;
  const circumference = radius * 2 * Math.PI;
  const progress = (score / 100) * circumference;

  const getColors = () => {
    if (score >= 75) {
      return {
        stroke: "#34D399",
        glow: "rgba(52,211,153,0.3)",
        bg: "linear-gradient(135deg, #064E3B 0%, #065F46 50%, #059669 100%)",
        tag: "Strong Match",
        emoji: "Strong Match",
        textColor: "#34D399",
      };
    }
    if (score >= 50) {
      return {
        stroke: "#FBBF24",
        glow: "rgba(251,191,36,0.3)",
        bg: "linear-gradient(135deg, #78350F 0%, #92400E 50%, #D97706 100%)",
        tag: "Moderate Match",
        emoji: "Moderate Match",
        textColor: "#FBBF24",
      };
    }
    return {
      stroke: "#F87171",
      glow: "rgba(248,113,113,0.3)",
      bg: "linear-gradient(135deg, #7F1D1D 0%, #991B1B 50%, #DC2626 100%)",
      tag: "Weak Match",
      emoji: "Weak Match",
      textColor: "#F87171",
    };
  };

  const colors = getColors();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex flex-col items-center justify-center rounded-3xl p-10 md:p-14"
      style={{ background: colors.bg }}
    >
      {/* Glow behind ring */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: (radius + 20) * 2,
          height: (radius + 20) * 2,
          background: colors.glow,
          filter: "blur(40px)",
        }}
      />

      <div className="relative">
        <svg width={(radius + 20) * 2} height={(radius + 20) * 2} className="-rotate-90">
          <circle
            cx={radius + 20}
            cy={radius + 20}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={radius + 20}
            cy={radius + 20}
            r={radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-[80px] font-black leading-none text-white md:text-[96px]"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {score}
          </motion.span>
        </div>
      </div>

      <div className="mt-6 text-center">
        <motion.p
          className="text-xs font-semibold uppercase tracking-[4px] text-white/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          ATS Match Score
        </motion.p>
        <motion.span
          className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-sm font-bold text-white backdrop-blur-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          {colors.tag}
        </motion.span>
      </div>
    </motion.div>
  );
}
