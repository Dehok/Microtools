"use client";

import { useMemo, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

type DiffType = "added" | "removed" | "same";

interface DiffLine {
  type: DiffType;
  text: string;
}

const SAMPLE_ORIGINAL = `You are a senior assistant.
Please provide a complete implementation plan.
Please include architecture, testing strategy, rollout strategy, and fallback strategy.
Keep your response concise and actionable.
Output as markdown with headings and bullet points.`;

const SAMPLE_REVISED = `You are a senior assistant.
Provide an implementation plan with:
- architecture
- testing strategy
- rollout and fallback
Keep it concise and actionable.
Output in markdown with headings and bullets.`;

function estimateTokens(text: string) {
  if (!text) return 0;
  const ascii = (text.match(/[\x00-\x7F]/g) || []).length;
  const nonAscii = text.length - ascii;
  const punctuation = (text.match(/[.,!?;:()[\]{}"'`~@#$%^&*+\-_=\\/|<>]/g) || []).length;
  const tokenFloat = ascii / 4 + nonAscii / 1.5 + punctuation / 6;
  return Math.max(1, Math.ceil(tokenFloat));
}

function diffLines(a: string, b: string): DiffLine[] {
  const left = a.split(/\r?\n/);
  const right = b.split(/\r?\n/);
  const out: DiffLine[] = [];
  const maxLen = Math.max(left.length, right.length);
  for (let i = 0; i < maxLen; i++) {
    const l = left[i];
    const r = right[i];
    if (l === r) {
      if (l !== undefined) out.push({ type: "same", text: l });
      continue;
    }
    if (l !== undefined) out.push({ type: "removed", text: l });
    if (r !== undefined) out.push({ type: "added", text: r });
  }
  return out;
}

function looksConstraintLine(line: string) {
  return /\b(must|do not|don't|json|format|output|strict|exactly|required)\b/i.test(line);
}

export default function PromptDiffOptimizerPage() {
  const [original, setOriginal] = useState("");
  const [revised, setRevised] = useState("");

  const analysis = useMemo(() => {
    const lines = diffLines(original, revised);
    const added = lines.filter((line) => line.type === "added").length;
    const removed = lines.filter((line) => line.type === "removed").length;
    const unchanged = lines.filter((line) => line.type === "same").length;

    const originalTokens = estimateTokens(original);
    const revisedTokens = estimateTokens(revised);
    const delta = revisedTokens - originalTokens;
    const savingsPct = originalTokens > 0 ? ((originalTokens - revisedTokens) / originalTokens) * 100 : 0;

    const removedConstraints = lines
      .filter((line) => line.type === "removed" && looksConstraintLine(line.text))
      .map((line) => line.text);

    return { lines, added, removed, unchanged, originalTokens, revisedTokens, delta, savingsPct, removedConstraints };
  }, [original, revised]);

  const summary = useMemo(
    () =>
      [
        "Prompt Diff Optimizer Summary",
        `Original tokens (est.): ${analysis.originalTokens}`,
        `Revised tokens (est.): ${analysis.revisedTokens}`,
        `Token delta: ${analysis.delta >= 0 ? "+" : ""}${analysis.delta}`,
        `Savings: ${analysis.savingsPct.toFixed(1)}%`,
        `Lines added/removed/unchanged: ${analysis.added}/${analysis.removed}/${analysis.unchanged}`,
      ].join("\n"),
    [analysis]
  );

  return (
    <ToolLayout
      title="Prompt Diff Optimizer"
      description="Compare original vs revised prompts, track token delta, and spot removed constraints before shipping."
      relatedTools={["prompt-compressor", "token-counter", "ai-cost-estimator"]}
    >
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          onClick={() => {
            setOriginal(SAMPLE_ORIGINAL);
            setRevised(SAMPLE_REVISED);
          }}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Load sample
        </button>
        <button
          onClick={() => {
            setOriginal("");
            setRevised("");
          }}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Clear
        </button>
        <CopyButton text={summary} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Original prompt</label>
          <textarea
            value={original}
            onChange={(event) => setOriginal(event.target.value)}
            rows={10}
            className="w-full rounded-lg border border-gray-300 bg-white p-3 font-mono text-sm dark:border-gray-600 dark:bg-gray-900"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Revised prompt</label>
          <textarea
            value={revised}
            onChange={(event) => setRevised(event.target.value)}
            rows={10}
            className="w-full rounded-lg border border-gray-300 bg-white p-3 font-mono text-sm dark:border-gray-600 dark:bg-gray-900"
          />
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Original Tokens (est.)" value={String(analysis.originalTokens)} />
        <StatCard label="Revised Tokens (est.)" value={String(analysis.revisedTokens)} />
        <StatCard label="Token Delta" value={`${analysis.delta >= 0 ? "+" : ""}${analysis.delta}`} />
        <StatCard label="Savings %" value={`${analysis.savingsPct.toFixed(1)}%`} />
      </div>

      <div className="mt-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300">
          Prompt line diff
        </div>
        <div className="max-h-[420px] overflow-auto p-2">
          {analysis.lines.length === 0 ? (
            <p className="px-2 py-3 text-sm text-gray-500 dark:text-gray-400">No content to compare yet.</p>
          ) : (
            analysis.lines.map((line, idx) => (
              <div
                key={`${idx}-${line.type}-${line.text}`}
                className={`mb-1 rounded px-2 py-1 font-mono text-xs ${
                  line.type === "added"
                    ? "bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-300"
                    : line.type === "removed"
                    ? "bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-300"
                    : "bg-gray-50 text-gray-700 dark:bg-gray-900 dark:text-gray-300"
                }`}
              >
                <span className="mr-2 inline-block w-4 font-bold">{line.type === "added" ? "+" : line.type === "removed" ? "-" : "="}</span>
                {line.text || "(empty line)"}
              </div>
            ))
          )}
        </div>
      </div>

      {analysis.removedConstraints.length > 0 && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950">
          <p className="mb-1 text-sm font-medium text-amber-800 dark:text-amber-200">Potentially removed constraints</p>
          <ul className="list-disc space-y-1 pl-5 text-xs text-amber-700 dark:text-amber-300">
            {analysis.removedConstraints.map((line, idx) => (
              <li key={`${line}-${idx}`} className="font-mono">
                {line}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-12 space-y-6 border-t border-gray-200 pt-8 text-sm leading-relaxed text-gray-600 dark:border-gray-700 dark:text-gray-400">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
        <p>
          Prompt Diff Optimizer helps iterate prompts safely by showing exactly what changed and how token footprint
          shifted between versions.
        </p>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is token counting exact?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No, it is an estimate for quick optimization decisions.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Why highlight removed constraints?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Prompt edits that remove strict instructions can change output quality and formatting behavior.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is data uploaded?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. Comparison runs locally in your browser.
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
