"use client";

import { useMemo, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface SourceItem {
  id: string;
  text: string;
  tokens: string[];
}

interface MatrixRow {
  claimId: string;
  claim: string;
  citedSources: string[];
  bestSource: string | null;
  supportScore: number;
  status: "supported" | "weak" | "missing";
  evidenceSnippet: string;
}

const SAMPLE_SOURCES = `[S1] Payment API incident lasted 11 minutes due to upstream timeout misconfiguration.
[S2] Mitigation included raising timeout from 2s to 5s and tuning circuit breaker thresholds.
[S3] A follow-up load test was scheduled for February 2026.`;

const SAMPLE_CLAIMS = `The outage lasted 11 minutes. [S1]
The root cause was upstream timeout settings. [S1]
The team increased timeout from 2s to 5s. [S2]
Monthly revenue dropped by 45%.
Load testing is planned for February 2026. [S3]`;

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
    .filter((token) => token.length > 2 && !STOPWORDS.has(token));
}

function parseSources(input: string): SourceItem[] {
  const lines = input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.map((line, index) => {
    const match = line.match(/^\[(S\d+)\]\s*(.*)$/i);
    const id = match?.[1]?.toUpperCase() || `S${index + 1}`;
    const text = match?.[2] || line;
    return { id, text, tokens: normalizeTokens(text) };
  });
}

function parseClaims(input: string) {
  return input
    .split(/\r?\n/)
    .flatMap((line) => line.split(/[.!?]\s+/))
    .map((line) => line.trim())
    .filter(Boolean)
    .map((claim, index) => ({ claimId: `C${index + 1}`, claim }));
}

function extractCitations(claim: string) {
  const ids = new Set<string>();
  const regex = /(?:\[(S\d+)\]|\((S\d+)\))/gi;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(claim)) !== null) {
    const id = (match[1] || match[2] || "").toUpperCase();
    if (id) ids.add(id);
    if (regex.lastIndex === match.index) regex.lastIndex += 1;
  }
  return [...ids];
}

function overlapScore(claimTokens: string[], sourceTokens: string[]) {
  if (claimTokens.length === 0 || sourceTokens.length === 0) return 0;
  const sourceSet = new Set(sourceTokens);
  const matches = claimTokens.filter((token) => sourceSet.has(token)).length;
  return (matches / claimTokens.length) * 100;
}

function snippetForClaim(source: string, claimTokens: string[]) {
  const sentences = source.split(/[.!?]\s+/).map((part) => part.trim()).filter(Boolean);
  if (sentences.length === 0) return source;
  let best = sentences[0];
  let bestScore = -1;
  for (const sentence of sentences) {
    const score = overlapScore(claimTokens, normalizeTokens(sentence));
    if (score > bestScore) {
      bestScore = score;
      best = sentence;
    }
  }
  return best;
}

function toCsv(rows: MatrixRow[]) {
  const header = "claim_id,status,support_score,best_source,cited_sources,claim,evidence_snippet";
  const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;
  const body = rows.map((row) =>
    [
      escape(row.claimId),
      escape(row.status),
      escape(row.supportScore.toFixed(1)),
      escape(row.bestSource || ""),
      escape(row.citedSources.join(";")),
      escape(row.claim),
      escape(row.evidenceSnippet),
    ].join(",")
  );
  return [header, ...body].join("\n");
}

