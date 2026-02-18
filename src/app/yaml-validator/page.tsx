"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

// ── YAML Parser with error reporting ──────────────────────────────

interface ParseResult {
  value: unknown;
  nextIdx: number;
}

function parseYaml(yaml: string): unknown {
  // Remove BOM if present
  const cleaned = yaml.replace(/^\uFEFF/, "");
  const rawLines = cleaned.split("\n");

  // Strip full-line comments and track original line numbers
  const lines: string[] = [];
  const lineMap: number[] = []; // maps processed index → original 1-based line number
  for (let i = 0; i < rawLines.length; i++) {
    const trimmed = rawLines[i].trim();
    if (trimmed.startsWith("#") || trimmed === "") {
      // keep blank lines for structure but skip pure comment lines
      if (trimmed === "") {
        lines.push("");
        lineMap.push(i + 1);
      }
      continue;
    }
    // Strip inline comments (not inside quotes)
    const stripped = stripInlineComment(rawLines[i]);
    lines.push(stripped);
    lineMap.push(i + 1);
  }

  if (lines.every((l) => l.trim() === "")) return null;

  const result = parseYamlLines(lines, lineMap, 0, 0);
  return result.value;
}

function stripInlineComment(line: string): string {
  let inSingle = false;
  let inDouble = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === "'" && !inDouble) inSingle = !inSingle;
    else if (ch === '"' && !inSingle) inDouble = !inDouble;
    else if (ch === "#" && !inSingle && !inDouble && i > 0 && line[i - 1] === " ") {
      return line.slice(0, i).trimEnd();
    }
  }
  return line;
}

