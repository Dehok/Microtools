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
    
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The Markdown Table Generator is a free online tool available on CodeUtilo. Create Markdown tables with a visual editor and column alignment. All processing happens directly in your browser — no data is ever sent to any server, ensuring your privacy and security. No signup or installation is required.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> — All markdown table generator operations run locally in your browser using JavaScript. Your data never leaves your device.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Instant Results</strong> — Get results immediately as you type or paste your input. No waiting for server responses or page reloads.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> — Use the markdown table generator as many times as you need without creating an account or paying anything.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Mobile Friendly</strong> — Works on desktop, tablet, and mobile browsers. Access this tool from any device with an internet connection.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Using the markdown table generator for day-to-day development tasks</li>
          <li>Saving time on repetitive tasks by using a browser-based tool instead of writing custom code</li>
          <li>Working on projects where installing software is not an option (school, work, shared computers)</li>
          <li>Quick prototyping and debugging without switching to a terminal or IDE</li>
          <li>Sharing the tool link with colleagues who need the same functionality</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Enter your input in the text area provided and the markdown table generator will process it instantly. Use the Copy button to copy the result to your clipboard. All operations are performed locally in your browser — no data is transmitted to any server.
        </p>
      
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Is the Markdown Table Generator free to use?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes, the Markdown Table Generator is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need.
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
              Yes. The Markdown Table Generator is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Do I need to install anything?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. The Markdown Table Generator runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately.
            </p>
          </details>
        </div>
</div>
    </ToolLayout>
  );
}
