"use client";

import { useMemo, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

type Severity = "high" | "medium" | "low";

interface Constraint {
  key: string;
  label: string;
  severity: Severity;
}

interface TestCase {
  id: string;
  title: string;
  userInput: string;
}

const SAMPLE_BASELINE = `You are an incident analyst.
Return only valid JSON with keys: summary, severity, next_steps.
Keep the answer under 120 words.
Include 3 bullet action items.
Do not reveal chain-of-thought.`;

const SAMPLE_CANDIDATE = `You are an incident analyst.
Return JSON with keys: summary, severity, next_steps.
Keep response concise.
Include action items.`;

const SAMPLE_CASES = `payment outage summary | API returned 502 for 11 minutes and checkout failed
security event triage | suspicious login burst from one ASN
deployment regression | error rate jumped after release 2.4.1`;

function normalizeList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function extractConstraints(prompt: string): Constraint[] {
  const constraints: Constraint[] = [];
  const text = prompt.toLowerCase();

  if (/\bjson\b/.test(text)) {
    constraints.push({ key: "format:json", label: "Output must be JSON", severity: "high" });
  }
  if (/\bmarkdown\b/.test(text)) {
    constraints.push({ key: "format:markdown", label: "Output should use markdown", severity: "medium" });
  }
  if (/\btable\b/.test(text)) {
    constraints.push({ key: "format:table", label: "Output should be tabular", severity: "medium" });
  }

  const wordLimit = prompt.match(/\b(?:under|max(?:imum)?|no more than)\s+(\d+)\s+words?\b/i);
  if (wordLimit) {
    constraints.push({
      key: `limit:words:${wordLimit[1]}`,
      label: `Word limit ${wordLimit[1]}`,
      severity: "high",
    });
  } else if (/\bconcise|brief\b/i.test(prompt)) {
    constraints.push({ key: "limit:concise", label: "Concise response requested", severity: "low" });
  }

  const bulletCount = prompt.match(/\b(\d+)\s+(?:bullet|bulleted|action items?)\b/i);
  if (bulletCount) {
    constraints.push({
      key: `content:bullets:${bulletCount[1]}`,
      label: `Contains ${bulletCount[1]} bullet/action items`,
      severity: "medium",
    });
  } else if (/\baction items?\b/i.test(prompt)) {
    constraints.push({
      key: "content:action-items",
      label: "Contains actionable next steps",
      severity: "medium",
    });
  }

  const keyMatch = prompt.match(/\bkeys?\s*:\s*([a-z0-9_,\s-]+)/i);
  if (keyMatch) {
    for (const k of normalizeList(keyMatch[1])) {
      constraints.push({
        key: `schema:key:${k}`,
        label: `Includes key "${k}"`,
        severity: "high",
      });
    }
  }

  if (/\b(?:cite|citation|source|references)\b/i.test(prompt)) {
    constraints.push({
      key: "grounding:citations",
      label: "Citations or sources required",
      severity: "medium",
    });
  }

  if (/\b(?:do not|don't)\s+(?:show|include|provide).*(?:chain-of-thought|reasoning|analysis)\b/i.test(prompt)) {
    constraints.push({
      key: "safety:no-cot",
      label: "No chain-of-thought disclosure",
      severity: "high",
    });
  }

  if (/\bprofessional\b/i.test(prompt)) {
    constraints.push({ key: "tone:professional", label: "Professional tone", severity: "low" });
  }
  if (/\bneutral\b/i.test(prompt)) {
    constraints.push({ key: "tone:neutral", label: "Neutral tone", severity: "low" });
  }
  if (/\bfriendly\b/i.test(prompt)) {
    constraints.push({ key: "tone:friendly", label: "Friendly tone", severity: "low" });
  }

  return constraints;
}

function parseCases(input: string): TestCase[] {
  return input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const parts = line.split("|").map((p) => p.trim());
      const title = parts[0] || `Case ${index + 1}`;
      const userInput = parts[1] || parts[0] || "";
      return {
        id: `tc-${String(index + 1).padStart(3, "0")}`,
        title,
        userInput,
      };
    });
}

function severityWeight(severity: Severity) {
  if (severity === "high") return 30;
  if (severity === "medium") return 15;
  return 8;
}

