"use client";

import { useCallback, useRef, useState } from "react";
import ToolLayout from "@/components/ToolLayout";

interface ConvertedImage {
  original: File;
  converted: Blob;
  previewUrl: string;
}

function isHeicFile(file: File) {
  return (
    file.type.includes("heic") ||
    file.type.includes("heif") ||
    /\.heic$/i.test(file.name) ||
    /\.heif$/i.test(file.name)
  );
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function HeicToPngPage() {
  const [results, setResults] = useState<ConvertedImage[]>([]);
  const [processing, setProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const convertFile = useCallback(async (file: File): Promise<ConvertedImage> => {
    const { default: heic2any } = await import("heic2any");
    const output = await heic2any({
      blob: file,
      toType: "image/png",
    });

    const blob = Array.isArray(output) ? output[0] : output;
    if (!(blob instanceof Blob)) {
      throw new Error(`Could not convert ${file.name}`);
    }

    return {
      original: file,
      converted: blob.type ? blob : new Blob([blob], { type: "image/png" }),
      previewUrl: URL.createObjectURL(blob),
    };
  }, []);

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      setError("");
      const input = Array.from(files).filter(isHeicFile);

      if (!input.length) {
        setError("Please upload HEIC or HEIF files.");
        return;
      }

      setProcessing(true);
      try {
        const converted = await Promise.all(input.map(convertFile));
        setResults((prev) => [...prev, ...converted]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "HEIC conversion failed.");
      } finally {
        setProcessing(false);
      }
    },
    [convertFile]
  );

  const download = (item: ConvertedImage) => {
    const link = document.createElement("a");
    link.download = item.original.name.replace(/\.(heic|heif)$/i, "") + ".png";
    link.href = item.previewUrl;
    link.click();
  };

  return (
    <ToolLayout
      title="HEIC to PNG Converter"
      description="Convert HEIC and HEIF photos to PNG directly in your browser. Private, fast, and no uploads."
      relatedTools={["heic-to-jpg", "webp-to-png", "image-format-converter"]}
    >
      <div className="mb-4 rounded-lg border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950 px-4 py-3 text-sm text-green-700 dark:text-green-300">
        Privacy mode: your photos stay on your device. No server upload.
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
          {processing ? "Converting..." : "Drop HEIC/HEIF files here or click to upload"}
        </p>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Batch conversion is supported</p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".heic,.heif,image/heic,image/heif"
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
              {results.length} file{results.length > 1 ? "s" : ""} converted
            </span>
            <button
              onClick={() => setResults([])}
              className="rounded-md border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Clear
            </button>
          </div>
          <div className="space-y-3">
            {results.map((item, index) => (
              <div
                key={`${item.original.name}-${index}`}
                className="flex items-center gap-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3"
              >
                <img src={item.previewUrl} alt="PNG preview" className="h-14 w-14 rounded object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-200">
                    {item.original.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatSize(item.original.size)} {"->"} {formatSize(item.converted.size)} PNG
                  </p>
                </div>
                <button
                  onClick={() => download(item)}
                  className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="mt-12 space-y-6 border-t border-gray-200 dark:border-gray-700 pt-8 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
        <p>
          Convert HEIC and HEIF images to PNG directly in your browser. PNG output is useful when you need transparent
          graphics workflows, lossless editing, or compatibility with older apps that do not accept HEIC files.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Do you store my photos?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. Conversion is done locally in your browser and no upload is required.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Why choose PNG instead of JPG?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              PNG is lossless, so repeated edits preserve quality better than JPG.
            </p>
          </details>
        </div>
      </div>
    </ToolLayout>
  );
}
