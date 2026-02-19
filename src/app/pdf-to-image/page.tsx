"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ToolLayout from "@/components/ToolLayout";

interface RenderedPage {
  pageNumber: number;
  url: string;
  width: number;
  height: number;
  bytes: number;
}

type OutputFormat = "png" | "jpg" | "webp";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function mimeForFormat(format: OutputFormat) {
  if (format === "png") return "image/png";
  if (format === "webp") return "image/webp";
  return "image/jpeg";
}

export default function PdfToImagePage() {
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("png");
  const [quality, setQuality] = useState(90);
  const [scale, setScale] = useState(1.6);
  const [pageRange, setPageRange] = useState("all");
  const [processing, setProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [pages, setPages] = useState<RenderedPage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const revokePages = useCallback((items: RenderedPage[]) => {
    for (const page of items) URL.revokeObjectURL(page.url);
  }, []);

  useEffect(() => {
    return () => revokePages(pages);
  }, [pages, revokePages]);

  const shouldUseQuality = outputFormat !== "png";

  const selectedPages = useMemo(() => {
    if (!totalPages) return [] as number[];
    if (pageRange.trim().toLowerCase() === "all" || !pageRange.trim()) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const out = new Set<number>();
    const chunks = pageRange.split(",");
    for (const chunk of chunks) {
      const part = chunk.trim();
      if (!part) continue;
      if (part.includes("-")) {
        const [fromRaw, toRaw] = part.split("-").map((value) => Number(value.trim()));
        if (!Number.isFinite(fromRaw) || !Number.isFinite(toRaw)) continue;
        const from = Math.max(1, Math.min(fromRaw, toRaw));
        const to = Math.min(totalPages, Math.max(fromRaw, toRaw));
        for (let page = from; page <= to; page++) out.add(page);
      } else {
        const page = Number(part);
        if (Number.isFinite(page) && page >= 1 && page <= totalPages) out.add(page);
      }
    }

    return Array.from(out).sort((a, b) => a - b);
  }, [pageRange, totalPages]);

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
        setTotalPages(pdf.numPages);

        const pagesToRender =
          selectedPages.length > 0
            ? selectedPages
            : Array.from({ length: pdf.numPages }, (_, index) => index + 1);

        if (!pagesToRender.length) {
          throw new Error("No valid pages selected in page range.");
        }

        const nextPages: RenderedPage[] = [];
        const mime = mimeForFormat(outputFormat);

        for (const pageNumber of pagesToRender) {
          const page = await pdf.getPage(pageNumber);
          const viewport = page.getViewport({ scale });
          const canvas = document.createElement("canvas");
          canvas.width = Math.ceil(viewport.width);
          canvas.height = Math.ceil(viewport.height);

          const ctx = canvas.getContext("2d");
          if (!ctx) throw new Error("Canvas is not available in this browser.");

          if (outputFormat === "jpg") {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }

          await page.render({ canvas, canvasContext: ctx, viewport }).promise;

          const blob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob(
              (output) => {
                if (!output) {
                  reject(new Error(`Could not render page ${pageNumber}.`));
                  return;
                }
                resolve(output);
              },
              mime,
              shouldUseQuality ? quality / 100 : undefined
            );
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
    [outputFormat, quality, revokePages, scale, selectedPages, shouldUseQuality]
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

  const extension = outputFormat === "jpg" ? "jpg" : outputFormat;
  const totalOutputBytes = pages.reduce((sum, page) => sum + page.bytes, 0);

  const downloadPage = (page: RenderedPage) => {
    const nameWithoutExt = fileName.replace(/\.pdf$/i, "") || "pdf";
    const link = document.createElement("a");
    link.href = page.url;
    link.download = `${nameWithoutExt}-page-${page.pageNumber}.${extension}`;
    link.click();
  };

  const downloadAll = async () => {
    for (const page of pages) {
      downloadPage(page);
      await new Promise((resolve) => setTimeout(resolve, 140));
    }
  };

  return (
    <ToolLayout
      title="PDF to Image Converter Online"
      description="Convert PDF pages to PNG, JPG, or WebP in-browser with page range and quality controls."
      relatedTools={["pdf-to-png", "pdf-to-jpg", "image-format-converter"]}
    >
      <div className="mb-4 grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Output format</label>
          <select
            value={outputFormat}
            onChange={(event) => setOutputFormat(event.target.value as OutputFormat)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
          >
            <option value="png">PNG (lossless)</option>
            <option value="jpg">JPG (smaller)</option>
            <option value="webp">WebP (modern)</option>
          </select>
        </div>
        <div>
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
      </div>

      {shouldUseQuality && (
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Image quality: {quality}%
          </label>
          <input
            type="range"
            min={50}
            max={100}
            value={quality}
            onChange={(event) => setQuality(Number(event.target.value))}
            className="w-full accent-blue-600"
          />
        </div>
      )}

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Page range (example: <code>1-3,6,9</code> or <code>all</code>)
        </label>
        <input
          value={pageRange}
          onChange={(event) => setPageRange(event.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
          placeholder="all"
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
          {processing ? "Converting pages..." : "Drop a PDF file here or click to upload"}
        </p>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Convert all pages or only specific ranges in one pass.
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
              {pages.length} of {totalPages || pages.length} page{pages.length > 1 ? "s" : ""} converted, total{" "}
              {formatBytes(totalOutputBytes)}
            </p>
            <button
              onClick={() => void downloadAll()}
              className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
            >
              Download All
            </button>
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
                  Download {extension.toUpperCase()}
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="mt-12 space-y-6 border-t border-gray-200 pt-8 text-sm leading-relaxed text-gray-600 dark:border-gray-700 dark:text-gray-400">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
        <p>
          PDF to Image Converter is a flexible browser-only tool for exporting PDF pages as PNG, JPG, or WebP. You can
          define output format, quality, scale, and page ranges before conversion.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Which format should I choose?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              PNG for maximum quality, JPG for compatibility and smaller size, WebP for modern compression.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is conversion private?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes. Files are processed locally in your browser and never uploaded.
            </p>
          </details>
        </div>
      </div>
    </ToolLayout>
  );
}
