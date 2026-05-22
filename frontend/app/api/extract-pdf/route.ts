import { NextRequest, NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// Server-side PDF text extraction for mobile compatibility.
//
// Strategy:
//  1. Polyfill DOMMatrix & Path2D (browser-only globals pdfjs needs).
//  2. Dynamically import both the worker module and the main pdfjs library.
//  3. Register the worker on globalThis.pdfjsWorker so pdfjs uses it inline
//     without trying to spawn a thread or fetch a URL.
// ---------------------------------------------------------------------------

function ensurePolyfills() {
  if (typeof globalThis.DOMMatrix === "undefined") {
    globalThis.DOMMatrix = class DOMMatrix {
      m11 = 1; m12 = 0; m13 = 0; m14 = 0;
      m21 = 0; m22 = 1; m23 = 0; m24 = 0;
      m31 = 0; m32 = 0; m33 = 1; m34 = 0;
      m41 = 0; m42 = 0; m43 = 0; m44 = 1;
      a = 1; b = 0; c = 0; d = 1; e = 0; f = 0;
      is2D = true; isIdentity = true;
      constructor(init?: number[] | string) {
        if (Array.isArray(init) && init.length === 6) {
          [this.a, this.b, this.c, this.d, this.e, this.f] = init;
          this.m11 = this.a; this.m12 = this.b;
          this.m21 = this.c; this.m22 = this.d;
          this.m41 = this.e; this.m42 = this.f;
          this.isIdentity = false;
        } else if (Array.isArray(init) && init.length === 16) {
          [
            this.m11, this.m12, this.m13, this.m14,
            this.m21, this.m22, this.m23, this.m24,
            this.m31, this.m32, this.m33, this.m34,
            this.m41, this.m42, this.m43, this.m44,
          ] = init;
          this.a = this.m11; this.b = this.m12;
          this.c = this.m21; this.d = this.m22;
          this.e = this.m41; this.f = this.m42;
          this.is2D = false; this.isIdentity = false;
        }
      }
      inverse() { return new DOMMatrix(); }
      multiply() { return new DOMMatrix(); }
      translate() { return new DOMMatrix(); }
      scale() { return new DOMMatrix(); }
      rotate() { return new DOMMatrix(); }
      transformPoint() { return { x: 0, y: 0, z: 0, w: 1 }; }
      toFloat32Array() { return new Float32Array(16); }
      toFloat64Array() { return new Float64Array(16); }
    } as unknown as typeof DOMMatrix;
  }

  if (typeof globalThis.Path2D === "undefined") {
    globalThis.Path2D = class Path2D {
      moveTo() {} lineTo() {} bezierCurveTo() {} quadraticCurveTo() {}
      arc() {} arcTo() {} ellipse() {} rect() {} closePath() {}
    } as unknown as typeof Path2D;
  }
}

/** Lazily cached pdfjs module */
let _pdfjs: typeof import("pdfjs-dist/legacy/build/pdf.mjs") | null = null;

async function getPdfjs() {
  if (_pdfjs) return _pdfjs;

  // 1. Polyfill browser globals
  ensurePolyfills();

  // 2. Import the worker module and register it on globalThis so pdfjs
  //    picks it up via PDFWorker.#mainThreadWorkerMessageHandler instead
  //    of trying to dynamically import() a path that may not exist in the
  //    serverless bundle.
  const workerModule = await import("pdfjs-dist/legacy/build/pdf.worker.mjs");
  (globalThis as Record<string, unknown>).pdfjsWorker = workerModule;

  // 3. Import the main library
  const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");

  // Set a non-empty workerSrc to prevent the "no workerSrc" error.
  // It won't actually be loaded since we registered the handler above.
  pdfjsLib.GlobalWorkerOptions.workerSrc = "pdfjs-fake-worker-stub";

  _pdfjs = pdfjsLib;
  return pdfjsLib;
}

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

    const pdfjsLib = await getPdfjs();
    const pdf = await pdfjsLib.getDocument({ data }).promise;

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
