"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const CELL_COLORS = [
  "#bfdbfe", "#bbf7d0", "#fef08a", "#e9d5ff", "#fbcfe8", "#c7d2fe",
  "#fecaca", "#99f6e4", "#fed7aa", "#a5f3fc", "#d9f99d", "#fde68a",
  "#a7f3d0", "#ddd6fe", "#f5d0fe", "#fecdd3", "#bae6fd", "#93c5fd",
  "#86efac", "#fde047", "#c084fc", "#f9a8d4", "#a5b4fc", "#fca5a5",
  "#5eead4", "#fdba74", "#67e8f9", "#bef264", "#fcd34d", "#6ee7b7",
  "#c4b5fd", "#f0abfc", "#fda4af", "#7dd3fc", "#dbeafe", "#dcfce7",
  "#fef9c3", "#f3e8ff", "#fce7f3", "#e0e7ff", "#fee2e2", "#ccfbf1",
  "#ffedd5", "#cffafe", "#ecfccb", "#fef3c7", "#d1fae5", "#ede9fe",
  "#60a5fa", "#4ade80", "#facc15", "#a855f7", "#f472b6", "#818cf8",
  "#f87171", "#2dd4bf", "#fb923c", "#22d3ee", "#a3e635", "#fbbf24",
  "#34d399", "#a78bfa", "#e879f9", "#fb7185", "#38bdf8", "#3b82f6",
  "#22c55e", "#eab308", "#9333ea", "#ec4899", "#6366f1", "#ef4444",
  "#14b8a6", "#f97316", "#06b6d4", "#84cc16", "#f59e0b", "#10b981",
  "#8b5cf6", "#d946ef", "#f43f5e", "#0ea5e9", "#2563eb", "#16a34a",
  "#ca8a04", "#7c3aed", "#db2777", "#4f46e5", "#dc2626", "#0d9488",
  "#ea580c", "#0891b2", "#65a30d", "#d97706", "#059669", "#7c3aed",
];

const JUSTIFY_OPTIONS = ["start", "end", "center", "stretch"] as const;
const ALIGN_OPTIONS = ["start", "end", "center", "stretch"] as const;

const COLUMN_PRESETS = [
  { name: "Equal", value: "1fr 1fr 1fr" },
  { name: "2:1", value: "2fr 1fr" },
  { name: "1:2:1", value: "1fr 2fr 1fr" },
  { name: "Sidebar", value: "250px 1fr" },
];

const ROW_PRESETS = [
  { name: "Equal", value: "1fr 1fr 1fr" },
  { name: "Header+Content", value: "auto 1fr" },
  { name: "Header+Content+Footer", value: "auto 1fr auto" },
];

