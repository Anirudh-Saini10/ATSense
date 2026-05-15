import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ATSense — AI Resume Analyzer",
  description: "Paste your resume and a job description. Get an instant ATS match score, skill gap breakdown, and AI-rewritten bullets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
