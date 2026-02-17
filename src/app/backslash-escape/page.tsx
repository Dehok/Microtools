"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function escapeString(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/'/g, "\\'")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t")
    .replace(/\0/g, "\\0");
}

function unescapeString(s: string): string {
  let result = "";
  let i = 0;
  while (i < s.length) {
    if (s[i] === "\\" && i + 1 < s.length) {
      const next = s[i + 1];
      switch (next) {
        case "n": result += "\n"; i += 2; continue;
        case "r": result += "\r"; i += 2; continue;
        case "t": result += "\t"; i += 2; continue;
        case "\\": result += "\\"; i += 2; continue;
        case '"': result += '"'; i += 2; continue;
        case "'": result += "'"; i += 2; continue;
        case "0": result += "\0"; i += 2; continue;
        default: result += s[i]; i++; continue;
      }
    }
    result += s[i];
    i++;
  }
  return result;
}

export default function BackslashEscape() {
  const [input, setInput] = useState('Hello "World"\nThis is a\tnew line.');
  const [mode, setMode] = useState<"escape" | "unescape">("escape");

  const output = useMemo(() => {
    if (!input) return "";
    return mode === "escape" ? escapeString(input) : unescapeString(input);
  }, [input, mode]);

  return (
    <ToolLayout
      title="Backslash Escape / Unescape Online"
      description="Escape or unescape special characters in strings. Handles newlines, tabs, quotes, and backslashes."
      relatedTools={["url-encoder-decoder", "html-encoder-decoder", "base64-encode-decode"]}
    >
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setMode("escape")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            mode === "escape"
              ? "bg-blue-600 text-white"
              : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          Escape
        </button>
        <button
          onClick={() => setMode("unescape")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            mode === "unescape"
              ? "bg-blue-600 text-white"
              : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          Unescape
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            {mode === "escape" ? "Raw String" : "Escaped String"}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === "escape"
                ? 'Hello "World"\nNew line here'
                : 'Hello \\"World\\"\\nNew line here'
            }
            className="h-48 w-full rounded-lg border border-gray-300 bg-gray-50 p-3 font-mono text-sm focus:border-blue-500 focus:outline-none"
            spellCheck={false}
          />
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              {mode === "escape" ? "Escaped" : "Unescaped"}
            </label>
            <CopyButton text={output} />
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="Result will appear here..."
            className="h-48 w-full rounded-lg border border-gray-300 bg-gray-50 p-3 font-mono text-sm"
          />
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => {
            setInput(output);
            setMode(mode === "escape" ? "unescape" : "escape");
          }}
          disabled={!output}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40"
        >
          Swap
        </button>
        <button
          onClick={() => setInput("")}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Clear
        </button>
      </div>

      {/* Escape reference */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm">
        <h3 className="mb-2 font-semibold text-gray-900">Escape Sequences</h3>
        <div className="grid grid-cols-2 gap-1 font-mono text-xs text-gray-600 sm:grid-cols-3">
          <span><strong>\\n</strong> — newline</span>
          <span><strong>\\t</strong> — tab</span>
          <span><strong>\\r</strong> — carriage return</span>
          <span><strong>\\\\</strong> — backslash</span>
          <span><strong>\&quot;</strong> — double quote</span>
          <span><strong>\\&apos;</strong> — single quote</span>
        </div>
      </div>

      <div className="mt-8 border-t border-gray-200 pt-6 text-sm text-gray-600">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">What is Backslash Escaping?</h2>
        <p className="mb-3">
          Backslash escaping is a way to represent special characters in strings. In most programming
          languages, characters like newlines, tabs, and quotes must be &quot;escaped&quot; with a
          backslash (\\) when used inside strings.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">When Do You Need to Escape?</h2>
        <p>
          You need escaping when embedding strings in code, JSON, CSV, or configuration files.
          Unescaped special characters can break parsing or introduce security vulnerabilities.
        </p>
      </div>
    </ToolLayout>
  );
}
