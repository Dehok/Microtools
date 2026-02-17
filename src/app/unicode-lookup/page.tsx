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
      <label className="mb-1 block text-sm font-medium text-gray-700">Input Text</label>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type or paste characters to inspect..."
        className="mb-4 h-20 w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm focus:border-blue-500 focus:outline-none"
        spellCheck={false}
      />

      {/* Common character sets */}
      <div className="mb-4">
        <h3 className="mb-2 text-sm font-semibold text-gray-900">Common Characters</h3>
        <div className="space-y-2">
          {COMMON_CHARS.map((group) => (
            <div key={group.label} className="flex items-start gap-2">
              <span className="w-20 text-xs font-medium text-gray-500 pt-1">{group.label}</span>
              <div className="flex flex-wrap gap-1">
                {group.chars.split(" ").map((char, i) => (
                  <button
                    key={i}
                    onClick={() => setInput((prev) => prev + char)}
                    className="rounded border border-gray-200 bg-white px-2 py-1 text-lg hover:bg-gray-50"
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
              <tr className="border-b border-gray-200 text-left">
                <th className="py-2 pr-3 font-medium text-gray-700">Char</th>
                <th className="py-2 pr-3 font-medium text-gray-700">Code Point</th>
                <th className="py-2 pr-3 font-medium text-gray-700">Unicode</th>
                <th className="py-2 pr-3 font-medium text-gray-700">HTML Hex</th>
                <th className="py-2 pr-3 font-medium text-gray-700">HTML Dec</th>
                <th className="py-2 pr-3 font-medium text-gray-700">CSS</th>
                <th className="py-2 font-medium text-gray-700">UTF-8</th>
              </tr>
            </thead>
            <tbody>
              {chars.slice(0, 100).map((c, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-1.5 pr-3 text-lg">{c.char === " " ? "␣" : c.char}</td>
                  <td className="py-1.5 pr-3 font-mono text-gray-600">{c.codePoint}</td>
                  <td className="py-1.5 pr-3 font-mono text-blue-700">
                    <span className="inline-flex items-center gap-1">
                      {c.hex}
                      <CopyButton text={c.hex} />
                    </span>
                  </td>
                  <td className="py-1.5 pr-3 font-mono text-gray-600">
                    <span className="inline-flex items-center gap-1">
                      {c.htmlEntity}
                      <CopyButton text={c.htmlEntity} />
                    </span>
                  </td>
                  <td className="py-1.5 pr-3 font-mono text-gray-600">{c.htmlDecimal}</td>
                  <td className="py-1.5 pr-3 font-mono text-gray-600">{c.cssEscape}</td>
                  <td className="py-1.5 font-mono text-gray-600">{c.utf8}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {chars.length > 100 && (
            <div className="mt-2 text-xs text-gray-400">
              Showing first 100 of {chars.length} characters.
            </div>
          )}
        </div>
      )}

      <div className="mt-8 border-t border-gray-200 pt-6 text-sm text-gray-600">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">What is Unicode?</h2>
        <p className="mb-3">
          Unicode is a universal character encoding standard that assigns a unique number (code point)
          to every character in every writing system. It covers over 150,000 characters, including
          letters, symbols, emoji, and technical characters.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Character Encodings</h2>
        <p>
          <strong>HTML entities</strong> (like &amp;copy;) display special characters in web pages.
          <strong> CSS escapes</strong> (like \00A9) work in stylesheets. <strong>UTF-8</strong> is
          the most common encoding on the web, using 1-4 bytes per character.
        </p>
      </div>
    </ToolLayout>
  );
}
