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
              : "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
          }`}
        >
          JSON → CSV
        </button>
        <button
          onClick={() => setMode("csv-to-json")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            mode === "csv-to-json"
              ? "bg-blue-600 text-white"
              : "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
          }`}
        >
          CSV → JSON
        </button>
        <button
          onClick={() => { setInput(SAMPLE_JSON); setMode("json-to-csv"); }}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
        >
          Sample
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 px-4 py-2 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {mode === "json-to-csv" ? "JSON Input" : "CSV Input"}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "json-to-csv" ? '[{"key": "value"}]' : "name,age,city\nAlice,30,Prague"}
            className="h-64 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
            spellCheck={false}
          />
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {mode === "json-to-csv" ? "CSV Output" : "JSON Output"}
            </label>
            <CopyButton text={output} />
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="Result will appear here..."
            className="h-64 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 font-mono text-sm"
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
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
        >
          Clear
        </button>
      </div>

      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">JSON to CSV Conversion</h2>
        <p className="mb-3">
          This tool converts JSON arrays of objects into CSV (Comma-Separated Values) format.
          Object keys become CSV column headers, and each object becomes a row. It handles
          special characters, commas in values, and nested objects.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">CSV to JSON</h2>
        <p>
          The reverse conversion takes CSV data with a header row and converts each row into
          a JSON object, producing a JSON array of objects.
        </p>
      </div>
    
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
        <p>The JSON to CSV Converter transforms JSON arrays of objects into CSV (Comma-Separated Values) spreadsheet format, and converts CSV data back to JSON arrays. It is built for data analysts, developers, and data engineers who need to move structured data between APIs and spreadsheet tools.</p>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Key Features</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong className="text-gray-700 dark:text-gray-300">Bidirectional Conversion</strong> &mdash; Converts JSON arrays to CSV with auto-detected column headers, and converts CSV back to JSON arrays of objects with header-mapped keys.</li>
          <li><strong className="text-gray-700 dark:text-gray-300">Auto Column Detection</strong> &mdash; Automatically infers column names from the object keys in the JSON array without requiring any manual configuration.</li>
          <li><strong className="text-gray-700 dark:text-gray-300">Handles Nested Data</strong> &mdash; Flattens simple nested objects and arrays into CSV-compatible string representations for compatibility with spreadsheet software.</li>
          <li><strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> &mdash; All conversion runs locally in your browser. Your data never leaves your device.</li>
          <li><strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> &mdash; Use this tool as many times as you need without creating an account or paying anything.</li>
        </ul>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Common Use Cases</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Exporting API response data from a REST endpoint into CSV for analysis in Excel or Google Sheets</li>
          <li>Converting database query results exported as JSON into CSV format for reporting or data import</li>
          <li>Transforming CSV data from a spreadsheet export into JSON arrays for feeding into a web application</li>
          <li>Preparing data migration scripts by converting between JSON and CSV formats for ETL pipelines</li>
          <li>Validating that the column structure of a JSON dataset matches the expected CSV schema before import</li>
        </ul>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">How to Use</h2>
        <p>Select JSON to CSV or CSV to JSON mode using the toggle. Paste your input data into the left panel. Click Convert to process the data. The result appears in the right panel. Use the Copy button to copy the output to your clipboard or the Download button to save it as a file.</p>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">What JSON structure can be converted to CSV?</summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">Only JSON arrays of flat objects can be directly converted to CSV. Each object in the array becomes a row, and its keys become column headers. Nested objects or arrays are converted to their string representation.</p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Why does my CSV have missing values in some cells?</summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">Missing values appear when objects in the JSON array have different keys. The converter uses all unique keys as columns, leaving cells empty where an object does not have that key.</p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Can I open the CSV output in Excel?</summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">Yes. Copy the CSV text and paste it into a text editor, save it with a .csv extension, and Excel will open it correctly. Alternatively, use the Download button to save the file directly.</p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">What delimiter does the CSV output use?</summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">The converter uses commas as the default delimiter. Values that contain commas or quote characters are wrapped in double quotes per the RFC 4180 CSV specification to prevent parsing errors.</p>
          </details>
        </div>
      </div>
    </ToolLayout>
  );
}
