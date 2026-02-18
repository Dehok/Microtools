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
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The JSON Formatter is a free online tool that helps you format, beautify, validate, and minify JSON data instantly. Whether you are debugging API responses, cleaning up configuration files, or preparing JSON for documentation, this tool makes it easy to work with JSON without installing any software.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Format &amp; Beautify</strong> — Automatically indents and formats JSON with customizable spacing (2 or 4 spaces, or tabs) for maximum readability.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Validate JSON</strong> — Instantly detects and highlights syntax errors such as missing brackets, trailing commas, unquoted keys, and mismatched braces.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Minify JSON</strong> — Compresses JSON by removing all unnecessary whitespace and line breaks, reducing file size for production use.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Syntax Highlighting</strong> — Color-coded output makes it easy to distinguish between keys, values, strings, numbers, booleans, and null values.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Debugging REST API responses by formatting raw JSON payloads</li>
          <li>Cleaning up and validating JSON configuration files (package.json, tsconfig.json, etc.)</li>
          <li>Preparing JSON data for documentation, presentations, or code reviews</li>
          <li>Minifying JSON before embedding it in scripts or sending over the network</li>
          <li>Validating JSON syntax before importing data into databases or applications</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Paste your JSON data into the input area or type it directly. Click &quot;Format / Beautify&quot; to prettify the JSON with proper indentation, or click &quot;Minify&quot; to compress it into a single line. If your JSON contains errors, the tool will display the error message with the location of the problem. You can copy the formatted output to your clipboard with one click.
        </p>
      </div>
    </ToolLayout>
  );
}
