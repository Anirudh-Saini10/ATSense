"use client";

export async function extractTextFromPDF(file: File): Promise<string> {
  // Dynamic import avoids SSR issues and lets us configure pdfjs on the fly
  const pdfjsLib = await import("pdfjs-dist");

  // Disable web worker - parse on main thread.
  // Workers fail on mobile due to cross-origin/MIME restrictions.
  // Resume PDFs are small (1-2 pages) so main-thread parsing is instant.
  // @ts-ignore - internal API exists at runtime
  if (pdfjsLib.GlobalWorkerOptions) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = "";
  }

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
