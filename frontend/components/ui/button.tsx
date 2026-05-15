import * as React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-[14px] font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] disabled:pointer-events-none disabled:opacity-50",
          variant === "default" &&
            "bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white hover:shadow-[0_8px_20px_rgba(99,102,241,0.4)] hover:-translate-y-[2px]",
          variant === "outline" &&
            "border border-[#1E293B] bg-transparent hover:bg-[#1E293B] hover:text-white",
          variant === "ghost" && "hover:bg-[#1E293B] hover:text-white",
          size === "default" && "h-11 px-6 py-3 text-base",
          size === "sm" && "h-9 px-3 text-sm",
          size === "lg" && "h-12 px-8 text-lg",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
