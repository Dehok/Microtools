"use client";

import { useMemo, useRef, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface MarkerResult {
  name: string;
  token: string;
  offsets: number[];
}

interface AnalysisResult {
  fileName: string;
  fileSize: number;
  fileType: string;
  sha256: string;
  markers: MarkerResult[];
}

const MARKERS = [
  { name: "C2PA token", token: "c2pa" },
  { name: "JUMBF box", token: "jumb" },
  { name: "C2PA manifest URI", token: "self#jumbf=c2pa" },
  { name: "C2PA claim", token: "c2pa.claim" },
  { name: "C2PA assertions", token: "c2pa.assertions" },
  { name: "PNG C2PA chunk", token: "cabx" },
  { name: "XMP metadata", token: "xmpmeta" },
] as const;

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function lowerAscii(byte: number) {
  if (byte >= 65 && byte <= 90) return byte + 32;
  return byte;
}

function findTokenOffsets(data: Uint8Array, token: string, maxHits = 20) {
  const tokenBytes = new TextEncoder().encode(token.toLowerCase());
  const offsets: number[] = [];
  if (tokenBytes.length === 0 || data.length < tokenBytes.length) return offsets;

  const first = tokenBytes[0];
  for (let index = 0; index <= data.length - tokenBytes.length; index++) {
    if (lowerAscii(data[index]) !== first) continue;
    let matches = true;
    for (let j = 1; j < tokenBytes.length; j++) {
      if (lowerAscii(data[index + j]) !== tokenBytes[j]) {
        matches = false;
        break;
      }
    }
    if (matches) {
      offsets.push(index);
      if (offsets.length >= maxHits) break;
    }
  }
  return offsets;
}

function hexOffset(value: number) {
  return `0x${value.toString(16).toUpperCase()}`;
}

async function sha256Hex(data: ArrayBuffer) {
  const digest = await crypto.subtle.digest("SHA-256", data);
  const bytes = new Uint8Array(digest);
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export default function C2paViewerPage() {
  const [processing, setProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const runAnalysis = async (file: File) => {
    setProcessing(true);
    setError("");
    setAnalysis(null);

    try {
      if (file.size > 100 * 1024 * 1024) {
        throw new Error("File is too large for browser analysis. Limit is 100 MB.");
      }

      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      const sha256 = await sha256Hex(buffer);

      const markers = MARKERS.map((marker) => ({
        name: marker.name,
        token: marker.token,
        offsets: findTokenOffsets(bytes, marker.token),
      }));

      setAnalysis({
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type || "unknown",
        sha256,
        markers,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not analyze file.");
    } finally {
      setProcessing(false);
    }
  };

  const positiveMarkers = useMemo(
    () => analysis?.markers.filter((marker) => marker.offsets.length > 0) ?? [],
    [analysis]
  );

  const confidence = useMemo(() => {
    const score = positiveMarkers.length;
    if (score === 0) return "No marker signals found";
    if (score <= 2) return "Low confidence (partial signals)";
    if (score <= 4) return "Medium confidence (multiple signals)";
    return "Higher confidence (strong signal set)";
  }, [positiveMarkers.length]);

  const reportText = useMemo(() => {
    if (!analysis) return "";
    const markerLines = analysis.markers.map((marker) => {
      if (!marker.offsets.length) return `${marker.name}: not found`;
      return `${marker.name}: ${marker.offsets.map(hexOffset).join(", ")}`;
    });
    return [
      `File: ${analysis.fileName}`,
      `Size: ${analysis.fileSize} bytes`,
      `Type: ${analysis.fileType}`,
      `SHA-256: ${analysis.sha256}`,
      `Signal summary: ${confidence}`,
      ...markerLines,
    ].join("\n");
  }, [analysis, confidence]);

  return (
    <ToolLayout
      title="C2PA Viewer (Content Credentials Inspector)"
      description="Inspect media files for C2PA-related markers locally in your browser. Best-effort metadata detection only."
      relatedTools={["exif-viewer", "exif-metadata-remover", "hash-generator"]}
    >
      <div
        onDrop={(event) => {
          event.preventDefault();
          setDragOver(false);
          const file = event.dataTransfer.files?.[0];
          if (file) void runAnalysis(file);
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
          {processing ? "Analyzing file..." : "Drop image/video file here or click to upload"}
        </p>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Supported by design: JPEG/PNG/WebP/video files as raw byte scan. Max 100 MB.
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void runAnalysis(file);
          }}
        />
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {error}
        </div>
      )}

      {analysis && (
        <>
          <div className="mb-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">File</p>
              <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{analysis.fileName}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatBytes(analysis.fileSize)} | {analysis.fileType}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">Signal summary</p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{confidence}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {positiveMarkers.length} marker type{positiveMarkers.length === 1 ? "" : "s"} found
              </p>
            </div>
          </div>

          <div className="mb-4 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs text-gray-500 dark:text-gray-400">SHA-256</p>
              <CopyButton text={analysis.sha256} />
            </div>
            <p className="break-all font-mono text-xs text-gray-700 dark:text-gray-300">{analysis.sha256}</p>
          </div>

          <div className="rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between border-b border-gray-200 px-3 py-2 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Detected markers</p>
              <CopyButton text={reportText} />
            </div>
            <div className="max-h-72 overflow-auto">
              {analysis.markers.map((marker) => (
                <div
                  key={marker.token}
                  className={`border-b border-gray-100 px-3 py-2 text-sm dark:border-gray-800 ${
                    marker.offsets.length
                      ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                      : "bg-gray-50 text-gray-600 dark:bg-gray-950 dark:text-gray-400"
                  }`}
                >
                  <p className="font-medium">{marker.name}</p>
                  <p className="font-mono text-xs">
                    {marker.offsets.length
                      ? marker.offsets.map(hexOffset).join(", ")
                      : "Not found"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="mt-12 space-y-6 border-t border-gray-200 pt-8 text-sm leading-relaxed text-gray-600 dark:border-gray-700 dark:text-gray-400">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
        <p>
          C2PA Viewer performs local byte-level inspection for common content-credential markers such as C2PA, JUMBF,
          and related manifest tokens. It is designed for quick triage before deeper forensic checks.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Does this cryptographically verify signatures?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. This is a best-effort marker inspector, not a full signature verifier.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Why can a file show no markers?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              The file may not include C2PA metadata, or metadata may be stripped during export/recompression.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is my file uploaded?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. Analysis runs entirely in your browser and data never leaves your device.
            </p>
          </details>
        </div>
      </div>
    </ToolLayout>
  );
}
