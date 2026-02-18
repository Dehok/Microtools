"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function makeGrid(rows: number, cols: number, existing: string[][]): string[][] {
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => existing[r]?.[c] ?? "")
  );
}

export default function HtmlTableGenerator() {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [includeHeader, setIncludeHeader] = useState(true);
  const [includeBorder, setIncludeBorder] = useState(false);
  const [striped, setStriped] = useState(false);
  const [responsive, setResponsive] = useState(false);
  const [data, setData] = useState<string[][]>(() =>
    makeGrid(3, 3, [
      ["Name", "Role", "Status"],
      ["Alice", "Developer", "Active"],
      ["Bob", "Designer", "Active"],
    ])
  );

  const updateCell = (r: number, c: number, value: string) => {
    setData((prev) => {
      const next = prev.map((row) => [...row]);
      next[r][c] = value;
      return next;
    });
  };

  const addRow = () => {
    const newRows = rows + 1;
    if (newRows > 50) return;
    setRows(newRows);
    setData((prev) => [...prev, Array(cols).fill("")]);
  };

  const removeRow = () => {
    const newRows = rows - 1;
    if (newRows < 1) return;
    setRows(newRows);
    setData((prev) => prev.slice(0, -1));
  };

  const addCol = () => {
    const newCols = cols + 1;
    if (newCols > 20) return;
    setCols(newCols);
    setData((prev) => prev.map((row) => [...row, ""]));
  };

  const removeCol = () => {
    const newCols = cols - 1;
    if (newCols < 1) return;
    setCols(newCols);
    setData((prev) => prev.map((row) => row.slice(0, -1)));
  };

  const handleRowsInput = (value: number) => {
    const clamped = Math.min(50, Math.max(1, value));
    setRows(clamped);
    setData((prev) => makeGrid(clamped, cols, prev));
  };

  const handleColsInput = (value: number) => {
    const clamped = Math.min(20, Math.max(1, value));
    setCols(clamped);
    setData((prev) => makeGrid(rows, clamped, prev));
  };

  const generatedHtml = useMemo(() => {
    const indent = "  ";
    const cellStyle = includeBorder ? ' style="border: 1px solid #ccc; padding: 8px 12px;"' : ' style="padding: 8px 12px;"';
    const tableStyle = includeBorder
      ? ' style="border-collapse: collapse; width: 100%;"'
      : ' style="width: 100%; border-collapse: collapse;"';

    const lines: string[] = [];

    if (responsive) {
      lines.push('<div style="overflow-x: auto;">');
    }

    lines.push(`<table${tableStyle}>`);

    const startRow = includeHeader ? 1 : 0;

    if (includeHeader && data.length > 0) {
      lines.push(`${indent}<thead>`);
      lines.push(`${indent}${indent}<tr>`);
      const headerRow = data[0] ?? [];
      for (let c = 0; c < cols; c++) {
        const cell = headerRow[c] ?? "";
        lines.push(`${indent}${indent}${indent}<th${cellStyle}>${cell}</th>`);
      }
      lines.push(`${indent}${indent}</tr>`);
      lines.push(`${indent}</thead>`);
    }

    lines.push(`${indent}<tbody>`);
    for (let r = startRow; r < rows; r++) {
      const bodyIndex = r - startRow;
      const isEven = bodyIndex % 2 === 0;
      const rowStyle =
        striped && !isEven
          ? ' style="background-color: #f5f5f5;"'
          : "";
      lines.push(`${indent}${indent}<tr${rowStyle}>`);
      const rowData = data[r] ?? [];
      for (let c = 0; c < cols; c++) {
        const cell = rowData[c] ?? "";
        lines.push(`${indent}${indent}${indent}<td${cellStyle}>${cell}</td>`);
      }
      lines.push(`${indent}${indent}</tr>`);
    }
    lines.push(`${indent}</tbody>`);
    lines.push("</table>");

    if (responsive) {
      lines.push("</div>");
    }

    return lines.join("\n");
  }, [data, rows, cols, includeHeader, includeBorder, striped, responsive]);

  // Build preview table styles inline
  const previewTableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    ...(includeBorder ? { border: "1px solid #ccc" } : {}),
  };

  const previewCellStyle: React.CSSProperties = {
    padding: "8px 12px",
    ...(includeBorder ? { border: "1px solid #ccc" } : { borderBottom: "1px solid #e5e7eb" }),
  };

  const previewHeaderCellStyle: React.CSSProperties = {
    ...previewCellStyle,
    fontWeight: 600,
    backgroundColor: "#f9fafb",
  };

  const startRow = includeHeader ? 1 : 0;

  return (
    <ToolLayout
      title="HTML Table Generator"
      description="Generate clean HTML table code with a visual editor. Customize rows, columns, borders, striped rows, and more."
      relatedTools={["markdown-table-generator", "csv-viewer", "html-minifier"]}
    >
      {/* Options row */}
      <div className="mb-5 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
            Rows <span className="text-gray-400 dark:text-gray-500">(1–50)</span>
          </label>
          <input
            type="number"
            min={1}
            max={50}
            value={rows}
            onChange={(e) => handleRowsInput(Number(e.target.value))}
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 px-3 py-1.5 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
            Columns <span className="text-gray-400 dark:text-gray-500">(1–20)</span>
          </label>
          <input
            type="number"
            min={1}
            max={20}
            value={cols}
            onChange={(e) => handleColsInput(Number(e.target.value))}
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 px-3 py-1.5 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-2 pt-1">
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includeHeader}
              onChange={(e) => setIncludeHeader(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 accent-blue-600"
            />
            Include header row
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includeBorder}
              onChange={(e) => setIncludeBorder(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 accent-blue-600"
            />
            Include border
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={striped}
              onChange={(e) => setStriped(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 accent-blue-600"
            />
            Striped rows
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={responsive}
              onChange={(e) => setResponsive(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 accent-blue-600"
            />
            Responsive wrapper
          </label>
        </div>
      </div>

      {/* Add/Remove buttons */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={addRow}
          disabled={rows >= 50}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800 disabled:opacity-40"
        >
          + Row
        </button>
        <button
          onClick={removeRow}
          disabled={rows <= 1}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800 disabled:opacity-40"
        >
          - Row
        </button>
        <button
          onClick={addCol}
          disabled={cols >= 20}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800 disabled:opacity-40"
        >
          + Column
        </button>
        <button
          onClick={removeCol}
          disabled={cols <= 1}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800 disabled:opacity-40"
        >
          - Column
        </button>
      </div>

      {/* Visual table editor */}
      <div className="mb-6 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm">
          {includeHeader && data.length > 0 && (
            <thead>
              <tr>
                {Array.from({ length: cols }, (_, c) => (
                  <th key={c} className="px-1 py-1 bg-blue-50 dark:bg-blue-950">
                    <input
                      type="text"
                      value={data[0]?.[c] ?? ""}
                      onChange={(e) => updateCell(0, c, e.target.value)}
                      placeholder={`Header ${c + 1}`}
                      className="w-full min-w-[80px] rounded border border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-900 px-2 py-1 text-sm font-semibold focus:border-blue-500 dark:border-blue-400 focus:outline-none"
                    />
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {Array.from({ length: rows - startRow }, (_, rowIdx) => {
              const r = rowIdx + startRow;
              return (
                <tr key={r} className={striped && rowIdx % 2 !== 0 ? "bg-gray-50 dark:bg-gray-950" : "bg-white dark:bg-gray-900"}>
                  {Array.from({ length: cols }, (_, c) => (
                    <td key={c} className="px-1 py-0.5 border-b border-gray-100 dark:border-gray-800">
                      <input
                        type="text"
                        value={data[r]?.[c] ?? ""}
                        onChange={(e) => updateCell(r, c, e.target.value)}
                        placeholder={`Cell ${r + 1},${c + 1}`}
                        className="w-full min-w-[80px] rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 px-2 py-1 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
                      />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Preview section */}
      <div className="mb-6">
        <h2 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Preview</h2>
        <div
          className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4"
          style={responsive ? { overflowX: "auto" } : {}}
        >
          <table style={previewTableStyle}>
            {includeHeader && data.length > 0 && (
              <thead>
                <tr>
                  {Array.from({ length: cols }, (_, c) => (
                    <th key={c} style={previewHeaderCellStyle}>
                      {data[0]?.[c] || `Header ${c + 1}`}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {Array.from({ length: rows - startRow }, (_, rowIdx) => {
                const r = rowIdx + startRow;
                const isEvenBody = rowIdx % 2 === 0;
                const rowBg = striped && !isEvenBody ? { backgroundColor: "#f5f5f5" } : {};
                return (
                  <tr key={r} style={rowBg}>
                    {Array.from({ length: cols }, (_, c) => (
                      <td key={c} style={previewCellStyle}>
                        {data[r]?.[c] || ""}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* HTML output */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Generated HTML</label>
          <CopyButton text={generatedHtml} />
        </div>
        <pre className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 p-3 font-mono text-xs leading-relaxed">
          {generatedHtml}
        </pre>
      </div>

      {/* SEO content */}
      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">What Is an HTML Table?</h2>
        <p className="mb-4">
          An HTML table is a structured grid of rows and columns defined with the{" "}
          <code className="rounded bg-gray-100 dark:bg-gray-800 px-1 py-0.5 font-mono text-xs">&lt;table&gt;</code>,{" "}
          <code className="rounded bg-gray-100 dark:bg-gray-800 px-1 py-0.5 font-mono text-xs">&lt;tr&gt;</code>,{" "}
          <code className="rounded bg-gray-100 dark:bg-gray-800 px-1 py-0.5 font-mono text-xs">&lt;th&gt;</code>, and{" "}
          <code className="rounded bg-gray-100 dark:bg-gray-800 px-1 py-0.5 font-mono text-xs">&lt;td&gt;</code>{" "}
          elements. Tables are used to display tabular data such as comparisons, schedules, and pricing grids.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">How to Use This Tool</h2>
        <p className="mb-4">
          Set the number of rows and columns, then type directly into the cells. Toggle options
          to add a header row, enable borders, apply striped row colors, or wrap the table in a
          responsive container. The generated HTML updates instantly and can be copied with one click.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Responsive Tables</h2>
        <p>
          Enabling the responsive wrapper adds{" "}
          <code className="rounded bg-gray-100 dark:bg-gray-800 px-1 py-0.5 font-mono text-xs">overflow-x: auto</code>{" "}
          to a wrapping div, allowing the table to scroll horizontally on small screens without
          breaking the page layout. This is a common best practice for tables with many columns.
        </p>
      </div>
    
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The HTML Table Generator is a free online tool available on CodeUtilo. Create HTML tables with a visual editor. Set rows, columns, headers, and styling. All processing happens directly in your browser — no data is ever sent to any server, ensuring your privacy and security. No signup or installation is required.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> — All html table generator operations run locally in your browser using JavaScript. Your data never leaves your device.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Instant Results</strong> — Get results immediately as you type or paste your input. No waiting for server responses or page reloads.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> — Use the html table generator as many times as you need without creating an account or paying anything.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Mobile Friendly</strong> — Works on desktop, tablet, and mobile browsers. Access this tool from any device with an internet connection.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Using the html table generator for day-to-day development tasks</li>
          <li>Saving time on repetitive tasks by using a browser-based tool instead of writing custom code</li>
          <li>Working on projects where installing software is not an option (school, work, shared computers)</li>
          <li>Quick prototyping and debugging without switching to a terminal or IDE</li>
          <li>Sharing the tool link with colleagues who need the same functionality</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Enter your input in the text area provided and the html table generator will process it instantly. Use the Copy button to copy the result to your clipboard. All operations are performed locally in your browser — no data is transmitted to any server.
        </p>
      </div>
    </ToolLayout>
  );
}
