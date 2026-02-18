"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function jsonToTs(obj: unknown, name = "Root", indent = 0): string {
  const pad = "  ".repeat(indent);

  if (obj === null) return "null";
  if (typeof obj === "string") return "string";
  if (typeof obj === "number") return Number.isInteger(obj) ? "number" : "number";
  if (typeof obj === "boolean") return "boolean";

  if (Array.isArray(obj)) {
    if (obj.length === 0) return "unknown[]";
    const itemType = jsonToTs(obj[0], name + "Item", indent);
    if (typeof obj[0] === "object" && obj[0] !== null && !Array.isArray(obj[0])) {
      return `${itemType}[]`;
    }
    return `${itemType}[]`;
  }

  if (typeof obj === "object") {
    const entries = Object.entries(obj as Record<string, unknown>);
    if (entries.length === 0) return "Record<string, unknown>";

    const fields = entries.map(([key, val]) => {
      const safeName = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
      const childName = key.charAt(0).toUpperCase() + key.slice(1);

      if (typeof val === "object" && val !== null && !Array.isArray(val)) {
        const nested = jsonToTs(val, childName, indent + 1);
        return `${pad}  ${safeName}: ${nested};`;
      }
      if (Array.isArray(val) && val.length > 0 && typeof val[0] === "object" && val[0] !== null) {
        const nested = jsonToTs(val[0], childName + "Item", indent + 1);
        return `${pad}  ${safeName}: ${nested}[];`;
      }

      const fieldType = jsonToTs(val, childName, indent + 1);
      return `${pad}  ${safeName}: ${fieldType};`;
    });

    return `{\n${fields.join("\n")}\n${pad}}`;
  }

  return "unknown";
}

function generateInterfaces(obj: unknown, rootName = "Root"): string {
  if (typeof obj !== "object" || obj === null || Array.isArray(obj)) {
    return `type ${rootName} = ${jsonToTs(obj, rootName)};`;
  }

  const interfaces: string[] = [];
  const seen = new Set<string>();

  function extract(o: unknown, name: string) {
    if (typeof o !== "object" || o === null) return;

    if (Array.isArray(o)) {
      if (o.length > 0) extract(o[0], name + "Item");
      return;
    }

    if (seen.has(name)) return;
    seen.add(name);

    const entries = Object.entries(o as Record<string, unknown>);
    const fields: string[] = [];

    for (const [key, val] of entries) {
      const safeName = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
      const childName = key.charAt(0).toUpperCase() + key.slice(1);

      if (typeof val === "object" && val !== null && !Array.isArray(val)) {
        extract(val, childName);
        fields.push(`  ${safeName}: ${childName};`);
      } else if (Array.isArray(val) && val.length > 0 && typeof val[0] === "object" && val[0] !== null) {
        extract(val[0], childName + "Item");
        fields.push(`  ${safeName}: ${childName}Item[];`);
      } else {
        fields.push(`  ${safeName}: ${jsonToTs(val, childName)};`);
      }
    }

    interfaces.push(`interface ${name} {\n${fields.join("\n")}\n}`);
  }

  extract(obj, rootName);
  return interfaces.reverse().join("\n\n");
}

const SAMPLE = JSON.stringify({
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  isActive: true,
  age: 30,
  address: {
    street: "123 Main St",
    city: "Prague",
    zip: "11000",
  },
  tags: ["developer", "typescript"],
  orders: [
    { id: 101, total: 29.99, items: 3 },
    { id: 102, total: 49.99, items: 1 },
  ],
}, null, 2);

export default function JsonToTypescript() {
  const [input, setInput] = useState(SAMPLE);
  const [rootName, setRootName] = useState("Root");
  const [mode, setMode] = useState<"inline" | "separate">("separate");

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: "", error: "" };
    try {
      const parsed = JSON.parse(input);
      if (mode === "separate") {
        return { output: generateInterfaces(parsed, rootName), error: "" };
      }
      const ts = jsonToTs(parsed, rootName);
      return { output: `interface ${rootName} ${ts}`, error: "" };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Invalid JSON";
      return { output: "", error: msg };
    }
  }, [input, rootName, mode]);

  return (
    <ToolLayout
      title="JSON to TypeScript — Generate Interfaces from JSON"
      description="Convert JSON data to TypeScript interfaces automatically. Supports nested objects, arrays, and multiple interface generation."
      relatedTools={["json-formatter", "json-path-finder", "json-csv-converter"]}
    >
      <div className="mb-4 flex flex-wrap items-end gap-4">
        <div>
          <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">Root name</label>
          <input
            type="text"
            value={rootName}
            onChange={(e) => setRootName(e.target.value || "Root")}
            className="w-32 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-1.5 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setMode("separate")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              mode === "separate" ? "bg-blue-600 text-white" : "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
            }`}
          >
            Separate interfaces
          </button>
          <button
            onClick={() => setMode("inline")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              mode === "inline" ? "bg-blue-600 text-white" : "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
            }`}
          >
            Inline
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">JSON Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste JSON here..."
            className="h-72 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 font-mono text-xs focus:border-blue-500 dark:border-blue-400 focus:outline-none"
            spellCheck={false}
          />
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => setInput(SAMPLE)}
              className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
            >
              Sample
            </button>
            <button
              onClick={() => setInput("")}
              className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
            >
              Clear
            </button>
          </div>
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">TypeScript Output</label>
            <CopyButton text={output} />
          </div>
          <textarea
            value={error || output}
            readOnly
            className={`h-72 w-full rounded-lg border p-3 font-mono text-xs ${
              error ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300" : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950"
            }`}
          />
        </div>
      </div>

      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">JSON to TypeScript Conversion</h2>
        <p className="mb-3">
          This tool analyzes JSON data and generates corresponding TypeScript interfaces. It
          infers types from values (string, number, boolean), handles nested objects as separate
          interfaces, and detects array item types.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">When to Use This</h2>
        <p>
          Use this when integrating with APIs — paste a JSON response to instantly get TypeScript
          types. This saves time and ensures type safety when working with external data sources.
        </p>
      </div>
    
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The JSON to TypeScript is a free online tool available on CodeUtilo. Generate TypeScript interfaces from JSON data automatically. All processing happens directly in your browser — no data is ever sent to any server, ensuring your privacy and security. No signup or installation is required.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> — All json to typescript operations run locally in your browser using JavaScript. Your data never leaves your device.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Instant Results</strong> — Get results immediately as you type or paste your input. No waiting for server responses or page reloads.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> — Use the json to typescript as many times as you need without creating an account or paying anything.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Mobile Friendly</strong> — Works on desktop, tablet, and mobile browsers. Access this tool from any device with an internet connection.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Using the json to typescript for day-to-day development tasks</li>
          <li>Saving time on repetitive tasks by using a browser-based tool instead of writing custom code</li>
          <li>Working on projects where installing software is not an option (school, work, shared computers)</li>
          <li>Quick prototyping and debugging without switching to a terminal or IDE</li>
          <li>Sharing the tool link with colleagues who need the same functionality</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Enter your input in the text area provided and the json to typescript will process it instantly. Use the Copy button to copy the result to your clipboard. All operations are performed locally in your browser — no data is transmitted to any server.
        </p>
      </div>
    </ToolLayout>
  );
}