function parseYamlLines(
  lines: string[],
  lineMap: number[],
  startIdx: number,
  baseIndent: number
): ParseResult {
  if (startIdx >= lines.length) return { value: null, nextIdx: startIdx };

  // Skip blank lines
  let si = startIdx;
  while (si < lines.length && lines[si].trim() === "") si++;
  if (si >= lines.length) return { value: null, nextIdx: si };

  const firstLine = lines[si];
  const trimmed = firstLine.trim();
  const firstIndent = firstLine.length - firstLine.trimStart().length;

  // Multi-line literal block scalar (|)
  if (trimmed === "|" || trimmed === "|+" || trimmed === "|-") {
    return parseBlockScalar(lines, lineMap, si, "literal", trimmed);
  }

  // Multi-line folded block scalar (>)
  if (trimmed === ">" || trimmed === ">+" || trimmed === ">-") {
    return parseBlockScalar(lines, lineMap, si, "folded", trimmed);
  }

  // Array at current level
  if (trimmed.startsWith("- ") || trimmed === "-") {
    const arr: unknown[] = [];
    let idx = si;
    while (idx < lines.length) {
      const line = lines[idx];
      if (line.trim() === "") { idx++; continue; }
      const indent = line.length - line.trimStart().length;
      if (indent < baseIndent) break;
      if (indent !== baseIndent) {
        // Could be continuation of a nested structure - skip
        idx++;
        continue;
      }
      const lt = line.trim();
      if (!lt.startsWith("- ") && lt !== "-") break;

      if (lt === "-") {
        // Nested block under array item
        const nextIdx = idx + 1;
        if (nextIdx < lines.length && lines[nextIdx].trim()) {
          const nextIndent = lines[nextIdx].length - lines[nextIdx].trimStart().length;
          if (nextIndent > baseIndent) {
            const result = parseYamlLines(lines, lineMap, nextIdx, nextIndent);
            arr.push(result.value);
            idx = result.nextIdx;
          } else {
            arr.push(null);
            idx++;
          }
        } else {
          arr.push(null);
          idx++;
        }
      } else {
        const afterDash = lt.slice(2);
        // Check if the array item contains a key: value (nested object inline)
        const colonMatch = afterDash.match(/^([^:]+):\s*(.*)/);
        if (colonMatch && !afterDash.startsWith('"') && !afterDash.startsWith("'")) {
          // It's an inline object start, reconstruct as nested
          const itemIndent = baseIndent + 2;
          const reconstructed = " ".repeat(itemIndent) + afterDash;
          const tempLines = [reconstructed];
          const tempLineMap = [lineMap[idx]];
          let ni = idx + 1;
          while (ni < lines.length) {
            const nl = lines[ni];
            if (nl.trim() === "") { ni++; continue; }
            const nIndent = nl.length - nl.trimStart().length;
            if (nIndent <= baseIndent) break;
            if (nIndent > baseIndent) {
              tempLines.push(nl);
              tempLineMap.push(lineMap[ni]);
              ni++;
            } else {
              break;
            }
          }
          const result = parseYamlLines(tempLines, tempLineMap, 0, itemIndent);
          arr.push(result.value);
          idx = ni;
        } else {
          arr.push(parseYamlValue(afterDash.trim()));
          idx++;
        }
      }
    }
    return { value: arr, nextIdx: idx };
  }

  // Object
  if (trimmed.includes(":")) {
    const obj: Record<string, unknown> = {};
    let idx = si;
    while (idx < lines.length) {
      const line = lines[idx];
      if (line.trim() === "") { idx++; continue; }
      const indent = line.length - line.trimStart().length;
      if (indent < baseIndent) break;
      if (indent > baseIndent) { idx++; continue; }
      const lt = line.trim();
      const colonIdx = findColon(lt);
      if (colonIdx === -1) {
        throw new Error(`Syntax error at line ${lineMap[idx]}: expected key-value pair, got "${lt}"`);
      }
      const key = lt.slice(0, colonIdx).trim().replace(/^["']|["']$/g, "");
      const valStr = lt.slice(colonIdx + 1).trim();

      if (valStr === "|" || valStr === "|+" || valStr === "|-") {
        const blockResult = parseBlockScalarAfterKey(lines, lineMap, idx, "literal", valStr);
        obj[key] = blockResult.value;
        idx = blockResult.nextIdx;
      } else if (valStr === ">" || valStr === ">+" || valStr === ">-") {
        const blockResult = parseBlockScalarAfterKey(lines, lineMap, idx, "folded", valStr);
        obj[key] = blockResult.value;
        idx = blockResult.nextIdx;
      } else if (valStr) {
        obj[key] = parseYamlValue(valStr);
        idx++;
      } else {
        // Nested object or array
        const nextIdx = idx + 1;
        let nsi = nextIdx;
        while (nsi < lines.length && lines[nsi].trim() === "") nsi++;
        if (nsi < lines.length && lines[nsi].trim()) {
          const nextIndent = lines[nsi].length - lines[nsi].trimStart().length;
          if (nextIndent > indent) {
            const result = parseYamlLines(lines, lineMap, nsi, nextIndent);
            obj[key] = result.value;
            idx = result.nextIdx;
          } else {
            obj[key] = null;
            idx++;
          }
        } else {
          obj[key] = null;
          idx++;
        }
      }
    }
    return { value: obj, nextIdx: idx };
  }

  // Scalar value
  return { value: parseYamlValue(trimmed), nextIdx: si + 1 };
}

function findColon(line: string): number {
  let inSingle = false;
  let inDouble = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === "'" && !inDouble) inSingle = !inSingle;
    else if (ch === '"' && !inSingle) inDouble = !inDouble;
    else if (ch === ":" && !inSingle && !inDouble) {
      // The colon must be followed by a space, end of string, or be at the end
      if (i + 1 >= line.length || line[i + 1] === " ") {
        return i;
      }
    }
  }
  return -1;
}

function parseBlockScalar(
  lines: string[],
  lineMap: number[],
  startIdx: number,
  mode: "literal" | "folded",
  _indicator: string
): ParseResult {
  let idx = startIdx + 1;
  if (idx >= lines.length) return { value: "", nextIdx: idx };

  // Find the indent of the block
  while (idx < lines.length && lines[idx].trim() === "") idx++;
  if (idx >= lines.length) return { value: "", nextIdx: idx };

  const blockIndent = lines[idx].length - lines[idx].trimStart().length;
  const collected: string[] = [];

  while (idx < lines.length) {
    const line = lines[idx];
    if (line.trim() === "") {
      collected.push("");
      idx++;
      continue;
    }
    const indent = line.length - line.trimStart().length;
    if (indent < blockIndent) break;
    collected.push(line.slice(blockIndent));
    idx++;
  }

  // Trim trailing empty lines
  while (collected.length > 0 && collected[collected.length - 1] === "") {
    collected.pop();
  }

  const text = mode === "literal"
    ? collected.join("\n")
    : collected.join(" ").replace(/\s+/g, " ").trim();

  return { value: text, nextIdx: idx };
}

