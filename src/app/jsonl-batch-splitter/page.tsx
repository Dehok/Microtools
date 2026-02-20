"use client";

import { useMemo, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface Chunk {
  lines: string[];
  bytes: number;
}

const SAMPLE_JSONL = `{"custom_id":"row-1","method":"POST","url":"/v1/responses","body":{"input":"hello 1"}}
{"custom_id":"row-2","method":"POST","url":"/v1/responses","body":{"input":"hello 2"}}
{"custom_id":"row-3","method":"POST","url":"/v1/responses","body":{"input":"hello 3"}}
{"custom_id":"row-4","method":"POST","url":"/v1/responses","body":{"input":"hello 4"}}
{"custom_id":"row-5","method":"POST","url":"/v1/responses","body":{"input":"hello 5"}}`;

function byteLength(text: string) {
  return new TextEncoder().encode(text).length;
}

function splitJsonl(input: string, maxLines: number, maxBytes: number, strictJson: boolean) {
  const lines = input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const validLines: string[] = [];
  const invalidLines: string[] = [];

  for (const line of lines) {
    if (!strictJson) {
      validLines.push(line);
      continue;
    }
    try {
      JSON.parse(line);
      validLines.push(line);
    } catch {
      invalidLines.push(line);
    }
  }

  const chunks: Chunk[] = [];
  let current: Chunk = { lines: [], bytes: 0 };

  for (const line of validLines) {
    const lineBytes = byteLength(line) + 1;
    const wouldExceedLines = current.lines.length >= maxLines;
    const wouldExceedBytes = current.bytes + lineBytes > maxBytes;

    if (current.lines.length > 0 && (wouldExceedLines || wouldExceedBytes)) {
      chunks.push(current);
      current = { lines: [], bytes: 0 };
    }

    current.lines.push(line);
    current.bytes += lineBytes;
  }
  if (current.lines.length > 0) chunks.push(current);

  return { chunks, invalidLines, totalValid: validLines.length };
}

export default function JsonlBatchSplitterPage() {
  const [input, setInput] = useState("");
  const [maxLines, setMaxLines] = useState(1000);
  const [maxBytesKB, setMaxBytesKB] = useState(512);
  const [strictJson, setStrictJson] = useState(true);
  const [selectedChunk, setSelectedChunk] = useState(0);

  const result = useMemo(
    () => splitJsonl(input, Math.max(1, maxLines), Math.max(1, maxBytesKB) * 1024, strictJson),
    [input, maxBytesKB, maxLines, strictJson]
  );

  const selected = result.chunks[selectedChunk] ?? null;
  const selectedText = selected ? selected.lines.join("\n") : "";

  return (
    <ToolLayout
      title="JSONL Batch Splitter"
      description="Split large JSONL payloads into chunked batch files by line count or byte size limits."
      relatedTools={["openai-batch-jsonl-validator", "json-formatter", "token-counter"]}
    >
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          onClick={() => setInput(SAMPLE_JSONL)}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Load sample
        </button>
        <button
          onClick={() => setInput("")}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Clear
        </button>
      </div>

      <div className="mb-4 grid gap-3 md:grid-cols-3">
        <label className="text-sm text-gray-700 dark:text-gray-300">
          Max lines per chunk
          <input
            type="number"
            min={1}
            step={1}
            value={maxLines}
            onChange={(event) => setMaxLines(Math.max(1, Number(event.target.value) || 1))}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
          />
        </label>
        <label className="text-sm text-gray-700 dark:text-gray-300">
          Max size per chunk (KB)
          <input
            type="number"
            min={1}
            step={1}
            value={maxBytesKB}
            onChange={(event) => setMaxBytesKB(Math.max(1, Number(event.target.value) || 1))}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
          />
        </label>
        <label className="mt-6 flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-300">
          <input type="checkbox" checked={strictJson} onChange={(event) => setStrictJson(event.target.checked)} className="accent-blue-600" />
          Strict JSON parse check
        </label>
      </div>

      <textarea
        value={input}
        onChange={(event) => setInput(event.target.value)}
        rows={10}
        placeholder="Paste JSONL records, one JSON object per line..."
        className="mb-4 w-full rounded-lg border border-gray-300 bg-white p-3 font-mono text-sm dark:border-gray-600 dark:bg-gray-900"
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-4">
        <StatCard label="Valid Records" value={String(result.totalValid)} />
        <StatCard label="Chunks" value={String(result.chunks.length)} />
        <StatCard label="Invalid Records" value={String(result.invalidLines.length)} />
        <StatCard
          label="Avg Records / Chunk"
          value={result.chunks.length > 0 ? (result.totalValid / result.chunks.length).toFixed(1) : "0.0"}
        />
      </div>

      {result.chunks.length > 0 && (
        <div className="mb-4 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <label className="text-sm text-gray-700 dark:text-gray-300">
              Selected chunk
              <select
                value={selectedChunk}
                onChange={(event) => setSelectedChunk(Number(event.target.value))}
                className="ml-2 rounded-lg border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-900"
              >
                {result.chunks.map((chunk, idx) => (
                  <option key={idx} value={idx}>
                    Chunk {idx + 1} ({chunk.lines.length} lines, {(chunk.bytes / 1024).toFixed(1)} KB)
                  </option>
                ))}
              </select>
            </label>
            <CopyButton text={selectedText} />
          </div>
          <textarea
            value={selectedText}
            onChange={() => {}}
            rows={10}
            readOnly
            className="w-full rounded-lg border border-gray-300 bg-white p-3 font-mono text-sm dark:border-gray-600 dark:bg-gray-900"
          />
        </div>
      )}

      {result.invalidLines.length > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950">
          <p className="mb-1 text-sm font-medium text-red-800 dark:text-red-200">Invalid JSONL lines skipped</p>
          <ul className="list-disc space-y-1 pl-5 text-xs text-red-700 dark:text-red-300">
            {result.invalidLines.slice(0, 10).map((line, idx) => (
              <li key={`${line}-${idx}`} className="break-all font-mono">
                {line}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-12 space-y-6 border-t border-gray-200 pt-8 text-sm leading-relaxed text-gray-600 dark:border-gray-700 dark:text-gray-400">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
        <p>
          JSONL Batch Splitter helps break large JSONL datasets into smaller chunks suitable for batch processing limits
          such as per-file size or record count constraints.
        </p>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Does it preserve record order?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes. Records stay in the original order across generated chunks.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              What happens to invalid JSON lines?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              With strict mode enabled, invalid lines are excluded and listed separately.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is data uploaded?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. Splitting runs fully in your browser.
            </p>
          </details>
        </div>
      </div>
    </ToolLayout>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-200 p-3 text-center dark:border-gray-700">
      <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  );
}
