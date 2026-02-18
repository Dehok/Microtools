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
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">JSON Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your JSON here..."
            className="h-80 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 font-mono text-xs focus:border-blue-500 dark:border-blue-400 focus:outline-none"
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
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
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
            className="mb-2 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-1.5 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
          />

          {error && (
            <div className="mb-2 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 px-3 py-2 text-xs text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

          <div className="h-[280px] overflow-y-auto rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900">
            {filtered.map((entry, i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 px-3 py-1.5 text-xs hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
              >
                <div className="min-w-0 flex-1">
                  <span className="font-mono text-blue-700 dark:text-blue-300">{entry.path}</span>
                  {entry.type !== "object" && entry.type !== "array" && (
                    <span className="ml-2 text-gray-500 dark:text-gray-400">→ {entry.value}</span>
                  )}
                </div>
                <div className="ml-2 flex items-center gap-1">
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                      entry.type === "string"
                        ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                        : entry.type === "number"
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                        : entry.type === "boolean"
                        ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"
                        : entry.type === "null"
                        ? "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                        : "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300"
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

      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">What is JSONPath?</h2>
        <p className="mb-3">
          JSONPath is an expression language for navigating JSON structures. The root is represented
          by <code>$</code>, object properties by dot notation (<code>.key</code>), and array elements
          by bracket notation (<code>[0]</code>).
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Use Cases</h2>
        <p>
          JSONPath is used in API testing (Postman, REST Assured), data transformation (jq),
          configuration files, and log analysis. This tool helps you find the exact path to any
          value in your JSON data.
        </p>
      </div>
    
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The JSON Path Finder is a free online tool available on CodeUtilo. Extract all paths from a JSON object. Filter and copy JSONPath expressions. All processing happens directly in your browser — no data is ever sent to any server, ensuring your privacy and security. No signup or installation is required.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> — All json path finder operations run locally in your browser using JavaScript. Your data never leaves your device.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Instant Results</strong> — Get results immediately as you type or paste your input. No waiting for server responses or page reloads.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> — Use the json path finder as many times as you need without creating an account or paying anything.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Mobile Friendly</strong> — Works on desktop, tablet, and mobile browsers. Access this tool from any device with an internet connection.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Using the json path finder for day-to-day development tasks</li>
          <li>Saving time on repetitive tasks by using a browser-based tool instead of writing custom code</li>
          <li>Working on projects where installing software is not an option (school, work, shared computers)</li>
          <li>Quick prototyping and debugging without switching to a terminal or IDE</li>
          <li>Sharing the tool link with colleagues who need the same functionality</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Enter your input in the text area provided and the json path finder will process it instantly. Use the Copy button to copy the result to your clipboard. All operations are performed locally in your browser — no data is transmitted to any server.
        </p>
      
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Is the JSON Path Finder free to use?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes, the JSON Path Finder is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Is my data safe when using this tool?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Does this tool work on mobile devices?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes. The JSON Path Finder is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Do I need to install anything?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. The JSON Path Finder runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately.
            </p>
          </details>
        </div>
</div>
    </ToolLayout>
  );
}
