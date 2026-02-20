"use client";

import { useMemo, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface SourceChunk {
  id: string;
  text: string;
  tokens: string[];
}

interface ClaimResult {
  claim: string;
  citedIds: string[];
  bestSourceId: string | null;
  bestScore: number;
  status: "grounded" | "partial" | "unverified";
  citationMismatch: boolean;
}

const SAMPLE_CONTEXT = `[S1] Q4 incident report: payment API returned 502 for 11 minutes due to upstream timeout misconfiguration.
[S2] Mitigation: upstream timeout raised from 2s to 5s and circuit breaker thresholds were tuned.
[S3] Follow-up action: load testing was scheduled for February 2026.`;

const SAMPLE_ANSWER = `The outage lasted 11 minutes [S1].
It was caused by an upstream timeout issue [S1].
The team increased timeout from 2s to 5s and tuned breaker thresholds [S2].
The company lost 45% of monthly revenue.
Load testing is planned for February 2026 [S3].`;

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
  "we",
  "you",
  "he",
  "she",
]);

function normalizeTokens(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 2 && !STOPWORDS.has(token));
}

function splitSources(input: string): SourceChunk[] {
  const trimmed = input.trim();
  if (!trimmed) return [];

  const lines = trimmed.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const prefixed = lines.every((line) => /^\[S\d+\]\s+/i.test(line));

  if (prefixed) {
    return lines.map((line, index) => {
      const match = line.match(/^\[(S\d+)\]\s+(.*)$/i);
      const id = match?.[1]?.toUpperCase() || `S${index + 1}`;
      const text = match?.[2] || line;
      return { id, text, tokens: normalizeTokens(text) };
    });
  }

  return trimmed
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((text, index) => ({ id: `S${index + 1}`, text, tokens: normalizeTokens(text) }));
}

function splitClaims(answer: string) {
  return answer
    .split(/\r?\n/)
    .flatMap((line) => line.split(/[.!?]\s+/))
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function extractCitationIds(claim: string) {
  const ids: string[] = [];
  const regex = /(?:\[(S\d+)\]|\((S\d+)\))/gi;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(claim)) !== null) {
    const id = (match[1] || match[2] || "").toUpperCase();
    if (id) ids.push(id);
    if (match.index === regex.lastIndex) regex.lastIndex += 1;
  }
  return Array.from(new Set(ids));
}

function overlapScore(claimTokens: string[], sourceTokens: string[]) {
  if (claimTokens.length === 0 || sourceTokens.length === 0) return 0;
  const sourceSet = new Set(sourceTokens);
  let matches = 0;
  for (const token of claimTokens) {
    if (sourceSet.has(token)) matches += 1;
  }
  return (matches / claimTokens.length) * 100;
}

function truncate(value: string, length = 140) {
  if (value.length <= length) return value;
  return `${value.slice(0, length - 3)}...`;
}

