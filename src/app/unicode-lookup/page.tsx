"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface CharInfo {
  char: string;
  codePoint: number;
  hex: string;
  htmlEntity: string;
  htmlDecimal: string;
  cssEscape: string;
  utf8: string;
}

function analyzeChar(char: string): CharInfo {
  const codePoint = char.codePointAt(0) || 0;
  const hex = `U+${codePoint.toString(16).toUpperCase().padStart(4, "0")}`;
  const htmlEntity = `&#x${codePoint.toString(16).toUpperCase()};`;
  const htmlDecimal = `&#${codePoint};`;
  const cssEscape = `\\${codePoint.toString(16).toUpperCase()}`;

  // UTF-8 bytes
  const encoder = new TextEncoder();
  const bytes = encoder.encode(char);
  const utf8 = Array.from(bytes)
    .map((b) => b.toString(16).toUpperCase().padStart(2, "0"))
    .join(" ");

  return { char, codePoint, hex, htmlEntity, htmlDecimal, cssEscape, utf8 };
}

const COMMON_CHARS = [
  { label: "Arrows", chars: "← → ↑ ↓ ⇐ ⇒ ⇑ ⇓ ↔ ↕" },
  { label: "Math", chars: "± × ÷ ≠ ≤ ≥ ≈ ∞ √ π" },
  { label: "Currency", chars: "$ € £ ¥ ₿ ₹ ₽ ₩ ₪ ₫" },
  { label: "Symbols", chars: "© ® ™ § ¶ † ‡ • … ° " },
  { label: "Box Drawing", chars: "─ │ ┌ ┐ └ ┘ ├ ┤ ┬ ┴" },
  { label: "Emoji", chars: "😀 🎉 🔥 ⭐ ❤️ 🚀 💡 ⚡ 🎯 ✅" },
];

export default function UnicodeLookup() {
  const [input, setInput] = useState("Hello World! © 2024 → ∞");

  const chars = useMemo(() => {
    if (!input) return [];
    const result: CharInfo[] = [];
    for (const char of input) {
      result.push(analyzeChar(char));
    }
    return result;
  }, [input]);

  return (
    <ToolLayout
      title="Unicode Character Lookup & Inspector"
      description="Inspect Unicode characters: code points, HTML entities, CSS escapes, and UTF-8 bytes. Browse common character sets."
      relatedTools={["html-encoder-decoder", "text-case-converter", "number-base-converter"]}
    >
      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Input Text</label>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type or paste characters to inspect..."
        className="mb-4 h-20 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
        spellCheck={false}
      />

      {/* Common character sets */}
      <div className="mb-4">
        <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">Common Characters</h3>
        <div className="space-y-2">
          {COMMON_CHARS.map((group) => (
            <div key={group.label} className="flex items-start gap-2">
              <span className="w-20 text-xs font-medium text-gray-500 dark:text-gray-400 pt-1">{group.label}</span>
              <div className="flex flex-wrap gap-1">
                {group.chars.split(" ").map((char, i) => (
                  <button
                    key={i}
                    onClick={() => setInput((prev) => prev + char)}
                    className="rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-1 text-lg hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
                    title={`Add ${char}`}
                  >
                    {char}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Character table */}
      {chars.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 text-left">
                <th className="py-2 pr-3 font-medium text-gray-700 dark:text-gray-300">Char</th>
                <th className="py-2 pr-3 font-medium text-gray-700 dark:text-gray-300">Code Point</th>
                <th className="py-2 pr-3 font-medium text-gray-700 dark:text-gray-300">Unicode</th>
                <th className="py-2 pr-3 font-medium text-gray-700 dark:text-gray-300">HTML Hex</th>
                <th className="py-2 pr-3 font-medium text-gray-700 dark:text-gray-300">HTML Dec</th>
                <th className="py-2 pr-3 font-medium text-gray-700 dark:text-gray-300">CSS</th>
                <th className="py-2 font-medium text-gray-700 dark:text-gray-300">UTF-8</th>
              </tr>
            </thead>
            <tbody>
              {chars.slice(0, 100).map((c, i) => (
                <tr key={i} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800">
                  <td className="py-1.5 pr-3 text-lg">{c.char === " " ? "␣" : c.char}</td>
                  <td className="py-1.5 pr-3 font-mono text-gray-600 dark:text-gray-400">{c.codePoint}</td>
                  <td className="py-1.5 pr-3 font-mono text-blue-700 dark:text-blue-300">
                    <span className="inline-flex items-center gap-1">
                      {c.hex}
                      <CopyButton text={c.hex} />
                    </span>
                  </td>
                  <td className="py-1.5 pr-3 font-mono text-gray-600 dark:text-gray-400">
                    <span className="inline-flex items-center gap-1">
                      {c.htmlEntity}
                      <CopyButton text={c.htmlEntity} />
                    </span>
                  </td>
                  <td className="py-1.5 pr-3 font-mono text-gray-600 dark:text-gray-400">{c.htmlDecimal}</td>
                  <td className="py-1.5 pr-3 font-mono text-gray-600 dark:text-gray-400">{c.cssEscape}</td>
                  <td className="py-1.5 font-mono text-gray-600 dark:text-gray-400">{c.utf8}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {chars.length > 100 && (
            <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
              Showing first 100 of {chars.length} characters.
            </div>
          )}
        </div>
      )}

      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">What is Unicode?</h2>
        <p className="mb-3">
          Unicode is a universal character encoding standard that assigns a unique number (code point)
          to every character in every writing system. It covers over 150,000 characters, including
          letters, symbols, emoji, and technical characters.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Character Encodings</h2>
        <p>
          <strong>HTML entities</strong> (like &amp;copy;) display special characters in web pages.
          <strong> CSS escapes</strong> (like \00A9) work in stylesheets. <strong>UTF-8</strong> is
          the most common encoding on the web, using 1-4 bytes per character.
        </p>
      </div>
    
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The Unicode Character Lookup is a free online tool available on CodeUtilo. Inspect characters: code points, HTML entities, CSS escapes, UTF-8 bytes. All processing happens directly in your browser — no data is ever sent to any server, ensuring your privacy and security. No signup or installation is required.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> — All unicode character lookup operations run locally in your browser using JavaScript. Your data never leaves your device.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Instant Results</strong> — Get results immediately as you type or paste your input. No waiting for server responses or page reloads.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> — Use the unicode character lookup as many times as you need without creating an account or paying anything.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Mobile Friendly</strong> — Works on desktop, tablet, and mobile browsers. Access this tool from any device with an internet connection.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Using the unicode character lookup for day-to-day development tasks</li>
          <li>Saving time on repetitive tasks by using a browser-based tool instead of writing custom code</li>
          <li>Working on projects where installing software is not an option (school, work, shared computers)</li>
          <li>Quick prototyping and debugging without switching to a terminal or IDE</li>
          <li>Sharing the tool link with colleagues who need the same functionality</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Enter your input in the text area provided and the unicode character lookup will process it instantly. Use the Copy button to copy the result to your clipboard. All operations are performed locally in your browser — no data is transmitted to any server.
        </p>
      
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Is the Unicode Character Lookup free to use?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes, the Unicode Character Lookup is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need.
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
              Yes. The Unicode Character Lookup is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Do I need to install anything?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. The Unicode Character Lookup runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately.
            </p>
          </details>
        </div>
</div>
    </ToolLayout>
  );
}
