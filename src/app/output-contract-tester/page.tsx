"use client";

import { useMemo, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface OutputContract {
  mustBeJson?: boolean;
  requiredKeys?: string[];
  allowedTopLevelKeys?: string[];
  mustInclude?: string[];
  forbiddenPatterns?: string[];
  minWords?: number;
  maxWords?: number;
}

interface CheckResult {
  id: string;
  label: string;
  pass: boolean;
  detail: string;
}

const SAMPLE_CONTRACT = `{
  "mustBeJson": true,
  "requiredKeys": ["summary", "risk", "next_steps"],
  "allowedTopLevelKeys": ["summary", "risk", "next_steps"],
  "mustInclude": ["timeout", "mitigation"],
  "forbiddenPatterns": ["as an ai language model", "cannot provide"],
  "maxWords": 120
}`;

const SAMPLE_OUTPUT = `{
  "summary": "Payment API returned 502 due to upstream timeout configuration.",
  "risk": "Moderate",
  "next_steps": [
    "Increase upstream timeout to 5 seconds",
    "Tune circuit breaker thresholds",
    "Run load test this week"
  ]
}`;

function countWords(text: string) {
  return (text.match(/\b[\w'-]+\b/g) || []).length;
}

function tryParseJson(text: string) {
  try {
    return { ok: true as const, value: JSON.parse(text) as unknown };
  } catch (error) {
    return { ok: false as const, error: (error as Error).message };
  }
}

function keyList(value: unknown): string[] {
  if (!value || typeof value !== "object" || Array.isArray(value)) return [];
  return Object.keys(value as Record<string, unknown>);
}

export default function OutputContractTesterPage() {
  const [contractText, setContractText] = useState("");
  const [outputText, setOutputText] = useState("");

  const result = useMemo(() => {
    const checks: CheckResult[] = [];
    const words = countWords(outputText);

    const parsedContract = tryParseJson(contractText);
    if (!parsedContract.ok) {
      return {
        contractError: parsedContract.error,
        checks,
        score: 0,
        words,
        jsonError: null as string | null,
      };
    }

    const contract = (parsedContract.value || {}) as OutputContract;
    const parsedOutput = tryParseJson(outputText);
    const outputObj = parsedOutput.ok ? parsedOutput.value : null;
    const outputKeys = keyList(outputObj);
    const lowerOutput = outputText.toLowerCase();

    if (contract.mustBeJson) {
      checks.push({
        id: "must-json",
        label: "Output must be valid JSON",
        pass: parsedOutput.ok,
        detail: parsedOutput.ok ? "Valid JSON parsed." : `JSON parse error: ${parsedOutput.error}`,
      });
    }

    if ((contract.requiredKeys || []).length > 0) {
      const missing = (contract.requiredKeys || []).filter((key) => !outputKeys.includes(key));
      checks.push({
        id: "required-keys",
        label: "Required keys present",
        pass: missing.length === 0,
        detail: missing.length === 0 ? "All required keys present." : `Missing keys: ${missing.join(", ")}`,
      });
    }

    if ((contract.allowedTopLevelKeys || []).length > 0) {
      const extras = outputKeys.filter((key) => !(contract.allowedTopLevelKeys || []).includes(key));
      checks.push({
        id: "allowed-keys",
        label: "Only allowed top-level keys",
        pass: extras.length === 0,
        detail: extras.length === 0 ? "No extra keys detected." : `Unexpected keys: ${extras.join(", ")}`,
      });
    }

    if ((contract.mustInclude || []).length > 0) {
      const missingTerms = (contract.mustInclude || []).filter(
        (term) => !lowerOutput.includes(term.toLowerCase())
      );
      checks.push({
        id: "must-include",
        label: "Required terms included",
        pass: missingTerms.length === 0,
        detail: missingTerms.length === 0 ? "All required terms found." : `Missing terms: ${missingTerms.join(", ")}`,
      });
    }

    if ((contract.forbiddenPatterns || []).length > 0) {
      const hits = (contract.forbiddenPatterns || []).filter((pattern) =>
        lowerOutput.includes(pattern.toLowerCase())
      );
      checks.push({
        id: "forbidden",
        label: "Forbidden patterns absent",
        pass: hits.length === 0,
        detail: hits.length === 0 ? "No forbidden patterns found." : `Detected: ${hits.join(", ")}`,
      });
    }

    if (typeof contract.minWords === "number") {
      checks.push({
        id: "min-words",
        label: "Minimum word count",
        pass: words >= contract.minWords,
        detail: `${words} words (min ${contract.minWords})`,
      });
    }

    if (typeof contract.maxWords === "number") {
      checks.push({
        id: "max-words",
        label: "Maximum word count",
        pass: words <= contract.maxWords,
        detail: `${words} words (max ${contract.maxWords})`,
      });
    }

    const passed = checks.filter((item) => item.pass).length;
    const score = checks.length > 0 ? (passed / checks.length) * 100 : 0;

    return {
      contractError: null as string | null,
      checks,
      score,
      words,
      jsonError: parsedOutput.ok ? null : parsedOutput.error,
    };
  }, [contractText, outputText]);

  const summary = useMemo(
    () =>
      [
        "Output Contract Tester",
        `Checks: ${result.checks.length}`,
        `Score: ${result.score.toFixed(1)}%`,
        `Words: ${result.words}`,
      ].join("\n"),
    [result]
  );

  return (
    <ToolLayout
      title="Output Contract Tester"
      description="Validate AI output against a contract (JSON structure, required keys, forbidden phrases, and length limits)."
      relatedTools={["json-output-guard", "llm-response-grader", "agent-safety-checklist"]}
    >
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          onClick={() => {
            setContractText(SAMPLE_CONTRACT);
            setOutputText(SAMPLE_OUTPUT);
          }}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Load sample
        </button>
        <button
          onClick={() => {
            setContractText("");
            setOutputText("");
          }}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Clear
        </button>
        <CopyButton text={summary} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Contract (JSON)</label>
          <textarea
            value={contractText}
            onChange={(event) => setContractText(event.target.value)}
            rows={12}
            className="w-full rounded-lg border border-gray-300 bg-white p-3 font-mono text-sm dark:border-gray-600 dark:bg-gray-900"
          />
          {result.contractError && <p className="mt-2 text-xs text-red-600 dark:text-red-400">Contract JSON error: {result.contractError}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Model output</label>
          <textarea
            value={outputText}
            onChange={(event) => setOutputText(event.target.value)}
            rows={12}
            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm dark:border-gray-600 dark:bg-gray-900"
          />
          {result.jsonError && <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">Output JSON parse note: {result.jsonError}</p>}
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <StatCard label="Checks" value={`${result.checks.length}`} />
        <StatCard label="Passed" value={`${result.checks.filter((item) => item.pass).length}`} />
        <StatCard label="Score" value={`${result.score.toFixed(1)}%`} />
        <StatCard label="Words" value={`${result.words}`} />
      </div>

      <div className="mt-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300">
          Validation results
        </div>
        <div className="max-h-[360px] overflow-auto">
          {result.checks.length === 0 ? (
            <p className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Add contract and output to validate.</p>
          ) : (
            result.checks.map((item) => (
              <div key={item.id} className="border-b border-gray-100 px-3 py-3 text-sm dark:border-gray-800">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      item.pass
                        ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                        : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                    }`}
                  >
                    {item.pass ? "pass" : "fail"}
                  </span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{item.label}</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">{item.detail}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-12 space-y-6 border-t border-gray-200 pt-8 text-sm leading-relaxed text-gray-600 dark:border-gray-700 dark:text-gray-400">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
        <p>
          Output Contract Tester enforces deterministic output requirements before automation or downstream parsing.
        </p>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Can this replace schema validation APIs?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              It is a fast client-side precheck and does not replace full server-side validation.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              What contract fields are supported?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              JSON flag, key constraints, required terms, forbidden patterns, and word limits.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is output uploaded?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. Validation runs locally in your browser.
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
