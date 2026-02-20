"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const SAMPLE_CSV = `id,name,age,salary,city
1,Alice,30,55000.50,Prague
2,Bob,25,42000,Berlin
3,Charlie,35,78000,London
4,Diana,28,61000.75,Paris`;

type OutputFormat = "insert" | "create-insert" | "create-only";
type DelimiterKey = "comma" | "semicolon" | "tab" | "pipe";
type QuoteChar = "double" | "single" | "none";

const DELIMITER_MAP: Record<DelimiterKey, string> = {
  comma: ",",
  semicolon: ";",
  tab: "\t",
  pipe: "|",
};

function parseCSV(csv: string, delimiter: string, quoteChar: string): string[][] {
  const rows: string[][] = [];
  const lines = csv.split("\n");

  for (const line of lines) {
    if (!line.trim()) continue;
    const cells: string[] = [];
    let current = "";
    let inQuotes = false;
    const useQuotes = quoteChar !== "";

    for (let i = 0; i < line.length; i++) {
      const ch = line[i];

      if (useQuotes && ch === quoteChar) {
        if (inQuotes && line[i + 1] === quoteChar) {
          // Escaped quote
          current += quoteChar;
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (!inQuotes && ch === delimiter) {
        cells.push(current);
        current = "";
      } else {
        current += ch;
      }
    }
    cells.push(current);
    rows.push(cells);
  }

  return rows;
}

type ColType = "INTEGER" | "REAL" | "TEXT";

function inferType(values: string[]): ColType {
  const nonEmpty = values.filter((v) => v.trim() !== "");
  if (nonEmpty.length === 0) return "TEXT";

  const allInt = nonEmpty.every((v) => /^-?\d+$/.test(v.trim()));
  if (allInt) return "INTEGER";

  const allNum = nonEmpty.every((v) => /^-?\d+(\.\d+)?$/.test(v.trim()));
  if (allNum) return "REAL";

  return "TEXT";
}

function escapeValue(val: string, colType: ColType): string {
  const trimmed = val.trim();
  if (trimmed === "" || trimmed.toUpperCase() === "NULL") return "NULL";

  if (colType === "INTEGER" && /^-?\d+$/.test(trimmed)) return trimmed;
  if (colType === "REAL" && /^-?\d+(\.\d+)?$/.test(trimmed)) return trimmed;

  // TEXT: escape single quotes by doubling them
  return `'${trimmed.replace(/'/g, "''")}'`;
}

function sanitizeColName(name: string): string {
  return name.trim().replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "") || "col";
}

interface ConversionResult {
  sql: string;
  columns: { name: string; type: ColType }[];
  rowCount: number;
  error: string;
}

function convertCsvToSql(
  csv: string,
  tableName: string,
  delimiterKey: DelimiterKey,
  hasHeader: boolean,
  outputFormat: OutputFormat,
  quoteCharKey: QuoteChar
): ConversionResult {
  const delimiter = DELIMITER_MAP[delimiterKey];
  const quoteChar = quoteCharKey === "double" ? '"' : quoteCharKey === "single" ? "'" : "";

  if (!csv.trim()) {
    return { sql: "", columns: [], rowCount: 0, error: "No CSV data provided." };
  }

  const rows = parseCSV(csv, delimiter, quoteChar);

  if (rows.length === 0) {
    return { sql: "", columns: [], rowCount: 0, error: "Could not parse any rows from input." };
  }

  const safeTable = sanitizeColName(tableName) || "my_table";

  let headers: string[];
  let dataRows: string[][];

  if (hasHeader) {
    if (rows.length < 2) {
      return { sql: "", columns: [], rowCount: 0, error: "With headers enabled, at least one data row is required." };
    }
    headers = rows[0].map((h, i) => sanitizeColName(h) || `col${i + 1}`);
    dataRows = rows.slice(1);
  } else {
    const colCount = rows[0].length;
    headers = Array.from({ length: colCount }, (_, i) => `col${i + 1}`);
    dataRows = rows;
  }

  // Infer column types from data rows
  const colTypes: ColType[] = headers.map((_, colIdx) => {
    const colValues = dataRows.map((row) => row[colIdx] ?? "");
    return inferType(colValues);
  });

  const columns = headers.map((name, i) => ({ name, type: colTypes[i] }));

  const parts: string[] = [];

  // CREATE TABLE statement
  if (outputFormat === "create-insert" || outputFormat === "create-only") {
    const colDefs = columns
      .map((col) => `  ${col.name} ${col.type}`)
      .join(",\n");
    parts.push(`CREATE TABLE ${safeTable} (\n${colDefs}\n);`);
  }

  // INSERT statements
  if (outputFormat === "insert" || outputFormat === "create-insert") {
    const colList = headers.join(", ");
    for (const row of dataRows) {
      const values = headers.map((_, i) => {
        const raw = row[i] ?? "";
        return escapeValue(raw, colTypes[i]);
      });
      parts.push(`INSERT INTO ${safeTable} (${colList}) VALUES (${values.join(", ")});`);
    }
  }

  return {
    sql: parts.join("\n"),
    columns,
    rowCount: dataRows.length,
    error: "",
  };
}

