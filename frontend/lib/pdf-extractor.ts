"use client";

import * as pdfjsLib from "pdfjs-dist";

// Bundled worker file in public/ - .js extension for universal MIME type support
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js?v=3";

export async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item: unknown) => {
        if (typeof item === "object" && item && "str" in item) {
          return (item as { str: string }).str;
        }
        return "";
      })
      .join(" ");
    text += pageText + "\n";
  }

  return text.trim();
}
