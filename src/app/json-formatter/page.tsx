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
      name: "MicroTools",
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
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Minify
        </button>
        <button
          onClick={handleClear}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Clear
        </button>
        <button
          onClick={handleSample}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Sample
        </button>
        <div className="ml-auto flex items-center gap-2">
          <label className="text-sm text-gray-600">Indent:</label>
          <select
            value={indent}
            onChange={(e) => setIndent(Number(e.target.value))}
            className="rounded-md border border-gray-300 px-2 py-1 text-sm"
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            <option value={1}>1 tab</option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Editor panels */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Input</label>
            <span className="text-xs text-gray-400">
              {input.length} characters
            </span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"key": "value"}'
            className="h-72 w-full rounded-lg border border-gray-300 bg-gray-50 p-3 font-mono text-sm focus:border-blue-500 focus:outline-none"
            spellCheck={false}
          />
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Output</label>
            <CopyButton text={output} />
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="Formatted JSON will appear here..."
            className="h-72 w-full rounded-lg border border-gray-300 bg-gray-50 p-3 font-mono text-sm"
          />
        </div>
      </div>

      {/* SEO Content */}
      <div className="mt-8 border-t border-gray-200 pt-6 text-sm text-gray-600">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          What is JSON?
        </h2>
        <p className="mb-3">
          JSON (JavaScript Object Notation) is a lightweight data interchange
          format that is easy for humans to read and write, and easy for machines
          to parse and generate. It is widely used in web APIs, configuration
          files, and data storage.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          How to use this JSON Formatter
        </h2>
        <p className="mb-3">
          Paste your JSON data into the input field and click &quot;Format /
          Beautify&quot; to prettify it with proper indentation. Use
          &quot;Minify&quot; to compress JSON by removing whitespace. The tool
          also validates your JSON and shows errors if the syntax is invalid.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">FAQ</h2>
        <p className="mb-1 font-medium">Is my data safe?</p>
        <p className="mb-3">
          Yes. All processing happens directly in your browser. No data is sent
          to any server.
        </p>
        <p className="mb-1 font-medium">
          What JSON errors can this tool detect?
        </p>
        <p>
          This tool detects syntax errors like missing brackets, incorrect
          commas, unquoted keys, and other invalid JSON structures.
        </p>
      </div>
    </ToolLayout>
  );
}
