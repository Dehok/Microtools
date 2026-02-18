"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function ByteCounter() {
  const [input, setInput] = useState("Hello, World! 🌍");

  const stats = useMemo(() => {
    if (!input) return null;

    const encoder = new TextEncoder();
    const utf8Bytes = encoder.encode(input);
    const utf8Length = utf8Bytes.length;

    // UTF-16 (JS internal)
    const utf16Length = input.length * 2;

    // ASCII bytes (only counts ASCII chars)
    const asciiCount = input.split("").filter((c) => c.charCodeAt(0) < 128).length;

    // Character count (handles surrogate pairs)
    const charCount = [...input].length;

    // Code points
    const codePoints = [...input].map((c) => c.codePointAt(0)!);
    const maxCodePoint = Math.max(...codePoints);

    // Determine encoding needed
    let minEncoding = "ASCII";
    if (maxCodePoint > 127) minEncoding = "UTF-8";
    if (maxCodePoint > 0xFFFF) minEncoding = "UTF-8 (4-byte)";

    // Breakdown by byte count
    const byteBreakdown = { one: 0, two: 0, three: 0, four: 0 };
    for (const cp of codePoints) {
      if (cp < 0x80) byteBreakdown.one++;
      else if (cp < 0x800) byteBreakdown.two++;
      else if (cp < 0x10000) byteBreakdown.three++;
      else byteBreakdown.four++;
    }

    return {
      charCount,
      utf8Length,
      utf16Length,
      asciiCount,
      codePointCount: charCount,
      maxCodePoint: `U+${maxCodePoint.toString(16).toUpperCase().padStart(4, "0")}`,
      minEncoding,
      byteBreakdown,
      bits: utf8Length * 8,
      kilobytes: (utf8Length / 1024).toFixed(3),
    };
  }, [input]);

  return (
    <ToolLayout
      title="Byte Counter — String Size Calculator"
      description="Count bytes, characters, and code points in any text. Shows UTF-8, UTF-16, and ASCII sizes. Free online tool."
      relatedTools={["word-counter", "unicode-lookup", "text-case-converter"]}
    >
      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Input Text</label>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type or paste text to analyze..."
        className="mb-4 h-32 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
        spellCheck={false}
      />

      {stats && (
        <>
          {/* Main stats */}
          <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Characters", value: stats.charCount },
              { label: "UTF-8 Bytes", value: stats.utf8Length },
              { label: "UTF-16 Bytes", value: stats.utf16Length },
              { label: "Bits", value: stats.bits },
            ].map((s) => (
              <div key={s.label} className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 p-3 text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{s.value}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Details */}
          <div className="space-y-2">
            {[
              { label: "Character count", value: stats.charCount.toString() },
              { label: "UTF-8 size", value: `${stats.utf8Length} bytes (${stats.kilobytes} KB)` },
              { label: "UTF-16 size", value: `${stats.utf16Length} bytes` },
              { label: "ASCII characters", value: `${stats.asciiCount} of ${stats.charCount}` },
              { label: "Code points", value: stats.codePointCount.toString() },
              { label: "Max code point", value: stats.maxCodePoint },
              { label: "Minimum encoding", value: stats.minEncoding },
            ].map((row) => (
              <div key={row.label} className="flex justify-between rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 px-4 py-2 text-sm">
                <span className="text-gray-500 dark:text-gray-400">{row.label}</span>
                <span className="font-medium text-gray-900 dark:text-gray-100 font-mono">{row.value}</span>
              </div>
            ))}
          </div>

          {/* UTF-8 breakdown */}
          <div className="mt-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 p-4">
            <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">UTF-8 Byte Breakdown</h3>
            <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
              <div className="text-center">
                <div className="font-bold text-gray-900 dark:text-gray-100">{stats.byteBreakdown.one}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">1-byte (ASCII)</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-900 dark:text-gray-100">{stats.byteBreakdown.two}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">2-byte</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-900 dark:text-gray-100">{stats.byteBreakdown.three}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">3-byte</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-900 dark:text-gray-100">{stats.byteBreakdown.four}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">4-byte (emoji)</div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Why Count Bytes?</h2>
        <p className="mb-3">
          String length in characters is not the same as byte size. A single emoji like 🌍 is
          1 character but 4 bytes in UTF-8. Knowing byte size is essential for database column
          limits, API payload sizes, HTTP headers, and file storage.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">UTF-8 vs UTF-16</h2>
        <p>
          UTF-8 uses 1-4 bytes per character and is the web standard. UTF-16 (used by JavaScript
          and Windows) uses 2 or 4 bytes per character. ASCII characters always take 1 byte in
          UTF-8 and 2 bytes in UTF-16.
        </p>
      </div>
    </ToolLayout>
  );
}
