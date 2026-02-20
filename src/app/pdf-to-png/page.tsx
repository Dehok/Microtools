"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import HowToBlock from "@/components/HowToBlock";

interface RenderedPage {
  pageNumber: number;
  url: string;
  width: number;
  height: number;
  bytes: number;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function PdfToPngPage() {
  const [scale, setScale] = useState(1.8);
  const [processing, setProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const [pages, setPages] = useState<RenderedPage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const revokePages = useCallback((items: RenderedPage[]) => {
    for (const page of items) URL.revokeObjectURL(page.url);
  }, []);

  useEffect(() => {
    return () => revokePages(pages);
  }, [pages, revokePages]);

  const convertPdf = useCallback(
    async (file: File) => {
      setProcessing(true);
      setError("");
      setFileName(file.name);
      setPages((prev) => {
        revokePages(prev);
        return [];
      });

      try {
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

        const input = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: input }).promise;
        const nextPages: RenderedPage[] = [];

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
          const page = await pdf.getPage(pageNumber);
          const viewport = page.getViewport({ scale });
          const canvas = document.createElement("canvas");
          canvas.width = Math.ceil(viewport.width);
          canvas.height = Math.ceil(viewport.height);

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            throw new Error("Canvas is not available in this browser.");
          }

          await page.render({ canvas, canvasContext: ctx, viewport }).promise;

          const blob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob((output) => {
              if (!output) {
                reject(new Error(`Could not render page ${pageNumber}.`));
                return;
              }
              resolve(output);
            }, "image/png");
          });

          nextPages.push({
            pageNumber,
            url: URL.createObjectURL(blob),
            width: canvas.width,
            height: canvas.height,
            bytes: blob.size,
          });
        }

        setPages(nextPages);
      } catch (err) {
        setError(err instanceof Error ? err.message : "PDF conversion failed.");
      } finally {
        setProcessing(false);
      }
    },
    [revokePages, scale]
  );

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const file = Array.from(files).find(
        (candidate) => candidate.type === "application/pdf" || /\.pdf$/i.test(candidate.name)
      );
      if (!file) {
        setError("Please upload a PDF file.");
        return;
      }
      await convertPdf(file);
    },
    [convertPdf]
  );

  const downloadPage = (page: RenderedPage) => {
    const nameWithoutExt = fileName.replace(/\.pdf$/i, "") || "pdf";
    const link = document.createElement("a");
    link.href = page.url;
    link.download = `${nameWithoutExt}-page-${page.pageNumber}.png`;
    link.click();
  };

  const downloadAll = async () => {
    for (const page of pages) {
      downloadPage(page);
      await new Promise((resolve) => setTimeout(resolve, 140));
    }
  };

  const totalOutputBytes = pages.reduce((sum, page) => sum + page.bytes, 0);

  return (
    <ToolLayout
      title="PDF to PNG Converter Online"
      description="Convert each PDF page to a PNG image locally in your browser with render scale control."
      relatedTools={["pdf-to-jpg", "image-compressor", "pdf-split"]}
    >
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Render Scale: {scale.toFixed(1)}x
        </label>
        <input
          type="range"
          min={1}
          max={3}
          step={0.1}
          value={scale}
          onChange={(event) => setScale(Number(event.target.value))}
          className="w-full accent-blue-600"
        />
      </div>

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
          {processing ? "Converting PDF pages..." : "Drop a PDF file here or click to upload"}
        </p>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          PNG keeps sharp edges and transparency where possible.
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
              {pages.length} page{pages.length > 1 ? "s" : ""} converted, total{" "}
              {formatBytes(totalOutputBytes)}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setPages((prev) => {
                    revokePages(prev);
                    return [];
                  });
                  setFileName("");
                }}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Clear
              </button>
              <button
                onClick={() => void downloadAll()}
                className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
              >
                Download All
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {pages.map((page) => (
              <div
                key={page.pageNumber}
                className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900 sm:flex-row sm:items-center"
              >
                <img
                  src={page.url}
                  alt={`PDF page ${page.pageNumber} preview`}
                  className="h-28 w-full rounded border border-gray-200 object-contain dark:border-gray-700 sm:w-36"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    Page {page.pageNumber}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {page.width} x {page.height} px, {formatBytes(page.bytes)}
                  </p>
                </div>
                <button
                  onClick={() => downloadPage(page)}
                  className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                >
                  Download PNG
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      <HowToBlock
        title="How to convert PDF to PNG"
        intro="Convert PDF pages to sharp PNG images in-browser with adjustable render scale."
        schemaName="How to convert PDF to PNG"
        schemaUrl="https://codeutilo.com/pdf-to-png"
        steps={[
          {
            title: "Adjust render scale",
            details: "Set scale based on detail needs. Higher scale gives clearer text and graphics.",
          },
          {
            title: "Upload your PDF",
            details: "Drop a PDF file or click the upload area to pick a file from your device.",
          },
          {
            title: "Check page previews",
            details: "Inspect each generated page preview and confirm resolution and file size.",
          },
          {
            title: "Export PNG files",
            details: "Download each page separately or export all pages in sequence.",
          },
        ]}
        tips={[
          "PNG is better for OCR and text-heavy pages.",
          "Higher scale improves sharpness but increases file size.",
          "Use PDF to JPG when small files matter more than lossless quality.",
        ]}
      />

      <div className="mt-12 space-y-6 border-t border-gray-200 pt-8 text-sm leading-relaxed text-gray-600 dark:border-gray-700 dark:text-gray-400">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
        <p>
          PDF to PNG Converter renders PDF pages to lossless PNG output directly in your browser. You can increase
          render scale to get higher detail for print or OCR workflows.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is this better than JPG for text-heavy pages?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Usually yes. PNG is lossless, so lines and small text often stay sharper than JPG.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Do you store my PDF?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. All rendering and conversion run locally in your browser.
            </p>
          </details>
        </div>
      </div>
    </ToolLayout>
  );
}
