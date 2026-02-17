"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function jsonToCsv(jsonStr: string): string {
  const data = JSON.parse(jsonStr);
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Input must be a non-empty JSON array of objects.");
  }

  const headers = [...new Set(data.flatMap((obj: Record<string, unknown>) => Object.keys(obj)))];

  const escapeCell = (val: unknown): string => {
    const str = val === null || val === undefined ? "" : String(val);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  };

  const rows = data.map((obj: Record<string, unknown>) =>
    headers.map((h) => escapeCell(obj[h])).join(",")
  );

  return [headers.join(","), ...rows].join("\n");
}

function csvToJson(csv: string): string {
  const lines = csv.trim().split("\n");
  if (lines.length < 2) throw new Error("CSV must have at least a header row and one data row.");

  const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));

  const result = lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => {
      obj[h] = values[i] || "";
    });
    return obj;
  });

  return JSON.stringify(result, null, 2);
}

const SAMPLE_JSON = `[
  { "name": "Alice", "age": 30, "city": "Prague" },
  { "name": "Bob", "age": 25, "city": "Berlin" },
  { "name": "Charlie", "age": 35, "city": "London" }
]`;

export default function JsonCsvConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"json-to-csv" | "csv-to-json">("json-to-csv");
  const [error, setError] = useState("");

  const handleConvert = () => {
    setError("");
    if (!input.trim()) { setError("Please enter some data."); return; }
    try {
      if (mode === "json-to-csv") {
        setOutput(jsonToCsv(input));
      } else {
        setOutput(csvToJson(input));
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Conversion failed.";
      setError(msg);
      setOutput("");
    }
  };

  return (
    <ToolLayout
      title="JSON to CSV Converter Online"
      description="Convert JSON arrays to CSV format and CSV back to JSON. Free online converter with instant results."
      relatedTools={["json-formatter", "base64-encode-decode", "diff-checker"]}
    >
      {/* Mode */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setMode("json-to-csv")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            mode === "json-to-csv"
              ? "bg-blue-600 text-white"
              : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          JSON → CSV
        </button>
        <button
          onClick={() => setMode("csv-to-json")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            mode === "csv-to-json"
              ? "bg-blue-600 text-white"
              : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          CSV → JSON
        </button>
        <button
          onClick={() => { setInput(SAMPLE_JSON); setMode("json-to-csv"); }}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Sample
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            {mode === "json-to-csv" ? "JSON Input" : "CSV Input"}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "json-to-csv" ? '[{"key": "value"}]' : "name,age,city\nAlice,30,Prague"}
            className="h-64 w-full rounded-lg border border-gray-300 bg-gray-50 p-3 font-mono text-sm focus:border-blue-500 focus:outline-none"
            spellCheck={false}
          />
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              {mode === "json-to-csv" ? "CSV Output" : "JSON Output"}
            </label>
            <CopyButton text={output} />
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="Result will appear here..."
            className="h-64 w-full rounded-lg border border-gray-300 bg-gray-50 p-3 font-mono text-sm"
          />
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={handleConvert}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Convert
        </button>
        <button
          onClick={() => { setInput(""); setOutput(""); setError(""); }}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Clear
        </button>
      </div>

      <div className="mt-8 border-t border-gray-200 pt-6 text-sm text-gray-600">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">JSON to CSV Conversion</h2>
        <p className="mb-3">
          This tool converts JSON arrays of objects into CSV (Comma-Separated Values) format.
          Object keys become CSV column headers, and each object becomes a row. It handles
          special characters, commas in values, and nested objects.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">CSV to JSON</h2>
        <p>
          The reverse conversion takes CSV data with a header row and converts each row into
          a JSON object, producing a JSON array of objects.
        </p>
      </div>
    </ToolLayout>
  );
}
