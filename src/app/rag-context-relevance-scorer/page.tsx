"use client";

import { useMemo, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface Chunk {
  id: string;
  text: string;
  tokens: string[];
}

interface ScoredChunk {
  chunk: Chunk;
  overlapScore: number;
  densityScore: number;
  phraseBonus: number;
  numberBonus: number;
  lengthPenalty: number;
  redundancyPenalty: number;
  finalScore: number;
  matchedQueryTokens: string[];
}

const SAMPLE_QUERY = "root cause of payment API 502 incident and mitigation steps";

const SAMPLE_CHUNKS = `[C1] Incident timeline: from 09:10 to 09:21 UTC payment API returned 502 for checkout requests.

[C2] Root cause analysis: upstream timeout at 2s caused retries and cascading failures in the payment path.

[C3] Mitigation: timeout increased from 2s to 5s and circuit-breaker thresholds were adjusted.

[C4] Marketing campaign summary for Q4 channels and ad spend performance by region.

[C5] Follow-up: load testing and retry budget validation were scheduled for February 2026.`;

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
  "about",
]);

function normalizeTokens(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 2 && !STOPWORDS.has(token));
}

function parseChunks(input: string): Chunk[] {
  const trimmed = input.trim();
  if (!trimmed) return [];

  let blocks = trimmed.split(/\n\s*\n/).map((block) => block.trim()).filter(Boolean);
  if (blocks.length === 1) {
    const lineBlocks = trimmed.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    if (lineBlocks.length > 1) blocks = lineBlocks;
  }

  return blocks.map((block, index) => {
    const bracket = block.match(/^\[(C?\d+)\]\s*(.*)$/i);
    if (bracket) {
      const id = bracket[1].toUpperCase();
      const text = bracket[2].trim();
      return { id, text, tokens: normalizeTokens(text) };
    }

    const pipe = block.match(/^([^|]{1,20})\|\s*(.*)$/);
    if (pipe) {
      const id = pipe[1].trim();
      const text = pipe[2].trim();
      return { id, text, tokens: normalizeTokens(text) };
    }

    const id = `C${index + 1}`;
    return { id, text: block, tokens: normalizeTokens(block) };
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

function buildBigrams(tokens: string[]) {
  const result: string[] = [];
  for (let i = 0; i < tokens.length - 1; i += 1) {
    result.push(`${tokens[i]} ${tokens[i + 1]}`);
  }
  return result;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export default function RagContextRelevanceScorerPage() {
  const [query, setQuery] = useState("");
  const [chunksInput, setChunksInput] = useState("");
  const [topK, setTopK] = useState(3);

  const result = useMemo(() => {
    const queryTokens = normalizeTokens(query);
    const querySet = new Set(queryTokens);
    const queryBigrams = buildBigrams(queryTokens);
    const queryNumbers = (query.match(/\b\d+(?:\.\d+)?\b/g) || []).map((n) => n.trim());

    const chunks = parseChunks(chunksInput);
    const initialScores = chunks.map((chunk) => {
      const chunkSet = new Set(chunk.tokens);
      const matched = queryTokens.filter((token, idx) => querySet.has(token) && chunkSet.has(token) && queryTokens.indexOf(token) === idx);
      const overlapRatio = queryTokens.length > 0 ? matched.length / queryTokens.length : 0;
      const overlapScore = overlapRatio * 60;
      const densityScore = chunk.tokens.length > 0 ? (matched.length / chunk.tokens.length) * 20 : 0;

      const lowerChunk = chunk.text.toLowerCase();
      const phraseHits = queryBigrams.filter((phrase) => lowerChunk.includes(phrase)).length;
      const phraseBonus = Math.min(16, phraseHits * 8);

      const numberBonus = queryNumbers.some((n) => lowerChunk.includes(n)) ? 8 : 0;

      let lengthPenalty = 0;
      if (chunk.text.length > 1200) lengthPenalty = 8;
      else if (chunk.text.length < 60) lengthPenalty = 6;

      const baseScore = overlapScore + densityScore + phraseBonus + numberBonus - lengthPenalty;
      return {
        chunk,
        overlapScore,
        densityScore,
        phraseBonus,
        numberBonus,
        lengthPenalty,
        baseScore,
        matchedQueryTokens: matched,
      };
    });

    const byBase = [...initialScores].sort((a, b) => b.baseScore - a.baseScore);

    const scored: ScoredChunk[] = byBase.map((item, idx) => {
      const previous = byBase.slice(0, idx);
      let redundancyPenalty = 0;
      for (const prev of previous) {
        const sim = jaccard(item.chunk.tokens, prev.chunk.tokens);
        if (sim > 0.75) redundancyPenalty = Math.max(redundancyPenalty, 15);
        else if (sim > 0.6) redundancyPenalty = Math.max(redundancyPenalty, 8);
      }

      return {
        chunk: item.chunk,
        overlapScore: item.overlapScore,
        densityScore: item.densityScore,
        phraseBonus: item.phraseBonus,
        numberBonus: item.numberBonus,
        lengthPenalty: item.lengthPenalty,
        redundancyPenalty,
        finalScore: clamp(item.baseScore - redundancyPenalty, 0, 100),
        matchedQueryTokens: item.matchedQueryTokens,
      };
    });

    scored.sort((a, b) => b.finalScore - a.finalScore);
    const safeTopK = Math.max(1, Math.min(topK, scored.length || 1));
    const top = scored.slice(0, safeTopK);
    const covered = new Set(top.flatMap((item) => item.matchedQueryTokens));
    const coverage = queryTokens.length > 0 ? (covered.size / new Set(queryTokens).size) * 100 : 0;

    return { queryTokens, scored, top, coverage };
  }, [chunksInput, query, topK]);

  const exportJson = useMemo(
    () =>
      JSON.stringify(
        result.scored.map((item, index) => ({
          rank: index + 1,
          id: item.chunk.id,
          score: Number(item.finalScore.toFixed(2)),
          matched_query_tokens: item.matchedQueryTokens,
          recommendation:
            item.finalScore >= 55 ? "keep-primary" : item.finalScore >= 35 ? "keep-secondary" : "drop-or-rewrite",
        })),
        null,
        2
      ),
    [result.scored]
  );

  const summary = useMemo(
    () =>
      [
        "RAG Context Relevance Scorer",
        `Chunks scored: ${result.scored.length}`,
        `Top-K coverage: ${result.coverage.toFixed(1)}%`,
      ].join("\n"),
    [result.coverage, result.scored.length]
  );

  return (
    <ToolLayout
      title="RAG Context Relevance Scorer"
      description="Score and rank context chunks for a query using overlap, phrase hits, and redundancy penalties."
      relatedTools={["rag-chunking-simulator", "grounded-answer-citation-checker", "context-window-packer"]}
    >
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          onClick={() => {
            setQuery(SAMPLE_QUERY);
            setChunksInput(SAMPLE_CHUNKS);
            setTopK(3);
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
        <CopyButton text={summary} />
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
          Top-K coverage
          <input
            type="number"
            min={1}
            step={1}
            value={topK}
            onChange={(event) => setTopK(Math.max(1, Number(event.target.value) || 1))}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
          />
        </label>
      </div>

      <textarea
        value={chunksInput}
        onChange={(event) => setChunksInput(event.target.value)}
        rows={11}
        placeholder="Paste chunks separated by blank lines. Optional prefix: [C1] ..."
        className="mb-4 w-full rounded-lg border border-gray-300 bg-white p-3 text-sm dark:border-gray-600 dark:bg-gray-900"
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-4">
        <StatCard label="Query Tokens" value={String(new Set(result.queryTokens).size)} />
        <StatCard label="Chunks" value={String(result.scored.length)} />
        <StatCard label="Top-K" value={String(result.top.length)} />
        <StatCard label="Coverage" value={`${result.coverage.toFixed(1)}%`} />
      </div>

      <div className="mb-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300">
          Ranked chunks
        </div>
        <div className="max-h-[430px] overflow-auto">
          {result.scored.length === 0 ? (
            <p className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Add query and chunks to score relevance.</p>
          ) : (
            result.scored.map((item, index) => (
              <div key={item.chunk.id + index} className="border-b border-gray-100 px-3 py-3 text-sm dark:border-gray-800">
                <div className="mb-1 flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded bg-gray-100 px-2 py-0.5 font-mono text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    #{index + 1} {item.chunk.id}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">score {item.finalScore.toFixed(1)}</span>
                  <span className="text-gray-500 dark:text-gray-400">overlap {item.overlapScore.toFixed(1)}</span>
                  <span className="text-gray-500 dark:text-gray-400">density {item.densityScore.toFixed(1)}</span>
                  {item.redundancyPenalty > 0 && (
                    <span className="text-red-600 dark:text-red-400">redundancy -{item.redundancyPenalty}</span>
                  )}
                </div>
                <p className="mb-1 text-gray-800 dark:text-gray-200">{item.chunk.text}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  matched tokens:{" "}
                  {item.matchedQueryTokens.length > 0 ? item.matchedQueryTokens.join(", ") : "none"}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Top chunk IDs</p>
            <CopyButton text={result.top.map((item) => item.chunk.id).join(", ")} />
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {result.top.length > 0 ? result.top.map((item) => item.chunk.id).join(", ") : "No top chunks yet."}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Scoring JSON</p>
            <CopyButton text={exportJson} />
          </div>
          <textarea
            value={exportJson}
            onChange={() => {}}
            readOnly
            rows={8}
            className="w-full rounded-lg border border-gray-300 bg-white p-3 font-mono text-xs dark:border-gray-600 dark:bg-gray-900"
          />
        </div>
      </div>

      <div className="mt-12 space-y-6 border-t border-gray-200 pt-8 text-sm leading-relaxed text-gray-600 dark:border-gray-700 dark:text-gray-400">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
        <p>
          RAG Context Relevance Scorer ranks candidate chunks for a query using lexical overlap, phrase hits, and
          redundancy penalties to help curate retrieval context.
        </p>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is this embedding-based ranking?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. It is deterministic lexical scoring and redundancy heuristics.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Why penalize redundancy?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Highly similar chunks waste context window and reduce topical diversity.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is content uploaded?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. Scoring runs entirely in your browser.
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
