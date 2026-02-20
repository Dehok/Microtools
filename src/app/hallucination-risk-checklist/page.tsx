"use client";

import { useMemo, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface RiskCheck {
  id: string;
  label: string;
  triggered: boolean;
  weight: number;
  reason: string;
  mitigation: string;
}

const SAMPLE_TASK = `Summarize the latest cybersecurity breach statistics in Europe and give exact percentages by country.
Be certain and do not include uncertainty language.`;

const SAMPLE_CONTEXT = `[S1] ENISA report 2024 baseline: ransomware remains top category.
[S2] Internal note from Jan 2025 with partial country distribution and confidence caveats.`;

function hasRecencyLanguage(text: string) {
  return /\b(latest|current|today|recent|newest|up-to-date)\b/i.test(text);
}

function hasCitationInstruction(text: string) {
  return /\b(cite|citation|source|references|with sources)\b/i.test(text);
}

function hasHighStakesDomain(text: string) {
  return /\b(medical|diagnos|legal|laws?|financial|investment|tax|security|compliance)\b/i.test(text);
}

function hasCertaintyPressure(text: string) {
  return /\b(guarantee|definitely|always|100%|certain|no uncertainty)\b/i.test(text);
}

function hasExactNumericPressure(text: string) {
  return /\b(exact|precise|percentage|percentages|how many|statistics|rate)\b/i.test(text);
}

function detectConflict(text: string) {
  const brief = /\b(brief|short|concise|under\s+\d+\s+words?)\b/i.test(text);
  const detailed = /\b(detailed|comprehensive|in-depth|thorough)\b/i.test(text);
  return brief && detailed;
}

function pronounDensity(text: string) {
  const pronouns = (text.match(/\b(this|that|it|they|them|these|those|he|she|his|her)\b/gi) || []).length;
  const words = (text.match(/\b[a-z0-9'-]+\b/gi) || []).length;
  return words > 0 ? pronouns / words : 0;
}

function buildChecks(task: string, context: string): RiskCheck[] {
  const cleanTask = task.trim();
  const cleanContext = context.trim();
  const contextShort = cleanContext.length > 0 && cleanContext.length < 180;

  return [
    {
      id: "missing-context",
      label: "No factual context provided",
      triggered: cleanTask.length > 0 && cleanContext.length === 0,
      weight: 28,
      reason: "Model may fill gaps with plausible but unverified facts.",
      mitigation: "Provide trusted source snippets or factual context before asking for conclusions.",
    },
    {
      id: "recency",
      label: "Recency request without date controls",
      triggered: hasRecencyLanguage(cleanTask) && !/\b(as of|cutoff|date)\b/i.test(cleanTask),
      weight: 18,
      reason: "Recency claims are error-prone without explicit cutoff dates.",
      mitigation: "Add a cutoff date requirement and ask the model to state uncertainty for stale data.",
    },
    {
      id: "high-stakes",
      label: "High-stakes domain without guardrails",
      triggered: hasHighStakesDomain(cleanTask) && !hasCitationInstruction(cleanTask),
      weight: 16,
      reason: "High-stakes topics require stronger evidence and traceability.",
      mitigation: "Require source citations and confidence notes for each key claim.",
    },
    {
      id: "certainty-pressure",
      label: "Certainty pressure in instructions",
      triggered: hasCertaintyPressure(cleanTask),
      weight: 14,
      reason: "Forcing certainty suppresses honest uncertainty handling.",
      mitigation: "Allow uncertainty phrasing and ask for confidence levels.",
    },
    {
      id: "exact-numbers",
      label: "Exact numeric demand with weak context",
      triggered: hasExactNumericPressure(cleanTask) && (cleanContext.length === 0 || contextShort),
      weight: 14,
      reason: "Exact numbers often require robust datasets and references.",
      mitigation: "Provide source tables or ask for ranges when exact values are unavailable.",
    },
    {
      id: "low-context-coverage",
      label: "Context likely too short for the requested scope",
      triggered: contextShort && cleanTask.length > 120,
      weight: 10,
      reason: "Large-scope tasks with short context increase unsupported synthesis.",
      mitigation: "Add more source coverage or narrow the scope of the request.",
    },
    {
      id: "no-citation-rule",
      label: "No citation requirement despite factual task",
      triggered:
        cleanContext.length > 0 &&
        !hasCitationInstruction(cleanTask) &&
        /\b(summarize|explain|report|compare|analyze|facts?)\b/i.test(cleanTask),
      weight: 9,
      reason: "Without citation rules, unsupported claims are harder to detect.",
      mitigation: "Require inline source tags such as [S1], [S2] for factual statements.",
    },
    {
      id: "ambiguous-references",
      label: "Ambiguous pronoun-heavy request",
      triggered: pronounDensity(cleanTask) > 0.08,
      weight: 8,
      reason: "Ambiguous references can cause incorrect entity resolution.",
      mitigation: "Replace pronouns with explicit entities, timelines, and scope.",
    },
    {
      id: "instruction-conflict",
      label: "Potentially conflicting instructions",
      triggered: detectConflict(cleanTask),
      weight: 8,
      reason: "Conflicts increase behavior drift and inconsistent outputs.",
      mitigation: "Prioritize constraints explicitly and remove contradictory requirements.",
    },
  ];
}

function riskLabel(score: number) {
  if (score >= 70) return "Critical";
  if (score >= 45) return "High";
  if (score >= 25) return "Moderate";
  if (score > 0) return "Low";
  return "Minimal";
}

export default function HallucinationRiskChecklistPage() {
  const [task, setTask] = useState("");
  const [context, setContext] = useState("");

  const analysis = useMemo(() => {
    const checks = buildChecks(task, context);
    const triggered = checks.filter((check) => check.triggered);
    const score = Math.min(100, triggered.reduce((sum, check) => sum + check.weight, 0));
    const label = riskLabel(score);

    const mitigationList = Array.from(new Set(triggered.map((item) => item.mitigation)));
    const saferPromptLines = [
      "Use only provided context.",
      "If evidence is insufficient, say what is missing.",
      "Attach source tags [S1], [S2] to each factual claim.",
      "State confidence level (high/medium/low) for final conclusion.",
    ];

    return { checks, triggered, score, label, mitigationList, saferPromptLines };
  }, [context, task]);

  const report = useMemo(
    () =>
      [
        "Hallucination Risk Checklist",
        `Risk score: ${analysis.score}/100 (${analysis.label})`,
        `Triggered checks: ${analysis.triggered.length}/${analysis.checks.length}`,
      ].join("\n"),
    [analysis]
  );

  return (
    <ToolLayout
      title="Hallucination Risk Checklist"
      description="Estimate hallucination risk from task instructions and context quality with deterministic guardrail checks."
      relatedTools={["prompt-linter", "grounded-answer-citation-checker", "prompt-security-scanner"]}
    >
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          onClick={() => {
            setTask(SAMPLE_TASK);
            setContext(SAMPLE_CONTEXT);
          }}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Load sample
        </button>
        <button
          onClick={() => {
            setTask("");
            setContext("");
          }}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Clear
        </button>
        <CopyButton text={report} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Task / prompt</label>
          <textarea
            value={task}
            onChange={(event) => setTask(event.target.value)}
            rows={10}
            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm dark:border-gray-600 dark:bg-gray-900"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Available context / sources</label>
          <textarea
            value={context}
            onChange={(event) => setContext(event.target.value)}
            rows={10}
            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm dark:border-gray-600 dark:bg-gray-900"
          />
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
        <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Hallucination risk</p>
        <p
          className={`mt-1 text-2xl font-bold ${
            analysis.label === "Critical"
              ? "text-red-700 dark:text-red-300"
              : analysis.label === "High"
                ? "text-amber-700 dark:text-amber-300"
                : analysis.label === "Moderate"
                  ? "text-yellow-700 dark:text-yellow-300"
                  : "text-green-700 dark:text-green-300"
          }`}
        >
          {analysis.score}/100 ({analysis.label})
        </p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <StatCard label="Total Checks" value={String(analysis.checks.length)} />
        <StatCard label="Triggered" value={String(analysis.triggered.length)} />
        <StatCard label="Mitigations" value={String(analysis.mitigationList.length)} />
      </div>

      <div className="mt-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300">
          Checklist results
        </div>
        <div className="max-h-[420px] overflow-auto">
          {analysis.checks.map((check) => (
            <div key={check.id} className="border-b border-gray-100 px-3 py-3 text-sm dark:border-gray-800">
              <div className="mb-1 flex items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    check.triggered
                      ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                      : "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                  }`}
                >
                  {check.triggered ? "risk" : "ok"}
                </span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{check.label}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">weight {check.weight}</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">{check.reason}</p>
              {check.triggered && <p className="mt-1 text-xs text-gray-700 dark:text-gray-300">Fix: {check.mitigation}</p>}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Recommended mitigations</p>
            <CopyButton text={analysis.mitigationList.join("\n")} />
          </div>
          {analysis.mitigationList.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">No high-risk mitigations needed.</p>
          ) : (
            <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700 dark:text-gray-300">
              {analysis.mitigationList.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Safer prompt starter</p>
            <CopyButton text={analysis.saferPromptLines.join("\n")} />
          </div>
          <textarea
            value={analysis.saferPromptLines.join("\n")}
            onChange={() => {}}
            readOnly
            rows={7}
            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm dark:border-gray-600 dark:bg-gray-900"
          />
        </div>
      </div>

      <div className="mt-12 space-y-6 border-t border-gray-200 pt-8 text-sm leading-relaxed text-gray-600 dark:border-gray-700 dark:text-gray-400">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
        <p>
          Hallucination Risk Checklist flags common prompt and context weaknesses that increase unsupported or
          fabricated outputs.
        </p>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is risk score a model prediction?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. It is deterministic scoring from prompt and context heuristics.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Can this replace human review?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. Use it as a fast pre-check before manual or automated evaluation.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is my prompt uploaded?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. Analysis runs fully in your browser.
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
