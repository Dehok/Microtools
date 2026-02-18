"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const FORMATS = [
  { id: "iso", label: "ISO 8601", fn: (d: Date) => d.toISOString() },
  { id: "utc", label: "UTC String", fn: (d: Date) => d.toUTCString() },
  { id: "locale", label: "Local String", fn: (d: Date) => d.toLocaleString() },
  { id: "date", label: "Date Only", fn: (d: Date) => d.toISOString().split("T")[0] },
  { id: "time", label: "Time Only", fn: (d: Date) => d.toISOString().split("T")[1].replace("Z", "") },
  { id: "unix", label: "Unix (seconds)", fn: (d: Date) => Math.floor(d.getTime() / 1000).toString() },
  { id: "unixms", label: "Unix (milliseconds)", fn: (d: Date) => d.getTime().toString() },
  {
    id: "relative",
    label: "Relative",
    fn: (d: Date) => {
      const diff = Date.now() - d.getTime();
      const abs = Math.abs(diff);
      const future = diff < 0;
      if (abs < 60000) return future ? "in a few seconds" : "a few seconds ago";
      if (abs < 3600000) {
        const m = Math.floor(abs / 60000);
        return future ? `in ${m} minute${m > 1 ? "s" : ""}` : `${m} minute${m > 1 ? "s" : ""} ago`;
      }
      if (abs < 86400000) {
        const h = Math.floor(abs / 3600000);
        return future ? `in ${h} hour${h > 1 ? "s" : ""}` : `${h} hour${h > 1 ? "s" : ""} ago`;
      }
      const days = Math.floor(abs / 86400000);
      return future ? `in ${days} day${days > 1 ? "s" : ""}` : `${days} day${days > 1 ? "s" : ""} ago`;
    },
  },
];

export default function TimestampConverter() {
  const [input, setInput] = useState(() => new Date().toISOString());

  const { date, error } = useMemo(() => {
    const trimmed = input.trim();
    if (!trimmed) return { date: null, error: "" };

    // Try as number (unix timestamp)
    if (/^\d+$/.test(trimmed)) {
      const num = parseInt(trimmed);
      const d = num > 1e12 ? new Date(num) : new Date(num * 1000);
      if (!isNaN(d.getTime())) return { date: d, error: "" };
    }

    // Try as date string
    const d = new Date(trimmed);
    if (!isNaN(d.getTime())) return { date: d, error: "" };

    return { date: null, error: "Could not parse the input as a valid date or timestamp." };
  }, [input]);

  return (
    <ToolLayout
      title="Timestamp Converter — ISO 8601, Unix, UTC"
      description="Convert between ISO 8601, Unix timestamps, UTC, and human-readable date formats. Supports seconds and milliseconds."
      relatedTools={["epoch-converter", "cron-generator", "uuid-generator"]}
    >
      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
        Input (ISO, Unix timestamp, or any date string)
      </label>
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="2024-01-15T12:00:00Z or 1705312800"
          className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-2 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
          spellCheck={false}
        />
        <button
          onClick={() => setInput(new Date().toISOString())}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
        >
          Now
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 px-4 py-2 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {date && (
        <div className="space-y-2">
          {FORMATS.map((fmt) => {
            const value = fmt.fn(date);
            return (
              <div
                key={fmt.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 p-3"
              >
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{fmt.label}</span>
                  <div className="truncate font-mono text-sm text-gray-900 dark:text-gray-100">{value}</div>
                </div>
                <CopyButton text={value} />
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">What is ISO 8601?</h2>
        <p className="mb-3">
          ISO 8601 is the international standard for representing dates and times.
          Format: <code>YYYY-MM-DDTHH:mm:ss.sssZ</code>. It is widely used in APIs,
          databases, and log files because it is unambiguous and sortable.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Unix Timestamp vs ISO 8601</h2>
        <p>
          A Unix timestamp is the number of seconds since January 1, 1970 (UTC). It is compact
          but not human-readable. ISO 8601 is human-readable but longer. Both are commonly used
          in APIs and databases.
        </p>
      </div>
    
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The Timestamp Converter is a free online tool available on CodeUtilo. Convert between ISO 8601, Unix timestamps, and human-readable dates. All processing happens directly in your browser — no data is ever sent to any server, ensuring your privacy and security. No signup or installation is required.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> — All timestamp converter operations run locally in your browser using JavaScript. Your data never leaves your device.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Instant Results</strong> — Get results immediately as you type or paste your input. No waiting for server responses or page reloads.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> — Use the timestamp converter as many times as you need without creating an account or paying anything.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Mobile Friendly</strong> — Works on desktop, tablet, and mobile browsers. Access this tool from any device with an internet connection.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Using the timestamp converter for day-to-day development tasks</li>
          <li>Saving time on repetitive tasks by using a browser-based tool instead of writing custom code</li>
          <li>Working on projects where installing software is not an option (school, work, shared computers)</li>
          <li>Quick prototyping and debugging without switching to a terminal or IDE</li>
          <li>Sharing the tool link with colleagues who need the same functionality</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Enter your input in the text area provided and the timestamp converter will process it instantly. Use the Copy button to copy the result to your clipboard. All operations are performed locally in your browser — no data is transmitted to any server.
        </p>
      </div>
    </ToolLayout>
  );
}