function parseBlockScalarAfterKey(
  lines: string[],
  lineMap: number[],
  startIdx: number,
  mode: "literal" | "folded",
  _indicator: string
): ParseResult {
  return parseBlockScalar(lines, lineMap, startIdx, mode, _indicator);
}

function parseYamlValue(val: string): unknown {
  if (val === "") return null;

  // Boolean
  if (val === "true" || val === "True" || val === "TRUE" || val === "yes" || val === "Yes" || val === "YES") return true;
  if (val === "false" || val === "False" || val === "FALSE" || val === "no" || val === "No" || val === "NO") return false;

  // Null
  if (val === "null" || val === "Null" || val === "NULL" || val === "~") return null;

  // Quoted strings
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    return val.slice(1, -1).replace(/\\n/g, "\n").replace(/\\t/g, "\t").replace(/\\\\/g, "\\").replace(/\\"/g, '"');
  }

  // Integers
  if (/^-?\d+$/.test(val)) return parseInt(val, 10);

  // Floats
  if (/^-?\d+\.\d+$/.test(val)) return parseFloat(val);

  // Special floats
  if (val === ".inf" || val === ".Inf" || val === ".INF") return Infinity;
  if (val === "-.inf" || val === "-.Inf" || val === "-.INF") return -Infinity;
  if (val === ".nan" || val === ".NaN" || val === ".NAN") return NaN;

  // Inline array [a, b, c]
  if (val.startsWith("[") && val.endsWith("]")) {
    const inner = val.slice(1, -1).trim();
    if (inner === "") return [];
    return inner.split(",").map((item) => parseYamlValue(item.trim()));
  }

  // Inline object {a: b, c: d}
  if (val.startsWith("{") && val.endsWith("}")) {
    const inner = val.slice(1, -1).trim();
    if (inner === "") return {};
    const obj: Record<string, unknown> = {};
    const pairs = inner.split(",");
    for (const pair of pairs) {
      const ci = pair.indexOf(":");
      if (ci === -1) continue;
      const k = pair.slice(0, ci).trim().replace(/^["']|["']$/g, "");
      const v = pair.slice(ci + 1).trim();
      obj[k] = parseYamlValue(v);
    }
    return obj;
  }

  return val;
}

// ── Validation wrapper ────────────────────────────────────────────

function validateYaml(input: string): { parsed: unknown; json: string; error: string; isValid: boolean; errorLine: number | null } {
  if (!input.trim()) {
    return { parsed: null, json: "", error: "", isValid: true, errorLine: null };
  }

  // Basic structural checks before parsing
  const lines = input.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === "" || line.trim().startsWith("#")) continue;

    // Check for tabs (YAML forbids tabs for indentation)
    if (line.match(/^\t/)) {
      return {
        parsed: null,
        json: "",
        error: `Tab character used for indentation (YAML requires spaces)`,
        isValid: false,
        errorLine: i + 1,
      };
    }

    // Check for inconsistent indentation with odd spaces in certain contexts
    const leadingSpaces = line.match(/^( *)/)?.[1].length ?? 0;
    if (leadingSpaces > 0 && leadingSpaces % 2 !== 0) {
      // Odd indentation is technically allowed but commonly causes issues
      // We'll just note it but not fail - only fail on truly invalid structures
    }
  }

  try {
    const parsed = parseYaml(input);
    const json = JSON.stringify(parsed, null, 2);
    return { parsed, json, error: "", isValid: true, errorLine: null };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Invalid YAML syntax";
    // Try to extract line number from error message
    const lineMatch = msg.match(/line (\d+)/i);
    const errorLine = lineMatch ? parseInt(lineMatch[1], 10) : null;
    return { parsed: null, json: "", error: msg, isValid: false, errorLine };
  }
}

// ── Sample YAML ───────────────────────────────────────────────────

