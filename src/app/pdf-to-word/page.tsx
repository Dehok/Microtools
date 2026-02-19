"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface PageText {
  pageNumber: number;
  text: string;
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export default function PdfToWordPage() {
  const [fileName, setFileName] = useState("");
  const [processing, setProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [pages, setPages] = useState<PageText[]>([]);
  const [resultText, setResultText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractText = useCallback(async (file: File) => {
    setProcessing(true);
    setError("");
    setFileName(file.name);
    setPages([]);
    setResultText("");

    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const nextPages: PageText[] = [];

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);
        const content = await page.getTextContent();
        const text = content.items
          .map((item) => {
            if ("str" in item) return item.str;
            return "";
          })
          .join(" ")
          .replace(/\s+/g, " ")
          .trim();
        nextPages.push({ pageNumber, text });
      }

      const merged = nextPages
        .map((page) => `Page ${page.pageNumber}\n${page.text || "[No extractable text found on this page]"}\n`)
        .join("\n");

      setPages(nextPages);
      setResultText(merged.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not extract text from PDF.");
    } finally {
      setProcessing(false);
    }
  }, []);

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const file = Array.from(files).find(
        (candidate) => candidate.type === "application/pdf" || /\.pdf$/i.test(candidate.name)
      );
      if (!file) {
        setError("Please upload a PDF file.");
        return;
      }
      await extractText(file);
    },
    [extractText]
  );

  const nonEmptyPages = useMemo(() => pages.filter((page) => page.text.length > 0).length, [pages]);
  const wordCount = useMemo(
    () => (resultText.trim() ? resultText.trim().split(/\s+/).length : 0),
    [resultText]
  );

  const exportWordDoc = () => {
    if (!pages.length) return;

    const bodyHtml = pages
      .map((page) => {
        const content = page.text || "[No extractable text found on this page]";
        return `<h2>Page ${page.pageNumber}</h2><p>${escapeHtml(content).replace(/\n/g, "<br/>")}</p>`;
      })
      .join('<div style="page-break-after:always"></div>');

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(fileName || "converted")}</title>
  <style>
    body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; line-height: 1.45; margin: 30px; }
    h1 { font-size: 18pt; margin-bottom: 8px; }
    h2 { font-size: 13pt; margin-top: 18px; margin-bottom: 8px; }
    p { margin: 0 0 12px 0; white-space: pre-wrap; }
    .meta { color: #666; margin-bottom: 18px; }
  </style>
</head>
<body>
  <h1>PDF to Word Export (Text)</h1>
  <p class="meta">Source file: ${escapeHtml(fileName)}</p>
  ${bodyHtml}
</body>
</html>`;

    const blob = new Blob([html], { type: "application/msword;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const nameWithoutExt = fileName.replace(/\.pdf$/i, "") || "converted";
    link.href = url;
    link.download = `${nameWithoutExt}.doc`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout
      title="PDF to Word Converter Online (Text)"
      description="Extract text from PDF and export a Word-compatible DOC file directly in your browser."
      relatedTools={["pdf-to-text", "word-counter", "screenshot-to-text"]}
    >
      <div
        onDrop={(event) => {
          event.preventDefault();
          setDragOver(false);
          void handleFiles(event.dataTransfer.files);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => fileInputRef.current?.click()}
        className={`mb-4 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
          dragOver
            ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
            : "border-gray-300 bg-gray-50 hover:border-blue-400 dark:border-gray-600 dark:bg-gray-950"
        }`}
      >
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {processing ? "Extracting text..." : "Drop a PDF file here or click to upload"}
        </p>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Text-only conversion to Word-compatible DOC.
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={(event) => event.target.files && void handleFiles(event.target.files)}
        />
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {error}
        </div>
      )}

      {pages.length > 0 && (
        <>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {pages.length} pages, {nonEmptyPages} with extractable text, {wordCount} words
            </p>
            <div className="flex gap-2">
              <CopyButton text={resultText} />
              <button
                onClick={exportWordDoc}
                className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
              >
                Download DOC
              </button>
            </div>
          </div>

          <textarea
            value={resultText}
            onChange={(event) => setResultText(event.target.value)}
            rows={16}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 font-mono text-sm dark:border-gray-600 dark:bg-gray-900"
          />
        </>
      )}

      <div className="mt-12 space-y-6 border-t border-gray-200 pt-8 text-sm leading-relaxed text-gray-600 dark:border-gray-700 dark:text-gray-400">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
        <p>
          This PDF to Word converter is a text-first workflow. It extracts textual content from each PDF page and
          generates a Word-compatible DOC file you can open and edit.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Does this preserve original PDF layout?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. This is a light text extraction converter. Complex layout, tables, and images are not preserved.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Can it read scanned PDFs?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Only if text is embedded in the PDF. For scanned pages, OCR is required.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Are files uploaded?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. Extraction and export run locally in your browser.
            </p>
          </details>
        </div>
      </div>
    </ToolLayout>
  );
}
