import { NextRequest, NextResponse } from "next/server";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf.mjs";

// No worker needed in Node.js — parsing runs on the main thread.
GlobalWorkerOptions.workerSrc = "";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: "No PDF file provided." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);

    const pdf = await getDocument({ data }).promise;

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

    return NextResponse.json({ text: text.trim() });
  } catch (error) {
    console.error("PDF extraction error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to extract text from PDF.",
      },
      { status: 500 }
    );
  }
}
