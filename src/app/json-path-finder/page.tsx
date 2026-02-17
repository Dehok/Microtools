"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const SAMPLE = JSON.stringify(
  {
    store: {
      name: "CodeUtilo Shop",
      books: [
        { title: "JavaScript Guide", price: 29.99, inStock: true },
        { title: "CSS Mastery", price: 24.99, inStock: false },
      ],
      location: { city: "Prague", country: "CZ" },
    },
  },
  null,
  2
);

interface PathEntry {
  path: string;
  value: string;
  type: string;
}

function extractPaths(obj: unknown, prefix = "$"): PathEntry[] {
  const entries: PathEntry[] = [];

  if (obj === null) {
    entries.push({ path: prefix, value: "null", type: "null" });
    return entries;
  }

  if (Array.isArray(obj)) {
    entries.push({ path: prefix, value: `Array(${obj.length})`, type: "array" });
    obj.forEach((item, i) => {
      entries.push(...extractPaths(item, `${prefix}[${i}]`));
    });
    return entries;
  }

  if (typeof obj === "object") {
    entries.push({ path: prefix, value: `Object(${Object.keys(obj).length} keys)`, type: "object" });
    for (const [key, val] of Object.entries(obj)) {
      const safePath = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? `.${key}` : `["${key}"]`;
      entries.push(...extractPaths(val, `${prefix}${safePath}`));
    }
    return entries;
  }

  entries.push({ path: prefix, value: JSON.stringify(obj), type: typeof obj });
  return entries;
}

export default function JsonPathFinder() {
  const [input, setInput] = useState(SAMPLE);
  const [filter, setFilter] = useState("");

  const { paths, error } = useMemo(() => {
    if (!input.trim()) return { paths: [], error: "" };
    try {
      const parsed = JSON.parse(input);
      return { paths: extractPaths(parsed), error: "" };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Invalid JSON";
      return { paths: [], error: msg };
    }
  }, [input]);

  const filtered = filter
    ? paths.filter(
        (p) =>
          p.path.toLowerCase().includes(filter.toLowerCase()) ||
          p.value.toLowerCase().includes(filter.toLowerCase())
      )
    : paths;

  return (
    <ToolLayout
      title="JSON Path Finder — Extract All Paths from JSON"
      description="Extract all paths from a JSON object. Filter and copy JSONPath expressions. Free online tool for developers."
      relatedTools={["json-formatter", "json-csv-converter", "jwt-decoder"]}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">JSON Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your JSON here..."
            className="h-80 w-full rounded-lg border border-gray-300 bg-gray-50 p-3 font-mono text-xs focus:border-blue-500 focus:outline-none"
            spellCheck={false}
          />
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => setInput(SAMPLE)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Sample
            </button>
            <button
              onClick={() => setInput("")}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Clear
            </button>
          </div>
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Paths ({filtered.length})
            </label>
            <CopyButton
              text={filtered.map((p) => `${p.path} → ${p.value}`).join("\n")}
            />
          </div>

          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter paths..."
            className="mb-2 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
          />

          {error && (
            <div className="mb-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {error}
            </div>
          )}

          <div className="h-[280px] overflow-y-auto rounded-lg border border-gray-300 bg-white">
            {filtered.map((entry, i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b border-gray-100 px-3 py-1.5 text-xs hover:bg-gray-50"
              >
                <div className="min-w-0 flex-1">
                  <span className="font-mono text-blue-700">{entry.path}</span>
                  {entry.type !== "object" && entry.type !== "array" && (
                    <span className="ml-2 text-gray-500">→ {entry.value}</span>
                  )}
                </div>
                <div className="ml-2 flex items-center gap-1">
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                      entry.type === "string"
                        ? "bg-green-100 text-green-700"
                        : entry.type === "number"
                        ? "bg-blue-100 text-blue-700"
                        : entry.type === "boolean"
                        ? "bg-yellow-100 text-yellow-700"
                        : entry.type === "null"
                        ? "bg-gray-100 text-gray-500"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {entry.type}
                  </span>
                  <CopyButton text={entry.path} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-gray-200 pt-6 text-sm text-gray-600">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">What is JSONPath?</h2>
        <p className="mb-3">
          JSONPath is an expression language for navigating JSON structures. The root is represented
          by <code>$</code>, object properties by dot notation (<code>.key</code>), and array elements
          by bracket notation (<code>[0]</code>).
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Use Cases</h2>
        <p>
          JSONPath is used in API testing (Postman, REST Assured), data transformation (jq),
          configuration files, and log analysis. This tool helps you find the exact path to any
          value in your JSON data.
        </p>
      </div>
    </ToolLayout>
  );
}
