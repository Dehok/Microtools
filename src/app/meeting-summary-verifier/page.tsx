"use client";

import { useMemo, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface ClaimRow {
  id: string;
  claim: string;
  score: number;
  status: "supported" | "weak" | "unsupported";
  numericGap: boolean;
  bestEvidence: string;
}

const SAMPLE_TRANSCRIPT = `[00:03] Incident started at 09:10 UTC and checkout began failing with 502 errors.
[00:06] Root cause was upstream timeout set to 2 seconds.
[00:09] Team increased timeout to 5 seconds and tuned breaker thresholds.
[00:12] Outage duration was about 11 minutes.
[00:18] Follow-up load test scheduled for next Tuesday.`;

const SAMPLE_SUMMARY = `Checkout failed with 502 errors and the outage lasted 11 minutes.
Root cause was upstream timeout at 2 seconds.
Mitigation increased timeout to 5 seconds and adjusted breakers.
Team reported 45% revenue loss.
Load test is planned for next Tuesday.`;

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

function normalize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 2 && !STOPWORDS.has(token));
}

function splitIntoEvidence(text: string) {
  return text
    .split(/\r?\n/)
    .flatMap((line) => line.split(/[.!?]\s+/))
    .map((part) => part.trim())
    .filter(Boolean);
}

function splitClaims(text: string) {
  return text
    .split(/\r?\n/)
    .flatMap((line) => line.split(/[.!?]\s+/))
    .map((part) => part.trim())
    .filter(Boolean);
}

function scoreOverlap(claimTokens: string[], evidenceTokens: string[]) {
  if (claimTokens.length === 0 || evidenceTokens.length === 0) return 0;
  const evidenceSet = new Set(evidenceTokens);
  const matches = claimTokens.filter((token) => evidenceSet.has(token)).length;
  return (matches / claimTokens.length) * 100;
}

function extractNumbers(text: string) {
  return (text.match(/\b\d+(?:\.\d+)?\b/g) || []).map((x) => x.trim());
}

function containsAnyNumber(target: string[], source: string[]) {
  if (target.length === 0) return false;
  const sourceSet = new Set(source);
  return target.some((n) => sourceSet.has(n));
}

export default function MeetingSummaryVerifierPage() {
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState("");

  const result = useMemo(() => {
    const evidences = splitIntoEvidence(transcript);
    const claims = splitClaims(summary);
    const transcriptNumbers = extractNumbers(transcript);

    const rows: ClaimRow[] = claims.map((claim, idx) => {
      const claimTokens = normalize(claim);
      let bestEvidence = "";
      let bestScore = 0;

      for (const evidence of evidences) {
        const score = scoreOverlap(claimTokens, normalize(evidence));
        if (score > bestScore) {
          bestScore = score;
          bestEvidence = evidence;
        }
      }

      const claimNumbers = extractNumbers(claim);
      const numericGap = claimNumbers.length > 0 && !containsAnyNumber(claimNumbers, transcriptNumbers);

      const status: ClaimRow["status"] =
        bestScore >= 55 && !numericGap ? "supported" : bestScore >= 30 ? "weak" : "unsupported";

      return {
        id: `C${idx + 1}`,
        claim,
        score: bestScore,
        status,
        numericGap,
        bestEvidence,
      };
    });

    const supported = rows.filter((row) => row.status === "supported").length;
    const weak = rows.filter((row) => row.status === "weak").length;
    const unsupported = rows.filter((row) => row.status === "unsupported").length;
    const numericIssues = rows.filter((row) => row.numericGap).length;
    const coverage = rows.length > 0 ? ((supported + weak) / rows.length) * 100 : 0;

    return { rows, supported, weak, unsupported, numericIssues, coverage };
  }, [summary, transcript]);

  const summaryReport = useMemo(
    () =>
      [
        "Meeting Summary Verifier",
        `Claims: ${result.rows.length}`,
        `Supported: ${result.supported}`,
        `Weak: ${result.weak}`,
        `Unsupported: ${result.unsupported}`,
        `Coverage: ${result.coverage.toFixed(1)}%`,
      ].join("\n"),
    [result]
  );

  return (
    <ToolLayout
      title="Meeting Summary Verifier"
      description="Verify whether summary statements are grounded in meeting transcript evidence and flag unsupported claims."
      relatedTools={["claim-evidence-matrix", "grounded-answer-citation-checker", "hallucination-risk-checklist"]}
    >
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          onClick={() => {
            setTranscript(SAMPLE_TRANSCRIPT);
            setSummary(SAMPLE_SUMMARY);
          }}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Load sample
        </button>
        <button
          onClick={() => {
            setTranscript("");
            setSummary("");
          }}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Clear
        </button>
        <CopyButton text={summaryReport} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Meeting transcript / notes</label>
          <textarea
            value={transcript}
            onChange={(event) => setTranscript(event.target.value)}
            rows={11}
            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm dark:border-gray-600 dark:bg-gray-900"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Generated summary</label>
          <textarea
            value={summary}
            onChange={(event) => setSummary(event.target.value)}
            rows={11}
            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm dark:border-gray-600 dark:bg-gray-900"
          />
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-5">
        <StatCard label="Claims" value={`${result.rows.length}`} />
        <StatCard label="Supported" value={`${result.supported}`} />
        <StatCard label="Weak" value={`${result.weak}`} />
        <StatCard label="Unsupported" value={`${result.unsupported}`} />
        <StatCard label="Coverage" value={`${result.coverage.toFixed(1)}%`} />
      </div>

      <div className="mt-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300">
          Claim verification table
        </div>
        <div className="max-h-[390px] overflow-auto">
          {result.rows.length === 0 ? (
            <p className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Paste transcript and summary to verify.</p>
          ) : (
            result.rows.map((row) => (
              <div key={row.id} className="border-b border-gray-100 px-3 py-3 text-sm dark:border-gray-800">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-gray-500 dark:text-gray-400">{row.id}</span>
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
                  <span className="text-xs text-gray-500 dark:text-gray-400">score {row.score.toFixed(1)}</span>
                  {row.numericGap && <span className="text-xs text-red-600 dark:text-red-400">numeric mismatch</span>}
                </div>
                <p className="mb-1 text-gray-800 dark:text-gray-200">{row.claim}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Best evidence: {row.bestEvidence || "none"}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Unsupported claims</p>
          <CopyButton text={result.rows.filter((row) => row.status === "unsupported").map((row) => row.claim).join("\n")} />
        </div>
        <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700 dark:text-gray-300">
          {result.rows.filter((row) => row.status === "unsupported").length === 0 ? (
            <li className="text-gray-500 dark:text-gray-400">No unsupported claims detected.</li>
          ) : (
            result.rows
              .filter((row) => row.status === "unsupported")
              .map((row) => <li key={`unsupported-${row.id}`}>{row.claim}</li>)
          )}
        </ul>
      </div>

      <div className="mt-12 space-y-6 border-t border-gray-200 pt-8 text-sm leading-relaxed text-gray-600 dark:border-gray-700 dark:text-gray-400">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
        <p>
          Meeting Summary Verifier helps teams audit AI-generated summaries by mapping each statement to transcript
          evidence and highlighting unsupported claims.
        </p>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is this semantic fact checking?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              It is deterministic lexical verification, suitable for fast review.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Can it detect fabricated numbers?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes, it flags numbers in summary claims that do not appear in transcript text.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is content uploaded?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. Verification runs locally in your browser.
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
