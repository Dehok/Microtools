"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface EnvLine {
  line: number;
  raw: string;
  key: string;
  value: string;
  type: "variable" | "comment" | "empty" | "invalid";
  issues: string[];
}

const EXAMPLE_ENV = `# Database configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=myapp
DB_USER=admin
DB_PASSWORD=secret123

# API keys
API_KEY=sk_live_abc123def456
API_SECRET=

# Duplicate key example
DB_HOST=127.0.0.1

# Invalid lines
this has no equals sign
SPACES IN KEY=bad
GOOD_KEY=value with spaces
MISSING_QUOTES=hello world

# App settings
NODE_ENV=production
PORT=3000
DEBUG=false`;

function parseEnvLines(input: string): EnvLine[] {
  return input.split("\n").map((raw, idx) => {
    const trimmed = raw.trim();
    if (!trimmed) return { line: idx + 1, raw, key: "", value: "", type: "empty" as const, issues: [] };
    if (trimmed.startsWith("#")) return { line: idx + 1, raw, key: "", value: "", type: "comment" as const, issues: [] };

    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) return { line: idx + 1, raw, key: "", value: "", type: "invalid" as const, issues: ["Missing '=' sign"] };

    const key = trimmed.slice(0, eqIdx).trim();
    let value = trimmed.slice(eqIdx + 1);
    const issues: string[] = [];

    if (/\s/.test(key)) issues.push("Key contains spaces");
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) issues.push("Invalid key format (use UPPER_SNAKE_CASE)");
    if (!value) issues.push("Empty value");
    if (value.includes(" ") && !value.startsWith('"') && !value.startsWith("'")) {
      issues.push("Value with spaces should be quoted");
    }
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    return { line: idx + 1, raw, key, value, type: "variable" as const, issues };
  });
}

