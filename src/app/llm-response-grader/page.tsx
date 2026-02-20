"use client";

import { useMemo, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface Rule {
  name: string;
  weight: number;
  pattern: string;
  isRegex: boolean;
}

interface RuleResult {
  rule: Rule;
  passed: boolean;
}

const SAMPLE_RESPONSE = `## Incident Summary
Payment API returned 502 errors for 11 minutes.

### Root Cause
A misconfigured upstream timeout caused retries to cascade.

### Actions
- Increased upstream timeout from 2s to 5s
- Added circuit-breaker thresholds
- Scheduled load test this week`;

const SAMPLE_RUBRIC = `Mentions root cause | 20 | root cause
Includes action items | 20 | /action|next step|mitigation/i
Uses markdown headings | 15 | /^(#|##|###)\\s+/m
Contains bullet list | 15 | /^[-*]\\s+/m
Mentions timeframe/impact | 15 | /minute|hour|impact|downtime/i
Keeps professional tone | 15 | /(incident|summary|actions)/i`;

function parseRules(input: string): Rule[] {
  return input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split("|").map((part) => part.trim());
      const name = parts[0] || "Unnamed rule";
      const weight = Math.max(0, Number(parts[1]) || 0);
      const patternRaw = parts[2] || "";
      const regexLike = patternRaw.startsWith("/") && patternRaw.lastIndexOf("/") > 0;
      return { name, weight, pattern: patternRaw, isRegex: regexLike };
    });
}

function evaluateRule(rule: Rule, response: string) {
  if (!rule.pattern) return false;
  if (rule.isRegex) {
    const lastSlash = rule.pattern.lastIndexOf("/");
    const source = rule.pattern.slice(1, lastSlash);
    const flags = rule.pattern.slice(lastSlash + 1);
    try {
      return new RegExp(source, flags).test(response);
    } catch {
      return false;
    }
  }
  return response.toLowerCase().includes(rule.pattern.toLowerCase());
}

