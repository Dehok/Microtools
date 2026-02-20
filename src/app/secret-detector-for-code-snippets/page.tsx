"use client";

import { useMemo, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

type Severity = "high" | "medium" | "low";

interface PatternDef {
  id: string;
  name: string;
  severity: Severity;
  regex: RegExp;
  recommendation: string;
}

interface Finding {
  id: string;
  name: string;
  severity: Severity;
  line: number;
  column: number;
  start: number;
  end: number;
  value: string;
  recommendation: string;
}

const SAMPLE_SNIPPET = `const OPENAI_API_KEY = "sk-proj-abc123def456ghi789jkl012mno345pqr678";
const AWS_ACCESS_KEY_ID = "AKIA1234567890ABCDEF";
const dbUrl = "postgres://admin:myHardcodedPass123@db.example.com:5432/app";
const githubToken = "ghp_1234567890abcdefghijklmnopqrstuvwxyzABCD";
const jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZGVtbyIsInJvbGUiOiJhZG1pbiJ9.signature1234567890";
-----BEGIN PRIVATE KEY-----
MIICeAIBADANBgkqhkiG9w0BAQEFAASCAmIwggJeAgEAAoGBAMockExampleOnly
-----END PRIVATE KEY-----`;

const PATTERNS: PatternDef[] = [
  {
    id: "openai-key",
    name: "OpenAI-style API key",
    severity: "high",
    regex: /\bsk-(?:proj-|live-|test-)?[A-Za-z0-9_-]{20,}\b/g,
    recommendation: "Move key to environment variables and rotate exposed credentials immediately.",
  },
  {
    id: "aws-access-key",
    name: "AWS Access Key ID",
    severity: "high",
    regex: /\bAKIA[0-9A-Z]{16}\b/g,
    recommendation: "Revoke and rotate AWS key, then remove hardcoded value from source files.",
  },
  {
    id: "github-token",
    name: "GitHub personal token",
    severity: "high",
    regex: /\bgh[pousr]_[A-Za-z0-9]{30,}\b/g,
    recommendation: "Revoke token in GitHub settings and use scoped short-lived tokens where possible.",
  },
  {
    id: "private-key-block",
    name: "Private key block",
    severity: "high",
    regex: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g,
    recommendation: "Treat as compromised key material and rotate immediately.",
  },
  {
    id: "db-credential-url",
    name: "Credentialed database URL",
    severity: "high",
    regex: /\b(?:postgres|mysql|mongodb(?:\+srv)?):\/\/[^:\s]+:[^@\s]+@[^/\s]+/gi,
    recommendation: "Store DB credentials in secret manager and avoid embedding in code.",
  },
  {
    id: "slack-token",
    name: "Slack token",
    severity: "high",
    regex: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/g,
    recommendation: "Revoke leaked Slack token and reissue with minimum required scopes.",
  },
  {
    id: "jwt-token",
    name: "JWT-like token",
    severity: "medium",
    regex: /\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b/g,
    recommendation: "Avoid committing JWTs. Use short lifetimes and rotate signing secrets if exposed.",
  },
  {
    id: "generic-api-assignment",
    name: "Generic API key assignment",
    severity: "medium",
    regex: /\b(?:api[_-]?key|secret|token)\b\s*[:=]\s*["'][A-Za-z0-9/_+=-]{16,}["']/gi,
    recommendation: "Move secret-looking assignments to secure env configuration.",
  },
  {
    id: "password-assignment",
    name: "Hardcoded password assignment",
    severity: "medium",
    regex: /\b(?:password|passwd|pwd)\b\s*[:=]\s*["'][^"'\n]{8,}["']/gi,
    recommendation: "Replace hardcoded passwords with vault-backed runtime injection.",
  },
  {
    id: "bearer-token",
    name: "Bearer token literal",
    severity: "low",
    regex: /\bBearer\s+[A-Za-z0-9._~-]{20,}\b/g,
    recommendation: "Do not persist bearer tokens in code or logs.",
  },
];

function getLineColumn(text: string, index: number) {
  let line = 1;
  let column = 1;
  for (let i = 0; i < index; i += 1) {
    if (text[i] === "\n") {
      line += 1;
      column = 1;
    } else {
      column += 1;
    }
  }
  return { line, column };
}

function maskSecret(value: string) {
  const trimmed = value.trim();
  if (trimmed.length <= 8) return "*".repeat(trimmed.length);
  const start = trimmed.slice(0, 4);
  const end = trimmed.slice(-4);
  return `${start}${"*".repeat(Math.max(4, trimmed.length - 8))}${end}`;
}

function detectFindings(source: string, enabled: Record<Severity, boolean>) {
  const findings: Finding[] = [];
  for (const pattern of PATTERNS) {
    if (!enabled[pattern.severity]) continue;
    const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
    let match: RegExpExecArray | null;
    while ((match = regex.exec(source)) !== null) {
      const value = match[0];
      const start = match.index;
      const end = start + value.length;
      const pos = getLineColumn(source, start);
      findings.push({
        id: pattern.id,
        name: pattern.name,
        severity: pattern.severity,
        line: pos.line,
        column: pos.column,
        start,
        end,
        value,
        recommendation: pattern.recommendation,
      });

      if (match.index === regex.lastIndex) {
        regex.lastIndex += 1;
      }
    }
  }

  return findings.sort((a, b) => a.start - b.start);
}

function buildRedactedText(source: string, findings: Finding[]) {
  if (findings.length === 0) return source;
  let output = source;
  const sorted = [...findings].sort((a, b) => b.start - a.start);
  for (const finding of sorted) {
    output =
      output.slice(0, finding.start) +
      `[REDACTED:${finding.id}]` +
      output.slice(finding.end);
  }
  return output;
}

export default function SecretDetectorForCodeSnippetsPage() {
  const [source, setSource] = useState("");
  const [enabled, setEnabled] = useState<Record<Severity, boolean>>({
    high: true,
    medium: true,
    low: true,
  });

  const findings = useMemo(() => detectFindings(source, enabled), [enabled, source]);

  const stats = useMemo(() => {
    const counts = { high: 0, medium: 0, low: 0 };
    for (const finding of findings) counts[finding.severity] += 1;
    return counts;
  }, [findings]);

  const redacted = useMemo(() => buildRedactedText(source, findings), [findings, source]);

  const report = useMemo(
    () =>
      [
        "Secret Detector Report",
        `Total findings: ${findings.length}`,
        `High: ${stats.high}`,
        `Medium: ${stats.medium}`,
        `Low: ${stats.low}`,
      ].join("\n"),
    [findings.length, stats.high, stats.low, stats.medium]
  );

  return (
    <ToolLayout
      title="Secret Detector for Code Snippets"
      description="Scan code snippets for leaked keys, tokens, private keys, and credential-like literals before sharing."
      relatedTools={["prompt-security-scanner", "pii-redactor", "json-output-guard"]}
    >
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          onClick={() => setSource(SAMPLE_SNIPPET)}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Load sample
        </button>
        <button
          onClick={() => setSource("")}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Clear
        </button>
        <CopyButton text={report} />
      </div>

      <div className="mb-4 grid gap-3 md:grid-cols-3">
        <label className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={enabled.high}
            onChange={(event) => setEnabled((prev) => ({ ...prev, high: event.target.checked }))}
            className="accent-red-600"
          />
          Include high severity
        </label>
        <label className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={enabled.medium}
            onChange={(event) => setEnabled((prev) => ({ ...prev, medium: event.target.checked }))}
            className="accent-amber-600"
          />
          Include medium severity
        </label>
        <label className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={enabled.low}
            onChange={(event) => setEnabled((prev) => ({ ...prev, low: event.target.checked }))}
            className="accent-blue-600"
          />
          Include low severity
        </label>
      </div>

      <textarea
        value={source}
        onChange={(event) => setSource(event.target.value)}
        rows={12}
        placeholder="Paste code snippet, env file, log excerpt, or config here..."
        className="mb-4 w-full rounded-lg border border-gray-300 bg-white p-3 font-mono text-sm dark:border-gray-600 dark:bg-gray-900"
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-4">
        <StatCard label="Total Findings" value={String(findings.length)} />
        <StatCard label="High" value={String(stats.high)} />
        <StatCard label="Medium" value={String(stats.medium)} />
        <StatCard label="Low" value={String(stats.low)} />
      </div>

      <div className="mb-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300">
          Detection results
        </div>
        <div className="max-h-[380px] overflow-auto">
          {findings.length === 0 ? (
            <p className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
              No matches found for enabled patterns.
            </p>
          ) : (
            findings.map((finding, index) => (
              <div key={`${finding.id}-${index}`} className="border-b border-gray-100 px-3 py-3 text-sm dark:border-gray-800">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      finding.severity === "high"
                        ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                        : finding.severity === "medium"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                    }`}
                  >
                    {finding.severity}
                  </span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{finding.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    line {finding.line}, col {finding.column}
                  </span>
                </div>
                <p className="mb-1 font-mono text-xs text-gray-700 dark:text-gray-300">
                  {maskSecret(finding.value)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{finding.recommendation}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Redacted snippet</p>
            <CopyButton text={redacted} />
          </div>
          <textarea
            value={redacted}
            onChange={() => {}}
            rows={10}
            readOnly
            className="w-full rounded-lg border border-gray-300 bg-white p-3 font-mono text-xs dark:border-gray-600 dark:bg-gray-900"
          />
        </div>
        <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Findings JSON</p>
            <CopyButton text={JSON.stringify(findings, null, 2)} />
          </div>
          <textarea
            value={JSON.stringify(findings, null, 2)}
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
          Secret Detector scans snippets for common credential patterns before sharing code in tickets, chats, or
          prompts. Detection and redaction run locally in your browser.
        </p>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is detection guaranteed?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. Pattern-based detection catches common leaks but can miss obfuscated secrets.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Why can false positives appear?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Some high-entropy strings resemble secrets. Always review results before removing data.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is snippet content uploaded?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. Source text stays local and never leaves your browser.
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
