"use client";

import { useMemo, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function normalizeBase64(input: string) {
  const cleaned = input.trim();
  const payload = cleaned.startsWith("data:") ? cleaned.split(",")[1] ?? "" : cleaned;
  let normalized = payload.replace(/\s+/g, "").replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4;
  if (padding > 0) normalized += "=".repeat(4 - padding);
  return normalized;
}

function decodeBase64(input: string) {
  const binary = atob(input);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

interface DecodeResult {
  bytes: Uint8Array | null;
  error: string | null;
}

export default function Base64ToPdfPage() {
  const [input, setInput] = useState("");
  const [fileName, setFileName] = useState("decoded.pdf");

  const decoded = useMemo<DecodeResult>(() => {
    if (!input.trim()) return { bytes: null, error: null };
    try {
      const normalized = normalizeBase64(input);
      if (!normalized) return { bytes: null, error: "Paste a Base64 value first." };
      const bytes = decodeBase64(normalized);
      return { bytes, error: null };
    } catch (error) {
      return {
        bytes: null,
        error: error instanceof Error ? error.message : "Invalid Base64 input.",
      };
    }
  }, [input]);

  const isPdf = useMemo(() => {
    if (!decoded.bytes || decoded.bytes.length < 5) return false;
    return (
      decoded.bytes[0] === 0x25 &&
      decoded.bytes[1] === 0x50 &&
      decoded.bytes[2] === 0x44 &&
      decoded.bytes[3] === 0x46 &&
      decoded.bytes[4] === 0x2d
    );
  }, [decoded.bytes]);

  const previewData = useMemo(() => {
    if (!decoded.bytes) return "";
    const bytes = decoded.bytes.slice(0, 32);
    return Array.from(bytes)
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join(" ");
  }, [decoded.bytes]);

  const outputName = fileName.trim().toLowerCase().endsWith(".pdf")
    ? fileName.trim()
    : `${fileName.trim() || "decoded"}.pdf`;

  const downloadPdf = () => {
    if (!decoded.bytes) return;
    const copiedBytes = new Uint8Array(decoded.bytes.byteLength);
    copiedBytes.set(decoded.bytes);
    const blob = new Blob([copiedBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = outputName;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout
      title="Base64 to PDF Converter Online"
      description="Decode Base64 into a PDF file locally in your browser. Supports both raw Base64 strings and data URLs."
      relatedTools={["base64-encode-decode", "pdf-to-text", "pdf-split"]}
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Base64 Input</label>
        {input && <CopyButton text={input} />}
      </div>

      <textarea
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder="Paste Base64 string or data:application/pdf;base64,..."
        className="h-56 w-full rounded-lg border border-gray-300 bg-white p-3 font-mono text-sm dark:border-gray-600 dark:bg-gray-900"
        spellCheck={false}
      />

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">Decoded size</p>
          <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {decoded.bytes ? formatBytes(decoded.bytes.length) : "-"}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">PDF header check</p>
          <p
            className={`text-base font-semibold ${
              isPdf
                ? "text-green-700 dark:text-green-300"
                : decoded.bytes
                  ? "text-amber-700 dark:text-amber-300"
                  : "text-gray-900 dark:text-gray-100"
            }`}
          >
            {decoded.bytes ? (isPdf ? "Looks like PDF" : "Header not detected") : "-"}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">First bytes (hex)</p>
          <p className="truncate font-mono text-xs text-gray-700 dark:text-gray-300">{previewData || "-"}</p>
        </div>
      </div>

      {decoded.error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {decoded.error}
        </div>
      )}

      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
        <input
          value={fileName}
          onChange={(event) => setFileName(event.target.value)}
          placeholder="Output file name"
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
        />
        <button
          onClick={downloadPdf}
          disabled={!decoded.bytes}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Download PDF
        </button>
      </div>

      <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-400">
        Tip: if your input starts with <code>data:application/pdf;base64,</code>, you can paste it directly.
      </div>

      <div className="mt-12 space-y-6 border-t border-gray-200 pt-8 text-sm leading-relaxed text-gray-600 dark:border-gray-700 dark:text-gray-400">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
        <p>
          Base64 to PDF Converter decodes Base64 text directly in your browser and saves the result as a PDF file. It
          works with raw Base64 and complete data URLs, with no server upload.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Why do I get &quot;Header not detected&quot;?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              The decoded bytes may not actually be a PDF, or the input may be truncated/invalid. The download still
              works, but the file might not open as PDF.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is any Base64 data sent to a server?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. Decoding and file generation are fully local in your browser.
            </p>
          </details>
        </div>
      </div>
    </ToolLayout>
  );
}
