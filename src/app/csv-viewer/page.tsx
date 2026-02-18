"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const SAMPLE_CSV = `Name,Age,City,Role,Salary
Alice Johnson,30,Prague,Developer,"85,000"
Bob Smith,25,Berlin,Designer,"72,000"
Charlie Brown,35,London,Manager,"95,000"
Diana Ross,28,Paris,Developer,"80,000"
Edward Kim,32,Tokyo,Designer,"78,000"
Fiona Chen,29,New York,Manager,"92,000"`;

function parseCsv(
  raw: string,
  delimiter: string,
  hasHeader: boolean
): { headers: string[]; rows: string[][]; error: string } {
  if (!raw.trim()) {
    return { headers: [], rows: [], error: "" };
  }

  try {
    const lines = parseLines(raw.trim(), delimiter);

    if (lines.length === 0) {
      return { headers: [], rows: [], error: "No data found." };
    }

    const maxCols = Math.max(...lines.map((l) => l.length));

    // Normalize all rows to the same column count
    const normalized = lines.map((row) => {
      while (row.length < maxCols) row.push("");
      return row;
    });

    if (hasHeader) {
      const headers = normalized[0];
      const rows = normalized.slice(1);
      return { headers, rows, error: "" };
    } else {
      const headers = Array.from({ length: maxCols }, (_, i) => `Column ${i + 1}`);
      return { headers, rows: normalized, error: "" };
    }
  } catch {
    return { headers: [], rows: [], error: "Failed to parse CSV. Check your delimiter and data format." };
  }
}

function parseLines(raw: string, delimiter: string): string[][] {
  const results: string[][] = [];
  let current: string[] = [];
  let field = "";
  let inQuotes = false;
  let i = 0;

  while (i < raw.length) {
    const ch = raw[i];

    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < raw.length && raw[i + 1] === '"') {
          // Escaped quote
          field += '"';
          i += 2;
          continue;
        } else {
          // End of quoted field
          inQuotes = false;
          i++;
          continue;
        }
      } else {
        field += ch;
        i++;
        continue;
      }
    }

    // Not in quotes
    if (ch === '"') {
      inQuotes = true;
      i++;
      continue;
    }

    if (ch === delimiter) {
      current.push(field.trim());
      field = "";
      i++;
      continue;
    }

    if (ch === "\r") {
      // Handle \r\n or lone \r
      current.push(field.trim());
      field = "";
      results.push(current);
      current = [];
      if (i + 1 < raw.length && raw[i + 1] === "\n") {
        i += 2;
      } else {
        i++;
      }
      continue;
    }

    if (ch === "\n") {
      current.push(field.trim());
      field = "";
      results.push(current);
      current = [];
      i++;
      continue;
    }

    field += ch;
    i++;
  }

  // Push last field/row
  if (field || current.length > 0) {
    current.push(field.trim());
    results.push(current);
  }

  return results;
}

type SortConfig = { col: number; dir: "asc" | "desc" } | null;

export default function CsvViewer() {
  const [input, setInput] = useState(SAMPLE_CSV);
  const [delimiter, setDelimiter] = useState(",");
  const [hasHeader, setHasHeader] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortConfig>(null);

  const parsed = useMemo(() => {
    return parseCsv(input, delimiter, hasHeader);
  }, [input, delimiter, hasHeader]);

  const filteredRows = useMemo(() => {
    if (!search.trim()) return parsed.rows;
    const term = search.toLowerCase();
    return parsed.rows.filter((row) =>
      row.some((cell) => cell.toLowerCase().includes(term))
    );
  }, [parsed.rows, search]);

  const sortedRows = useMemo(() => {
    if (!sort) return filteredRows;
    const { col, dir } = sort;
    return [...filteredRows].sort((a, b) => {
      const aVal = a[col] || "";
      const bVal = b[col] || "";

      // Try numeric comparison
      const aNum = parseFloat(aVal.replace(/,/g, ""));
      const bNum = parseFloat(bVal.replace(/,/g, ""));
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return dir === "asc" ? aNum - bNum : bNum - aNum;
      }

      // Fall back to string comparison
      const cmp = aVal.localeCompare(bVal, undefined, { sensitivity: "base" });
      return dir === "asc" ? cmp : -cmp;
    });
  }, [filteredRows, sort]);

  const handleSort = (colIndex: number) => {
    setSort((prev) => {
      if (prev && prev.col === colIndex) {
        if (prev.dir === "asc") return { col: colIndex, dir: "desc" };
        return null; // Third click removes sort
      }
      return { col: colIndex, dir: "asc" };
    });
  };

  const getSortIndicator = (colIndex: number) => {
    if (!sort || sort.col !== colIndex) return " \u2195";
    return sort.dir === "asc" ? " \u2191" : " \u2193";
  };

  const delimiterLabel: Record<string, string> = {
    ",": "Comma (,)",
    ";": "Semicolon (;)",
    "\t": "Tab",
    "|": "Pipe (|)",
  };

  return (
    <ToolLayout
      title="CSV Viewer Online"
      description="Paste CSV data and view it as a sortable, searchable table. Supports custom delimiters and quoted fields."
      relatedTools={["json-csv-converter", "markdown-table-generator", "line-sorter"]}
    >
      {/* Input */}
      <div className="mb-4">
        <div className="mb-1 flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">CSV Data</label>
          <CopyButton text={input} />
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your CSV data here..."
          className="h-40 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
          spellCheck={false}
        />
      </div>

      {/* Options */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Delimiter:</label>
          <select
            value={delimiter}
            onChange={(e) => setDelimiter(e.target.value)}
            className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-1.5 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
          >
            {Object.entries(delimiterLabel).map(([val, label]) => (
              <option key={val} value={val}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={hasHeader}
            onChange={(e) => setHasHeader(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-400 focus:ring-blue-500"
          />
          <span className="font-medium">First row is header</span>
        </label>
      </div>

      {/* Error */}
      {parsed.error && (
        <div className="mb-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 px-4 py-2 text-sm text-red-700 dark:text-red-300">
          {parsed.error}
        </div>
      )}

      {/* Stats & Search */}
      {parsed.headers.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-950 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
              {parsed.rows.length} row{parsed.rows.length !== 1 ? "s" : ""}
            </span>
            <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-950 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
              {parsed.headers.length} column{parsed.headers.length !== 1 ? "s" : ""}
            </span>
            {search.trim() && filteredRows.length !== parsed.rows.length && (
              <span className="inline-flex items-center rounded-full bg-yellow-50 dark:bg-yellow-950 px-3 py-1 text-xs font-medium text-yellow-700 dark:text-yellow-300">
                {filteredRows.length} match{filteredRows.length !== 1 ? "es" : ""}
              </span>
            )}
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search rows..."
            className="w-full max-w-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-1.5 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
          />
        </div>
      )}

      {/* Table */}
      {parsed.headers.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="whitespace-nowrap px-3 py-2 text-left text-xs font-semibold">
                  #
                </th>
                {parsed.headers.map((header, i) => (
                  <th
                    key={i}
                    onClick={() => handleSort(i)}
                    className="cursor-pointer whitespace-nowrap px-3 py-2 text-left text-xs font-semibold select-none hover:bg-blue-700 transition-colors"
                  >
                    {header}
                    <span className="ml-1 opacity-75">{getSortIndicator(i)}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={parsed.headers.length + 1}
                    className="px-3 py-6 text-center text-gray-400 dark:text-gray-500"
                  >
                    {search.trim() ? "No matching rows found." : "No data rows."}
                  </td>
                </tr>
              ) : (
                sortedRows.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    className={`border-t border-gray-100 dark:border-gray-800 transition-colors hover:bg-blue-50 dark:bg-blue-950 dark:hover:bg-blue-950 ${
                      rIdx % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-950"
                    }`}
                  >
                    <td className="whitespace-nowrap px-3 py-2 text-xs text-gray-400 dark:text-gray-500 font-mono">
                      {rIdx + 1}
                    </td>
                    {row.map((cell, cIdx) => (
                      <td
                        key={cIdx}
                        className="whitespace-nowrap px-3 py-2 text-gray-700 dark:text-gray-300"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Clear button */}
      <div className="mt-4">
        <button
          onClick={() => {
            setInput("");
            setSearch("");
            setSort(null);
          }}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
        >
          Clear
        </button>
      </div>

      {/* SEO Content */}
      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
          Online CSV Viewer & Table Viewer
        </h2>
        <p className="mb-3">
          This free online CSV viewer lets you paste or type CSV data and instantly see it
          rendered as a clean, readable table. It supports comma, semicolon, tab, and pipe
          delimiters, and correctly handles quoted fields containing delimiters or line breaks.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
          Sortable & Searchable
        </h2>
        <p className="mb-3">
          Click any column header to sort the data in ascending or descending order. Use the
          search box to filter rows instantly -- it matches against all columns. Row numbers
          help you keep track of your position in large datasets.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
          CSV Format
        </h2>
        <p>
          CSV (Comma-Separated Values) is a widely used format for tabular data. Each line
          represents a row, and values within a row are separated by a delimiter (typically a
          comma). Fields containing the delimiter, quotes, or newlines are enclosed in double
          quotes. This tool correctly parses all standard CSV formats, including RFC 4180.
        </p>
      </div>
    </ToolLayout>
  );
}
