"use client";

import { useCallback, useRef, useState } from "react";
import ToolLayout from "@/components/ToolLayout";

interface ConvertedImage {
  original: File;
  converted: Blob;
  previewUrl: string;
}

function isWebP(file: File) {
  return file.type === "image/webp" || /\.webp$/i.test(file.name);
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function WebPToJpgPage() {
  const [quality, setQuality] = useState(90);
  const [results, setResults] = useState<ConvertedImage[]>([]);
  const [processing, setProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const convertFile = useCallback(async (file: File): Promise<ConvertedImage> => {
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

        // JPG has no transparency, so we paint white background first.
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0);

        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(sourceUrl);
            if (!blob) {
              reject(new Error("JPG conversion failed."));
              return;
            }
            resolve({
              original: file,
              converted: blob,
              previewUrl: URL.createObjectURL(blob),
            });
          },
          "image/jpeg",
          quality / 100
        );
      };

      image.onerror = () => {
        URL.revokeObjectURL(sourceUrl);
        reject(new Error(`Could not read ${file.name}.`));
      };

      image.src = sourceUrl;
    });
  }, [quality]);

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      setError("");
      const input = Array.from(files).filter(isWebP);
      if (!input.length) {
        setError("Please upload at least one WEBP image.");
        return;
      }

      setProcessing(true);
      try {
        const converted = await Promise.all(input.map(convertFile));
        setResults((prev) => [...prev, ...converted]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Conversion failed.");
      } finally {
        setProcessing(false);
      }
    },
    [convertFile]
  );

  const download = (item: ConvertedImage) => {
    const link = document.createElement("a");
    link.download = item.original.name.replace(/\.webp$/i, "") + ".jpg";
    link.href = item.previewUrl;
    link.click();
  };

  return (
    <ToolLayout
      title="WebP to JPG Converter"
      description="Convert WebP images to JPG (JPEG) with adjustable quality. Runs fully in your browser."
      relatedTools={["webp-to-png", "image-format-converter", "image-compressor"]}
    >
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          JPG Quality: {quality}%
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
          {processing ? "Converting..." : "Drop WEBP images here or click to upload"}
        </p>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Batch conversion supported</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/webp,.webp"
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
                <img src={item.previewUrl} alt="JPG preview" className="h-14 w-14 rounded object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-200">
                    {item.original.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatSize(item.original.size)} {"->"} {formatSize(item.converted.size)} JPG
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
          This converter re-encodes WEBP images to JPG locally in the browser. No files are uploaded and no user data
          is collected.
        </p>
      </div>
    </ToolLayout>
  );
}
