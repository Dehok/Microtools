"use client";

import { useMemo, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const SAMPLE_PROMPT = `Please help me with the following task.
I would like you to create a concise, structured response.
In order to do that, can you please focus on practical steps?

Requirements:
1. Keep it short.
2. Keep it accurate.
3. Keep it implementation-ready.

Please avoid unnecessary intro.`;

const FILLER_REPLACEMENTS: Array<[RegExp, string]> = [
  [/\bplease\b/gi, ""],
  [/\bkindly\b/gi, ""],
  [/\bI would like you to\b/gi, ""],
  [/\bcan you\b/gi, ""],
  [/\bin order to\b/gi, "to"],
  [/\bat this point in time\b/gi, "now"],
  [/\bfor the purpose of\b/gi, "for"],
  [/\bit is important to note that\b/gi, ""],
];

function estimateTokens(text: string) {
  if (!text) return 0;
  const ascii = (text.match(/[\x00-\x7F]/g) || []).length;
  const nonAscii = text.length - ascii;
  const punctuation = (text.match(/[.,!?;:()[\]{}"'`~@#$%^&*+\-_=\\/|<>]/g) || []).length;
  const tokenFloat = ascii / 4 + nonAscii / 1.5 + punctuation / 6;
  return Math.max(1, Math.ceil(tokenFloat));
}

export default function PromptCompressorPage() {
  const [input, setInput] = useState("");
  const [trimLines, setTrimLines] = useState(true);
  const [collapseWhitespace, setCollapseWhitespace] = useState(true);
  const [dedupeLines, setDedupeLines] = useState(true);
  const [removeFiller, setRemoveFiller] = useState(true);
  const [normalizeBullets, setNormalizeBullets] = useState(true);

  const output = useMemo(() => {
    let value = input;

    if (trimLines) {
      value = value
        .split(/\r?\n/)
        .map((line) => line.trim())
        .join("\n");
    }

    if (normalizeBullets) {
      value = value.replace(/^\s*(?:•|\*|\d+\.)\s+/gm, "- ");
    }

    if (removeFiller) {
      for (const [pattern, replacement] of FILLER_REPLACEMENTS) {
        value = value.replace(pattern, replacement);
      }
    }

    if (dedupeLines) {
      const seen = new Set<string>();
      const unique: string[] = [];
      for (const line of value.split(/\r?\n/)) {
        const key = line.trim().toLowerCase();
        if (!key) {
          unique.push("");
          continue;
        }
        if (!seen.has(key)) {
          seen.add(key);
          unique.push(line);
        }
      }
      value = unique.join("\n");
    }

    if (collapseWhitespace) {
      value = value.replace(/[ \t]+/g, " ");
      value = value.replace(/\n{3,}/g, "\n\n");
      value = value.trim();
    }

    return value;
  }, [collapseWhitespace, dedupeLines, input, normalizeBullets, removeFiller, trimLines]);

  const metrics = useMemo(() => {
    const inputChars = input.length;
    const outputChars = output.length;
    const inputTokens = estimateTokens(input);
    const outputTokens = estimateTokens(output);
    const charSavings = inputChars > 0 ? ((inputChars - outputChars) / inputChars) * 100 : 0;
    const tokenSavings = inputTokens > 0 ? ((inputTokens - outputTokens) / inputTokens) * 100 : 0;
    return { inputChars, outputChars, inputTokens, outputTokens, charSavings, tokenSavings };
  }, [input, output]);

  return (
    <ToolLayout
      title="Prompt Compressor"
      description="Compress long prompts by removing verbosity, duplicate lines, and filler phrases while keeping intent."
      relatedTools={["token-counter", "ai-cost-estimator", "prompt-security-scanner"]}
    >
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          onClick={() => setInput(SAMPLE_PROMPT)}
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
      </div>

      <div className="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        <Toggle label="Trim lines" value={trimLines} onChange={setTrimLines} />
        <Toggle label="Collapse whitespace" value={collapseWhitespace} onChange={setCollapseWhitespace} />
        <Toggle label="Dedupe lines" value={dedupeLines} onChange={setDedupeLines} />
        <Toggle label="Remove filler" value={removeFiller} onChange={setRemoveFiller} />
        <Toggle label="Normalize bullets" value={normalizeBullets} onChange={setNormalizeBullets} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Original prompt</label>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            rows={14}
            placeholder="Paste your prompt here..."
            className="w-full rounded-lg border border-gray-300 bg-white p-3 font-mono text-sm dark:border-gray-600 dark:bg-gray-900"
          />
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Compressed prompt</label>
            <CopyButton text={output} />
          </div>
          <textarea
            value={output}
            onChange={() => {}}
            rows={14}
            readOnly
            className="w-full rounded-lg border border-gray-300 bg-white p-3 font-mono text-sm dark:border-gray-600 dark:bg-gray-900"
          />
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Input Tokens (est.)" value={metrics.inputTokens.toLocaleString()} />
        <StatCard label="Output Tokens (est.)" value={metrics.outputTokens.toLocaleString()} />
        <StatCard label="Token Savings" value={`${Math.max(0, metrics.tokenSavings).toFixed(1)}%`} />
        <StatCard label="Char Savings" value={`${Math.max(0, metrics.charSavings).toFixed(1)}%`} />
      </div>

      <div className="mt-12 space-y-6 border-t border-gray-200 pt-8 text-sm leading-relaxed text-gray-600 dark:border-gray-700 dark:text-gray-400">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
        <p>
          Prompt Compressor reduces prompt bloat with deterministic text cleanup rules. It is useful when you need
          shorter prompts for lower token usage, lower cost, or tighter context windows.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Does compression guarantee same model output?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. It preserves intent heuristically, but wording changes can alter model behavior. Always review.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is this AI-based rewriting?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. It uses local deterministic rules, not remote model calls.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is my prompt sent anywhere?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. Everything runs fully in your browser.
            </p>
          </details>
        </div>
      </div>
    </ToolLayout>
  );
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-300">
      <input type="checkbox" checked={value} onChange={(event) => onChange(event.target.checked)} className="accent-blue-600" />
      {label}
    </label>
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
