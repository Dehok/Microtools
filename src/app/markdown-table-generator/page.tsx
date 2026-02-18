"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function MarkdownTableGenerator() {
  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(3);
  const [data, setData] = useState<string[][]>(() => {
    const initial = [
      ["Name", "Role", "Status"],
      ["Alice", "Developer", "Active"],
      ["Bob", "Designer", "Active"],
      ["Charlie", "Manager", "Away"],
    ];
    return initial;
  });
  const [alignment, setAlignment] = useState<("left" | "center" | "right")[]>(["left", "left", "left"]);

  const updateCell = (r: number, c: number, value: string) => {
    setData((prev) => {
      const next = prev.map((row) => [...row]);
      while (next.length <= r) next.push(Array(cols).fill(""));
      while (next[r].length <= c) next[r].push("");
      next[r][c] = value;
      return next;
    });
  };

  const addRow = () => {
    setRows(rows + 1);
    setData((prev) => [...prev, Array(cols).fill("")]);
  };

  const addCol = () => {
    setCols(cols + 1);
    setData((prev) => prev.map((row) => [...row, ""]));
    setAlignment((prev) => [...prev, "left"]);
  };

  const removeRow = () => {
    if (rows <= 2) return;
    setRows(rows - 1);
    setData((prev) => prev.slice(0, -1));
  };

  const removeCol = () => {
    if (cols <= 1) return;
    setCols(cols - 1);
    setData((prev) => prev.map((row) => row.slice(0, -1)));
    setAlignment((prev) => prev.slice(0, -1));
  };

  const markdown = useMemo(() => {
    const effectiveData = data.slice(0, rows).map((row) => {
      const r = row.slice(0, cols);
      while (r.length < cols) r.push("");
      return r;
    });
    while (effectiveData.length < rows) effectiveData.push(Array(cols).fill(""));

    // Calculate column widths
    const widths = Array(cols).fill(3);
    for (const row of effectiveData) {
      for (let c = 0; c < cols; c++) {
        widths[c] = Math.max(widths[c], (row[c] || "").length);
      }
    }

    // Header
    const header = effectiveData[0] || Array(cols).fill("");
    const headerLine = "| " + header.map((cell, c) => (cell || "").padEnd(widths[c])).join(" | ") + " |";

    // Separator
    const sepLine = "| " + widths.map((w, c) => {
      const a = alignment[c] || "left";
      if (a === "center") return ":" + "-".repeat(Math.max(1, w - 2)) + ":";
      if (a === "right") return "-".repeat(Math.max(1, w - 1)) + ":";
      return "-".repeat(w);
    }).join(" | ") + " |";

    // Body
    const bodyLines = effectiveData.slice(1).map((row) =>
      "| " + row.map((cell, c) => (cell || "").padEnd(widths[c])).join(" | ") + " |"
    );

    return [headerLine, sepLine, ...bodyLines].join("\n");
  }, [data, rows, cols, alignment]);

  return (
    <ToolLayout
      title="Markdown Table Generator — Create Tables Easily"
      description="Generate Markdown tables with a visual editor. Supports column alignment, adding/removing rows and columns."
      relatedTools={["markdown-preview", "json-csv-converter", "diff-checker"]}
    >
      {/* Controls */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button onClick={addRow} className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800">
          + Row
        </button>
        <button onClick={removeRow} disabled={rows <= 2} className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800 disabled:opacity-40">
          - Row
        </button>
        <button onClick={addCol} className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800">
          + Column
        </button>
        <button onClick={removeCol} disabled={cols <= 1} className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800 disabled:opacity-40">
          - Column
        </button>
      </div>

      {/* Table editor */}
      <div className="mb-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="w-8" />
              {Array.from({ length: cols }, (_, c) => (
                <th key={c} className="px-1 pb-1">
                  <select
                    value={alignment[c] || "left"}
                    onChange={(e) => {
                      const next = [...alignment];
                      next[c] = e.target.value as "left" | "center" | "right";
                      setAlignment(next);
                    }}
                    className="w-full rounded border border-gray-200 dark:border-gray-700 px-1 py-0.5 text-[10px] text-gray-500 dark:text-gray-400"
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }, (_, r) => (
              <tr key={r}>
                <td className="pr-1 text-center text-xs text-gray-400 dark:text-gray-500">
                  {r === 0 ? "H" : r}
                </td>
                {Array.from({ length: cols }, (_, c) => (
                  <td key={c} className="px-0.5 py-0.5">
                    <input
                      type="text"
                      value={data[r]?.[c] || ""}
                      onChange={(e) => updateCell(r, c, e.target.value)}
                      className={`w-full rounded border px-2 py-1 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none ${
                        r === 0
                          ? "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950 font-semibold"
                          : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950"
                      }`}
                      placeholder={r === 0 ? `Header ${c + 1}` : ""}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Markdown output */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Markdown Output</label>
          <CopyButton text={markdown} />
        </div>
        <pre className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 p-3 font-mono text-xs overflow-x-auto">
          {markdown}
        </pre>
      </div>

      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Markdown Table Syntax</h2>
        <p className="mb-3">
          Markdown tables use pipes (|) to separate columns and hyphens (-) to separate the header
          from data rows. Column alignment is set with colons: <code>:---</code> (left),
          <code> :---:</code> (center), <code>---:</code> (right).
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Where Tables Work</h2>
        <p>
          Markdown tables are supported on GitHub, GitLab, Reddit, Stack Overflow, Notion,
          and most documentation tools. They are commonly used in README files, documentation,
          and issue/PR descriptions.
        </p>
      </div>
    </ToolLayout>
  );
}