export default function EnvEditorPage() {
  const [input, setInput] = useState("");

  const parsed = useMemo(() => {
    if (!input.trim()) return { lines: [] as EnvLine[], duplicates: [] as string[], stats: { vars: 0, comments: 0, empty: 0, invalid: 0, issues: 0 } };
    const lines = parseEnvLines(input);
    const keyCounts: Record<string, number[]> = {};
    for (const l of lines) {
      if (l.type === "variable" && l.key) {
        if (!keyCounts[l.key]) keyCounts[l.key] = [];
        keyCounts[l.key].push(l.line);
      }
    }
    const duplicates: string[] = [];
    for (const [key, occurrences] of Object.entries(keyCounts)) {
      if (occurrences.length > 1) {
        duplicates.push(key);
        for (const l of lines) {
          if (l.key === key) l.issues.push(`Duplicate key (lines: ${occurrences.join(", ")})`);
        }
      }
    }
    const vars = lines.filter((l) => l.type === "variable").length;
    const comments = lines.filter((l) => l.type === "comment").length;
    const empty = lines.filter((l) => l.type === "empty").length;
    const invalid = lines.filter((l) => l.type === "invalid").length;
    const issues = lines.reduce((sum, l) => sum + l.issues.length, 0);
    return { lines, duplicates, stats: { vars, comments, empty, invalid, issues } };
  }, [input]);

  const sortAlpha = () => {
    const lines = input.split("\n");
    const vars: { key: string; line: string }[] = [];
    const other: string[] = [];
    for (const line of lines) {
      const trimmed = line.trim();
      const eqIdx = trimmed.indexOf("=");
      if (trimmed && !trimmed.startsWith("#") && eqIdx !== -1) {
        vars.push({ key: trimmed.slice(0, eqIdx).trim(), line });
      } else {
        other.push(line);
      }
    }
    vars.sort((a, b) => a.key.localeCompare(b.key));
    const result = other.filter((l) => l.trim()).join("\n") + (other.some((l) => l.trim()) ? "\n\n" : "") + vars.map((v) => v.line).join("\n");
    setInput(result.trim());
  };

  const removeDuplicates = () => {
    const seen = new Set<string>();
    const lines = input.split("\n");
    const result: string[] = [];
    for (let i = lines.length - 1; i >= 0; i--) {
      const trimmed = lines[i].trim();
      const eqIdx = trimmed.indexOf("=");
      if (trimmed && !trimmed.startsWith("#") && eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        if (seen.has(key)) continue;
        seen.add(key);
      }
      result.unshift(lines[i]);
    }
    setInput(result.join("\n"));
  };

  const removeComments = () => {
    setInput(input.split("\n").filter((l) => !l.trim().startsWith("#")).join("\n"));
  };

  const removeEmptyLines = () => {
    setInput(input.split("\n").filter((l) => l.trim()).join("\n"));
  };

  const quoteAllValues = () => {
    setInput(
      input.split("\n").map((line) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) return line;
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx === -1) return line;
        const key = trimmed.slice(0, eqIdx);
        let val = trimmed.slice(eqIdx + 1);
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) return line;
        return `${key}="${val}"`;
      }).join("\n")
    );
  };

  return (
    <ToolLayout
      title=".env Editor & Validator"
      description="Edit and validate .env files. Check for duplicates, empty values, and syntax errors."
      relatedTools={["json-formatter", "yaml-validator", "nginx-config-generator"]}
    >
      {/* Buttons */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button onClick={() => setInput(EXAMPLE_ENV)} className="rounded-lg bg-gray-100 dark:bg-gray-800 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:bg-gray-700">Load Example</button>
        <button onClick={sortAlpha} className="rounded-lg bg-blue-50 dark:bg-blue-950 px-3 py-1.5 text-sm text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:bg-blue-900">Sort A-Z</button>
        <button onClick={removeDuplicates} className="rounded-lg bg-blue-50 dark:bg-blue-950 px-3 py-1.5 text-sm text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:bg-blue-900">Remove Duplicates</button>
        <button onClick={removeComments} className="rounded-lg bg-blue-50 dark:bg-blue-950 px-3 py-1.5 text-sm text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:bg-blue-900">Remove Comments</button>
        <button onClick={removeEmptyLines} className="rounded-lg bg-blue-50 dark:bg-blue-950 px-3 py-1.5 text-sm text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:bg-blue-900">Remove Empty Lines</button>
        <button onClick={quoteAllValues} className="rounded-lg bg-blue-50 dark:bg-blue-950 px-3 py-1.5 text-sm text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:bg-blue-900">Quote All Values</button>
        <button onClick={() => setInput("")} className="rounded-lg bg-gray-100 dark:bg-gray-800 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:bg-gray-700">Clear</button>
      </div>

      {/* Editor */}
      <div className="mb-4">
        <div className="mb-1 flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">.env Content</label>
          {input && <CopyButton text={input} />}
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your .env file content here..."
          className="h-64 w-full rounded-lg border border-gray-300 dark:border-gray-600 p-3 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          spellCheck={false}
        />
      </div>

      {/* Stats */}
      {input.trim() && (
        <>
          <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
            <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-3 text-center">
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{parsed.stats.vars}</div>
              <div className="text-xs text-blue-600 dark:text-blue-400">Variables</div>
            </div>
            <div className="rounded-lg bg-gray-50 dark:bg-gray-950 p-3 text-center">
              <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">{parsed.stats.comments}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Comments</div>
            </div>
            <div className="rounded-lg bg-gray-50 dark:bg-gray-950 p-3 text-center">
              <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">{parsed.stats.empty}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Empty Lines</div>
            </div>
            <div className="rounded-lg bg-red-50 dark:bg-red-950 p-3 text-center">
              <div className="text-2xl font-bold text-red-700 dark:text-red-300">{parsed.stats.invalid}</div>
              <div className="text-xs text-red-600 dark:text-red-400">Invalid Lines</div>
            </div>
            <div className={`rounded-lg p-3 text-center ${parsed.stats.issues > 0 ? "bg-yellow-50 dark:bg-yellow-950" : "bg-green-50 dark:bg-green-950"}`}>
              <div className={`text-2xl font-bold ${parsed.stats.issues > 0 ? "text-yellow-700 dark:text-yellow-300" : "text-green-700 dark:text-green-300"}`}>{parsed.stats.issues}</div>
              <div className={`text-xs ${parsed.stats.issues > 0 ? "text-yellow-600 dark:text-yellow-400" : "text-green-600 dark:text-green-400"}`}>Issues</div>
            </div>
          </div>

          {/* Results Table */}
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950">
                  <th className="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300">Line</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300">Key</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300">Value</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {parsed.lines.filter((l) => l.type !== "empty").map((l) => (
                  <tr key={l.line} className={`border-b border-gray-100 dark:border-gray-800 ${l.issues.length > 0 ? "bg-yellow-50 dark:bg-yellow-950" : l.type === "invalid" ? "bg-red-50 dark:bg-red-950" : l.type === "comment" ? "bg-gray-50 dark:bg-gray-950" : ""}`}>
                    <td className="px-3 py-1.5 font-mono text-xs text-gray-500 dark:text-gray-400">{l.line}</td>
                    <td className="px-3 py-1.5 font-mono text-xs">
                      {l.type === "comment" ? <span className="text-gray-400 dark:text-gray-500">{l.raw.trim()}</span> : l.type === "invalid" ? <span className="text-red-500 dark:text-red-400">{l.raw.trim()}</span> : l.key}
                    </td>
                    <td className="max-w-[200px] truncate px-3 py-1.5 font-mono text-xs text-gray-600 dark:text-gray-400">{l.value}</td>
                    <td className="px-3 py-1.5 text-xs">
                      {l.type === "comment" && <span className="text-gray-400 dark:text-gray-500">Comment</span>}
                      {l.type === "invalid" && <span className="text-red-600 dark:text-red-400">Invalid</span>}
                      {l.type === "variable" && l.issues.length === 0 && <span className="text-green-600 dark:text-green-400">✓ Valid</span>}
                      {l.issues.length > 0 && (
                        <div className="space-y-0.5">
                          {l.issues.map((issue, i) => (
                            <div key={i} className="text-yellow-600 dark:text-yellow-400">⚠ {issue}</div>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The .env Editor &amp; Validator is a free online tool available on CodeUtilo. Edit and validate .env files. Check for duplicates, empty values, and syntax errors. All processing happens directly in your browser — no data is ever sent to any server, ensuring your privacy and security. No signup or installation is required.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> — All .env editor &amp; validator operations run locally in your browser using JavaScript. Your data never leaves your device.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Instant Results</strong> — Get results immediately as you type or paste your input. No waiting for server responses or page reloads.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> — Use the .env editor &amp; validator as many times as you need without creating an account or paying anything.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Mobile Friendly</strong> — Works on desktop, tablet, and mobile browsers. Access this tool from any device with an internet connection.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Using the .env editor &amp; validator for day-to-day development tasks</li>
          <li>Saving time on repetitive tasks by using a browser-based tool instead of writing custom code</li>
          <li>Working on projects where installing software is not an option (school, work, shared computers)</li>
          <li>Quick prototyping and debugging without switching to a terminal or IDE</li>
          <li>Sharing the tool link with colleagues who need the same functionality</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Enter your input in the text area provided and the .env editor &amp; validator will process it instantly. Use the Copy button to copy the result to your clipboard. All operations are performed locally in your browser — no data is transmitted to any server.
        </p>
      </div>
    </ToolLayout>
  );
}
