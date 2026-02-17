"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

// Simple YAML parser (handles common cases without external deps)
function parseYaml(yaml: string): unknown {
  const lines = yaml.split("\n");
  return parseYamlLines(lines, 0, 0).value;
}

function parseYamlLines(
  lines: string[],
  startIdx: number,
  baseIndent: number
): { value: unknown; nextIdx: number } {
  if (startIdx >= lines.length) return { value: null, nextIdx: startIdx };

  const firstLine = lines[startIdx];
  const trimmed = firstLine.trim();

  // Array item at current level
  if (trimmed.startsWith("- ")) {
    const arr: unknown[] = [];
    let idx = startIdx;
    while (idx < lines.length) {
      const line = lines[idx];
      const indent = line.length - line.trimStart().length;
      if (indent < baseIndent && line.trim()) break;
      if (indent !== baseIndent) { idx++; continue; }
      const lt = line.trim();
      if (!lt.startsWith("- ")) break;
      arr.push(parseYamlValue(lt.slice(2).trim()));
      idx++;
    }
    return { value: arr, nextIdx: idx };
  }

  // Object
  if (trimmed.includes(":")) {
    const obj: Record<string, unknown> = {};
    let idx = startIdx;
    while (idx < lines.length) {
      const line = lines[idx];
      if (!line.trim()) { idx++; continue; }
      const indent = line.length - line.trimStart().length;
      if (indent < baseIndent) break;
      if (indent > baseIndent) { idx++; continue; }
      const lt = line.trim();
      const colonIdx = lt.indexOf(":");
      if (colonIdx === -1) { idx++; continue; }
      const key = lt.slice(0, colonIdx).trim();
      const valStr = lt.slice(colonIdx + 1).trim();
      if (valStr) {
        obj[key] = parseYamlValue(valStr);
        idx++;
      } else {
        // Nested object or array
        const nextIdx = idx + 1;
        if (nextIdx < lines.length && lines[nextIdx].trim()) {
          const nextIndent = lines[nextIdx].length - lines[nextIdx].trimStart().length;
          if (nextIndent > baseIndent) {
            const result = parseYamlLines(lines, nextIdx, nextIndent);
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

  return { value: parseYamlValue(trimmed), nextIdx: startIdx + 1 };
}

function parseYamlValue(val: string): unknown {
  if (val === "true" || val === "True" || val === "TRUE") return true;
  if (val === "false" || val === "False" || val === "FALSE") return false;
  if (val === "null" || val === "Null" || val === "~" || val === "") return null;
  if (/^-?\d+$/.test(val)) return parseInt(val);
  if (/^-?\d+\.\d+$/.test(val)) return parseFloat(val);
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))
    return val.slice(1, -1);
  return val;
}

// Simple JSON to YAML converter
function jsonToYaml(obj: unknown, indent = 0): string {
  const pad = "  ".repeat(indent);
  if (obj === null || obj === undefined) return "null";
  if (typeof obj === "boolean") return obj.toString();
  if (typeof obj === "number") return obj.toString();
  if (typeof obj === "string") {
    if (obj.includes("\n") || obj.includes(":") || obj.includes("#") || obj.startsWith(" ")) {
      return `"${obj.replace(/"/g, '\\"')}"`;
    }
    return obj;
  }
  if (Array.isArray(obj)) {
    if (obj.length === 0) return "[]";
    return obj
      .map((item) => {
        const val = jsonToYaml(item, indent + 1);
        if (typeof item === "object" && item !== null) {
          return `${pad}- ${val.trim().replace(/^  /, "")}`;
        }
        return `${pad}- ${val}`;
      })
      .join("\n");
  }
  if (typeof obj === "object") {
    const entries = Object.entries(obj);
    if (entries.length === 0) return "{}";
    return entries
      .map(([key, val]) => {
        if (typeof val === "object" && val !== null) {
          return `${pad}${key}:\n${jsonToYaml(val, indent + 1)}`;
        }
        return `${pad}${key}: ${jsonToYaml(val, indent + 1)}`;
      })
      .join("\n");
  }
  return String(obj);
}

const SAMPLE_YAML = `name: MicroTools
version: 1.0
description: Free online developer tools
features:
  - fast
  - free
  - no signup
database:
  host: localhost
  port: 5432
  ssl: true
debug: false`;

const SAMPLE_JSON = JSON.stringify(
  {
    name: "MicroTools",
    version: 1.0,
    description: "Free online developer tools",
    features: ["fast", "free", "no signup"],
    database: { host: "localhost", port: 5432, ssl: true },
    debug: false,
  },
  null,
  2
);

export default function YamlJsonConverter() {
  const [mode, setMode] = useState<"yaml-to-json" | "json-to-yaml">("yaml-to-json");
  const [input, setInput] = useState(SAMPLE_YAML);

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: "", error: "" };
    try {
      if (mode === "yaml-to-json") {
        const parsed = parseYaml(input);
        return { output: JSON.stringify(parsed, null, 2), error: "" };
      } else {
        const parsed = JSON.parse(input);
        return { output: jsonToYaml(parsed), error: "" };
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Conversion failed";
      return { output: "", error: msg };
    }
  }, [input, mode]);

  return (
    <ToolLayout
      title="YAML ↔ JSON Converter Online"
      description="Convert between YAML and JSON formats. Paste YAML to get JSON or vice versa. Free online converter."
      relatedTools={["json-formatter", "json-csv-converter", "json-path-finder"]}
    >
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => { setMode("yaml-to-json"); setInput(SAMPLE_YAML); }}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            mode === "yaml-to-json"
              ? "bg-blue-600 text-white"
              : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          YAML → JSON
        </button>
        <button
          onClick={() => { setMode("json-to-yaml"); setInput(SAMPLE_JSON); }}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            mode === "json-to-yaml"
              ? "bg-blue-600 text-white"
              : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          JSON → YAML
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            {mode === "yaml-to-json" ? "YAML Input" : "JSON Input"}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "yaml-to-json" ? "Paste YAML here..." : "Paste JSON here..."}
            className="h-64 w-full rounded-lg border border-gray-300 bg-gray-50 p-3 font-mono text-xs focus:border-blue-500 focus:outline-none"
            spellCheck={false}
          />
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              {mode === "yaml-to-json" ? "JSON Output" : "YAML Output"}
            </label>
            <CopyButton text={output} />
          </div>
          <textarea
            value={error || output}
            readOnly
            className={`h-64 w-full rounded-lg border p-3 font-mono text-xs ${
              error
                ? "border-red-300 bg-red-50 text-red-700"
                : "border-gray-300 bg-gray-50"
            }`}
          />
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => setInput("")}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Clear
        </button>
      </div>

      <div className="mt-8 border-t border-gray-200 pt-6 text-sm text-gray-600">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">YAML vs JSON</h2>
        <p className="mb-3">
          YAML (YAML Ain&apos;t Markup Language) uses indentation for structure and is more
          human-readable. JSON (JavaScript Object Notation) uses braces and brackets and is
          more widely supported by APIs and programming languages. Both represent the same data.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">When to Use Each</h2>
        <p>
          Use YAML for configuration files (Docker Compose, Kubernetes, CI/CD pipelines).
          Use JSON for APIs, data exchange, and JavaScript/TypeScript code. Convert between
          them when migrating configurations or integrating systems.
        </p>
      </div>
    </ToolLayout>
  );
}
