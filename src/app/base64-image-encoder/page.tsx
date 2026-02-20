"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface ImageData {
  name: string;
  type: string;
  size: number;
  base64: string;
  dataUri: string;
  previewUrl: string;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default function Base64ImageEncoder() {
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  const processFile = useCallback((file: File) => {
    setError("");

    const validTypes = [
      "image/png",
      "image/jpeg",
      "image/gif",
      "image/svg+xml",
      "image/webp",
    ];

    if (!validTypes.includes(file.type)) {
      setError(
        "Unsupported file type. Please upload a PNG, JPEG, GIF, SVG, or WebP image."
      );
      setImageData(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUri = reader.result as string;
      // dataUri format: "data:image/png;base64,iVBOR..."
      const base64 = dataUri.split(",")[1] || "";

      setImageData({
        name: file.name,
        type: file.type,
        size: file.size,
        base64,
        dataUri,
        previewUrl: dataUri,
      });
    };
    reader.onerror = () => {
      setError("Failed to read the file. Please try again.");
      setImageData(null);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleClear = () => {
    setImageData(null);
    setError("");
  };

  const htmlImgTag = imageData
    ? `<img src="${imageData.dataUri}" alt="${imageData.name}" />`
    : "";

  const cssBackground = imageData
    ? `background-image: url('${imageData.dataUri}');`
    : "";

  return (
    <ToolLayout
      title="Base64 Image Encoder"
      description="Convert images to Base64 encoded strings. Get Data URI, raw Base64, HTML img tag, or CSS background-image. All processing happens in your browser."
      relatedTools={["base64-encode-decode", "favicon-generator", "color-picker"]}
    >
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`mb-4 flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
          isDragging
            ? "border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-950"
            : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 hover:border-gray-400"
        }`}
      >
        <svg
          className="mb-3 h-10 w-10 text-gray-400 dark:text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          {isDragging
            ? "Drop image here..."
            : "Drag & drop an image here, or click to browse"}
        </p>
        <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
          PNG, JPEG, GIF, SVG, WebP supported
        </p>
        <label className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
          Choose File
          <input
            type="file"
            accept="image/png,image/jpeg,image/gif,image/svg+xml,image/webp"
            onChange={handleFileInput}
            className="hidden"
          />
        </label>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 px-4 py-2 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Results */}
      {imageData && (
        <div>
          {/* Image Preview & File Info */}
          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            <div className="flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
              <img
                src={imageData.previewUrl}
                alt="Preview"
                className="max-h-48 max-w-full object-contain"
              />
            </div>
            <div className="space-y-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 p-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">File Info</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Name:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100 truncate ml-2 max-w-[200px]">
                    {imageData.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Type:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {imageData.type}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Original Size:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {formatBytes(imageData.size)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Base64 Length:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {imageData.base64.length.toLocaleString()} chars
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Base64 Size:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {formatBytes(
                      Math.ceil(imageData.base64.length * 0.75)
                    )}{" "}
                    (approx)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Data URI Size:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {formatBytes(imageData.dataUri.length)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Output: Data URI */}
          <div className="mb-4">
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Data URI
              </label>
              <CopyButton text={imageData.dataUri} />
            </div>
            <textarea
              value={imageData.dataUri}
              readOnly
              rows={3}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 font-mono text-xs break-all focus:border-blue-500 dark:border-blue-400 focus:outline-none"
            />
          </div>

          {/* Output: Raw Base64 */}
          <div className="mb-4">
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Raw Base64
              </label>
              <CopyButton text={imageData.base64} />
            </div>
            <textarea
              value={imageData.base64}
              readOnly
              rows={3}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 font-mono text-xs break-all focus:border-blue-500 dark:border-blue-400 focus:outline-none"
            />
          </div>

          {/* Output: HTML <img> Tag */}
          <div className="mb-4">
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                HTML &lt;img&gt; Tag
              </label>
              <CopyButton text={htmlImgTag} />
            </div>
            <textarea
              value={htmlImgTag}
              readOnly
              rows={3}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 font-mono text-xs break-all focus:border-blue-500 dark:border-blue-400 focus:outline-none"
            />
          </div>

          {/* Output: CSS background-image */}
          <div className="mb-4">
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                CSS background-image
              </label>
              <CopyButton text={cssBackground} />
            </div>
            <textarea
              value={cssBackground}
              readOnly
              rows={3}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 font-mono text-xs break-all focus:border-blue-500 dark:border-blue-400 focus:outline-none"
            />
          </div>

          {/* Clear Button */}
          <button
            onClick={handleClear}
            className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
          >
            Clear
          </button>
        </div>
      )}

      
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The Base64 Image Encoder is a free online tool available on CodeUtilo. Convert images to Base64 strings. Supports PNG, JPG, GIF, SVG, and WebP formats. All processing happens directly in your browser — no data is ever sent to any server, ensuring your privacy and security. No signup or installation is required.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> — All base64 image encoder operations run locally in your browser using JavaScript. Your data never leaves your device.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Instant Results</strong> — Get results immediately as you type or paste your input. No waiting for server responses or page reloads.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> — Use the base64 image encoder as many times as you need without creating an account or paying anything.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Mobile Friendly</strong> — Works on desktop, tablet, and mobile browsers. Access this tool from any device with an internet connection.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Using the base64 image encoder for day-to-day development tasks</li>
          <li>Saving time on repetitive tasks by using a browser-based tool instead of writing custom code</li>
          <li>Working on projects where installing software is not an option (school, work, shared computers)</li>
          <li>Quick prototyping and debugging without switching to a terminal or IDE</li>
          <li>Sharing the tool link with colleagues who need the same functionality</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Enter your input in the text area provided and the base64 image encoder will process it instantly. Use the Copy button to copy the result to your clipboard. All operations are performed locally in your browser — no data is transmitted to any server.
        </p>
      
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Is the Base64 Image Encoder free to use?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes, the Base64 Image Encoder is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Is my data safe when using this tool?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Does this tool work on mobile devices?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes. The Base64 Image Encoder is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Do I need to install anything?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. The Base64 Image Encoder runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately.
            </p>
          </details>
        </div>
</div>
    </ToolLayout>
  );
}
