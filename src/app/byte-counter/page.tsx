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
    
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The Byte Counter is a free online tool available on CodeUtilo. Count bytes, characters, and code points. Shows UTF-8 and UTF-16 sizes. All processing happens directly in your browser — no data is ever sent to any server, ensuring your privacy and security. No signup or installation is required.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> — All byte counter operations run locally in your browser using JavaScript. Your data never leaves your device.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Instant Results</strong> — Get results immediately as you type or paste your input. No waiting for server responses or page reloads.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> — Use the byte counter as many times as you need without creating an account or paying anything.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Mobile Friendly</strong> — Works on desktop, tablet, and mobile browsers. Access this tool from any device with an internet connection.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Using the byte counter for day-to-day development tasks</li>
          <li>Saving time on repetitive tasks by using a browser-based tool instead of writing custom code</li>
          <li>Working on projects where installing software is not an option (school, work, shared computers)</li>
          <li>Quick prototyping and debugging without switching to a terminal or IDE</li>
          <li>Sharing the tool link with colleagues who need the same functionality</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Enter your input in the text area provided and the byte counter will process it instantly. Use the Copy button to copy the result to your clipboard. All operations are performed locally in your browser — no data is transmitted to any server.
        </p>
      
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Is the Byte Counter free to use?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes, the Byte Counter is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need.
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
              Yes. The Byte Counter is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Do I need to install anything?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. The Byte Counter runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately.
            </p>
          </details>
        </div>
</div>
    </ToolLayout>
  );
}