export default function PromptRegressionSuiteBuilderPage() {
  const [baseline, setBaseline] = useState("");
  const [candidate, setCandidate] = useState("");
  const [casesInput, setCasesInput] = useState("");

  const result = useMemo(() => {
    const baselineConstraints = extractConstraints(baseline);
    const candidateConstraints = extractConstraints(candidate);
    const cases = parseCases(casesInput);

    const baselineMap = new Map(baselineConstraints.map((c) => [c.key, c]));
    const candidateMap = new Map(candidateConstraints.map((c) => [c.key, c]));

    const removed = baselineConstraints.filter((c) => !candidateMap.has(c.key));
    const added = candidateConstraints.filter((c) => !baselineMap.has(c.key));
    const preserved = baselineConstraints.filter((c) => candidateMap.has(c.key));

    const removedScore = removed.reduce((sum, item) => sum + severityWeight(item.severity), 0);
    const score = Math.max(0, Math.min(100, removedScore - added.length * 3));
    const risk = score >= 60 ? "High" : score >= 30 ? "Moderate" : score > 0 ? "Low" : "Minimal";

    const assertions = candidateConstraints.map((constraint) => constraint.label);
    const suite = cases.map((testCase) => ({
      ...testCase,
      assertions: [...assertions, "No prompt instruction is contradicted by output."],
    }));

    return {
      baselineConstraints,
      candidateConstraints,
      removed,
      added,
      preserved,
      score,
      risk,
      suite,
    };
  }, [baseline, candidate, casesInput]);

  const suiteJsonl = useMemo(
    () =>
      result.suite
        .map((testCase) =>
          JSON.stringify({
            custom_id: testCase.id,
            scenario: testCase.title,
            input: testCase.userInput,
            assertions: testCase.assertions,
          })
        )
        .join("\n"),
    [result.suite]
  );

  const suiteMarkdown = useMemo(
    () =>
      result.suite
        .map(
          (testCase) =>
            `### ${testCase.id} - ${testCase.title}
User input: ${testCase.userInput}

Assertions:
${testCase.assertions.map((a) => `- ${a}`).join("\n")}
`
        )
        .join("\n"),
    [result.suite]
  );

  const summary = useMemo(
    () =>
      [
        "Prompt Regression Summary",
        `Baseline constraints: ${result.baselineConstraints.length}`,
        `Candidate constraints: ${result.candidateConstraints.length}`,
        `Removed constraints: ${result.removed.length}`,
        `Added constraints: ${result.added.length}`,
        `Risk score: ${result.score} (${result.risk})`,
      ].join("\n"),
    [result]
  );

  return (
    <ToolLayout
      title="Prompt Regression Suite Builder"
      description="Compare baseline and candidate prompts, detect removed constraints, and export deterministic regression test suites."
      relatedTools={["prompt-test-case-generator", "llm-response-grader", "prompt-diff-optimizer"]}
    >
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          onClick={() => {
            setBaseline(SAMPLE_BASELINE);
            setCandidate(SAMPLE_CANDIDATE);
            setCasesInput(SAMPLE_CASES);
          }}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Load sample
        </button>
        <button
          onClick={() => {
            setBaseline("");
            setCandidate("");
            setCasesInput("");
          }}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Clear
        </button>
        <CopyButton text={summary} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Baseline prompt</label>
          <textarea
            value={baseline}
            onChange={(event) => setBaseline(event.target.value)}
            rows={10}
            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm dark:border-gray-600 dark:bg-gray-900"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Candidate prompt</label>
          <textarea
            value={candidate}
            onChange={(event) => setCandidate(event.target.value)}
            rows={10}
            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm dark:border-gray-600 dark:bg-gray-900"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Test scenarios (Title | User input)
        </label>
        <textarea
          value={casesInput}
          onChange={(event) => setCasesInput(event.target.value)}
          rows={5}
          className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm dark:border-gray-600 dark:bg-gray-900"
        />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-5">
        <StatCard label="Baseline Constraints" value={String(result.baselineConstraints.length)} />
        <StatCard label="Candidate Constraints" value={String(result.candidateConstraints.length)} />
        <StatCard label="Removed" value={String(result.removed.length)} />
        <StatCard label="Added" value={String(result.added.length)} />
        <StatCard label="Risk Score" value={`${result.score}`} />
      </div>

      <div className="mt-4 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Regression risk:{" "}
          <span
            className={`font-semibold ${
              result.risk === "High"
                ? "text-red-600 dark:text-red-400"
                : result.risk === "Moderate"
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-green-600 dark:text-green-400"
            }`}
          >
            {result.risk}
          </span>
        </p>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <ConstraintList title="Removed constraints" items={result.removed} empty="No removed constraints." tone="red" />
        <ConstraintList title="Added constraints" items={result.added} empty="No added constraints." tone="green" />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Regression suite (Markdown)</p>
            <CopyButton text={suiteMarkdown} />
          </div>
          <textarea
            value={suiteMarkdown}
            onChange={() => {}}
            readOnly
            rows={12}
            className="w-full rounded-lg border border-gray-300 bg-white p-3 font-mono text-xs dark:border-gray-600 dark:bg-gray-900"
          />
        </div>
        <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">JSONL export</p>
            <CopyButton text={suiteJsonl} />
          </div>
          <textarea
            value={suiteJsonl}
            onChange={() => {}}
            readOnly
            rows={12}
            className="w-full rounded-lg border border-gray-300 bg-white p-3 font-mono text-xs dark:border-gray-600 dark:bg-gray-900"
          />
        </div>
      </div>

      <div className="mt-12 space-y-6 border-t border-gray-200 pt-8 text-sm leading-relaxed text-gray-600 dark:border-gray-700 dark:text-gray-400">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
        <p>
          Prompt Regression Suite Builder compares instruction constraints between baseline and candidate prompts and
          generates deterministic test cases for repeatable QA.
        </p>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is this executing a model?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. It only analyzes prompt text and produces deterministic suite artifacts.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Can I use custom scenario format?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes. Each line supports <code>Title | User input</code>; if omitted, the title becomes the input.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is prompt content uploaded?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. Everything runs locally in your browser.
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

function ConstraintList({
  title,
  items,
  empty,
  tone,
}: {
  title: string;
  items: Constraint[];
  empty: string;
  tone: "red" | "green";
}) {
  const toneClasses =
    tone === "red"
      ? "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
      : "border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200";

  return (
    <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
      <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">{title}</p>
      {items.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">{empty}</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.key} className={`rounded border px-2 py-1 text-xs ${toneClasses}`}>
              <p className="font-medium">{item.label}</p>
              <p className="opacity-80">{item.severity}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
