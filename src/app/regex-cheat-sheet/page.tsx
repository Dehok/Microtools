"use client";

import { useState, useMemo, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";

interface RegexEntry {
  pattern: string;
  description: string;
  example: string;
}

interface RegexSection {
  title: string;
  entries: RegexEntry[];
}

const sections: RegexSection[] = [
  {
    title: "Character Classes",
    entries: [
      { pattern: ".", description: "Any character except newline", example: "a.c matches \"abc\", \"a1c\"" },
      { pattern: "\\d", description: "Any digit [0-9]", example: "\\d{3} matches \"123\"" },
      { pattern: "\\D", description: "Any non-digit [^0-9]", example: "\\D+ matches \"abc\"" },
      { pattern: "\\w", description: "Any word character [a-zA-Z0-9_]", example: "\\w+ matches \"hello_1\"" },
      { pattern: "\\W", description: "Any non-word character [^a-zA-Z0-9_]", example: "\\W matches \"@\"" },
      { pattern: "\\s", description: "Any whitespace (space, tab, newline)", example: "a\\sb matches \"a b\"" },
      { pattern: "\\S", description: "Any non-whitespace character", example: "\\S+ matches \"hello\"" },
      { pattern: "[abc]", description: "Any one of a, b, or c", example: "[aeiou] matches vowels" },
      { pattern: "[^abc]", description: "Any character except a, b, or c", example: "[^0-9] matches non-digits" },
      { pattern: "[a-z]", description: "Any lowercase letter", example: "[a-z]+ matches \"hello\"" },
      { pattern: "[A-Z]", description: "Any uppercase letter", example: "[A-Z] matches \"H\"" },
      { pattern: "[0-9]", description: "Any digit (same as \\d)", example: "[0-9]{2} matches \"42\"" },
    ],
  },
  {
    title: "Quantifiers",
    entries: [
      { pattern: "*", description: "0 or more times (greedy)", example: "ab*c matches \"ac\", \"abc\", \"abbc\"" },
      { pattern: "+", description: "1 or more times (greedy)", example: "ab+c matches \"abc\", \"abbc\"" },
      { pattern: "?", description: "0 or 1 time (optional)", example: "colou?r matches \"color\", \"colour\"" },
      { pattern: "{n}", description: "Exactly n times", example: "\\d{4} matches \"2024\"" },
      { pattern: "{n,}", description: "n or more times", example: "\\w{3,} matches 3+ word chars" },
      { pattern: "{n,m}", description: "Between n and m times", example: "\\d{2,4} matches \"12\", \"1234\"" },
      { pattern: "*?", description: "0 or more times (lazy)", example: "<.*?> matches first tag only" },
      { pattern: "+?", description: "1 or more times (lazy)", example: "\\w+? matches single char" },
      { pattern: "??", description: "0 or 1 time (lazy)", example: "\\d?? prefers 0 digits" },
    ],
  },
  {
    title: "Anchors & Boundaries",
    entries: [
      { pattern: "^", description: "Start of string (or line in multiline mode)", example: "^Hello matches \"Hello world\"" },
      { pattern: "$", description: "End of string (or line in multiline mode)", example: "world$ matches \"Hello world\"" },
      { pattern: "\\b", description: "Word boundary", example: "\\bcat\\b matches \"cat\" not \"catch\"" },
      { pattern: "\\B", description: "Non-word boundary", example: "\\Bcat matches \"scat\" not \"cat\"" },
    ],
  },
  {
    title: "Groups & Backreferences",
    entries: [
      { pattern: "(abc)", description: "Capturing group", example: "(\\d+)-(\\d+) captures both numbers" },
      { pattern: "(?:abc)", description: "Non-capturing group", example: "(?:ab)+ matches \"abab\"" },
      { pattern: "(?<name>abc)", description: "Named capturing group", example: "(?<year>\\d{4}) captures as 'year'" },
      { pattern: "\\1", description: "Backreference to group 1", example: "(\\w)\\1 matches \"aa\", \"bb\"" },
      { pattern: "(?=abc)", description: "Positive lookahead", example: "\\d(?=px) matches \"5\" in \"5px\"" },
      { pattern: "(?!abc)", description: "Negative lookahead", example: "\\d(?!px) matches \"5\" in \"5em\"" },
      { pattern: "(?<=abc)", description: "Positive lookbehind", example: "(?<=\\$)\\d+ matches \"50\" in \"$50\"" },
      { pattern: "(?<!abc)", description: "Negative lookbehind", example: "(?<!\\$)\\d+ matches \"50\" in \"50\"" },
    ],
  },
  {
    title: "Flags",
    entries: [
      { pattern: "g", description: "Global: find all matches, not just the first", example: "/cat/g matches all \"cat\" occurrences" },
      { pattern: "i", description: "Case insensitive: ignore upper/lowercase", example: "/hello/i matches \"HELLO\"" },
      { pattern: "m", description: "Multiline: ^ and $ match line boundaries", example: "/^line/m matches each line start" },
      { pattern: "s", description: "Dotall: . matches newline characters too", example: "/a.b/s matches \"a\\nb\"" },
      { pattern: "u", description: "Unicode: enable full Unicode matching", example: "/\\u{1F600}/u matches emoji" },
      { pattern: "y", description: "Sticky: match only from lastIndex position", example: "/\\d/y matches at exact position" },
    ],
  },
  {
    title: "Common Patterns",
    entries: [
      { pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}", description: "Email address", example: "user@example.com" },
      { pattern: "https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)", description: "URL", example: "https://www.example.com/path?q=1" },
      { pattern: "\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b", description: "IPv4 address", example: "192.168.1.1" },
      { pattern: "\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])", description: "Date (YYYY-MM-DD)", example: "2024-12-31" },
      { pattern: "#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})", description: "Hex color code", example: "#ff6600 or #f60" },
      { pattern: "<([a-z][a-z0-9]*)\\b[^>]*>(.*?)<\\/\\1>", description: "HTML tag with content", example: "<div>content</div>" },
      { pattern: "\\+?\\d{1,4}?[-.\\s]?\\(?\\d{1,3}?\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,9}", description: "Phone number (international)", example: "+1 (555) 123-4567" },
    ],
  },
];

export default function RegexCheatSheet() {
  const [search, setSearch] = useState("");
  const [copiedPattern, setCopiedPattern] = useState<string | null>(null);

  const filteredSections = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return sections;

    return sections
      .map((section) => ({
        ...section,
        entries: section.entries.filter(
          (entry) =>
            entry.pattern.toLowerCase().includes(query) ||
            entry.description.toLowerCase().includes(query) ||
            entry.example.toLowerCase().includes(query)
        ),
      }))
      .filter((section) => section.entries.length > 0);
  }, [search]);

  const totalMatches = useMemo(() => {
    return filteredSections.reduce((sum, s) => sum + s.entries.length, 0);
  }, [filteredSections]);

  const handleCopy = useCallback(async (pattern: string) => {
    try {
      await navigator.clipboard.writeText(pattern);
      setCopiedPattern(pattern);
      setTimeout(() => setCopiedPattern(null), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = pattern;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopiedPattern(pattern);
      setTimeout(() => setCopiedPattern(null), 2000);
    }
  }, []);

  return (
    <ToolLayout
      title="Regex Cheat Sheet"
      description="Complete regular expression quick reference with character classes, quantifiers, anchors, groups, lookaheads, flags, and common patterns. Click any pattern to copy."
      relatedTools={["regex-tester", "json-formatter", "text-case-converter"]}
    >
      {/* Search input */}
      <div className="mb-6">
        <div className="relative">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patterns, descriptions, or examples..."
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:text-gray-400"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        {search && (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {totalMatches} {totalMatches === 1 ? "result" : "results"} found
          </p>
        )}
      </div>

      {/* Sections */}
      {filteredSections.length === 0 && (
        <div className="py-12 text-center text-gray-500 dark:text-gray-400">
          <p className="text-lg font-medium">No patterns found</p>
          <p className="mt-1 text-sm">Try a different search term</p>
        </div>
      )}

      <div className="space-y-8">
        {filteredSections.map((section) => (
          <div key={section.title}>
            <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
              {section.title}
            </h2>

            {/* Desktop table */}
            <div className="hidden overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 sm:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-950">
                    <th className="px-4 py-2.5 text-left font-medium text-gray-600 dark:text-gray-400">Pattern</th>
                    <th className="px-4 py-2.5 text-left font-medium text-gray-600 dark:text-gray-400">Description</th>
                    <th className="px-4 py-2.5 text-left font-medium text-gray-600 dark:text-gray-400">Example</th>
                    <th className="w-16 px-4 py-2.5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {section.entries.map((entry) => (
                    <tr key={entry.pattern} className="group transition-colors hover:bg-blue-50 dark:bg-blue-950 dark:hover:bg-blue-950/50">
                      <td className="px-4 py-2.5">
                        <code className="rounded bg-blue-50 dark:bg-blue-950 px-2 py-0.5 font-mono text-sm font-medium text-blue-600 dark:text-blue-400">
                          {entry.pattern}
                        </code>
                      </td>
                      <td className="px-4 py-2.5 text-gray-700 dark:text-gray-300">{entry.description}</td>
                      <td className="px-4 py-2.5 font-mono text-xs text-gray-500 dark:text-gray-400">{entry.example}</td>
                      <td className="px-4 py-2.5">
                        <button
                          onClick={() => handleCopy(entry.pattern)}
                          className="rounded px-2 py-1 text-xs text-gray-400 dark:text-gray-500 opacity-0 transition-all hover:bg-blue-100 dark:bg-blue-900 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-400 group-hover:opacity-100"
                          title="Copy pattern"
                        >
                          {copiedPattern === entry.pattern ? (
                            <span className="text-green-600 dark:text-green-400">Copied!</span>
                          ) : (
                            "Copy"
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="space-y-2 sm:hidden">
              {section.entries.map((entry) => (
                <div
                  key={entry.pattern}
                  className="rounded-lg border border-gray-200 dark:border-gray-700 p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <code className="rounded bg-blue-50 dark:bg-blue-950 px-2 py-0.5 font-mono text-sm font-medium text-blue-600 dark:text-blue-400">
                      {entry.pattern}
                    </code>
                    <button
                      onClick={() => handleCopy(entry.pattern)}
                      className="shrink-0 rounded px-2 py-1 text-xs text-gray-400 dark:text-gray-500 hover:bg-blue-100 dark:bg-blue-900 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-400"
                    >
                      {copiedPattern === entry.pattern ? (
                        <span className="text-green-600 dark:text-green-400">Copied!</span>
                      ) : (
                        "Copy"
                      )}
                    </button>
                  </div>
                  <p className="mt-1.5 text-sm text-gray-700 dark:text-gray-300">{entry.description}</p>
                  <p className="mt-1 font-mono text-xs text-gray-500 dark:text-gray-400">{entry.example}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The Regex Cheat Sheet is a free online tool available on CodeUtilo. Quick reference for regular expressions. Character classes, quantifiers, groups, and common patterns. All processing happens directly in your browser — no data is ever sent to any server, ensuring your privacy and security. No signup or installation is required.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> — All regex cheat sheet operations run locally in your browser using JavaScript. Your data never leaves your device.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Instant Results</strong> — Get results immediately as you type or paste your input. No waiting for server responses or page reloads.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> — Use the regex cheat sheet as many times as you need without creating an account or paying anything.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Mobile Friendly</strong> — Works on desktop, tablet, and mobile browsers. Access this tool from any device with an internet connection.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Using the regex cheat sheet for day-to-day development tasks</li>
          <li>Saving time on repetitive tasks by using a browser-based tool instead of writing custom code</li>
          <li>Working on projects where installing software is not an option (school, work, shared computers)</li>
          <li>Quick prototyping and debugging without switching to a terminal or IDE</li>
          <li>Sharing the tool link with colleagues who need the same functionality</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Enter your input in the text area provided and the regex cheat sheet will process it instantly. Use the Copy button to copy the result to your clipboard. All operations are performed locally in your browser — no data is transmitted to any server.
        </p>
      </div>
    </ToolLayout>
  );
}
