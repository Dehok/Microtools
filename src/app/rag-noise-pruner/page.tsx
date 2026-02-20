"use client";

import { useMemo, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface Chunk {
  id: string;
  text: string;
  tokens: string[];
}

interface RankedChunk {
  chunk: Chunk;
  relevance: number;
  density: number;
  boilerplatePenalty: number;
  shortPenalty: number;
  redundancyPenalty: number;
  score: number;
  decision: "keep" | "rewrite" | "drop";
}

const SAMPLE_QUERY = "payment API 502 root cause mitigation timeout";

const SAMPLE_CHUNKS = `[C1] The payment API returned 502 for 11 minutes due to upstream timeout misconfiguration.

[C2] Root cause analysis shows timeout at 2s caused retry storms and cascading errors.

[C3] We increased timeout from 2s to 5s and tuned breaker thresholds as mitigation.

[C4] Welcome to our platform. This document contains general information and terms.

[C5] Payment API returned 502 for 11 minutes due to upstream timeout misconfiguration.

[C6] Contact support for more information and visit our homepage for updates.`;

const STOPWORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "from",
  "that",
  "this",
  "were",
  "was",
  "are",
  "is",
  "a",
  "an",
  "to",
  "of",
  "in",
  "on",
  "as",
  "it",
  "by",
  "be",
  "at",
  "or",
  "if",
  "then",
  "than",
  "into",
  "their",
  "our",
  "your",
  "they",
  "them",
]);

function normalizeTokens(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 2);
}

function keywordTokens(text: string) {
  return normalizeTokens(text).filter((token) => !STOPWORDS.has(token));
}

function parseChunks(input: string): Chunk[] {
  const trimmed = input.trim();
  if (!trimmed) return [];

  const blocks = trimmed.split(/\n\s*\n/).map((block) => block.trim()).filter(Boolean);
  return blocks.map((block, idx) => {
    const match = block.match(/^\[(C\d+)\]\s*(.*)$/i);
    const id = match?.[1]?.toUpperCase() || `C${idx + 1}`;
    const text = match?.[2] || block;
    return { id, text, tokens: keywordTokens(text) };
  });
}