export default function CsvToSqlConverter() {
  const [csvInput, setCsvInput] = useState("");
  const [tableName, setTableName] = useState("my_table");
  const [delimiter, setDelimiter] = useState<DelimiterKey>("comma");
  const [hasHeader, setHasHeader] = useState(true);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("create-insert");
  const [quoteChar, setQuoteChar] = useState<QuoteChar>("double");

  const result = useMemo((): ConversionResult => {
    return convertCsvToSql(csvInput, tableName, delimiter, hasHeader, outputFormat, quoteChar);
  }, [csvInput, tableName, delimiter, hasHeader, outputFormat, quoteChar]);

  return (
    <ToolLayout
      title="CSV to SQL Converter Online"
      description="Convert CSV data to SQL INSERT and CREATE TABLE statements instantly. Free online tool with type detection, custom delimiters, and table options."
      relatedTools={["csv-viewer", "json-csv-converter", "sql-formatter"]}
    >
      {/* Top bar: Load Example + Clear */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setCsvInput(SAMPLE_CSV)}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800 transition-colors"
        >
          Load Example
        </button>
        <button
          onClick={() => setCsvInput("")}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800 transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Options */}
      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Table Name</label>
          <input
            type="text"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            placeholder="my_table"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-2 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Delimiter</label>
          <select
            value={delimiter}
            onChange={(e) => setDelimiter(e.target.value as DelimiterKey)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-2 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
          >
            <option value="comma">Comma ( , )</option>
            <option value="semicolon">Semicolon ( ; )</option>
            <option value="tab">Tab</option>
            <option value="pipe">Pipe ( | )</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Quote Character</label>
          <select
            value={quoteChar}
            onChange={(e) => setQuoteChar(e.target.value as QuoteChar)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-2 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
          >
            <option value="double">Double Quote ( &quot; )</option>
            <option value="single">Single Quote ( &#39; )</option>
            <option value="none">None</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Output Format</label>
          <select
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value as OutputFormat)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-2 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
          >
            <option value="insert">INSERT Statements Only</option>
            <option value="create-insert">CREATE TABLE + INSERT</option>
            <option value="create-only">CREATE TABLE Only</option>
          </select>
        </div>

        <div className="flex items-center gap-2 pt-5">
          <input
            id="has-header"
            type="checkbox"
            checked={hasHeader}
            onChange={(e) => setHasHeader(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-400 focus:ring-blue-500"
          />
          <label htmlFor="has-header" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            First row is header
          </label>
        </div>
      </div>

      {/* Input + Output */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">CSV Input</label>
          <textarea
            value={csvInput}
            onChange={(e) => setCsvInput(e.target.value)}
            placeholder={"id,name,age\n1,Alice,30\n2,Bob,25"}
            className="h-72 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 font-mono text-xs focus:border-blue-500 dark:border-blue-400 focus:outline-none"
            spellCheck={false}
          />
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">SQL Output</label>
            <CopyButton text={result.sql} />
          </div>
          <textarea
            value={result.sql}
            readOnly
            placeholder="SQL will appear here..."
            className="h-72 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 font-mono text-xs"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Error */}
      {result.error && (
        <div className="mt-3 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 px-4 py-2 text-sm text-red-700 dark:text-red-300">
          {result.error}
        </div>
      )}

      {/* Column Preview */}
      {result.columns.length > 0 && (
        <div className="mt-4">
          <h3 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Detected Columns &mdash; {result.rowCount} data row{result.rowCount !== 1 ? "s" : ""}
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.columns.map((col) => (
              <span
                key={col.name}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                  col.type === "INTEGER"
                    ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                    : col.type === "REAL"
                    ? "bg-green-100 dark:bg-green-900 text-green-800"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`}
              >
                <span>{col.name}</span>
                <span className="opacity-60">{col.type}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The CSV to SQL Converter is a free online tool available on CodeUtilo. Convert CSV data to SQL INSERT statements or CREATE TABLE queries. All processing happens directly in your browser — no data is ever sent to any server, ensuring your privacy and security. No signup or installation is required.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> — All csv to sql converter operations run locally in your browser using JavaScript. Your data never leaves your device.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Instant Results</strong> — Get results immediately as you type or paste your input. No waiting for server responses or page reloads.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> — Use the csv to sql converter as many times as you need without creating an account or paying anything.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Mobile Friendly</strong> — Works on desktop, tablet, and mobile browsers. Access this tool from any device with an internet connection.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Using the csv to sql converter for day-to-day development tasks</li>
          <li>Saving time on repetitive tasks by using a browser-based tool instead of writing custom code</li>
          <li>Working on projects where installing software is not an option (school, work, shared computers)</li>
          <li>Quick prototyping and debugging without switching to a terminal or IDE</li>
          <li>Sharing the tool link with colleagues who need the same functionality</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Enter your input in the text area provided and the csv to sql converter will process it instantly. Use the Copy button to copy the result to your clipboard. All operations are performed locally in your browser — no data is transmitted to any server.
        </p>
      
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Is the CSV to SQL Converter free to use?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes, the CSV to SQL Converter is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need.
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
              Yes. The CSV to SQL Converter is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Do I need to install anything?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. The CSV to SQL Converter runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately.
            </p>
          </details>
        </div>
</div>
    </ToolLayout>
  );
}