export default function ClaimEvidenceMatrixPage() {
  const [sourcesInput, setSourcesInput] = useState("");
  const [claimsInput, setClaimsInput] = useState("");

  const result = useMemo(() => {
    const sources = parseSources(sourcesInput);
    const claims = parseClaims(claimsInput);

    const rows: MatrixRow[] = claims.map((claimItem) => {
      const claimTokens = normalizeTokens(claimItem.claim);
      let bestSource: SourceItem | null = null;
      let bestScore = 0;

      for (const source of sources) {
        const score = overlapScore(claimTokens, source.tokens);
        if (score > bestScore) {
          bestScore = score;
          bestSource = source;
        }
      }

      const citedSources = extractCitations(claimItem.claim);
      const status: MatrixRow["status"] = bestScore >= 55 ? "supported" : bestScore >= 30 ? "weak" : "missing";
      const evidenceSnippet = bestSource ? snippetForClaim(bestSource.text, claimTokens) : "";

      return {
        claimId: claimItem.claimId,
        claim: claimItem.claim,
        citedSources,
        bestSource: bestSource?.id || null,
        supportScore: bestScore,
        status,
        evidenceSnippet,
      };
    });

    const supported = rows.filter((row) => row.status === "supported").length;
    const weak = rows.filter((row) => row.status === "weak").length;
    const missing = rows.filter((row) => row.status === "missing").length;
    const cited = rows.filter((row) => row.citedSources.length > 0).length;
    const citationCoverage = rows.length > 0 ? (cited / rows.length) * 100 : 0;

    return { rows, supported, weak, missing, citationCoverage };
  }, [claimsInput, sourcesInput]);

  const markdown = useMemo(
    () =>
      [
        "| Claim ID | Status | Score | Best Source | Cited | Claim | Evidence |",
        "| --- | --- | --- | --- | --- | --- | --- |",
        ...result.rows.map(
          (row) =>
            `| ${row.claimId} | ${row.status} | ${row.supportScore.toFixed(1)} | ${row.bestSource || "-"} | ${row.citedSources.join(", ") || "-"} | ${row.claim.replace(/\|/g, "\\|")} | ${row.evidenceSnippet.replace(/\|/g, "\\|")} |`
        ),
      ].join("\n"),
    [result.rows]
  );

  const csv = useMemo(() => toCsv(result.rows), [result.rows]);

  const summary = useMemo(
    () =>
      [
        "Claim Evidence Matrix Report",
        `Claims: ${result.rows.length}`,
        `Supported: ${result.supported}`,
        `Weak: ${result.weak}`,
        `Missing: ${result.missing}`,
        `Citation coverage: ${result.citationCoverage.toFixed(1)}%`,
      ].join("\n"),
    [result]
  );

  return (
    <ToolLayout
      title="Claim Evidence Matrix"
      description="Map answer claims to source evidence, score support strength, and export verification matrix reports."
      relatedTools={["grounded-answer-citation-checker", "hallucination-risk-checklist", "llm-response-grader"]}
    >
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          onClick={() => {
            setSourcesInput(SAMPLE_SOURCES);
            setClaimsInput(SAMPLE_CLAIMS);
          }}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Load sample
        </button>
        <button
          onClick={() => {
            setSourcesInput("");
            setClaimsInput("");
          }}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Clear
        </button>
        <CopyButton text={summary} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Sources</label>
          <textarea
            value={sourcesInput}
            onChange={(event) => setSourcesInput(event.target.value)}
            rows={10}
            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm dark:border-gray-600 dark:bg-gray-900"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Claims / answer text</label>
          <textarea
            value={claimsInput}
            onChange={(event) => setClaimsInput(event.target.value)}
            rows={10}
            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm dark:border-gray-600 dark:bg-gray-900"
          />
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-5">
        <StatCard label="Claims" value={String(result.rows.length)} />
        <StatCard label="Supported" value={String(result.supported)} />
        <StatCard label="Weak" value={String(result.weak)} />
        <StatCard label="Missing" value={String(result.missing)} />
        <StatCard label="Citation Coverage" value={`${result.citationCoverage.toFixed(1)}%`} />
      </div>

      <div className="mt-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300">
          Matrix rows
        </div>
        <div className="max-h-[380px] overflow-auto">
          {result.rows.length === 0 ? (
            <p className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Add sources and claims to build matrix.</p>
          ) : (
            result.rows.map((row) => (
              <div key={row.claimId} className="border-b border-gray-100 px-3 py-3 text-sm dark:border-gray-800">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-gray-500 dark:text-gray-400">{row.claimId}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      row.status === "supported"
                        ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                        : row.status === "weak"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                          : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                    }`}
                  >
                    {row.status}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">score {row.supportScore.toFixed(1)}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">best {row.bestSource || "-"}</span>
                </div>
                <p className="mb-1 text-gray-800 dark:text-gray-200">{row.claim}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Evidence: {row.evidenceSnippet || "none"}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Markdown export</p>
            <CopyButton text={markdown} />
          </div>
          <textarea
            value={markdown}
            onChange={() => {}}
            rows={9}
            readOnly
            className="w-full rounded-lg border border-gray-300 bg-white p-3 font-mono text-xs dark:border-gray-600 dark:bg-gray-900"
          />
        </div>
        <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">CSV export</p>
            <CopyButton text={csv} />
          </div>
          <textarea
            value={csv}
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
          Claim Evidence Matrix creates a structured verification table linking each claim to the strongest available
          source and support score.
        </p>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is this semantic verification?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              It is lexical support scoring, useful for fast deterministic checks.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Can I export for audits?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes. Matrix can be copied as CSV or markdown table.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is content uploaded?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. All processing runs in your browser.
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
