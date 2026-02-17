"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function RegexTester() {
  const [pattern, setPattern] = useState("\\b\\w+@\\w+\\.\\w+\\b");
  const [flags, setFlags] = useState("gi");
  const [testText, setTestText] = useState(
    "Contact us at hello@microtools.dev or support@example.com for help.\nInvalid: @broken, test@, @.com"
  );
  const results = useMemo(() => {
    if (!pattern) return { matches: [], highlighted: testText, error: "" };

    try {
      const regex = new RegExp(pattern, flags);
      const matches: { match: string; index: number; groups?: Record<string, string> }[] = [];

      if (flags.includes("g")) {
        let m;
        while ((m = regex.exec(testText)) !== null) {
          matches.push({
            match: m[0],
            index: m.index,
            groups: m.groups ? { ...m.groups } : undefined,
          });
          if (!m[0]) break;
        }
      } else {
        const m = regex.exec(testText);
        if (m) {
          matches.push({
            match: m[0],
            index: m.index,
            groups: m.groups ? { ...m.groups } : undefined,
          });
        }
      }

      // Build highlighted HTML
      let highlighted = "";
      let lastIndex = 0;
      const sortedMatches = [...matches].sort((a, b) => a.index - b.index);
      for (const m of sortedMatches) {
        highlighted += escapeHtml(testText.slice(lastIndex, m.index));
        highlighted += `<mark class="bg-yellow-200 rounded px-0.5">${escapeHtml(m.match)}</mark>`;
        lastIndex = m.index + m.match.length;
      }
      highlighted += escapeHtml(testText.slice(lastIndex));

      return { matches, highlighted, error: "" };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Invalid regex";
      return { matches: [], highlighted: escapeHtml(testText), error: msg };
    }
  }, [pattern, flags, testText]);

  const error = results.error;

  return (
    <ToolLayout
      title="Regex Tester Online"
      description="Test regular expressions against text with real-time match highlighting. Supports all JavaScript regex flags."
      relatedTools={["json-formatter", "diff-checker", "slug-generator"]}
    >
      {/* Pattern input */}
      <div className="mb-4 flex gap-2">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium text-gray-700">Pattern</label>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="Enter regex pattern..."
            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none"
            spellCheck={false}
          />
        </div>
        <div className="w-24">
          <label className="mb-1 block text-sm font-medium text-gray-700">Flags</label>
          <input
            type="text"
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            placeholder="gi"
            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Flag checkboxes */}
      <div className="mb-4 flex flex-wrap gap-3 text-sm text-gray-600">
        {[
          { flag: "g", label: "Global" },
          { flag: "i", label: "Case insensitive" },
          { flag: "m", label: "Multiline" },
          { flag: "s", label: "Dotall" },
        ].map(({ flag, label }) => (
          <label key={flag} className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={flags.includes(flag)}
              onChange={(e) => {
                setFlags(
                  e.target.checked
                    ? flags + flag
                    : flags.replace(flag, "")
                );
              }}
              className="rounded border-gray-300"
            />
            <code className="font-mono">{flag}</code> {label}
          </label>
        ))}
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Test text */}
      <label className="mb-1 block text-sm font-medium text-gray-700">Test String</label>
      <textarea
        value={testText}
        onChange={(e) => setTestText(e.target.value)}
        placeholder="Enter test text..."
        className="mb-4 h-32 w-full rounded-lg border border-gray-300 bg-gray-50 p-3 font-mono text-sm focus:border-blue-500 focus:outline-none"
        spellCheck={false}
      />

      {/* Highlighted result */}
      <label className="mb-1 block text-sm font-medium text-gray-700">
        Matches ({results.matches.length})
      </label>
      <div
        className="mb-4 min-h-20 whitespace-pre-wrap rounded-lg border border-gray-300 bg-white p-3 font-mono text-sm"
        dangerouslySetInnerHTML={{ __html: results.highlighted }}
      />

      {/* Match list */}
      {results.matches.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
          <div className="mb-2 text-sm font-medium text-gray-700">Match Details</div>
          <div className="space-y-1 text-sm font-mono">
            {results.matches.slice(0, 50).map((m, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-gray-400 w-6">{i + 1}.</span>
                <span className="text-blue-700">&quot;{m.match}&quot;</span>
                <span className="text-gray-400">at index {m.index}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 border-t border-gray-200 pt-6 text-sm text-gray-600">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">What is Regex?</h2>
        <p className="mb-3">
          A regular expression (regex) is a sequence of characters that defines a search pattern.
          It is used for string matching, validation, search-and-replace, and text parsing in
          virtually every programming language.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Common Regex Flags</h2>
        <p>
          <strong>g</strong> (global) finds all matches. <strong>i</strong> (case insensitive)
          ignores case. <strong>m</strong> (multiline) treats ^ and $ as line boundaries.
          <strong> s</strong> (dotall) makes . match newlines.
        </p>
      </div>
    </ToolLayout>
  );
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br/>");
}
