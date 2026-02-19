"use client";

import { useMemo, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

type Severity = "error" | "warning";

interface LineIssue {
  line: number;
  severity: Severity;
  message: string;
}

interface ParsedLine {
  line: number;
  raw: string;
  object: Record<string, unknown> | null;
}

const SAMPLE_JSONL = [
  '{"custom_id":"req_001","method":"POST","url":"/v1/responses","body":{"model":"gpt-4.1-mini","input":"Summarize this: browser privacy matters."}}',
  '{"custom_id":"req_002","method":"POST","url":"/v1/responses","body":{"model":"gpt-4.1-mini","input":[{"role":"user","content":"List 3 title ideas for a privacy-first tool site."}]}}',
  '{"custom_id":"req_002","method":"POST","url":"/v1/responses","body":{"model":"gpt-4.1-mini","input":"This line intentionally duplicates custom_id."}}',
].join("\n");

function parseLines(input: string): ParsedLine[] {
  return input.split(/\r?\n/).map((raw, index) => {
    const line = index + 1;
    const trimmed = raw.trim();
    if (!trimmed) return { line, raw, object: null };
    try {
      const value = JSON.parse(trimmed);
      if (!value || typeof value !== "object" || Array.isArray(value)) {
        return { line, raw, object: null };
      }
      return { line, raw, object: value as Record<string, unknown> };
    } catch {
      return { line, raw, object: null };
    }
  });
}

function hasOwnKey(record: Record<string, unknown>, key: string) {
  return Object.prototype.hasOwnProperty.call(record, key);
}

function validateLine(entry: ParsedLine): LineIssue[] {
  const issues: LineIssue[] = [];
  const trimmed = entry.raw.trim();
  if (!trimmed) return issues;

  if (!entry.object) {
    issues.push({ line: entry.line, severity: "error", message: "Invalid JSON object on this line." });
    return issues;
  }

  const row = entry.object;

  if (!hasOwnKey(row, "custom_id")) {
    issues.push({ line: entry.line, severity: "error", message: "Missing required field: custom_id." });
  } else if (typeof row.custom_id !== "string" || !row.custom_id.trim()) {
    issues.push({ line: entry.line, severity: "error", message: "custom_id must be a non-empty string." });
  }

  if (!hasOwnKey(row, "method")) {
    issues.push({ line: entry.line, severity: "error", message: "Missing required field: method." });
  } else if (typeof row.method !== "string") {
    issues.push({ line: entry.line, severity: "error", message: "method must be a string." });
  } else if (row.method.toUpperCase() !== "POST") {
    issues.push({
      line: entry.line,
      severity: "warning",
      message: "method is not POST. Batch requests usually use POST.",
    });
  }

  if (!hasOwnKey(row, "url")) {
    issues.push({ line: entry.line, severity: "error", message: "Missing required field: url." });
  } else if (typeof row.url !== "string") {
    issues.push({ line: entry.line, severity: "error", message: "url must be a string." });
  } else if (!row.url.startsWith("/v1/")) {
    issues.push({
      line: entry.line,
      severity: "warning",
      message: "url does not start with /v1/. Verify endpoint path.",
    });
  }

  if (!hasOwnKey(row, "body")) {
    issues.push({ line: entry.line, severity: "error", message: "Missing required field: body." });
  } else if (!row.body || typeof row.body !== "object" || Array.isArray(row.body)) {
    issues.push({ line: entry.line, severity: "error", message: "body must be a JSON object." });
  } else {
    const body = row.body as Record<string, unknown>;
    if (!hasOwnKey(body, "model") || typeof body.model !== "string" || !body.model.trim()) {
      issues.push({
        line: entry.line,
        severity: "warning",
        message: "body.model is missing or invalid.",
      });
    }
  }

  return issues;
}

export default function OpenAiBatchJsonlValidatorPage() {
  const [input, setInput] = useState("");

  const analysis = useMemo(() => {
    const parsed = parseLines(input);
    const nonEmpty = parsed.filter((line) => line.raw.trim().length > 0);
    const issues: LineIssue[] = [];

    for (const line of nonEmpty) {
      issues.push(...validateLine(line));
    }

    const idLines = new Map<string, number[]>();
    for (const line of nonEmpty) {
      const object = line.object;
      if (!object || typeof object.custom_id !== "string" || !object.custom_id.trim()) continue;
      const id = object.custom_id.trim();
      const hits = idLines.get(id) ?? [];
      hits.push(line.line);
      idLines.set(id, hits);
    }

    for (const [id, lines] of idLines.entries()) {
      if (lines.length > 1) {
        for (const line of lines) {
          issues.push({
            line,
            severity: "error",
            message: `Duplicate custom_id "${id}" found on lines ${lines.join(", ")}.`,
          });
        }
      }
    }

    const errors = issues.filter((issue) => issue.severity === "error").length;
    const warnings = issues.filter((issue) => issue.severity === "warning").length;

    const linesWithErrors = new Set(
      issues.filter((issue) => issue.severity === "error").map((issue) => issue.line)
    );
    const validLines = nonEmpty.filter((line) => !linesWithErrors.has(line.line));

    return {
      parsed,
      nonEmptyCount: nonEmpty.length,
      validCount: validLines.length,
      issues,
      errors,
      warnings,
      validJsonl: validLines.map((line) => line.raw.trim()).join("\n"),
    };
  }, [input]);

  const summaryText = [
    `Non-empty lines: ${analysis.nonEmptyCount}`,
    `Valid lines: ${analysis.validCount}`,
    `Errors: ${analysis.errors}`,
    `Warnings: ${analysis.warnings}`,
    ...analysis.issues.map((issue) => `Line ${issue.line} [${issue.severity}]: ${issue.message}`),
  ].join("\n");

  const downloadValidJsonl = () => {
    if (!analysis.validJsonl.trim()) return;
    const blob = new Blob([analysis.validJsonl], { type: "application/jsonl" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "batch-input-valid.jsonl";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout
      title="OpenAI Batch JSONL Validator"
      description="Validate Batch API JSONL input locally: parse checks, required fields, and duplicate custom_id detection."
      relatedTools={["json-formatter", "json-schema-validator", "token-counter"]}
    >
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          onClick={() => setInput(SAMPLE_JSONL)}
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

      <div className="mb-4">
        <div className="mb-1 flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">JSONL input</label>
          {summaryText && <CopyButton text={summaryText} />}
        </div>
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder='Paste one JSON object per line, e.g. {"custom_id":"req_001","method":"POST","url":"/v1/responses","body":{...}}'
          rows={14}
          className="w-full rounded-lg border border-gray-300 bg-white p-3 font-mono text-sm dark:border-gray-600 dark:bg-gray-900"
          spellCheck={false}
        />
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-gray-200 p-3 text-center dark:border-gray-700">
          <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{analysis.nonEmptyCount}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Non-empty lines</div>
        </div>
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-center dark:border-green-900 dark:bg-green-950">
          <div className="text-xl font-bold text-green-700 dark:text-green-300">{analysis.validCount}</div>
          <div className="text-xs text-green-700 dark:text-green-300">Valid lines</div>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-center dark:border-red-900 dark:bg-red-950">
          <div className="text-xl font-bold text-red-700 dark:text-red-300">{analysis.errors}</div>
          <div className="text-xs text-red-700 dark:text-red-300">Errors</div>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-center dark:border-amber-900 dark:bg-amber-950">
          <div className="text-xl font-bold text-amber-700 dark:text-amber-300">{analysis.warnings}</div>
          <div className="text-xs text-amber-700 dark:text-amber-300">Warnings</div>
        </div>
      </div>

      {analysis.issues.length > 0 ? (
        <div className="mb-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="border-b border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300">
            Validation issues
          </div>
          <div className="max-h-72 overflow-auto">
            {analysis.issues.map((issue, index) => (
              <div
                key={`${issue.line}-${index}`}
                className={`border-b border-gray-100 px-3 py-2 text-sm dark:border-gray-800 ${
                  issue.severity === "error"
                    ? "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                    : "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                }`}
              >
                Line {issue.line}: {issue.message}
              </div>
            ))}
          </div>
        </div>
      ) : (
        input.trim() && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300">
            No issues found. Your JSONL looks valid for Batch input.
          </div>
        )
      )}

      <div className="flex flex-wrap gap-2">
        <button
          onClick={downloadValidJsonl}
          disabled={!analysis.validJsonl.trim()}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Download valid JSONL
        </button>
        <CopyButton text={analysis.validJsonl || ""} />
      </div>

      <div className="mt-12 space-y-6 border-t border-gray-200 pt-8 text-sm leading-relaxed text-gray-600 dark:border-gray-700 dark:text-gray-400">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
        <p>
          This validator checks JSONL lines for common OpenAI Batch API input requirements. It runs entirely in your
          browser, highlights parse and schema issues, and helps you export only valid lines.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Does this guarantee the API will accept my file?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. It is a fast local validator for common errors. Final validation is still done by the API.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is my batch input uploaded?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. All parsing and validation happen locally in your browser.
            </p>
          </details>
        </div>
      </div>
    </ToolLayout>
  );
}
