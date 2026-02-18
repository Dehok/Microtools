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
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 bg-gray-50 hover:border-gray-400"
        }`}
      >
        <svg
          className="mb-3 h-10 w-10 text-gray-400"
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
        <p className="mb-2 text-sm font-medium text-gray-700">
          {isDragging
            ? "Drop image here..."
            : "Drag & drop an image here, or click to browse"}
        </p>
        <p className="mb-3 text-xs text-gray-500">
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
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Results */}
      {imageData && (
        <div>
          {/* Image Preview & File Info */}
          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-white p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageData.previewUrl}
                alt="Preview"
                className="max-h-48 max-w-full object-contain"
              />
            </div>
            <div className="space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="text-sm font-semibold text-gray-900">File Info</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Name:</span>
                  <span className="font-medium text-gray-900 truncate ml-2 max-w-[200px]">
                    {imageData.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Type:</span>
                  <span className="font-medium text-gray-900">
                    {imageData.type}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Original Size:</span>
                  <span className="font-medium text-gray-900">
                    {formatBytes(imageData.size)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Base64 Length:</span>
                  <span className="font-medium text-gray-900">
                    {imageData.base64.length.toLocaleString()} chars
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Base64 Size:</span>
                  <span className="font-medium text-gray-900">
                    {formatBytes(
                      Math.ceil(imageData.base64.length * 0.75)
                    )}{" "}
                    (approx)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Data URI Size:</span>
                  <span className="font-medium text-gray-900">
                    {formatBytes(imageData.dataUri.length)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Output: Data URI */}
          <div className="mb-4">
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Data URI
              </label>
              <CopyButton text={imageData.dataUri} />
            </div>
            <textarea
              value={imageData.dataUri}
              readOnly
              rows={3}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 font-mono text-xs break-all focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Output: Raw Base64 */}
          <div className="mb-4">
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Raw Base64
              </label>
              <CopyButton text={imageData.base64} />
            </div>
            <textarea
              value={imageData.base64}
              readOnly
              rows={3}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 font-mono text-xs break-all focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Output: HTML <img> Tag */}
          <div className="mb-4">
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                HTML &lt;img&gt; Tag
              </label>
              <CopyButton text={htmlImgTag} />
            </div>
            <textarea
              value={htmlImgTag}
              readOnly
              rows={3}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 font-mono text-xs break-all focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Output: CSS background-image */}
          <div className="mb-4">
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                CSS background-image
              </label>
              <CopyButton text={cssBackground} />
            </div>
            <textarea
              value={cssBackground}
              readOnly
              rows={3}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 font-mono text-xs break-all focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Clear Button */}
          <button
            onClick={handleClear}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Clear
          </button>
        </div>
      )}

      {/* SEO Content */}
      <div className="mt-8 border-t border-gray-200 pt-6 text-sm text-gray-600">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          What is Base64 Image Encoding?
        </h2>
        <p className="mb-3">
          Base64 image encoding converts binary image data into an ASCII text
          string. This allows you to embed images directly in HTML, CSS, or
          JSON without needing a separate image file. The encoded string can
          be used as a Data URI in an <code>&lt;img&gt;</code> tag or as a CSS{" "}
          <code>background-image</code> value.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          When Should You Use Base64 Images?
        </h2>
        <p className="mb-3">
          Base64 encoding is ideal for small images like icons, logos, and
          thumbnails where reducing HTTP requests improves performance. It is
          commonly used in email templates (where external images may be
          blocked), single-page applications, and CSS sprites. Note that
          Base64 encoding increases file size by approximately 33%, so it is
          not recommended for large images.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          Supported Formats
        </h2>
        <p>
          This tool supports PNG, JPEG, GIF, SVG, and WebP image formats.
          All conversion happens entirely in your browser using the FileReader
          API — your images are never uploaded to any server.
        </p>
      </div>
    </ToolLayout>
  );
}
