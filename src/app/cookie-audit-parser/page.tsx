"use client";

import { useMemo, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

type Severity = "low" | "medium" | "high";

interface CookieFinding {
  code: string;
  message: string;
  severity: Severity;
}

interface ParsedCookie {
  name: string;
  valuePreview: string;
  attributes: Record<string, string | true>;
  findings: CookieFinding[];
  sourceLine: string;
}

const SAMPLE_INPUT = `Set-Cookie: session_id=abc123; Path=/; HttpOnly; Secure; SameSite=Lax
Set-Cookie: analytics_id=u-2987; Path=/; SameSite=None
Set-Cookie: prefs=theme-dark; Path=/; Max-Age=31536000
tracking_id=ad-9981; csrftoken=xyz-token; locale=en`;

function normalizeAttributeKey(key: string) {
  return key.trim().toLowerCase();
}

function severityClass(severity: Severity) {
  if (severity === "high") return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300";
  if (severity === "medium") return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300";
  return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300";
}

function parseSetCookieLine(line: string): ParsedCookie | null {
  let normalized = line.trim();
  if (!normalized) return null;
  if (/^set-cookie:/i.test(normalized)) normalized = normalized.replace(/^set-cookie:\s*/i, "");

  const parts = normalized.split(";").map((part) => part.trim()).filter(Boolean);
  if (parts.length === 0) return null;

  const firstEq = parts[0].indexOf("=");
  if (firstEq <= 0) return null;
  const name = parts[0].slice(0, firstEq).trim();
  const value = parts[0].slice(firstEq + 1).trim();
  if (!name) return null;

  const attributes: Record<string, string | true> = {};
  for (const raw of parts.slice(1)) {
    const eqIdx = raw.indexOf("=");
    if (eqIdx === -1) {
      attributes[normalizeAttributeKey(raw)] = true;
    } else {
      const key = normalizeAttributeKey(raw.slice(0, eqIdx));
      const val = raw.slice(eqIdx + 1).trim();
      attributes[key] = val;
    }
  }

  const findings: CookieFinding[] = [];
  const secure = Boolean(attributes.secure);
  const httpOnly = Boolean(attributes.httponly);
  const sameSiteRaw = String(attributes.samesite || "").toLowerCase();
  const sameSite = sameSiteRaw === "lax" || sameSiteRaw === "strict" || sameSiteRaw === "none" ? sameSiteRaw : "";

  if (!secure) {
    findings.push({
      code: "missing-secure",
      message: "Missing Secure attribute. Cookie may be sent over non-HTTPS connections.",
      severity: "high",
    });
  }
  if (!httpOnly) {
    findings.push({
      code: "missing-httponly",
      message: "Missing HttpOnly. JavaScript can read this cookie.",
      severity: "medium",
    });
  }
  if (!sameSite) {
    findings.push({
      code: "missing-samesite",
      message: "SameSite not set. Consider Lax or Strict for CSRF risk reduction.",
      severity: "medium",
    });
  }
  if (sameSite === "none" && !secure) {
    findings.push({
      code: "none-without-secure",
      message: "SameSite=None without Secure is unsafe and often rejected by modern browsers.",
      severity: "high",
    });
  }
  if (!attributes.path) {
    findings.push({
      code: "missing-path",
      message: "Path is not explicitly set. Scope might be broader or ambiguous.",
      severity: "low",
    });
  }

  return {
    name,
    valuePreview: value.length > 12 ? `${value.slice(0, 12)}...` : value,
    attributes,
    findings,
    sourceLine: line,
  };
}

function parseCookieHeaderLine(line: string): ParsedCookie[] {
  const parts = line
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean);

  const cookies: ParsedCookie[] = [];
  for (const part of parts) {
    const eqIdx = part.indexOf("=");
    if (eqIdx <= 0) continue;
    const name = part.slice(0, eqIdx).trim();
    const value = part.slice(eqIdx + 1).trim();
    if (!name) continue;
    cookies.push({
      name,
      valuePreview: value.length > 12 ? `${value.slice(0, 12)}...` : value,
      attributes: {},
      sourceLine: line,
      findings: [
        {
          code: "header-no-flags",
          message: "Cookie header input does not include Secure/HttpOnly/SameSite attributes to audit.",
          severity: "low",
        },
      ],
    });
  }
  return cookies;
}

