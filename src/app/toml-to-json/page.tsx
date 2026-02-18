"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const EXAMPLE_TOML = `# Example TOML configuration
title = "My App"
debug = false
version = 2

[owner]
name = "John Doe"
dob = 1979-05-27

[database]
server = "192.168.1.1"
ports = [8001, 8001, 8002]
enabled = true
max_connections = 5000

[servers.alpha]
ip = "10.0.0.1"
dc = "eqdc10"

[servers.beta]
ip = "10.0.0.2"
dc = "eqdc10"`;

const EXAMPLE_JSON = `{
  "title": "My App",
  "debug": false,
  "version": 2,
  "owner": {
    "name": "John Doe",
    "dob": "1979-05-27"
  },
  "database": {
    "server": "192.168.1.1",
    "ports": [8001, 8001, 8002],
    "enabled": true,
    "max_connections": 5000
  },
  "servers": {
    "alpha": {
      "ip": "10.0.0.1",
      "dc": "eqdc10"
    },
    "beta": {
      "ip": "10.0.0.2",
      "dc": "eqdc10"
    }
  }
}`;

function parseTOML(input: string): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  let currentSection = result;
  const lines = input.split("\n");

  const setNested = (obj: Record<string, unknown>, path: string[], value: unknown) => {
    let cur = obj;
    for (let i = 0; i < path.length - 1; i++) {
      if (!(path[i] in cur) || typeof cur[path[i]] !== "object" || cur[path[i]] === null) {
        cur[path[i]] = {};
      }
      cur = cur[path[i]] as Record<string, unknown>;
    }
    cur[path[path.length - 1]] = value;
    return cur;
  };

  const getNested = (obj: Record<string, unknown>, path: string[]): Record<string, unknown> => {
    let cur = obj;
    for (const key of path) {
      if (!(key in cur) || typeof cur[key] !== "object" || cur[key] === null) {
        cur[key] = {};
      }
      cur = cur[key] as Record<string, unknown>;
    }
    return cur;
  };

  const parseValue = (val: string): unknown => {
    val = val.trim();
    if (val === "true") return true;
    if (val === "false") return false;
    if (val.startsWith('"') && val.endsWith('"')) return val.slice(1, -1).replace(/\\n/g, "\n").replace(/\\t/g, "\t").replace(/\\"/g, '"').replace(/\\\\/g, "\\");
    if (val.startsWith("'") && val.endsWith("'")) return val.slice(1, -1);
    if (/^-?\d+$/.test(val)) return parseInt(val, 10);
    if (/^-?\d+\.\d+$/.test(val)) return parseFloat(val);
    if (/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?/.test(val)) return val;
    if (val.startsWith("[") && val.endsWith("]")) {
      const inner = val.slice(1, -1).trim();
      if (!inner) return [];
      return splitArray(inner).map((item) => parseValue(item.trim()));
    }
    if (val.startsWith("{") && val.endsWith("}")) {
      const inner = val.slice(1, -1).trim();
      if (!inner) return {};
      const obj: Record<string, unknown> = {};
      const pairs = splitArray(inner);
      for (const pair of pairs) {
        const eqIdx = pair.indexOf("=");
        if (eqIdx !== -1) {
          const k = pair.slice(0, eqIdx).trim();
          const v = pair.slice(eqIdx + 1).trim();
          obj[k] = parseValue(v);
        }
      }
      return obj;
    }
    return val;
  };

  const splitArray = (s: string): string[] => {
    const items: string[] = [];
    let depth = 0;
    let current = "";
    let inStr = false;
    let strChar = "";
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (inStr) {
        current += c;
        if (c === strChar && s[i - 1] !== "\\") inStr = false;
        continue;
      }
      if (c === '"' || c === "'") { inStr = true; strChar = c; current += c; continue; }
      if (c === "[" || c === "{") { depth++; current += c; continue; }
      if (c === "]" || c === "}") { depth--; current += c; continue; }
      if (c === "," && depth === 0) { items.push(current.trim()); current = ""; continue; }
      current += c;
    }
    if (current.trim()) items.push(current.trim());
    return items;
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const sectionMatch = line.match(/^\[([^\]]+)\]$/);
    if (sectionMatch) {
      const path = sectionMatch[1].split(".");
      currentSection = getNested(result, path);
      continue;
    }

    const eqIdx = line.indexOf("=");
    if (eqIdx !== -1) {
      const key = line.slice(0, eqIdx).trim();
      let val = line.slice(eqIdx + 1).trim();
      const commentIdx = findComment(val);
      if (commentIdx !== -1) val = val.slice(0, commentIdx).trim();
      const dotParts = key.split(".");
      if (dotParts.length > 1) {
        setNested(currentSection as Record<string, unknown>, dotParts, parseValue(val));
      } else {
        currentSection[key] = parseValue(val);
      }
    }
  }

  return result;
}

function findComment(val: string): number {
  let inStr = false;
  let strChar = "";
  for (let i = 0; i < val.length; i++) {
    const c = val[i];
    if (inStr) {
      if (c === strChar && val[i - 1] !== "\\") inStr = false;
      continue;
    }
    if (c === '"' || c === "'") { inStr = true; strChar = c; continue; }
    if (c === "#") return i;
  }
  return -1;
}

function jsonToTOML(obj: unknown, prefix = ""): string {
  if (typeof obj !== "object" || obj === null || Array.isArray(obj)) return "";
  const record = obj as Record<string, unknown>;
  const lines: string[] = [];
  const sections: string[] = [];

  for (const [key, value] of Object.entries(record)) {
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      sections.push(key);
    } else {
      lines.push(`${key} = ${tomlValue(value)}`);
    }
  }

  for (const key of sections) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const sub = record[key] as Record<string, unknown>;
    const hasSubSections = Object.values(sub).some((v) => typeof v === "object" && v !== null && !Array.isArray(v));
    if (hasSubSections || Object.keys(sub).length > 0) {
      lines.push("");
      lines.push(`[${fullKey}]`);
      const subLines = jsonToTOML(sub, fullKey);
      if (subLines) lines.push(subLines);
    }
  }

  return lines.join("\n");
}

function tomlValue(value: unknown): string {
  if (typeof value === "string") return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return `[${value.map((v) => tomlValue(v)).join(", ")}]`;
  if (typeof value === "object" && value !== null) {
    const entries = Object.entries(value as Record<string, unknown>);
    return `{ ${entries.map(([k, v]) => `${k} = ${tomlValue(v)}`).join(", ")} }`;
  }
  return String(value);
}

export default function TomlToJsonPage() {
  const [mode, setMode] = useState<"toml-to-json" | "json-to-toml">("toml-to-json");
  const [input, setInput] = useState("");

  const result = useMemo(() => {
    if (!input.trim()) return { value: "", error: "" };
    try {
      if (mode === "toml-to-json") {
        const parsed = parseTOML(input);
        return { value: JSON.stringify(parsed, null, 2), error: "" };
      } else {
        const parsed = JSON.parse(input);
        return { value: jsonToTOML(parsed), error: "" };
      }
    } catch (e) {
      return { value: "", error: e instanceof Error ? e.message : "Invalid input" };
    }
  }, [input, mode]);

  const loadExample = () => {
    setInput(mode === "toml-to-json" ? EXAMPLE_TOML : EXAMPLE_JSON);
  };

  const swap = () => {
    if (result.value) {
      setInput(result.value);
      setMode(mode === "toml-to-json" ? "json-to-toml" : "toml-to-json");
    }
  };

  return (
    <ToolLayout
      title="TOML ↔ JSON Converter"
      description="Convert between TOML and JSON formats. Validate TOML syntax and see parsed output."
      relatedTools={["yaml-json-converter", "json-formatter", "xml-to-json"]}
    >
      {/* Mode Toggle */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => { setMode("toml-to-json"); setInput(""); }}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${mode === "toml-to-json" ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:bg-gray-700"}`}
        >
          TOML → JSON
        </button>
        <button
          onClick={() => { setMode("json-to-toml"); setInput(""); }}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${mode === "json-to-toml" ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:bg-gray-700"}`}
        >
          JSON → TOML
        </button>
      </div>

      {/* Action Buttons */}
      <div className="mb-4 flex gap-2">
        <button onClick={loadExample} className="rounded-lg bg-gray-100 dark:bg-gray-800 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:bg-gray-700">
          Load Example
        </button>
        <button onClick={swap} className="rounded-lg bg-gray-100 dark:bg-gray-800 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:bg-gray-700" disabled={!result.value}>
          ⇄ Swap
        </button>
        <button onClick={() => setInput("")} className="rounded-lg bg-gray-100 dark:bg-gray-800 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:bg-gray-700">
          Clear
        </button>
      </div>

      {/* Input/Output */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {mode === "toml-to-json" ? "TOML Input" : "JSON Input"}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "toml-to-json" ? 'key = "value"\n[section]\nname = "test"' : '{\n  "key": "value"\n}'}
            className="h-80 w-full rounded-lg border border-gray-300 dark:border-gray-600 p-3 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            spellCheck={false}
          />
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {mode === "toml-to-json" ? "JSON Output" : "TOML Output"}
            </label>
            {result.value && <CopyButton text={result.value} />}
          </div>
          <textarea
            value={result.error || result.value}
            readOnly
            className={`h-80 w-full rounded-lg border p-3 font-mono text-sm ${result.error ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400" : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200"}`}
            spellCheck={false}
          />
        </div>
      </div>

      
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The TOML ↔ JSON Converter is a free online tool available on CodeUtilo. Convert between TOML and JSON formats. Validate TOML syntax and see parsed output. All processing happens directly in your browser — no data is ever sent to any server, ensuring your privacy and security. No signup or installation is required.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> — All toml ↔ json converter operations run locally in your browser using JavaScript. Your data never leaves your device.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Instant Results</strong> — Get results immediately as you type or paste your input. No waiting for server responses or page reloads.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> — Use the toml ↔ json converter as many times as you need without creating an account or paying anything.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Mobile Friendly</strong> — Works on desktop, tablet, and mobile browsers. Access this tool from any device with an internet connection.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Using the toml ↔ json converter for day-to-day development tasks</li>
          <li>Saving time on repetitive tasks by using a browser-based tool instead of writing custom code</li>
          <li>Working on projects where installing software is not an option (school, work, shared computers)</li>
          <li>Quick prototyping and debugging without switching to a terminal or IDE</li>
          <li>Sharing the tool link with colleagues who need the same functionality</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Enter your input in the text area provided and the toml ↔ json converter will process it instantly. Use the Copy button to copy the result to your clipboard. All operations are performed locally in your browser — no data is transmitted to any server.
        </p>
      </div>
    </ToolLayout>
  );
}