export default function GroundedAnswerCitationCheckerPage() {
  const [context, setContext] = useState("");
  const [answer, setAnswer] = useState("");

  const analysis = useMemo(() => {
    const sources = splitSources(context);
    const claims = splitClaims(answer);

    const results: ClaimResult[] = claims.map((claim) => {
      const claimTokens = normalizeTokens(claim);
      let bestSourceId: string | null = null;
      let bestScore = 0;

      for (const source of sources) {
        const score = overlapScore(claimTokens, source.tokens);
        if (score > bestScore) {
          bestScore = score;
          bestSourceId = source.id;
        }
      }

      const citedIds = extractCitationIds(claim);
      const hasCitation = citedIds.length > 0;
      const citationMismatch = hasCitation && bestSourceId !== null && !citedIds.includes(bestSourceId);

      let status: ClaimResult["status"] = "unverified";
      if (bestScore >= 55) status = "grounded";
      else if (bestScore >= 30) status = "partial";

      return { claim, citedIds, bestSourceId, bestScore, status, citationMismatch };
    });

    const grounded = results.filter((r) => r.status === "grounded").length;
    const partial = results.filter((r) => r.status === "partial").length;
    const unverified = results.filter((r) => r.status === "unverified").length;
    const withCitation = results.filter((r) => r.citedIds.length > 0).length;
    const mismatches = results.filter((r) => r.citationMismatch).length;
    const groundedCoverage = results.length > 0 ? ((grounded + partial) / results.length) * 100 : 0;
    const citationCoverage = results.length > 0 ? (withCitation / results.length) * 100 : 0;

    return {
      sources,
      results,
      grounded,
      partial,
      unverified,
      withCitation,
      mismatches,
      groundedCoverage,
      citationCoverage,
    };
  }, [answer, context]);

  const resultBySource = useMemo(() => {
    const map = new Map<string, number>();
    for (const result of analysis.results) {
      if (result.bestSourceId) {
        map.set(result.bestSourceId, (map.get(result.bestSourceId) || 0) + 1);
      }
    }
    return map;
  }, [analysis.results]);

  const report = useMemo(
    () =>
      [
        "Grounded Answer Citation Checker",
        `Claims: ${analysis.results.length}`,
        `Grounded: ${analysis.grounded}`,
        `Partial: ${analysis.partial}`,
        `Unverified: ${analysis.unverified}`,
        `Citation mismatches: ${analysis.mismatches}`,
        `Grounding coverage: ${analysis.groundedCoverage.toFixed(1)}%`,
      ].join("\n"),
    [analysis]
  );

  return (
    <ToolLayout
      title="Grounded Answer Citation Checker"
      description="Check whether answer claims are supported by provided sources and detect citation mismatches."
      relatedTools={["hallucination-risk-checklist", "rag-context-relevance-scorer", "prompt-linter"]}
    >
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          onClick={() => {
            setContext(SAMPLE_CONTEXT);
            setAnswer(SAMPLE_ANSWER);
          }}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Load sample
        </button>
        <button
          onClick={() => {
            setContext("");
            setAnswer("");
          }}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Clear
        </button>
        <CopyButton text={report} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Context sources</label>
          <textarea
            value={context}
            onChange={(event) => setContext(event.target.value)}
            rows={11}
            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm dark:border-gray-600 dark:bg-gray-900"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Answer to verify</label>
          <textarea
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            rows={11}
            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm dark:border-gray-600 dark:bg-gray-900"
          />
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-5">
        <StatCard label="Claims" value={String(analysis.results.length)} />
        <StatCard label="Grounded" value={String(analysis.grounded)} />
        <StatCard label="Partial" value={String(analysis.partial)} />
        <StatCard label="Unverified" value={String(analysis.unverified)} />
        <StatCard label="Mismatch" value={String(analysis.mismatches)} />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Grounding coverage:{" "}
            <span className="font-semibold text-blue-700 dark:text-blue-300">{analysis.groundedCoverage.toFixed(1)}%</span>
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Citation coverage:{" "}
            <span className="font-semibold text-blue-700 dark:text-blue-300">{analysis.citationCoverage.toFixed(1)}%</span>
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Source usage</p>
            <CopyButton
              text={analysis.sources
                .map((source) => `${source.id}: ${resultBySource.get(source.id) || 0} matched claims`)
                .join("\n")}
            />
          </div>
          <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
            {analysis.sources.map((source) => (
              <li key={source.id}>
                <span className="font-mono">{source.id}</span>: {resultBySource.get(source.id) || 0} matched claims
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300">
          Claim verification
        </div>
        <div className="max-h-[430px] overflow-auto">
          {analysis.results.length === 0 ? (
            <p className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Paste an answer to start checking.</p>
          ) : (
            analysis.results.map((result, index) => (
              <div key={`${result.claim}-${index}`} className="border-b border-gray-100 px-3 py-3 text-sm dark:border-gray-800">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      result.status === "grounded"
                        ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                        : result.status === "partial"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                          : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                    }`}
                  >
                    {result.status}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">score {result.bestScore.toFixed(1)}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    best source {result.bestSourceId || "none"}
                  </span>
                  {result.citedIds.length > 0 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      cited {result.citedIds.join(", ")}
                    </span>
                  )}
                </div>
                <p className="mb-1 text-gray-800 dark:text-gray-200">{result.claim}</p>
                {result.citationMismatch && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    Citation mismatch: cited source differs from the highest-overlap source.
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
        <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Parsed sources</p>
        <div className="space-y-2">
          {analysis.sources.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">No sources detected.</p>
          ) : (
            analysis.sources.map((source) => (
              <p key={source.id} className="text-xs text-gray-700 dark:text-gray-300">
                <span className="font-mono">{source.id}</span> - {truncate(source.text)}
              </p>
            ))
          )}
        </div>
      </div>

      <div className="mt-12 space-y-6 border-t border-gray-200 pt-8 text-sm leading-relaxed text-gray-600 dark:border-gray-700 dark:text-gray-400">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
        <p>
          Grounded Answer Citation Checker estimates how well each answer claim is supported by supplied context and
          highlights potential citation mismatches.
        </p>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is this semantic reasoning?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              It uses lexical overlap heuristics, not full semantic understanding.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Can claims be marked partial?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes. Partial means some overlap exists but evidence appears incomplete.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is answer data uploaded?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. All checks run in your browser only.
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
