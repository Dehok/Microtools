"use client";

import { useCallback, useRef, useState } from "react";
import ToolLayout from "@/components/ToolLayout";

type OutputFormat = "preserve" | "image/jpeg" | "image/png" | "image/webp";

interface SanitizedImage {
  original: File;
  sanitized: Blob;
  previewUrl: string;
  outputMime: string;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function extensionFromMime(mime: string) {
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/webp") return "webp";
  return "png";
}

function normalizeMimeForOutput(sourceMime: string, format: OutputFormat) {
  if (format !== "preserve") return format;
  if (sourceMime === "image/jpeg" || sourceMime === "image/png" || sourceMime === "image/webp") {
    return sourceMime;
  }
  return "image/png";
}

export default function ExifMetadataRemoverPage() {
  const [format, setFormat] = useState<OutputFormat>("preserve");
  const [quality, setQuality] = useState(92);
  const [results, setResults] = useState<SanitizedImage[]>([]);
  const [processing, setProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const removeMetadata = useCallback(
    async (file: File): Promise<SanitizedImage> => {
      return new Promise((resolve, reject) => {
        const sourceUrl = URL.createObjectURL(file);
        const image = new Image();

        image.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = image.width;
          canvas.height = image.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            URL.revokeObjectURL(sourceUrl);
            reject(new Error("Canvas is not supported in this browser."));
            return;
          }

          const outputMime = normalizeMimeForOutput(file.type, format);
          if (outputMime === "image/jpeg") {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          ctx.drawImage(image, 0, 0);

          const qualityValue = outputMime === "image/jpeg" || outputMime === "image/webp" ? quality / 100 : 1;
          canvas.toBlob(
            (blob) => {
              URL.revokeObjectURL(sourceUrl);
              if (!blob) {
                reject(new Error(`Could not re-encode ${file.name}.`));
                return;
              }
              resolve({
                original: file,
                sanitized: blob,
                previewUrl: URL.createObjectURL(blob),
                outputMime,
              });
            },
            outputMime,
            qualityValue
          );
        };

        image.onerror = () => {
          URL.revokeObjectURL(sourceUrl);
          reject(new Error(`Could not load ${file.name}.`));
        };

        image.src = sourceUrl;
      });
    },
    [format, quality]
  );

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      setError("");
      const input = Array.from(files).filter((file) => file.type.startsWith("image/"));
      if (!input.length) {
        setError("Please upload at least one image file.");
        return;
      }

      setProcessing(true);
      try {
        const sanitized = await Promise.all(input.map(removeMetadata));
        setResults((prev) => [...prev, ...sanitized]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Metadata removal failed.");
      } finally {
        setProcessing(false);
      }
    },
    [removeMetadata]
  );

  const download = (item: SanitizedImage) => {
    const link = document.createElement("a");
    const ext = extensionFromMime(item.outputMime);
    link.download = item.original.name.replace(/\.[^.]+$/, "") + "-clean." + ext;
    link.href = item.previewUrl;
    link.click();
  };

  return (
    <ToolLayout
      title="Image Metadata Remover"
      description="Remove EXIF and hidden metadata from photos before sharing. Processing is local in your browser."
      relatedTools={["exif-viewer", "image-compressor", "image-format-converter"]}
    >
      <div className="mb-4 rounded-lg border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950 px-4 py-3 text-sm text-green-700 dark:text-green-300">
        Privacy mode: your images never leave your device.
      </div>

      <div className="mb-4 grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Output format</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as OutputFormat)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
          >
            <option value="preserve">Preserve original (best effort)</option>
            <option value="image/jpeg">JPG</option>
            <option value="image/png">PNG</option>
            <option value="image/webp">WEBP</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Quality ({quality}%)
          </label>
          <input
            type="range"
            min={40}
            max={100}
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
        </div>
      </div>

      <div
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          void handleFiles(e.dataTransfer.files);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => fileInputRef.current?.click()}
        className={`mb-4 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
          dragOver
            ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
            : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 hover:border-blue-400"
        }`}
      >
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {processing ? "Cleaning metadata..." : "Drop images here or click to upload"}
        </p>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Batch processing supported</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && void handleFiles(e.target.files)}
        />
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950 px-4 py-2 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {results.length > 0 && (
        <>
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {results.length} image{results.length > 1 ? "s" : ""} cleaned
            </span>
            <button
              onClick={() => setResults([])}
              className="rounded-md border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Clear
            </button>
          </div>

          <div className="space-y-3">
            {results.map((item, index) => {
              const reduction = ((1 - item.sanitized.size / item.original.size) * 100).toFixed(1);
              return (
                <div
                  key={`${item.original.name}-${index}`}
                  className="flex items-center gap-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3"
                >
                  <img src={item.previewUrl} alt="Sanitized preview" className="h-14 w-14 rounded object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-200">{item.original.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatSize(item.original.size)} {"->"} {formatSize(item.sanitized.size)} ({reduction}%)
                    </p>
                  </div>
                  <button
                    onClick={() => download(item)}
                    className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                  >
                    Download
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}

      <div className="mt-12 space-y-6 border-t border-gray-200 dark:border-gray-700 pt-8 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
        <p>
          Metadata removal works by re-rendering your image to a fresh bitmap and exporting it again. This drops EXIF
          blocks like camera model, lens data, geolocation, and capture timestamps.
        </p>
      </div>
    </ToolLayout>
  );
}
