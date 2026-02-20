"use client";

import { useMemo, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface AnswerItem {
  id: string;
  text: string;
  tokens: string[];
}

interface PairResult {
  left: string;
  right: string;
  similarity: number;
  numericConflict: boolean;
  negationConflict: boolean;
  verdict: "consistent" | "mixed" | "conflicting";
}

const SAMPLE_QUESTION = "What caused the payment incident and what actions were taken?";

const SAMPLE_ANSWERS = `[A1] The payment incident lasted 11 minutes and was caused by upstream timeout settings. The team raised timeout from 2s to 5s and tuned circuit breakers.
[A2] Root cause was upstream timeout configuration. Outage duration was 11 minutes. Mitigation included increasing timeout to 5 seconds and adjusting breaker thresholds.
[A3] The outage lasted 18 minutes and happened because of a database migration issue. The team rolled back the schema changes.`;

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

const NEGATION_REGEX = /\b(no|not|never|none|cannot|can't|didn't|won't|without)\b/i;

function normalizeTokens(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 2 && !STOPWORDS.has(token));
}

function parseAnswers(input: string): AnswerItem[] {
  const trimmed = input.trim();
  if (!trimmed) return [];

  const prefixed = trimmed
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (prefixed.every((line) => /^\[A\d+\]\s+/i.test(line))) {
    return prefixed.map((line, idx) => {
      const match = line.match(/^\[(A\d+)\]\s+(.*)$/i);
      const id = match?.[1]?.toUpperCase() || `A${idx + 1}`;
      const text = match?.[2] || line;
      return { id, text, tokens: normalizeTokens(text) };
    });
  }

  const blocks = trimmed.split(/\n\s*---+\s*\n/).map((block) => block.trim()).filter(Boolean);
  return blocks.map((text, index) => ({
    id: `A${index + 1}`,
    text,
    tokens: normalizeTokens(text),
  }));
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

function numbersIn(text: string) {
  return (text.match(/\b\d+(?:\.\d+)?\b/g) || []).map((n) => n.trim());
}

function setEquals(a: string[], b: string[]) {
  if (a.length !== b.length) return false;
  const aSet = new Set(a);
  const bSet = new Set(b);
  if (aSet.size !== bSet.size) return false;
  for (const value of aSet) {
    if (!bSet.has(value)) return false;
  }
  return true;
}

function consensusTokens(items: AnswerItem[]) {
  if (items.length === 0) return [];
  const counts = new Map<string, number>();
  for (const item of items) {
    for (const token of new Set(item.tokens)) {
      counts.set(token, (counts.get(token) || 0) + 1);
    }
  }
  const required = Math.max(2, Math.ceil(items.length * 0.7));
  return [...counts.entries()]
    .filter(([, count]) => count >= required)
    .sort((a, b) => b[1] - a[1])
    .map(([token]) => token)
    .slice(0, 20);
}

export default function AnswerConsistencyCheckerPage() {
  const [question, setQuestion] = useState("");
  const [answersInput, setAnswersInput] = useState("");

  const result = useMemo(() => {
    const answers = parseAnswers(answersInput);
    const pairs: PairResult[] = [];

    for (let i = 0; i < answers.length; i += 1) {
      for (let j = i + 1; j < answers.length; j += 1) {
        const left = answers[i];
        const right = answers[j];
        const similarity = jaccard(left.tokens, right.tokens) * 100;

        const leftNums = numbersIn(left.text);
        const rightNums = numbersIn(right.text);
        const numericConflict = leftNums.length > 0 && rightNums.length > 0 && !setEquals(leftNums, rightNums);

        const negationConflict =
          similarity >= 35 && NEGATION_REGEX.test(left.text) !== NEGATION_REGEX.test(right.text);

        const verdict: PairResult["verdict"] =
          numericConflict || negationConflict
            ? "conflicting"
            : similarity >= 55
              ? "consistent"
              : similarity >= 30
                ? "mixed"
                : "conflicting";

        pairs.push({
          left: left.id,
          right: right.id,
          similarity,
          numericConflict,
          negationConflict,
          verdict,
        });
      }
    }

    const avgSimilarity = pairs.length > 0 ? pairs.reduce((sum, p) => sum + p.similarity, 0) / pairs.length : 0;
    const conflictCount = pairs.filter((pair) => pair.verdict === "conflicting").length;
    const score = Math.max(0, Math.min(100, avgSimilarity - conflictCount * 14));
    const label = score >= 75 ? "Stable" : score >= 50 ? "Moderate" : score >= 30 ? "Unstable" : "Highly inconsistent";
    const consensus = consensusTokens(answers);

    return { answers, pairs, avgSimilarity, conflictCount, score, label, consensus };
  }, [answersInput]);

  const report = useMemo(
    () =>
      [
        "Answer Consistency Report",
        `Answers: ${result.answers.length}`,
        `Pair checks: ${result.pairs.length}`,
        `Consistency score: ${result.score.toFixed(1)} (${result.label})`,
        `Conflicting pairs: ${result.conflictCount}`,
      ].join("\n"),
    [result]
  );

  return (
    <ToolLayout
      title="Answer Consistency Checker"
      description="Compare multiple AI answers for the same question and detect conflicts, drift, and unstable claims."
      relatedTools={["llm-response-grader", "claim-evidence-matrix", "hallucination-risk-checklist"]}
    >
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          onClick={() => {
            setQuestion(SAMPLE_QUESTION);
            setAnswersInput(SAMPLE_ANSWERS);
          }}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Load sample
        </button>
        <button
          onClick={() => {
            setQuestion("");
            setAnswersInput("");
          }}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Clear
        </button>
        <CopyButton text={report} />
      </div>

      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Question / task</label>
      <textarea
        value={question}
        onChange={(event) => setQuestion(event.target.value)}
        rows={3}
        className="mb-4 w-full rounded-lg border border-gray-300 bg-white p-3 text-sm dark:border-gray-600 dark:bg-gray-900"
      />

      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
        Answer variants (one per line with [A1] prefix, or blocks separated by ---)
      </label>
      <textarea
        value={answersInput}
        onChange={(event) => setAnswersInput(event.target.value)}
        rows={9}
        className="mb-4 w-full rounded-lg border border-gray-300 bg-white p-3 text-sm dark:border-gray-600 dark:bg-gray-900"
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-5">
        <StatCard label="Answers" value={String(result.answers.length)} />
        <StatCard label="Pair Checks" value={String(result.pairs.length)} />
        <StatCard label="Avg Similarity" value={`${result.avgSimilarity.toFixed(1)}%`} />
        <StatCard label="Conflicts" value={String(result.conflictCount)} />
        <StatCard label="Score" value={`${result.score.toFixed(1)}`} />
      </div>

      <div className="mb-4 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Consistency label:{" "}
          <span
            className={`font-semibold ${
              result.label === "Stable"
                ? "text-green-600 dark:text-green-400"
                : result.label === "Moderate"
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-red-600 dark:text-red-400"
            }`}
          >
            {result.label}
          </span>
        </p>
      </div>

      <div className="mb-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300">
          Pair comparison
        </div>
        <div className="max-h-[360px] overflow-auto">
          {result.pairs.length === 0 ? (
            <p className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Add at least two answers to compare.</p>
          ) : (
            result.pairs.map((pair) => (
              <div key={`${pair.left}-${pair.right}`} className="border-b border-gray-100 px-3 py-3 text-sm dark:border-gray-800">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
                    {pair.left} vs {pair.right}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      pair.verdict === "consistent"
                        ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                        : pair.verdict === "mixed"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                          : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                    }`}
                  >
                    {pair.verdict}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    similarity {pair.similarity.toFixed(1)}%
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  numeric conflict: {pair.numericConflict ? "yes" : "no"} | negation conflict:{" "}
                  {pair.negationConflict ? "yes" : "no"}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Consensus tokens</p>
            <CopyButton text={result.consensus.join(", ")} />
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {result.consensus.length > 0 ? result.consensus.join(", ") : "No consensus tokens yet."}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Pair JSON</p>
            <CopyButton text={JSON.stringify(result.pairs, null, 2)} />
          </div>
          <textarea
            value={JSON.stringify(result.pairs, null, 2)}
            onChange={() => {}}
            rows={8}
            readOnly
            className="w-full rounded-lg border border-gray-300 bg-white p-3 font-mono text-xs dark:border-gray-600 dark:bg-gray-900"
          />
        </div>
      </div>

      <div className="mt-12 space-y-6 border-t border-gray-200 pt-8 text-sm leading-relaxed text-gray-600 dark:border-gray-700 dark:text-gray-400">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
        <p>
          Answer Consistency Checker helps detect unstable outputs by comparing multiple responses for overlap and basic
          contradiction signals.
        </p>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Does it understand meaning deeply?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              It is heuristic-based, focused on lexical overlap and simple contradiction patterns.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              How many variants should I compare?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              At least 3 variants gives a stronger stability signal than only 2.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is answer data uploaded?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. Comparisons run locally in-browser.
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
