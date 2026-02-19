"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function RegexTester() {
  const [pattern, setPattern] = useState("\\b\\w+@\\w+\\.\\w+\\b");
  const [flags, setFlags] = useState("gi");
  const [testText, setTestText] = useState(
    "Contact us at hello@codeutilo.com or support@example.com for help.\nInvalid: @broken, test@, @.com"
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
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Pattern</label>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="Enter regex pattern..."
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-2 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
            spellCheck={false}
          />
        </div>
        <div className="w-24">
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Flags</label>
          <input
            type="text"
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            placeholder="gi"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-2 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Flag checkboxes */}
      <div className="mb-4 flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400">
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
              className="rounded border-gray-300 dark:border-gray-600"
            />
            <code className="font-mono">{flag}</code> {label}
          </label>
        ))}
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 px-4 py-2 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Test text */}
      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Test String</label>
      <textarea
        value={testText}
        onChange={(e) => setTestText(e.target.value)}
        placeholder="Enter test text..."
        className="mb-4 h-32 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
        spellCheck={false}
      />

      {/* Highlighted result */}
      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
        Matches ({results.matches.length})
      </label>
      <div
        className="mb-4 min-h-20 whitespace-pre-wrap rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 p-3 font-mono text-sm"
        dangerouslySetInnerHTML={{ __html: results.highlighted }}
      />

      {/* Match list */}
      {results.matches.length > 0 && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 p-3">
          <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Match Details</div>
          <div className="space-y-1 text-sm font-mono">
            {results.matches.slice(0, 50).map((m, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-gray-400 dark:text-gray-500 w-6">{i + 1}.</span>
                <span className="text-blue-700 dark:text-blue-300">&quot;{m.match}&quot;</span>
                <span className="text-gray-400 dark:text-gray-500">at index {m.index}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">What is Regex?</h2>
        <p className="mb-3">
          A regular expression (regex) is a sequence of characters that defines a search pattern.
          It is used for string matching, validation, search-and-replace, and text parsing in
          virtually every programming language.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Common Regex Flags</h2>
        <p>
          <strong>g</strong> (global) finds all matches. <strong>i</strong> (case insensitive)
          ignores case. <strong>m</strong> (multiline) treats ^ and $ as line boundaries.
          <strong> s</strong> (dotall) makes . match newlines.
        </p>
      </div>
    
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
        <p>The Regex Tester lets you write and test regular expressions against sample text in real time. Match highlights update instantly as you type your pattern, making it easy to validate, debug, and refine regular expressions for search, validation, and text processing tasks.</p>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Key Features</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong className="text-gray-700 dark:text-gray-300">Live Match Highlighting</strong> &mdash; Highlights all pattern matches in your test string in real time as you type, with no button press needed.</li>
          <li><strong className="text-gray-700 dark:text-gray-300">Flags Support</strong> &mdash; Toggle standard regex flags: g (global), i (case-insensitive), m (multiline), and s (dot-all) to control match behavior.</li>
          <li><strong className="text-gray-700 dark:text-gray-300">Match Details</strong> &mdash; Shows the number of matches found, their positions, and captured group values for each match.</li>
          <li><strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> &mdash; All regex execution runs locally in your browser using the JavaScript RegExp engine. Your text never leaves your device.</li>
          <li><strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> &mdash; Use this tool as many times as you need without creating an account or paying anything.</li>
        </ul>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Common Use Cases</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Validating that user-entered email addresses, phone numbers, or postal codes match expected formats</li>
          <li>Extracting specific data patterns such as dates, prices, or identifiers from raw text strings</li>
          <li>Testing search-and-replace patterns before using them in a code editor, database query, or shell script</li>
          <li>Debugging complex regex patterns by breaking them into parts and testing each section independently</li>
          <li>Learning regular expression syntax interactively with immediate visual feedback</li>
        </ul>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">How to Use</h2>
        <p>Enter your regular expression in the Pattern field (without surrounding slashes). Select any flags you need using the checkboxes. Paste or type your test string in the Test String area. Matches are highlighted in the string and listed with their positions below.</p>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">What is the difference between the g flag and no flag in regex?</summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">Without the g (global) flag, the regex stops after finding the first match. With g, it finds all non-overlapping matches in the string. Most practical use cases (replace-all, extract-all) require the g flag.</p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">What are capturing groups and how do they work?</summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">Wrapping part of a pattern in parentheses (e.g., (\d{4})) creates a capturing group. The matched content is saved separately. For example, (\d{4})-(\d{2})-(\d{2}) matching 2024-01-15 gives group 1=2024, group 2=01, group 3=15.</p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">What is catastrophic backtracking?</summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">Catastrophic backtracking occurs when a poorly written regex takes exponential time to determine there is no match, causing the browser or server to freeze. Avoid nested quantifiers like (a+)+ on large inputs.</p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Does this tool use JavaScript regex or another engine?</summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">This tool uses JavaScript&apos;s built-in RegExp engine. JavaScript regex is largely compatible with PCRE (Perl-Compatible Regular Expressions) but has some differences, such as no lookbehind support in older engines and no possessive quantifiers.</p>
          </details>
        </div>
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