function jaccard(a: string[], b: string[]) {
  if (a.length === 0 || b.length === 0) return 0;
  const aSet = new Set(a);
  const bSet = new Set(b);
  let intersection = 0;
  for (const token of aSet) {
    if (bSet.has(token)) intersection += 1;
  }
  const union = new Set([...aSet, ...bSet]).size;
  return union > 0 ? intersection / union : 0;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export default function RagNoisePrunerPage() {
  const [query, setQuery] = useState("");
  const [chunksInput, setChunksInput] = useState("");
  const [keepTarget, setKeepTarget] = useState(4);

  const result = useMemo(() => {
    const queryTokens = keywordTokens(query);
    const querySet = new Set(queryTokens);
    const chunks = parseChunks(chunksInput);

    const prelim = chunks.map((chunk) => {
      const uniqueChunkTokens = Array.from(new Set(chunk.tokens));
      const matched = uniqueChunkTokens.filter((token) => querySet.has(token));
      const relevance = queryTokens.length > 0 ? (matched.length / new Set(queryTokens).size) * 65 : 0;
      const density = uniqueChunkTokens.length > 0 ? (matched.length / uniqueChunkTokens.length) * 25 : 0;

      const allTokens = normalizeTokens(chunk.text);
      const stopCount = allTokens.filter((token) => STOPWORDS.has(token)).length;
      const boilerplateRatio = allTokens.length > 0 ? stopCount / allTokens.length : 0;
      const boilerplatePenalty = boilerplateRatio > 0.72 ? 14 : boilerplateRatio > 0.6 ? 8 : 0;

      const shortPenalty = chunk.text.length < 60 ? 8 : 0;

      return {
        chunk,
        relevance,
        density,
        boilerplatePenalty,
        shortPenalty,
        score: relevance + density - boilerplatePenalty - shortPenalty,
      };
    });

    prelim.sort((a, b) => b.score - a.score);

    const ranked: RankedChunk[] = prelim.map((item, idx) => {
      let redundancyPenalty = 0;
      for (let i = 0; i < idx; i += 1) {
        const sim = jaccard(item.chunk.tokens, prelim[i].chunk.tokens);
        if (sim > 0.85) redundancyPenalty = Math.max(redundancyPenalty, 18);
        else if (sim > 0.7) redundancyPenalty = Math.max(redundancyPenalty, 10);
      }

      const finalScore = clamp(item.score - redundancyPenalty, 0, 100);
      const decision: RankedChunk["decision"] = finalScore >= 45 ? "keep" : finalScore >= 25 ? "rewrite" : "drop";

      return {
        chunk: item.chunk,
        relevance: item.relevance,
        density: item.density,
        boilerplatePenalty: item.boilerplatePenalty,
        shortPenalty: item.shortPenalty,
        redundancyPenalty,
        score: finalScore,
        decision,
      };
    });

    ranked.sort((a, b) => b.score - a.score);

    const keep = ranked.filter((item) => item.decision === "keep");
    const rewrite = ranked.filter((item) => item.decision === "rewrite");
    const drop = ranked.filter((item) => item.decision === "drop");
    const topKept = keep.slice(0, Math.max(1, keepTarget));
    const prunedText = topKept.map((item) => `[${item.chunk.id}] ${item.chunk.text}`).join("\n\n");
    const averageScore =
      ranked.length > 0 ? ranked.reduce((sum, item) => sum + item.score, 0) / ranked.length : 0;

    return { ranked, keep, rewrite, drop, topKept, prunedText, averageScore };
  }, [chunksInput, keepTarget, query]);

  const report = useMemo(
    () =>
      [
        "RAG Noise Pruner",
        `Chunks: ${result.ranked.length}`,
        `Keep: ${result.keep.length}`,
        `Rewrite: ${result.rewrite.length}`,
        `Drop: ${result.drop.length}`,
        `Average score: ${result.averageScore.toFixed(1)}`,
      ].join("\n"),
    [result]
  );

  return (
    <ToolLayout
      title="RAG Noise Pruner"
      description="Prune noisy and redundant RAG chunks by scoring relevance, information density, and duplication risk."
      relatedTools={["rag-context-relevance-scorer", "rag-chunking-simulator", "context-window-packer"]}
    >
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          onClick={() => {
            setQuery(SAMPLE_QUERY);
            setChunksInput(SAMPLE_CHUNKS);
            setKeepTarget(3);
          }}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Load sample
        </button>
        <button
          onClick={() => {
            setQuery("");
            setChunksInput("");
          }}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Clear
        </button>
        <CopyButton text={report} />
      </div>

      <div className="mb-4 grid gap-3 md:grid-cols-4">
        <label className="md:col-span-3 text-sm text-gray-700 dark:text-gray-300">
          Query
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
          />
        </label>
        <label className="text-sm text-gray-700 dark:text-gray-300">
          Keep top chunks
          <input
            type="number"
            min={1}
            step={1}
            value={keepTarget}
            onChange={(event) => setKeepTarget(Math.max(1, Number(event.target.value) || 1))}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
          />
        </label>
      </div>

      <textarea
        value={chunksInput}
        onChange={(event) => setChunksInput(event.target.value)}
        rows={11}
        placeholder="Paste chunks separated by blank lines. Optional chunk IDs like [C1]..."
        className="mb-4 w-full rounded-lg border border-gray-300 bg-white p-3 text-sm dark:border-gray-600 dark:bg-gray-900"
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-5">
        <StatCard label="Chunks" value={String(result.ranked.length)} />
        <StatCard label="Keep" value={String(result.keep.length)} />
        <StatCard label="Rewrite" value={String(result.rewrite.length)} />
        <StatCard label="Drop" value={String(result.drop.length)} />
        <StatCard label="Avg Score" value={result.averageScore.toFixed(1)} />
      </div>

      <div className="mb-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300">
          Chunk decisions
        </div>
        <div className="max-h-[390px] overflow-auto">
          {result.ranked.length === 0 ? (
            <p className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Add query and chunks to prune noise.</p>
          ) : (
            result.ranked.map((item) => (
              <div key={item.chunk.id} className="border-b border-gray-100 px-3 py-3 text-sm dark:border-gray-800">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-gray-500 dark:text-gray-400">{item.chunk.id}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      item.decision === "keep"
                        ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                        : item.decision === "rewrite"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                          : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                    }`}
                  >
                    {item.decision}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">score {item.score.toFixed(1)}</span>
                </div>
                <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                  relevance {item.relevance.toFixed(1)} | density {item.density.toFixed(1)} | boilerplate -
                  {item.boilerplatePenalty} | short -{item.shortPenalty} | redundancy -{item.redundancyPenalty}
                </p>
                <p className="text-gray-800 dark:text-gray-200">{item.chunk.text}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Pruned chunk set</p>
            <CopyButton text={result.prunedText} />
          </div>
          <textarea
            value={result.prunedText}
            onChange={() => {}}
            rows={9}
            readOnly
            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-xs dark:border-gray-600 dark:bg-gray-900"
          />
        </div>
        <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Ranked JSON</p>
            <CopyButton
              text={JSON.stringify(
                result.ranked.map((item) => ({
                  id: item.chunk.id,
                  score: Number(item.score.toFixed(2)),
                  decision: item.decision,
                })),
                null,
                2
              )}
            />
          </div>
          <textarea
            value={JSON.stringify(
              result.ranked.map((item) => ({
                id: item.chunk.id,
                score: Number(item.score.toFixed(2)),
                decision: item.decision,
              })),
              null,
              2
            )}
            onChange={() => {}}
            rows={9}
            readOnly
            className="w-full rounded-lg border border-gray-300 bg-white p-3 font-mono text-xs dark:border-gray-600 dark:bg-gray-900"
          />
        </div>
      </div>

      <div className="mt-12 space-y-6 border-t border-gray-200 pt-8 text-sm leading-relaxed text-gray-600 dark:border-gray-700 dark:text-gray-400">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
        <p>
          RAG Noise Pruner removes low-value chunks before retrieval by combining relevance, density, and duplication
          heuristics.
        </p>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is this embedding similarity?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. Scoring is deterministic and lexical for fast local pruning.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Why mark some chunks as rewrite?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Rewrite indicates partially relevant chunks that need compression or cleanup rather than removal.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is data uploaded?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. Chunk pruning runs locally in your browser.
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
