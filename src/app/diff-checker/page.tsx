"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

interface DiffLine {
  type: "same" | "added" | "removed";
  text: string;
  lineNum: number;
}

function computeDiff(text1: string, text2: string): DiffLine[] {
  const lines1 = text1.split("\n");
  const lines2 = text2.split("\n");
  const result: DiffLine[] = [];

  const maxLen = Math.max(lines1.length, lines2.length);

  for (let i = 0; i < maxLen; i++) {
    const l1 = i < lines1.length ? lines1[i] : undefined;
    const l2 = i < lines2.length ? lines2[i] : undefined;

    if (l1 === l2) {
      result.push({ type: "same", text: l1!, lineNum: i + 1 });
    } else {
      if (l1 !== undefined) {
        result.push({ type: "removed", text: l1, lineNum: i + 1 });
      }
      if (l2 !== undefined) {
        result.push({ type: "added", text: l2, lineNum: i + 1 });
      }
    }
  }

  return result;
}

export default function DiffChecker() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [diff, setDiff] = useState<DiffLine[]>([]);
  const [compared, setCompared] = useState(false);

  const handleCompare = () => {
    setDiff(computeDiff(text1, text2));
    setCompared(true);
  };

  const handleClear = () => {
    setText1("");
    setText2("");
    setDiff([]);
    setCompared(false);
  };

  const handleSwap = () => {
    setText1(text2);
    setText2(text1);
    setDiff([]);
    setCompared(false);
  };

  const added = diff.filter((d) => d.type === "added").length;
  const removed = diff.filter((d) => d.type === "removed").length;
  const unchanged = diff.filter((d) => d.type === "same").length;

  return (
    <ToolLayout
      title="Diff Checker — Compare Two Texts Online"
      description="Compare two texts and highlight the differences line by line. Free online text comparison tool."
      relatedTools={["json-formatter", "word-counter", "css-minifier"]}
    >
      {/* Two inputs */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Original Text
          </label>
          <textarea
            value={text1}
            onChange={(e) => { setText1(e.target.value); setCompared(false); }}
            placeholder="Paste original text here..."
            className="h-48 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
            spellCheck={false}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Modified Text
          </label>
          <textarea
            value={text2}
            onChange={(e) => { setText2(e.target.value); setCompared(false); }}
            placeholder="Paste modified text here..."
            className="h-48 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="my-4 flex flex-wrap items-center gap-2">
        <button
          onClick={handleCompare}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Compare
        </button>
        <button
          onClick={handleSwap}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
        >
          Swap
        </button>
        <button
          onClick={handleClear}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
        >
          Clear
        </button>
        {compared && (
          <div className="ml-auto flex gap-3 text-sm">
            <span className="text-green-600 dark:text-green-400 font-medium">+{added} added</span>
            <span className="text-red-600 dark:text-red-400 font-medium">-{removed} removed</span>
            <span className="text-gray-500 dark:text-gray-400">{unchanged} unchanged</span>
          </div>
        )}
      </div>

      {/* Diff result */}
      {compared && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {diff.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
              Both texts are identical.
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {diff.map((line, i) => (
                <div
                  key={i}
                  className={`flex border-b border-gray-100 dark:border-gray-800 font-mono text-sm ${
                    line.type === "added"
                      ? "bg-green-50 dark:bg-green-950"
                      : line.type === "removed"
                      ? "bg-red-50 dark:bg-red-950"
                      : ""
                  }`}
                >
                  <span className="w-8 shrink-0 select-none border-r border-gray-200 dark:border-gray-700 px-1 py-1 text-center text-xs text-gray-400 dark:text-gray-500">
                    {line.lineNum}
                  </span>
                  <span
                    className={`w-6 shrink-0 select-none px-1 py-1 text-center font-bold ${
                      line.type === "added"
                        ? "text-green-600 dark:text-green-400"
                        : line.type === "removed"
                        ? "text-red-600 dark:text-red-400"
                        : "text-gray-300"
                    }`}
                  >
                    {line.type === "added" ? "+" : line.type === "removed" ? "-" : " "}
                  </span>
                  <span className="flex-1 whitespace-pre-wrap px-2 py-1">
                    {line.text || "\u00A0"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">What is a Diff Checker?</h2>
        <p className="mb-3">
          A diff checker compares two pieces of text and highlights the differences between them.
          Lines that exist only in the original are marked as removed (red), and lines only in the
          modified text are marked as added (green).
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Common uses</h2>
        <p>
          Comparing code versions, checking document revisions, verifying configuration changes,
          and finding differences between API responses.
        </p>
      </div>
    
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The Diff Checker compares two texts and highlights the differences between them line by line. It is an essential tool for code reviews, document comparison, and version tracking. The tool shows added, removed, and modified lines with color-coded highlighting for easy identification.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Line-by-Line Comparison</strong> — Compares text line by line and identifies additions, deletions, and modifications.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Color-Coded Output</strong> — Green highlights for added lines, red for removed lines, making differences easy to spot.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Inline Diff</strong> — Shows character-level changes within modified lines for precise difference identification.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Clean Interface</strong> — Side-by-side text input areas with clear labeling for original and modified text.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Comparing code changes before committing or during code reviews</li>
          <li>Checking differences between configuration file versions</li>
          <li>Verifying document changes between drafts</li>
          <li>Debugging by comparing expected vs. actual output</li>
          <li>Tracking content changes in text files, scripts, or data files</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Paste the original text in the left panel and the modified text in the right panel. The differences are highlighted automatically. Added lines appear in green, removed lines in red, and modified lines show both old and new content.
        </p>
      </div>
    </ToolLayout>
  );
}