function parseAll(input: string) {
  const parsed: ParsedCookie[] = [];
  const lines = input.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  let invalidLines = 0;

  for (const line of lines) {
    const looksLikeSetCookie = /^set-cookie:/i.test(line) || /;\s*(secure|httponly|samesite|max-age|expires|path|domain)\b/i.test(line);
    if (looksLikeSetCookie) {
      const cookie = parseSetCookieLine(line);
      if (cookie) parsed.push(cookie);
      else invalidLines += 1;
      continue;
    }

    const headerCookies = parseCookieHeaderLine(line);
    if (headerCookies.length > 0) parsed.push(...headerCookies);
    else invalidLines += 1;
  }

  const allFindings = parsed.flatMap((cookie) => cookie.findings);
  return {
    cookies: parsed,
    invalidLines,
    counts: {
      high: allFindings.filter((f) => f.severity === "high").length,
      medium: allFindings.filter((f) => f.severity === "medium").length,
      low: allFindings.filter((f) => f.severity === "low").length,
    },
  };
}

function tryReadBrowserCookies() {
  if (typeof document === "undefined") return "";
  return document.cookie || "";
}

export default function CookieAuditParserPage() {
  const [input, setInput] = useState("");

  const result = useMemo(() => parseAll(input), [input]);
  const summary = useMemo(
    () =>
      [
        "Cookie Audit Summary",
        `Parsed cookies: ${result.cookies.length}`,
        `Invalid lines: ${result.invalidLines}`,
        `Findings - High: ${result.counts.high}, Medium: ${result.counts.medium}, Low: ${result.counts.low}`,
      ].join("\n"),
    [result]
  );

  return (
    <ToolLayout
      title="Cookie Audit Parser"
      description="Parse Set-Cookie or Cookie header lines and audit security flags like Secure, HttpOnly, and SameSite."
      relatedTools={["browser-permissions-auditor", "prompt-security-scanner", "url-tracker-cleaner"]}
    >
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          onClick={() => setInput(SAMPLE_INPUT)}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Load sample
        </button>
        <button
          onClick={() => setInput(tryReadBrowserCookies())}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Load browser cookies
        </button>
        <button
          onClick={() => setInput("")}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Clear
        </button>
        <CopyButton text={summary} />
      </div>

      <textarea
        value={input}
        onChange={(event) => setInput(event.target.value)}
        rows={10}
        placeholder="Paste Set-Cookie headers or Cookie header lines..."
        className="mb-4 w-full rounded-lg border border-gray-300 bg-white p-3 font-mono text-sm dark:border-gray-600 dark:bg-gray-900"
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-4">
        <StatCard label="Cookies Parsed" value={String(result.cookies.length)} />
        <StatCard label="High Findings" value={String(result.counts.high)} />
        <StatCard label="Medium Findings" value={String(result.counts.medium)} />
        <StatCard label="Low Findings" value={String(result.counts.low)} />
      </div>

      {result.invalidLines > 0 && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300">
          {result.invalidLines} line(s) could not be parsed.
        </div>
      )}

      <div className="rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300">
          Parsed Cookies
        </div>
        <div className="max-h-[560px] overflow-auto">
          {result.cookies.length === 0 ? (
            <p className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">No cookies parsed yet.</p>
          ) : (
            result.cookies.map((cookie, index) => (
              <div key={`${cookie.name}-${index}`} className="border-b border-gray-100 px-3 py-3 dark:border-gray-800">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded bg-gray-100 px-2 py-0.5 font-mono text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    {cookie.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">value: {cookie.valuePreview || "(empty)"}</span>
                </div>
                <div className="mb-2 flex flex-wrap gap-2">
                  {Object.keys(cookie.attributes).length === 0 ? (
                    <span className="text-xs text-gray-400 dark:text-gray-500">No attributes parsed</span>
                  ) : (
                    Object.entries(cookie.attributes).map(([key, value]) => (
                      <span key={key} className="rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                        {key}
                        {value === true ? "" : `=${String(value)}`}
                      </span>
                    ))
                  )}
                </div>
                <div className="space-y-1">
                  {cookie.findings.map((finding, fIdx) => (
                    <div key={`${finding.code}-${fIdx}`} className="flex items-start gap-2 text-xs">
                      <span className={`mt-0.5 rounded-full px-2 py-0.5 font-medium ${severityClass(finding.severity)}`}>{finding.severity}</span>
                      <span className="text-gray-600 dark:text-gray-400">{finding.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-12 space-y-6 border-t border-gray-200 pt-8 text-sm leading-relaxed text-gray-600 dark:border-gray-700 dark:text-gray-400">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
        <p>
          Cookie Audit Parser helps inspect cookie security posture quickly. It parses raw cookie header text and flags
          risky combinations such as missing Secure/HttpOnly or SameSite=None without Secure.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Can it audit cookie headers copied from DevTools?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes. Paste Set-Cookie lines directly, one per line.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Why are Cookie header lines less detailed?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Cookie request headers only contain name/value pairs, not security attributes.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is any cookie data uploaded?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. Parsing and analysis run locally in your browser.
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
