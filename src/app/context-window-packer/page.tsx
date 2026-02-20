"use client";

import { useMemo, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

type Strategy = "priority" | "order" | "shortest";

interface Segment {
  id: number;
  text: string;
  required: boolean;
  priority: number;
  tokens: number;
  order: number;
}

const SAMPLE_SEGMENTS = `! [p5] System role: You are a strict API output assistant.
[p5] Return only valid JSON object with keys: summary, risk, next_actions.
[p4] Keep response under 120 words.
[p3] Use neutral professional tone.
[p2] Avoid repeating the user's prompt.
[p4] Mention at least 2 concrete risks.
[p1] Add one optional motivational sentence.`;

function estimateTokens(text: string) {
  if (!text) return 0;
  const ascii = (text.match(/[\x00-\x7F]/g) || []).length;
  const nonAscii = text.length - ascii;
  const punctuation = (text.match(/[.,!?;:()[\]{}"'`~@#$%^&*+\-_=\\/|<>]/g) || []).length;
  const tokenFloat = ascii / 4 + nonAscii / 1.5 + punctuation / 6;
  return Math.max(1, Math.ceil(tokenFloat));
}

function parseSegments(input: string): Segment[] {
  const lines = input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.map((raw, index) => {
    let text = raw;
    let required = false;
    let priority = 3;

    if (text.startsWith("!")) {
      required = true;
      text = text.slice(1).trim();
    }

    const priorityMatch = text.match(/^\[p([1-5])\]\s*/i);
    if (priorityMatch) {
      priority = Number(priorityMatch[1]);
      text = text.replace(/^\[p[1-5]\]\s*/i, "");
    }

    return {
      id: index + 1,
      text,
      required,
      priority,
      tokens: estimateTokens(text),
      order: index,
    };
  });
}

function sortByStrategy(items: Segment[], strategy: Strategy) {
  if (strategy === "order") return [...items].sort((a, b) => a.order - b.order);
  if (strategy === "shortest") return [...items].sort((a, b) => a.tokens - b.tokens || b.priority - a.priority);
  return [...items].sort((a, b) => b.priority - a.priority || a.tokens - b.tokens || a.order - b.order);
}

export default function ContextWindowPackerPage() {
  const [segmentsInput, setSegmentsInput] = useState("");
  const [contextLimit, setContextLimit] = useState(8000);
  const [reservedOutput, setReservedOutput] = useState(600);
  const [strategy, setStrategy] = useState<Strategy>("priority");

  const result = useMemo(() => {
    const segments = parseSegments(segmentsInput);
    const budget = Math.max(0, contextLimit - reservedOutput);

    const required = segments.filter((segment) => segment.required);
    const optional = segments.filter((segment) => !segment.required);

    const requiredSorted = sortByStrategy(required, "order");
    const optionalSorted = sortByStrategy(optional, strategy);

    const included: Segment[] = [];
    const excluded: Segment[] = [];
    let used = 0;
    let requiredOverflow = false;

    for (const segment of requiredSorted) {
      if (used + segment.tokens <= budget) {
        included.push(segment);
        used += segment.tokens;
      } else {
        excluded.push(segment);
        requiredOverflow = true;
      }
    }

    for (const segment of optionalSorted) {
      if (used + segment.tokens <= budget) {
        included.push(segment);
        used += segment.tokens;
      } else {
        excluded.push(segment);
      }
    }

    const includedInOrder = [...included].sort((a, b) => a.order - b.order);
    const packedPrompt = includedInOrder.map((segment) => segment.text).join("\n");

    return {
      segments,
      included: includedInOrder,
      excluded: [...excluded].sort((a, b) => a.order - b.order),
      packedPrompt,
      usedTokens: used,
      budget,
      requiredOverflow,
    };
  }, [contextLimit, reservedOutput, segmentsInput, strategy]);

  const fillPct = result.budget > 0 ? Math.min(100, (result.usedTokens / result.budget) * 100) : 0;

  const report = useMemo(
    () =>
      [
        "Context Window Packer Report",
        `Total segments: ${result.segments.length}`,
        `Included: ${result.included.length}`,
        `Excluded: ${result.excluded.length}`,
        `Budget: ${result.budget} tokens`,
        `Used: ${result.usedTokens} tokens (${fillPct.toFixed(1)}%)`,
        result.requiredOverflow ? "WARNING: some required segments did not fit." : "All required segments fit.",
      ].join("\n"),
    [fillPct, result]
  );

  return (
    <ToolLayout
      title="Context Window Packer"
      description="Pack prompt segments into a fixed token budget while preserving high-priority and required instructions."
      relatedTools={["token-counter", "ai-cost-estimator", "prompt-linter"]}
    >
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          onClick={() => setSegmentsInput(SAMPLE_SEGMENTS)}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Load sample
        </button>
        <button
          onClick={() => setSegmentsInput("")}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Clear
        </button>
        <CopyButton text={report} />
      </div>

      <div className="mb-4 grid gap-3 md:grid-cols-3">
        <label className="text-sm text-gray-700 dark:text-gray-300">
          Context limit (tokens)
          <input
            type="number"
            min={1}
            step={1}
            value={contextLimit}
            onChange={(event) => setContextLimit(Math.max(1, Number(event.target.value) || 1))}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
          />
        </label>
        <label className="text-sm text-gray-700 dark:text-gray-300">
          Reserved output (tokens)
          <input
            type="number"
            min={0}
            step={1}
            value={reservedOutput}
            onChange={(event) => setReservedOutput(Math.max(0, Number(event.target.value) || 0))}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
          />
        </label>
        <label className="text-sm text-gray-700 dark:text-gray-300">
          Packing strategy
          <select
            value={strategy}
            onChange={(event) => setStrategy(event.target.value as Strategy)}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
          >
            <option value="priority">Highest priority first</option>
            <option value="order">Original order</option>
            <option value="shortest">Shortest first</option>
          </select>
        </label>
      </div>

      <textarea
        value={segmentsInput}
        onChange={(event) => setSegmentsInput(event.target.value)}
        rows={10}
        placeholder="One segment per line. Prefix with ! for required and [p1]-[p5] for priority."
        className="mb-4 w-full rounded-lg border border-gray-300 bg-white p-3 font-mono text-sm dark:border-gray-600 dark:bg-gray-900"
      />

      <div className="mb-4 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-gray-700 dark:text-gray-300">
            Budget usage: {result.usedTokens}/{result.budget} tokens
          </span>
          <span className="text-gray-500 dark:text-gray-400">{fillPct.toFixed(1)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className={`h-full rounded-full transition-all ${result.requiredOverflow ? "bg-red-500" : fillPct > 90 ? "bg-amber-500" : "bg-blue-600"}`}
            style={{ width: `${fillPct}%` }}
          />
        </div>
        {result.requiredOverflow && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            Required segments overflow the current budget. Increase context limit or reduce reserved output.
          </p>
        )}
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <StatCard label="Total Segments" value={String(result.segments.length)} />
        <StatCard label="Included" value={String(result.included.length)} />
        <StatCard label="Excluded" value={String(result.excluded.length)} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Packed prompt</p>
            <CopyButton text={result.packedPrompt} />
          </div>
          <textarea
            value={result.packedPrompt}
            onChange={() => {}}
            rows={12}
            readOnly
            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm dark:border-gray-600 dark:bg-gray-900"
          />
        </div>
        <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
          <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Excluded segments</p>
          <div className="max-h-[290px] space-y-2 overflow-auto">
            {result.excluded.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">Nothing excluded.</p>
            ) : (
              result.excluded.map((segment) => (
                <div key={segment.id} className="rounded bg-red-50 p-2 text-xs text-red-800 dark:bg-red-950 dark:text-red-300">
                  <p className="mb-1 font-mono">
                    {segment.required ? "required" : "optional"} | p{segment.priority} | ~{segment.tokens} tokens
                  </p>
                  <p>{segment.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-12 space-y-6 border-t border-gray-200 pt-8 text-sm leading-relaxed text-gray-600 dark:border-gray-700 dark:text-gray-400">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
        <p>
          Context Window Packer helps fit instruction blocks into finite context. It is useful for long system prompts,
          RAG assembly, and multi-part tool instructions where token budgets are strict.
        </p>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is token count exact?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. It is a heuristic estimate for planning.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              How do required segments work?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Prefix a line with <code>!</code>. Required lines are packed first.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is prompt text uploaded?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. All packing logic runs in your browser.
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
