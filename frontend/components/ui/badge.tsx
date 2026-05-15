import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "green" | "red" | "amber";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-[14px] py-[7px] text-[13px] font-medium transition-colors",
        variant === "default" &&
          "border-transparent bg-[#6366F1]/15 text-[#818CF8]",
        variant === "green" &&
          "border-[rgba(34,197,94,0.35)] bg-[rgba(34,197,94,0.15)] text-[#86EFAC]",
        variant === "red" &&
          "border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.12)] text-[#FCA5A5]",
        variant === "amber" &&
          "border-[rgba(251,191,36,0.3)] bg-[rgba(251,191,36,0.12)] text-[#FCD34D]",
        className
      )}
      {...props}
    />
  );
}

export { Badge };
