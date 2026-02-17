"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

type SortMode = "az" | "za" | "short" | "long" | "reverse" | "shuffle" | "numeric";

export default function LineSorter() {
  const [input, setInput] = useState("banana\napple\ncherry\napple\ndate\nbanana\nelderberry");
  const [mode, setMode] = useState<SortMode>("az");
  const [dedupe, setDedupe] = useState(false);
  const [trimLines, setTrimLines] = useState(true);
  const [removeEmpty, setRemoveEmpty] = useState(true);

  const output = useMemo(() => {
    let lines = input.split("\n");

    if (trimLines) lines = lines.map((l) => l.trim());
    if (removeEmpty) lines = lines.filter((l) => l.length > 0);
    if (dedupe) lines = [...new Set(lines)];

    switch (mode) {
      case "az":
        lines.sort((a, b) => a.localeCompare(b));
        break;
      case "za":
        lines.sort((a, b) => b.localeCompare(a));
        break;
      case "short":
        lines.sort((a, b) => a.length - b.length);
        break;
      case "long":
        lines.sort((a, b) => b.length - a.length);
        break;
      case "reverse":
        lines.reverse();
        break;
      case "shuffle":
        for (let i = lines.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [lines[i], lines[j]] = [lines[j], lines[i]];
        }
        break;
      case "numeric":
        lines.sort((a, b) => {
          const na = parseFloat(a);
          const nb = parseFloat(b);
          if (isNaN(na) && isNaN(nb)) return a.localeCompare(b);
          if (isNaN(na)) return 1;
          if (isNaN(nb)) return -1;
          return na - nb;
        });
        break;
    }

    return lines.join("\n");
  }, [input, mode, dedupe, trimLines, removeEmpty]);

  const inputCount = input.split("\n").filter((l) => l.trim()).length;
  const outputCount = output.split("\n").filter((l) => l.trim()).length;

  const MODES: { id: SortMode; label: string }[] = [
    { id: "az", label: "A → Z" },
    { id: "za", label: "Z → A" },
    { id: "numeric", label: "Numeric" },
    { id: "short", label: "Shortest first" },
    { id: "long", label: "Longest first" },
    { id: "reverse", label: "Reverse order" },
    { id: "shuffle", label: "Shuffle" },
  ];

  return (
    <ToolLayout
      title="Line Sorter & Deduplicator Online"
      description="Sort lines alphabetically, numerically, by length, or randomly. Remove duplicates and empty lines."
      relatedTools={["diff-checker", "word-counter", "text-case-converter"]}
    >
      {/* Sort mode */}
      <div className="mb-4 flex flex-wrap gap-2">
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              mode === m.id
                ? "border-blue-300 bg-blue-50 text-blue-700"
                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Options */}
      <div className="mb-4 flex flex-wrap gap-4 text-sm text-gray-600">
        <label className="flex items-center gap-1.5">
          <input
            type="checkbox"
            checked={dedupe}
            onChange={(e) => setDedupe(e.target.checked)}
            className="rounded border-gray-300"
          />
          Remove duplicates
        </label>
        <label className="flex items-center gap-1.5">
          <input
            type="checkbox"
            checked={trimLines}
            onChange={(e) => setTrimLines(e.target.checked)}
            className="rounded border-gray-300"
          />
          Trim whitespace
        </label>
        <label className="flex items-center gap-1.5">
          <input
            type="checkbox"
            checked={removeEmpty}
            onChange={(e) => setRemoveEmpty(e.target.checked)}
            className="rounded border-gray-300"
          />
          Remove empty lines
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Input ({inputCount} lines)
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter lines to sort..."
            className="h-64 w-full rounded-lg border border-gray-300 bg-gray-50 p-3 font-mono text-sm focus:border-blue-500 focus:outline-none"
            spellCheck={false}
          />
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Output ({outputCount} lines)
            </label>
            <CopyButton text={output} />
          </div>
          <textarea
            value={output}
            readOnly
            className="h-64 w-full rounded-lg border border-gray-300 bg-gray-50 p-3 font-mono text-sm"
          />
        </div>
      </div>

      <div className="mt-8 border-t border-gray-200 pt-6 text-sm text-gray-600">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Why Sort Lines?</h2>
        <p className="mb-3">
          Sorting lines is useful when cleaning up lists, organizing data, preparing CSV files,
          or deduplicating entries. Numeric sort handles numbers correctly (1, 2, 10 instead of 1, 10, 2).
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Use Cases</h2>
        <p>
          Common uses include sorting configuration files, organizing word lists, cleaning up
          log entries, preparing data for comparison, and removing duplicate entries from lists.
        </p>
      </div>
    </ToolLayout>
  );
}
