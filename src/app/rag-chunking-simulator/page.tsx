"use client";

import { useMemo, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface Chunk {
  index: number;
  start: number;
  end: number;
  text: string;
}

const SAMPLE_TEXT = `Retrieval-augmented generation (RAG) pipelines depend heavily on chunk quality.
If chunks are too small, context fragments become weak and retrieval loses semantic signal.
If chunks are too large, relevant details are diluted and token costs increase.

A practical strategy is to tune chunk size and overlap for your corpus type.
Technical docs often work with medium chunks and moderate overlap.
Chat transcripts may require shorter chunks with stronger overlap around topic transitions.

Always evaluate retrieval metrics alongside answer quality.
Good chunking reduces hallucinations, improves citation grounding, and lowers re-query frequency.`;

function estimateTokens(text: string) {
  if (!text) return 0;
  const ascii = (text.match(/[\x00-\x7F]/g) || []).length;
  const nonAscii = text.length - ascii;
  const punctuation = (text.match(/[.,!?;:()[\]{}"'`~@#$%^&*+\-_=\\/|<>]/g) || []).length;
  const tokenFloat = ascii / 4 + nonAscii / 1.5 + punctuation / 6;
  return Math.max(1, Math.ceil(tokenFloat));
}

function findPreferredBoundary(windowText: string, minIndex: number, maxIndex: number) {
  const candidates: number[] = [];
  const regex = /(?:\n\n|[.!?]\s|\n)/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(windowText)) !== null) {
    const idx = match.index + match[0].length;
    if (idx >= minIndex && idx <= maxIndex) candidates.push(idx);
  }
  if (candidates.length === 0) return null;
  return candidates[candidates.length - 1];
}

function simulateChunks(text: string, chunkSize: number, overlap: number, sentenceAware: boolean) {
  const clean = text.replace(/\r\n/g, "\n").trim();
  if (!clean) return [] as Chunk[];

  const safeChunkSize = Math.max(50, chunkSize);
  const safeOverlap = Math.max(0, Math.min(overlap, safeChunkSize - 1));
  const chunks: Chunk[] = [];
  let start = 0;

  while (start < clean.length) {
    let end = Math.min(clean.length, start + safeChunkSize);

    if (sentenceAware && end < clean.length) {
      const extension = Math.min(clean.length, end + Math.floor(safeChunkSize * 0.4));
      const windowText = clean.slice(start, extension);
      const boundary = findPreferredBoundary(
        windowText,
        Math.floor(safeChunkSize * 0.6),
        Math.floor(safeChunkSize * 1.2)
      );
      if (boundary !== null) {
        end = start + boundary;
      }
    }

    const chunkText = clean.slice(start, end).trim();
    if (chunkText.length > 0) {
      chunks.push({
        index: chunks.length + 1,
        start,
        end,
        text: chunkText,
      });
    }

    if (end >= clean.length) break;
    const next = Math.max(end - safeOverlap, start + 1);
    start = next;
  }

  return chunks;
}

export default function RagChunkingSimulatorPage() {
  const [text, setText] = useState("");
  const [chunkSize, setChunkSize] = useState(350);
  const [overlap, setOverlap] = useState(60);
  const [sentenceAware, setSentenceAware] = useState(true);
  const [selectedChunk, setSelectedChunk] = useState(0);

  const chunks = useMemo(() => simulateChunks(text, chunkSize, overlap, sentenceAware), [chunkSize, overlap, sentenceAware, text]);

  const stats = useMemo(() => {
    const sourceLength = text.trim().length;
    const totalChunkChars = chunks.reduce((sum, chunk) => sum + chunk.text.length, 0);
    const avgChunk = chunks.length > 0 ? totalChunkChars / chunks.length : 0;
    const overlapDuplication = totalChunkChars > 0 ? ((totalChunkChars - sourceLength) / totalChunkChars) * 100 : 0;
    const maxChunkTokens = chunks.length > 0 ? Math.max(...chunks.map((chunk) => estimateTokens(chunk.text))) : 0;
    return { sourceLength, totalChunkChars, avgChunk, overlapDuplication, maxChunkTokens };
  }, [chunks, text]);

  const current = chunks[selectedChunk] ?? null;
  const chunkExport = current ? current.text : "";

  const report = useMemo(
    () =>
      [
        "RAG Chunking Simulator",
        `Chunks: ${chunks.length}`,
        `Avg chunk chars: ${stats.avgChunk.toFixed(1)}`,
        `Overlap duplication: ${stats.overlapDuplication.toFixed(1)}%`,
        `Largest chunk tokens (est.): ${stats.maxChunkTokens}`,
      ].join("\n"),
    [chunks.length, stats.avgChunk, stats.maxChunkTokens, stats.overlapDuplication]
  );

  return (
    <ToolLayout
      title="RAG Chunking Simulator"
      description="Simulate chunk size and overlap strategies to estimate retrieval-friendly chunk distributions."
      relatedTools={["token-counter", "prompt-diff-optimizer", "jsonl-batch-splitter"]}
    >
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          onClick={() => setText(SAMPLE_TEXT)}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Load sample
        </button>
        <button
          onClick={() => setText("")}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Clear
        </button>
        <CopyButton text={report} />
      </div>

      <div className="mb-4 grid gap-3 md:grid-cols-3">
        <label className="text-sm text-gray-700 dark:text-gray-300">
          Chunk size (chars)
          <input
            type="number"
            min={50}
            step={10}
            value={chunkSize}
            onChange={(event) => setChunkSize(Math.max(50, Number(event.target.value) || 50))}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
          />
        </label>
        <label className="text-sm text-gray-700 dark:text-gray-300">
          Overlap (chars)
          <input
            type="number"
            min={0}
            step={10}
            value={overlap}
            onChange={(event) => setOverlap(Math.max(0, Number(event.target.value) || 0))}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
          />
        </label>
        <label className="mt-6 flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={sentenceAware}
            onChange={(event) => setSentenceAware(event.target.checked)}
            className="accent-blue-600"
          />
          Sentence-aware split
        </label>
      </div>

      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={12}
        placeholder="Paste corpus text for chunk simulation..."
        className="mb-4 w-full rounded-lg border border-gray-300 bg-white p-3 text-sm dark:border-gray-600 dark:bg-gray-900"
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Chunks" value={String(chunks.length)} />
        <StatCard label="Source Chars" value={String(stats.sourceLength)} />
        <StatCard label="Avg Chunk Chars" value={stats.avgChunk.toFixed(1)} />
        <StatCard label="Overlap Duplication" value={`${stats.overlapDuplication.toFixed(1)}%`} />
        <StatCard label="Max Chunk Tokens (est.)" value={String(stats.maxChunkTokens)} />
      </div>

      {chunks.length > 0 && (
        <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <label className="text-sm text-gray-700 dark:text-gray-300">
              Selected chunk
              <select
                value={selectedChunk}
                onChange={(event) => setSelectedChunk(Number(event.target.value))}
                className="ml-2 rounded-lg border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-900"
              >
                {chunks.map((chunk, idx) => (
                  <option key={chunk.index} value={idx}>
                    Chunk {chunk.index} ({chunk.end - chunk.start} chars, tokens ~{estimateTokens(chunk.text)})
                  </option>
                ))}
              </select>
            </label>
            <CopyButton text={chunkExport} />
          </div>
          <textarea
            value={chunkExport}
            onChange={() => {}}
            rows={9}
            readOnly
            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm dark:border-gray-600 dark:bg-gray-900"
          />
          {current && (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Character range: [{current.start}, {current.end}) | length: {current.end - current.start}
            </p>
          )}
        </div>
      )}

      <div className="mt-12 space-y-6 border-t border-gray-200 pt-8 text-sm leading-relaxed text-gray-600 dark:border-gray-700 dark:text-gray-400">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
        <p>
          RAG Chunking Simulator helps tune chunk parameters before indexing documents. It visualizes chunk counts,
          overlap duplication, and approximate token footprint for each chunk.
        </p>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is sentence-aware always better?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Not always. It often improves readability, but strict fixed windows can be simpler and faster.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Why does overlap increase token cost?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Overlap duplicates text across chunks, improving recall but increasing total indexed tokens.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is text uploaded?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. Simulation runs entirely in your browser.
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