const SAMPLE_YAML = `# Server Configuration
server:
  name: CodeUtilo
  version: 2.1
  host: localhost
  port: 8080
  ssl: true
  debug: false

# Database settings
database:
  engine: postgresql
  host: db.example.com
  port: 5432
  credentials:
    username: admin
    password: "s3cret#pass"

# Features list
features:
  - name: yaml-validator
    enabled: true
  - name: json-formatter
    enabled: true
  - name: code-minifier
    enabled: false

# Supported formats
formats:
  - yaml
  - json
  - xml
  - toml

# Null and special values
cache: ~
timeout: null
max_retries: 3
ratio: 0.85
verbose: no`;

export default function YamlValidator() {
  const [input, setInput] = useState(SAMPLE_YAML);

  const result = useMemo(() => {
    return validateYaml(input);
  }, [input]);

  const lineCount = input.split("\n").length;

  return (
    <ToolLayout
      title="YAML Validator"
      description="Validate YAML syntax online. Check for errors, see parsed output as JSON. Supports nested objects, arrays, comments, multi-line strings, and more."
      relatedTools={["yaml-json-converter", "json-formatter", "json-schema-validator"]}
    >
      {/* Status Indicator */}
      {input.trim() && (
        <div
          className={`mb-4 flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium ${
            result.isValid
              ? "border-green-300 bg-green-50 dark:bg-green-950 text-green-800"
              : "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950 text-red-800"
          }`}
        >
          {result.isValid ? (
            <>
              <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>Valid YAML</span>
            </>
          ) : (
            <>
              <svg className="h-5 w-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>
                Invalid YAML
                {result.errorLine ? ` (line ${result.errorLine})` : ""}
                {result.error ? `: ${result.error}` : ""}
              </span>
            </>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setInput(SAMPLE_YAML)}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
        >
          Sample YAML
        </button>
        <button
          onClick={() => setInput("")}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
        >
          Clear
        </button>
      </div>

      {/* YAML Input with Line Numbers */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          YAML Input
        </label>
        <div className="flex overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600 focus-within:border-blue-500 dark:border-blue-400 focus-within:ring-1 focus-within:ring-blue-500">
          {/* Line Numbers */}
          <div
            className="select-none border-r border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-2 py-3 text-right font-mono text-xs leading-[1.625] text-gray-400 dark:text-gray-500"
            aria-hidden="true"
          >
            {Array.from({ length: lineCount }, (_, i) => (
              <div
                key={i}
                className={
                  result.errorLine === i + 1
                    ? "text-red-500 dark:text-red-400 font-bold"
                    : ""
                }
              >
                {i + 1}
              </div>
            ))}
          </div>
          {/* Textarea */}
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your YAML here..."
            rows={20}
            className="w-full resize-none bg-gray-50 dark:bg-gray-950 p-3 font-mono text-xs leading-[1.625] focus:outline-none"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Parsed JSON Output */}
      {result.isValid && result.json && (
        <div className="mt-4">
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Parsed Output (JSON)
            </label>
            <CopyButton text={result.json} />
          </div>
          <pre className="max-h-96 overflow-auto rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 font-mono text-xs">
            {result.json}
          </pre>
        </div>
      )}

      
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The YAML Validator is a free online tool available on CodeUtilo. Validate YAML syntax online. Find errors with line numbers and see parsed JSON output. All processing happens directly in your browser — no data is ever sent to any server, ensuring your privacy and security. No signup or installation is required.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> — All yaml validator operations run locally in your browser using JavaScript. Your data never leaves your device.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Instant Results</strong> — Get results immediately as you type or paste your input. No waiting for server responses or page reloads.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> — Use the yaml validator as many times as you need without creating an account or paying anything.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Mobile Friendly</strong> — Works on desktop, tablet, and mobile browsers. Access this tool from any device with an internet connection.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Using the yaml validator for day-to-day development tasks</li>
          <li>Saving time on repetitive tasks by using a browser-based tool instead of writing custom code</li>
          <li>Working on projects where installing software is not an option (school, work, shared computers)</li>
          <li>Quick prototyping and debugging without switching to a terminal or IDE</li>
          <li>Sharing the tool link with colleagues who need the same functionality</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Enter your input in the text area provided and the yaml validator will process it instantly. Use the Copy button to copy the result to your clipboard. All operations are performed locally in your browser — no data is transmitted to any server.
        </p>
      </div>
    </ToolLayout>
  );
}