export default function LlmResponseGraderPage() {
  const [responseText, setResponseText] = useState("");
  const [rubricText, setRubricText] = useState("");
  const [bannedTermsRaw, setBannedTermsRaw] = useState("");
  const [bannedPenalty, setBannedPenalty] = useState(10);

  const result = useMemo(() => {
    const rules = parseRules(rubricText);
    const ruleResults: RuleResult[] = rules.map((rule) => ({
      rule,
      passed: evaluateRule(rule, responseText),
    }));

    const totalWeight = rules.reduce((sum, rule) => sum + rule.weight, 0);
    const passedWeight = ruleResults.reduce((sum, item) => sum + (item.passed ? item.rule.weight : 0), 0);
    const baseScore = totalWeight > 0 ? (passedWeight / totalWeight) * 100 : 0;

    const bannedTerms = bannedTermsRaw
      .split(",")
      .map((term) => term.trim().toLowerCase())
      .filter(Boolean);

    const lower = responseText.toLowerCase();
    const bannedHits = bannedTerms.filter((term) => lower.includes(term));
    const penalty = bannedHits.length * Math.max(0, bannedPenalty);
    const finalScore = Math.max(0, Math.min(100, baseScore - penalty));

    return { rules, ruleResults, totalWeight, passedWeight, baseScore, finalScore, bannedHits };
  }, [bannedPenalty, bannedTermsRaw, responseText, rubricText]);

  const grade = result.finalScore >= 85 ? "A" : result.finalScore >= 70 ? "B" : result.finalScore >= 55 ? "C" : result.finalScore >= 40 ? "D" : "F";

  const report = useMemo(
    () =>
      [
        "LLM Response Grader Report",
        `Score: ${result.finalScore.toFixed(1)} / 100 (grade ${grade})`,
        `Base score: ${result.baseScore.toFixed(1)}`,
        `Rubric rules: ${result.rules.length}`,
        `Passed rules: ${result.ruleResults.filter((r) => r.passed).length}`,
        `Banned term hits: ${result.bannedHits.length}`,
      ].join("\n"),
    [grade, result]
  );

  return (
    <ToolLayout
      title="LLM Response Grader"
      description="Grade model responses against custom weighted rubric rules and detect banned-term violations."
      relatedTools={["prompt-linter", "prompt-diff-optimizer", "json-output-guard"]}
    >
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          onClick={() => {
            setResponseText(SAMPLE_RESPONSE);
            setRubricText(SAMPLE_RUBRIC);
            setBannedTermsRaw("sorry, as an ai language model");
          }}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Load sample
        </button>
        <button
          onClick={() => {
            setResponseText("");
            setRubricText("");
            setBannedTermsRaw("");
          }}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Clear
        </button>
        <CopyButton text={report} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Model response</label>
          <textarea
            value={responseText}
            onChange={(event) => setResponseText(event.target.value)}
            rows={12}
            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm dark:border-gray-600 dark:bg-gray-900"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Rubric rules (Name | Weight | Pattern)
          </label>
          <textarea
            value={rubricText}
            onChange={(event) => setRubricText(event.target.value)}
            rows={12}
            className="w-full rounded-lg border border-gray-300 bg-white p-3 font-mono text-sm dark:border-gray-600 dark:bg-gray-900"
          />
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <label className="text-sm text-gray-700 dark:text-gray-300">
          Banned terms (comma-separated)
          <input
            value={bannedTermsRaw}
            onChange={(event) => setBannedTermsRaw(event.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
          />
        </label>
        <label className="text-sm text-gray-700 dark:text-gray-300">
          Penalty per banned term (points)
          <input
            type="number"
            min={0}
            step={1}
            value={bannedPenalty}
            onChange={(event) => setBannedPenalty(Math.max(0, Number(event.target.value) || 0))}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
          />
        </label>
      </div>

      <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
        <p className="text-xs uppercase tracking-wide text-blue-700 dark:text-blue-300">Response score</p>
        <p className="mt-1 text-2xl font-bold text-blue-800 dark:text-blue-200">
          {result.finalScore.toFixed(1)}/100 <span className="text-base font-medium">(grade {grade})</span>
        </p>
        <p className="mt-1 text-xs text-blue-700 dark:text-blue-300">
          Base {result.baseScore.toFixed(1)} minus penalties for banned terms.
        </p>
      </div>

      <div className="mt-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300">
          Rubric checks
        </div>
        <div className="max-h-[420px] overflow-auto">
          {result.ruleResults.length === 0 ? (
            <p className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Add rubric rules to start grading.</p>
          ) : (
            result.ruleResults.map((item, idx) => (
              <div key={`${item.rule.name}-${idx}`} className="border-b border-gray-100 px-3 py-2 text-sm dark:border-gray-800">
                <div className="mb-1 flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${item.passed ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300" : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"}`}>
                    {item.passed ? "pass" : "fail"}
                  </span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{item.rule.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">weight {item.rule.weight}</span>
                </div>
                <p className="font-mono text-xs text-gray-600 dark:text-gray-400">{item.rule.pattern}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {result.bannedHits.length > 0 && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950">
          <p className="mb-1 text-sm font-medium text-red-800 dark:text-red-200">Banned terms detected</p>
          <ul className="list-disc space-y-1 pl-5 text-xs text-red-700 dark:text-red-300">
            {result.bannedHits.map((term) => (
              <li key={term} className="font-mono">
                {term}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-12 space-y-6 border-t border-gray-200 pt-8 text-sm leading-relaxed text-gray-600 dark:border-gray-700 dark:text-gray-400">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
        <p>
          LLM Response Grader applies weighted rubric checks to evaluate response quality consistently. It is useful for
          prompt iteration, regression checks, and human-in-the-loop QA.
        </p>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Can rules use regex?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes. Use syntax like <code>/pattern/i</code> in the third column.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is score objective?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              It is objective relative to your rubric definition, not universal quality truth.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is response data uploaded?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. Grading runs locally in your browser.
            </p>
          </details>
        </div>
      </div>
    </ToolLayout>
  );
}
