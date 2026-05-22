"use client";

import * as pdfjsLib from "pdfjs-dist";

// Use a CDN-hosted worker that matches our installed pdfjs-dist version.
// The local public/ worker file was returning 404 on Vercel, which caused:
//   - Desktop: silent fallback to main-thread (worked by luck)
//   - Mobile: hard failure (no graceful fallback on iOS Safari / mobile Chrome)
// A CDN URL guarantees correct MIME type, CORS headers, and availability.
const PDFJS_VERSION = "5.7.284";
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.mjs`;

/**
 * Read a File into a Uint8Array.
 * Tries the modern File.arrayBuffer() first, then falls back to FileReader
 * for older mobile browsers that lack ArrayBuffer support on File/Blob.
 */
async function fileToUint8Array(file: File): Promise<Uint8Array> {
  if (typeof file.arrayBuffer === "function") {
    try {
      const buf = await file.arrayBuffer();
      return new Uint8Array(buf);
    } catch {
      // Fall through to FileReader path
    }
  }

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


