"use client";

import { useMemo, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

type Severity = "low" | "medium" | "high";

interface LintIssue {
  id: string;
  severity: Severity;
  title: string;
  message: string;
  suggestion: string;
}

const SAMPLE_PROMPT = `Write something about AI for my website.
Make it good and detailed but also short.
Use whatever format you think is best.
Please include examples etc.`;

function severityClass(severity: Severity) {
  if (severity === "high") return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300";
  if (severity === "medium") return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300";
  return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300";
}

function hasAny(text: string, patterns: RegExp[]) {
  return patterns.some((pattern) => pattern.test(text));
}

function lintPrompt(input: string) {
  const text = input.trim();
  if (!text) return { issues: [] as LintIssue[], score: 100 };

  const issues: LintIssue[] = [];

  const hasRole = hasAny(text, [/\byou are\b/i, /\bact as\b/i, /\brole:\b/i]);
  if (!hasRole) {
    issues.push({
      id: "missing-role",
      severity: "medium",
      title: "Missing role/context framing",
      message: "Prompt does not define assistant role or perspective.",
      suggestion: "Add a role line, e.g. 'You are a senior product copywriter...'.",
    });
  }

  const hasOutputFormat = hasAny(text, [/\bjson\b/i, /\bmarkdown\b/i, /\bbullet/i, /\btable\b/i, /\bformat\b/i]);
  if (!hasOutputFormat) {
    issues.push({
      id: "missing-format",
      severity: "high",
      title: "Missing output format",
      message: "No explicit output format was detected.",
      suggestion: "Specify format explicitly, e.g. 'Return valid JSON with keys ...'.",
    });
  }

  const hasConstraints = hasAny(text, [/\bmax\b/i, /\bno more than\b/i, /\blimit\b/i, /\bmust\b/i, /\bexactly\b/i]);
  if (!hasConstraints) {
    issues.push({
      id: "missing-constraints",
      severity: "medium",
      title: "Weak constraints",
      message: "Prompt lacks strict constraints (length, tone, must/should rules).",
      suggestion: "Add clear constraints, e.g. max length, mandatory sections, forbidden content.",
    });
  }

  if (hasAny(text, [/\betc\b/i, /\bwhatever\b/i, /\bsomething\b/i, /\bgood\b/i, /\bnice\b/i])) {
    issues.push({
      id: "ambiguous-terms",
      severity: "medium",
      title: "Ambiguous language",
      message: "Prompt includes vague words such as etc./good/whatever.",
      suggestion: "Replace vague words with measurable criteria or examples.",
    });
  }

  const shortLike = hasAny(text, [/\bshort\b/i, /\bconcise\b/i, /\bbrief\b/i]);
  const longLike = hasAny(text, [/\bdetailed\b/i, /\bcomprehensive\b/i, /\bin-depth\b/i, /\bthorough\b/i]);
  if (shortLike && longLike) {
    issues.push({
      id: "conflicting-length",
      severity: "high",
      title: "Potential instruction conflict",
      message: "Prompt requests both short and detailed output.",
      suggestion: "Prioritize one objective or split into two passes.",
    });
  }

  const mentionsAudience = hasAny(text, [/\bfor developers\b/i, /\bfor beginners\b/i, /\baudience\b/i, /\btarget\b/i]);
  if (!mentionsAudience) {
    issues.push({
      id: "missing-audience",
      severity: "low",
      title: "Audience not specified",
      message: "Prompt does not define intended audience level.",
      suggestion: "Add audience context (e.g., beginner, technical, executive).",
    });
  }

  const score = Math.max(
    0,
    100 -
      issues.reduce((sum, issue) => sum + (issue.severity === "high" ? 20 : issue.severity === "medium" ? 12 : 6), 0)
  );

  return { issues, score };
}

function scoreLabel(score: number) {
  if (score >= 85) return "Strong";
  if (score >= 60) return "Needs work";
  return "Risky";
}

export default function PromptLinterPage() {
  const [prompt, setPrompt] = useState("");
  const result = useMemo(() => lintPrompt(prompt), [prompt]);

  const report = useMemo(
    () =>
      [
        "Prompt Linter Report",
        `Quality score: ${result.score}/100 (${scoreLabel(result.score)})`,
        `Issues: ${result.issues.length}`,
        "",
        ...result.issues.map(
          (issue, idx) => `${idx + 1}. [${issue.severity.toUpperCase()}] ${issue.title}\n- ${issue.message}\n- Fix: ${issue.suggestion}`
        ),
      ].join("\n"),
    [result]
  );

  return (
    <ToolLayout
      title="Prompt Linter"
      description="Lint prompts for ambiguity, missing constraints, and instruction conflicts before sending to AI."
      relatedTools={["prompt-compressor", "prompt-diff-optimizer", "prompt-security-scanner"]}
    >
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          onClick={() => setPrompt(SAMPLE_PROMPT)}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Load sample
        </button>
        <button
          onClick={() => setPrompt("")}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Clear
        </button>
        <CopyButton text={report} />
      </div>

      <textarea
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        rows={12}
        placeholder="Paste prompt text to lint..."
        className="mb-4 w-full rounded-lg border border-gray-300 bg-white p-3 font-mono text-sm dark:border-gray-600 dark:bg-gray-900"
      />

      <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
        <p className="text-xs uppercase tracking-wide text-blue-700 dark:text-blue-300">Prompt quality score</p>
        <p className="mt-1 text-2xl font-bold text-blue-800 dark:text-blue-200">
          {result.score}/100 <span className="text-base font-medium">({scoreLabel(result.score)})</span>
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300">
          Issues ({result.issues.length})
        </div>
        <div className="max-h-[460px] overflow-auto">
          {result.issues.length === 0 ? (
            <p className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">No major issues detected.</p>
          ) : (
            result.issues.map((issue) => (
              <div key={issue.id} className="border-b border-gray-100 px-3 py-3 dark:border-gray-800">
                <div className="mb-1 flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${severityClass(issue.severity)}`}>
                    {issue.severity}
                  </span>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{issue.title}</p>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{issue.message}</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Fix: {issue.suggestion}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-12 space-y-6 border-t border-gray-200 pt-8 text-sm leading-relaxed text-gray-600 dark:border-gray-700 dark:text-gray-400">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
        <p>
          Prompt Linter is a fast pre-flight check for AI prompts. It catches common quality problems that often cause
          unstable model outputs: ambiguity, weak constraints, or conflicting instructions.
        </p>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is this an AI-powered evaluator?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. It uses deterministic heuristics for transparent, predictable linting.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Does a high score guarantee perfect output?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. It improves prompt quality but does not guarantee model behavior.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is prompt text uploaded?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. Linting runs fully in your browser.
            </p>
          </details>
        </div>
      </div>
    </ToolLayout>
  );
}
