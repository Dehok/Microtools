"use client";

import { useMemo, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface RepairAttempt {
  step: string;
  changed: boolean;
  success: boolean;
  error: string;
}

interface RepairStep {
  name: string;
  fn: (value: string) => string;
}

const SAMPLE_BROKEN_OUTPUT = `Model output:
\`\`\`json
{
  task: 'Review release checklist',
  priority: 'high',
  done: False,
  labels: ['qa', 'release',],
  notes: 'Needs follow-up', // owner unavailable
}
\`\`\``;

function extractJsonCandidate(input: string) {
  const trimmed = input.trim();
  if (!trimmed) return "";
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) return fenced[1].trim();
  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) return trimmed.slice(firstBrace, lastBrace + 1);
  return trimmed;
}

function parseJsonSafe(value: string) {
  try {
    return {
      ok: true,
      parsed: JSON.parse(value) as unknown,
      error: "",
    };
  } catch (error) {
    return {
      ok: false,
      parsed: null,
      error: (error as Error).message,
    };
  }
}

const REPAIR_STEPS: RepairStep[] = [
  {
    name: "Normalize smart quotes",
    fn: (value) => value.replace(/[“”]/g, '"').replace(/[‘’]/g, "'"),
  },
  {
    name: "Remove JS-style comments",
    fn: (value) => value.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1"),
  },
  {
    name: "Convert Python literals",
    fn: (value) => value.replace(/\bTrue\b/g, "true").replace(/\bFalse\b/g, "false").replace(/\bNone\b/g, "null"),
  },
  {
    name: "Quote unquoted object keys",
    fn: (value) => value.replace(/([{,]\s*)([A-Za-z_][A-Za-z0-9_-]*)(\s*:)/g, '$1"$2"$3'),
  },
  {
    name: "Convert single-quoted strings",
    fn: (value) =>
      value.replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, (_, inner: string) => {
        const escaped = inner.replace(/"/g, '\\"');
        return `"${escaped}"`;
      }),
  },
  {
    name: "Remove trailing commas",
    fn: (value) => value.replace(/,\s*([}\]])/g, "$1"),
  },
];

export default function JsonOutputRepairerPage() {
  const [input, setInput] = useState("");

  const result = useMemo(() => {
    const candidate = extractJsonCandidate(input);
    if (!candidate) {
      return {
        candidate: "",
        repaired: "",
        attempts: [] as RepairAttempt[],
        success: false,
        finalError: "",
        parsedJson: "",
        appliedFixes: [] as string[],
      };
    }

    const attempts: RepairAttempt[] = [];
    const appliedFixes: string[] = [];

    let working = candidate;
    let parse = parseJsonSafe(working);
    attempts.push({
      step: "Initial parse",
      changed: false,
      success: parse.ok,
      error: parse.error,
    });

    if (!parse.ok) {
      for (const step of REPAIR_STEPS) {
        const next = step.fn(working);
        const changed = next !== working;
        if (changed) {
          appliedFixes.push(step.name);
          working = next;
        }
        parse = parseJsonSafe(working);
        attempts.push({
          step: step.name,
          changed,
          success: parse.ok,
          error: parse.error,
        });
        if (parse.ok) break;
      }
    }

    return {
      candidate,
      repaired: working,
      attempts,
      success: parse.ok,
      finalError: parse.error,
      parsedJson: parse.ok ? JSON.stringify(parse.parsed, null, 2) : "",
      appliedFixes,
    };
  }, [input]);

  const report = useMemo(
    () =>
      [
        "JSON Output Repairer Report",
        `Repair success: ${result.success ? "yes" : "no"}`,
        `Applied fixes: ${result.appliedFixes.length ? result.appliedFixes.join(", ") : "none"}`,
        result.finalError ? `Final error: ${result.finalError}` : "Final parse: OK",
      ].join("\n"),
    [result]
  );

  return (
    <ToolLayout
      title="JSON Output Repairer"
      description="Repair malformed JSON produced by AI tools and recover parser-safe output for downstream workflows."
      relatedTools={["json-output-guard", "function-calling-schema-tester", "output-contract-tester", "json-formatter"]}
    >
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          onClick={() => setInput(SAMPLE_BROKEN_OUTPUT)}
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
        <CopyButton text={report} />
      </div>

      <textarea
        value={input}
        onChange={(event) => setInput(event.target.value)}
        rows={11}
        placeholder="Paste model output with broken JSON..."
        className="mb-4 w-full rounded-lg border border-gray-300 bg-white p-3 font-mono text-sm dark:border-gray-600 dark:bg-gray-900"
      />

      <div
        className={`mb-4 rounded-lg border p-3 text-sm ${
          result.success
            ? "border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-300"
            : "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
        }`}
      >
        {result.success
          ? "Repair completed successfully. Parsed JSON is ready."
          : result.candidate
            ? "Repair failed. Review the attempt log and input format."
            : "Paste output to begin repair."}
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <StatCard label="Attempts" value={String(result.attempts.length)} />
        <StatCard label="Applied Fixes" value={String(result.appliedFixes.length)} />
        <StatCard label="Status" value={result.success ? "Recovered" : "Unresolved"} />
      </div>

      <div className="mb-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300">
          Repair attempts
        </div>
        <div className="max-h-[280px] overflow-auto">
          {result.attempts.length === 0 ? (
            <p className="px-3 py-3 text-sm text-gray-500 dark:text-gray-400">No attempts yet.</p>
          ) : (
            result.attempts.map((attempt, index) => (
              <div key={`${attempt.step}-${index}`} className="border-b border-gray-100 px-3 py-2 text-sm dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      attempt.success
                        ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                        : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                    }`}
                  >
                    {attempt.success ? "ok" : "fail"}
                  </span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{attempt.step}</span>
                  {attempt.changed && (
                    <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                      changed
                    </span>
                  )}
                </div>
                {!attempt.success && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{attempt.error}</p>}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Extracted JSON candidate</p>
            <CopyButton text={result.candidate} />
          </div>
          <textarea
            value={result.candidate}
            onChange={() => {}}
            rows={10}
            readOnly
            className="w-full rounded-lg border border-gray-300 bg-white p-3 font-mono text-xs dark:border-gray-600 dark:bg-gray-900"
          />
        </div>

        <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Repaired JSON</p>
            <CopyButton text={result.parsedJson || result.repaired} />
          </div>
          <textarea
            value={result.parsedJson || result.repaired}
            onChange={() => {}}
            rows={10}
            readOnly
            className="w-full rounded-lg border border-gray-300 bg-white p-3 font-mono text-xs dark:border-gray-600 dark:bg-gray-900"
          />
        </div>
      </div>

      <div className="mt-12 space-y-6 border-t border-gray-200 pt-8 text-sm leading-relaxed text-gray-600 dark:border-gray-700 dark:text-gray-400">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
        <p>
          JSON Output Repairer recovers malformed AI JSON with deterministic cleanup steps so you can validate and use
          structured outputs safely in automation workflows.
        </p>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Does it use an LLM for repair?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. Repairs are deterministic regex and normalization steps running locally in your browser.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Will this always recover broken JSON?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. Deeply corrupted structures may still fail and require manual edits.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is output uploaded anywhere?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. All extraction, repair, and parsing happen client-side.
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