export default function CSSGridGenerator() {
  const [columns, setColumns] = useState(3);
  const [rows, setRows] = useState(3);
  const [columnGap, setColumnGap] = useState(10);
  const [rowGap, setRowGap] = useState(10);
  const [templateColumns, setTemplateColumns] = useState("1fr 1fr 1fr");
  const [templateRows, setTemplateRows] = useState("1fr 1fr 1fr");
  const [justifyItems, setJustifyItems] = useState<string>("stretch");
  const [alignItems, setAlignItems] = useState<string>("stretch");

  const totalCells = columns * rows;

  const css = useMemo(() => {
    const lines: string[] = [
      "display: grid;",
      `grid-template-columns: ${templateColumns};`,
      `grid-template-rows: ${templateRows};`,
      `column-gap: ${columnGap}px;`,
      `row-gap: ${rowGap}px;`,
    ];
    if (justifyItems !== "stretch") {
      lines.push(`justify-items: ${justifyItems};`);
    }
    if (alignItems !== "stretch") {
      lines.push(`align-items: ${alignItems};`);
    }
    return `.grid-container {\n  ${lines.join("\n  ")}\n}`;
  }, [templateColumns, templateRows, columnGap, rowGap, justifyItems, alignItems]);

  return (
    <ToolLayout
      title="CSS Grid Generator"
      description="Build CSS Grid layouts visually. Configure columns, rows, gaps, and alignment. Preview the grid and copy ready-to-use CSS code."
      relatedTools={["flexbox-generator", "box-shadow-generator", "css-minifier"]}
    >
      {/* Controls */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        {/* Columns slider */}
        <div>
          <label className="mb-1 flex items-center justify-between text-xs font-medium text-gray-700 dark:text-gray-300">
            Columns
            <span className="font-mono text-gray-500 dark:text-gray-400">{columns}</span>
          </label>
          <input
            type="range"
            min={1}
            max={12}
            value={columns}
            onChange={(e) => {
              const v = parseInt(e.target.value);
              setColumns(v);
              setTemplateColumns(Array(v).fill("1fr").join(" "));
            }}
            className="w-full"
          />
        </div>

        {/* Rows slider */}
        <div>
          <label className="mb-1 flex items-center justify-between text-xs font-medium text-gray-700 dark:text-gray-300">
            Rows
            <span className="font-mono text-gray-500 dark:text-gray-400">{rows}</span>
          </label>
          <input
            type="range"
            min={1}
            max={8}
            value={rows}
            onChange={(e) => {
              const v = parseInt(e.target.value);
              setRows(v);
              setTemplateRows(Array(v).fill("1fr").join(" "));
            }}
            className="w-full"
          />
        </div>

        {/* Column Gap */}
        <div>
          <label className="mb-1 flex items-center justify-between text-xs font-medium text-gray-700 dark:text-gray-300">
            Column Gap
            <span className="font-mono text-gray-500 dark:text-gray-400">{columnGap}px</span>
          </label>
          <input
            type="range"
            min={0}
            max={50}
            value={columnGap}
            onChange={(e) => setColumnGap(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Row Gap */}
        <div>
          <label className="mb-1 flex items-center justify-between text-xs font-medium text-gray-700 dark:text-gray-300">
            Row Gap
            <span className="font-mono text-gray-500 dark:text-gray-400">{rowGap}px</span>
          </label>
          <input
            type="range"
            min={0}
            max={50}
            value={rowGap}
            onChange={(e) => setRowGap(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Template Columns */}
      <div className="mb-4">
        <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
          grid-template-columns
        </label>
        <input
          type="text"
          value={templateColumns}
          onChange={(e) => setTemplateColumns(e.target.value)}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-2 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="e.g. 1fr 2fr 1fr"
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {COLUMN_PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => {
                setTemplateColumns(p.value);
                setColumns(p.value.split(/\s+/).length);
              }}
              className="rounded-lg border border-blue-600 bg-blue-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-blue-700"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Template Rows */}
      <div className="mb-4">
        <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
          grid-template-rows
        </label>
        <input
          type="text"
          value={templateRows}
          onChange={(e) => setTemplateRows(e.target.value)}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-2 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="e.g. auto 1fr auto"
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {ROW_PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => {
                setTemplateRows(p.value);
                setRows(p.value.split(/\s+/).length);
              }}
              className="rounded-lg border border-blue-600 bg-blue-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-blue-700"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Justify & Align */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
            justify-items
          </label>
          <select
            value={justifyItems}
            onChange={(e) => setJustifyItems(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-2 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {JUSTIFY_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
            align-items
          </label>
          <select
            value={alignItems}
            onChange={(e) => setAlignItems(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-2 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {ALIGN_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid Preview */}
      <div className="mb-6">
        <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">Preview</h3>
        <div
          className="overflow-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-4"
          style={{ minHeight: "200px" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: templateColumns,
              gridTemplateRows: templateRows,
              columnGap: `${columnGap}px`,
              rowGap: `${rowGap}px`,
              justifyItems: justifyItems as React.CSSProperties["justifyItems"],
              alignItems: alignItems as React.CSSProperties["alignItems"],
              minHeight: "180px",
            }}
          >
            {Array.from({ length: totalCells }, (_, i) => (
              <div
                key={i}
                className="flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-600 text-sm font-semibold text-gray-700 dark:text-gray-300"
                style={{
                  minHeight: "48px",
                  minWidth: "48px",
                  backgroundColor: CELL_COLORS[i % CELL_COLORS.length],
                }}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CSS Output */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Generated CSS</label>
          <CopyButton text={css} />
        </div>
        <pre className="mt-1 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-900 p-4 font-mono text-sm text-green-400">
          {css}
        </pre>
      </div>

      
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The CSS Grid Generator is a free online tool available on CodeUtilo. Create CSS Grid layouts with a visual editor. Set columns, rows, and gap. All processing happens directly in your browser — no data is ever sent to any server, ensuring your privacy and security. No signup or installation is required.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> — All css grid generator operations run locally in your browser using JavaScript. Your data never leaves your device.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Instant Results</strong> — Get results immediately as you type or paste your input. No waiting for server responses or page reloads.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> — Use the css grid generator as many times as you need without creating an account or paying anything.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Mobile Friendly</strong> — Works on desktop, tablet, and mobile browsers. Access this tool from any device with an internet connection.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Using the css grid generator for day-to-day development tasks</li>
          <li>Saving time on repetitive tasks by using a browser-based tool instead of writing custom code</li>
          <li>Working on projects where installing software is not an option (school, work, shared computers)</li>
          <li>Quick prototyping and debugging without switching to a terminal or IDE</li>
          <li>Sharing the tool link with colleagues who need the same functionality</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Enter your input in the text area provided and the css grid generator will process it instantly. Use the Copy button to copy the result to your clipboard. All operations are performed locally in your browser — no data is transmitted to any server.
        </p>
      </div>
    </ToolLayout>
  );
}
