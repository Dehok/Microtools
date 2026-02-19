"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState(2);

  const handleFormat = () => {
    setError("");
    if (!input.trim()) {
      setError("Please enter some JSON.");
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Invalid JSON";
      setError(msg);
      setOutput("");
    }
  };

  const handleMinify = () => {
    setError("");
    if (!input.trim()) {
      setError("Please enter some JSON.");
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Invalid JSON";
      setError(msg);
      setOutput("");
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  const handleSample = () => {
    const sample = {
      name: "CodeUtilo",
      version: "1.0.0",
      tools: ["JSON Formatter", "Base64", "UUID"],
      config: { theme: "light", language: "en" },
    };
    setInput(JSON.stringify(sample));
  };

  return (
    <ToolLayout
      title="JSON Formatter & Validator Online"
      description="Format, beautify, validate, and minify JSON data instantly. Free online JSON formatter with adjustable indentation."
      relatedTools={["base64-encode-decode", "uuid-generator"]}
    >
      {/* Controls */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          onClick={handleFormat}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Format / Beautify
        </button>
        <button
          onClick={handleMinify}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
        >
          Minify
        </button>
        <button
          onClick={handleClear}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
        >
          Clear
        </button>
        <button
          onClick={handleSample}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
        >
          Sample
        </button>
        <div className="ml-auto flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">Indent:</label>
          <select
            value={indent}
            onChange={(e) => setIndent(Number(e.target.value))}
            className="rounded-md border border-gray-300 dark:border-gray-600 px-2 py-1 text-sm"
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            <option value={1}>1 tab</option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 px-4 py-2 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Editor panels */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Input</label>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {input.length} characters
            </span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"key": "value"}'
            className="h-72 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
            spellCheck={false}
          />
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Output</label>
            <CopyButton text={output} />
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="Formatted JSON will appear here..."
            className="h-72 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 font-mono text-sm"
          />
        </div>
      </div>

      
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
        <p>The JSON Formatter is a free online tool that instantly formats, validates, and minifies JSON data directly in your browser. Built for developers working with APIs, configuration files, and data pipelines, it gives you clean, readable JSON or compact production-ready output with a single click.</p>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Key Features</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong className="text-gray-700 dark:text-gray-300">Adjustable Indentation</strong> &mdash; Choose 2 spaces, 4 spaces, or tabs to match your project&apos;s code style when beautifying JSON.</li>
          <li><strong className="text-gray-700 dark:text-gray-300">Syntax Error Detection</strong> &mdash; Pinpoints the exact line and position of JSON errors including trailing commas, missing quotes, and unmatched brackets.</li>
          <li><strong className="text-gray-700 dark:text-gray-300">Minify to Single Line</strong> &mdash; Strips all whitespace and line breaks to produce a compact JSON string optimized for network transmission.</li>
          <li><strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> &mdash; All operations run locally in your browser. Your data never leaves your device.</li>
          <li><strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> &mdash; Use this tool as many times as you need without creating an account or paying anything.</li>
        </ul>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Common Use Cases</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Formatting raw REST API responses to inspect nested objects and arrays during debugging</li>
          <li>Validating package.json, tsconfig.json, or other config files before committing to version control</li>
          <li>Minifying large JSON payloads to reduce bandwidth usage in production APIs</li>
          <li>Preparing formatted JSON examples for technical documentation or code reviews</li>
          <li>Checking whether data exported from a database or spreadsheet is valid JSON</li>
        </ul>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">How to Use</h2>
        <p>Paste your JSON into the input panel on the left, or click &quot;Sample&quot; to load an example. Select your indentation from the Indent dropdown, then click &quot;Format&quot; to pretty-print or &quot;Minify&quot; to compress it. If your JSON contains errors, the error message shows the exact problem location.</p>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">What makes JSON invalid?</summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">Common causes include trailing commas after the last item, single quotes instead of double quotes, JavaScript comments, and unquoted key names. This formatter shows the exact error location to help you fix issues quickly.</p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Can I format large JSON files?</summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">Yes. The tool processes JSON in your browser using JSON.parse and JSON.stringify, so there are no server-side limits. Very large files (50 MB+) may be slow depending on your device&apos;s memory.</p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">What is the difference between 2-space and 4-space indentation?</summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">Both are cosmetic choices that do not affect the JSON meaning. Two spaces are common in JavaScript projects. Four spaces are common in Python and Java. Choose whichever matches your team&apos;s convention.</p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Why minify JSON instead of keeping it formatted?</summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">Minified JSON removes all whitespace, reducing file size by 20&ndash;30%. This matters for HTTP responses, JavaScript bundles, and database storage. Formatted JSON is only for human readability during development.</p>
          </details>
        </div>
      </div>
    </ToolLayout>
  );
}
