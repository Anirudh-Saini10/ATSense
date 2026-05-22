"use client";

import * as pdfjsLib from "pdfjs-dist";

// Disable the external Web Worker entirely.
// Mobile browsers (especially iOS Safari) often fail to load the worker file
// due to stricter MIME-type enforcement, CORS restrictions, or Content Security
// Policy. Running pdf.js inline on the main thread avoids all of these issues
// and has negligible performance impact for resume-sized documents (1-5 pages).
pdfjsLib.GlobalWorkerOptions.workerSrc = "";

/**
 * Read a File into a Uint8Array.
 * Tries the modern File.arrayBuffer() first, then falls back to FileReader
 * for older mobile browsers that lack ArrayBuffer support on File/Blob.
 */
async function fileToUint8Array(file: File): Promise<Uint8Array> {
  // Modern path – works on all recent desktop & mobile browsers
  if (typeof file.arrayBuffer === "function") {
    try {
      const buf = await file.arrayBuffer();
      return new Uint8Array(buf);
    } catch {
      // Fall through to FileReader path
    }
  }

  // Legacy fallback via FileReader (universal support)
  return new Promise<Uint8Array>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(new Uint8Array(reader.result));
      } else {
        reject(new Error("FileReader did not return an ArrayBuffer."));
      }
    };
    reader.onerror = () => reject(reader.error ?? new Error("FileReader failed."));
    reader.readAsArrayBuffer(file);
  });
}

export async function extractTextFromPDF(file: File): Promise<string> {
  const data = await fileToUint8Array(file);

  const pdf = await pdfjsLib.getDocument({
    data,
    useSystemFonts: true,
  }).promise;

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

