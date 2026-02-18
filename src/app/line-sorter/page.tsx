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
                ? "border-blue-300 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Options */}
      <div className="mb-4 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
        <label className="flex items-center gap-1.5">
          <input
            type="checkbox"
            checked={dedupe}
            onChange={(e) => setDedupe(e.target.checked)}
            className="rounded border-gray-300 dark:border-gray-600"
          />
          Remove duplicates
        </label>
        <label className="flex items-center gap-1.5">
          <input
            type="checkbox"
            checked={trimLines}
            onChange={(e) => setTrimLines(e.target.checked)}
            className="rounded border-gray-300 dark:border-gray-600"
          />
          Trim whitespace
        </label>
        <label className="flex items-center gap-1.5">
          <input
            type="checkbox"
            checked={removeEmpty}
            onChange={(e) => setRemoveEmpty(e.target.checked)}
            className="rounded border-gray-300 dark:border-gray-600"
          />
          Remove empty lines
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Input ({inputCount} lines)
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter lines to sort..."
            className="h-64 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
            spellCheck={false}
          />
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Output ({outputCount} lines)
            </label>
            <CopyButton text={output} />
          </div>
          <textarea
            value={output}
            readOnly
            className="h-64 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 font-mono text-sm"
          />
        </div>
      </div>

      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Why Sort Lines?</h2>
        <p className="mb-3">
          Sorting lines is useful when cleaning up lists, organizing data, preparing CSV files,
          or deduplicating entries. Numeric sort handles numbers correctly (1, 2, 10 instead of 1, 10, 2).
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Use Cases</h2>
        <p>
          Common uses include sorting configuration files, organizing word lists, cleaning up
          log entries, preparing data for comparison, and removing duplicate entries from lists.
        </p>
      </div>
    
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The Line Sorter &amp; Deduplicator is a free online tool available on CodeUtilo. Sort lines alphabetically, numerically, or by length. Remove duplicates. All processing happens directly in your browser — no data is ever sent to any server, ensuring your privacy and security. No signup or installation is required.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> — All line sorter &amp; deduplicator operations run locally in your browser using JavaScript. Your data never leaves your device.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Instant Results</strong> — Get results immediately as you type or paste your input. No waiting for server responses or page reloads.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> — Use the line sorter &amp; deduplicator as many times as you need without creating an account or paying anything.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Mobile Friendly</strong> — Works on desktop, tablet, and mobile browsers. Access this tool from any device with an internet connection.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Using the line sorter &amp; deduplicator for day-to-day development tasks</li>
          <li>Saving time on repetitive tasks by using a browser-based tool instead of writing custom code</li>
          <li>Working on projects where installing software is not an option (school, work, shared computers)</li>
          <li>Quick prototyping and debugging without switching to a terminal or IDE</li>
          <li>Sharing the tool link with colleagues who need the same functionality</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Enter your input in the text area provided and the line sorter &amp; deduplicator will process it instantly. Use the Copy button to copy the result to your clipboard. All operations are performed locally in your browser — no data is transmitted to any server.
        </p>
      
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Is the Line Sorter &amp; Deduplicator free to use?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes, the Line Sorter &amp; Deduplicator is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need.
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
              Yes. The Line Sorter &amp; Deduplicator is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Do I need to install anything?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. The Line Sorter &amp; Deduplicator runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately.
            </p>
          </details>
        </div>
</div>
    </ToolLayout>
  );
}
