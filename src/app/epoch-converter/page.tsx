"use client";

import { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function EpochConverter() {
  const [epoch, setEpoch] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEpoch(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleEpochToDate = () => {
    setError("");
    if (!epoch.trim()) { setError("Enter a timestamp."); return; }
    const num = Number(epoch.trim());
    if (isNaN(num)) { setError("Invalid number."); return; }
    // Auto-detect seconds vs milliseconds
    const ms = num > 1e12 ? num : num * 1000;
    const d = new Date(ms);
    if (isNaN(d.getTime())) { setError("Invalid timestamp."); return; }
    setDateStr(d.toISOString());
  };

  const handleDateToEpoch = () => {
    setError("");
    if (!dateStr.trim()) { setError("Enter a date string."); return; }
    const d = new Date(dateStr.trim());
    if (isNaN(d.getTime())) { setError("Invalid date format. Try ISO 8601: 2026-02-16T12:00:00Z"); return; }
    setEpoch(Math.floor(d.getTime() / 1000).toString());
  };

  const handleNow = () => {
    const now = Math.floor(Date.now() / 1000);
    setEpoch(now.toString());
    setDateStr(new Date().toISOString());
    setError("");
  };

  const nowDate = new Date(currentEpoch * 1000);

  return (
    <ToolLayout
      title="Epoch / Unix Timestamp Converter Online"
      description="Convert Unix timestamps to human-readable dates and vice versa. Supports seconds and milliseconds."
      relatedTools={["json-formatter", "uuid-generator", "hash-generator"]}
    >
      {/* Live clock */}
      <div className="mb-6 rounded-lg border border-blue-100 bg-blue-50 dark:bg-blue-950 p-4 text-center">
        <div className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">Current Unix Timestamp</div>
        <div className="text-3xl font-bold font-mono text-blue-700 dark:text-blue-300">{currentEpoch}</div>
        <div className="text-sm text-blue-500 mt-1">{nowDate.toUTCString()}</div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 px-4 py-2 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Epoch → Date */}
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">Timestamp → Date</h3>
          <input
            type="text"
            value={epoch}
            onChange={(e) => setEpoch(e.target.value)}
            placeholder="e.g. 1708099200"
            className="mb-3 w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
          />
          <div className="flex gap-2">
            <button
              onClick={handleEpochToDate}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Convert to Date
            </button>
            <button
              onClick={handleNow}
              className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
            >
              Now
            </button>
          </div>
        </div>

        {/* Date → Epoch */}
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">Date → Timestamp</h3>
          <input
            type="text"
            value={dateStr}
            onChange={(e) => setDateStr(e.target.value)}
            placeholder="e.g. 2026-02-16T12:00:00Z"
            className="mb-3 w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
          />
          <div className="flex gap-2">
            <button
              onClick={handleDateToEpoch}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Convert to Timestamp
            </button>
            <CopyButton text={epoch} />
          </div>
        </div>
      </div>

      {/* Quick reference */}
      {epoch && dateStr && !error && (
        <div className="mt-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 p-4">
          <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">Converted Values</h3>
          <div className="grid gap-2 text-sm sm:grid-cols-2">
            <div><span className="text-gray-500 dark:text-gray-400">Unix (seconds):</span> <code className="font-mono">{epoch}</code></div>
            <div><span className="text-gray-500 dark:text-gray-400">Unix (ms):</span> <code className="font-mono">{Number(epoch) * 1000}</code></div>
            <div><span className="text-gray-500 dark:text-gray-400">ISO 8601:</span> <code className="font-mono">{dateStr}</code></div>
            <div><span className="text-gray-500 dark:text-gray-400">UTC:</span> <code className="font-mono">{new Date(Number(epoch) * 1000).toUTCString()}</code></div>
            <div><span className="text-gray-500 dark:text-gray-400">Local:</span> <code className="font-mono">{new Date(Number(epoch) * 1000).toLocaleString()}</code></div>
            <div><span className="text-gray-500 dark:text-gray-400">Relative:</span> <code className="font-mono">{Math.abs(currentEpoch - Number(epoch))} seconds {Number(epoch) > currentEpoch ? "from now" : "ago"}</code></div>
          </div>
        </div>
      )}

      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">What is a Unix Timestamp?</h2>
        <p className="mb-3">
          A Unix timestamp (epoch time) is the number of seconds that have elapsed since
          January 1, 1970, 00:00:00 UTC. It is widely used in programming, databases, and APIs
          to represent points in time as a single number.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Seconds vs Milliseconds</h2>
        <p>
          Some systems use seconds (10 digits, e.g. 1708099200) while others use milliseconds
          (13 digits, e.g. 1708099200000). This tool auto-detects the format based on the
          number of digits.
        </p>
      </div>
    
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
        <p>The Epoch Converter tool translates Unix timestamps to human-readable dates and converts dates back to Unix epoch seconds. Unix timestamps are the standard way to represent time in databases, APIs, log files, and programming languages across all time zones.</p>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Key Features</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong className="text-gray-700 dark:text-gray-300">Timestamp to Date</strong> &mdash; Converts a Unix epoch (seconds since January 1, 1970 UTC) to a readable local date and time in your browser&apos;s timezone.</li>
          <li><strong className="text-gray-700 dark:text-gray-300">Date to Timestamp</strong> &mdash; Converts any date and time you enter into the corresponding Unix timestamp in seconds for use in APIs and databases.</li>
          <li><strong className="text-gray-700 dark:text-gray-300">Current Epoch Time</strong> &mdash; Displays the live current Unix timestamp in seconds and milliseconds, updating every second.</li>
          <li><strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> &mdash; All conversion runs locally in your browser using JavaScript Date objects. No data is sent to any server.</li>
          <li><strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> &mdash; Use this tool as many times as you need without creating an account or paying anything.</li>
        </ul>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Common Use Cases</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Debugging API requests that use Unix timestamps in request headers or response payloads</li>
          <li>Checking whether a JWT token expiration timestamp (exp claim) has already passed</li>
          <li>Converting database-stored timestamps to readable dates for data analysis and reporting</li>
          <li>Generating epoch timestamps for constructing time-based queries or scheduled event triggers</li>
          <li>Reading log file timestamps and correlating events across different time zones</li>
        </ul>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">How to Use</h2>
        <p>The current Unix timestamp is shown at the top and updates live. To convert a timestamp to a date, paste the epoch value into the Timestamp field and click Convert. To convert a date to a timestamp, enter the date and time in the Date field and click Convert.</p>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">What is a Unix timestamp?</summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">A Unix timestamp is the number of seconds elapsed since January 1, 1970, 00:00:00 UTC (the Unix epoch). It is a time zone-independent way to represent moments in time used by virtually all operating systems and programming languages.</p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">What is the Year 2038 problem?</summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">The Year 2038 problem affects 32-bit signed integers storing Unix timestamps. The maximum value (2,147,483,647) corresponds to January 19, 2038. After that date, the counter overflows. Modern systems use 64-bit integers which will not overflow for billions of years.</p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">What is the difference between Unix timestamps in seconds and milliseconds?</summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">Most Unix APIs use seconds. JavaScript&apos;s Date.now() and many web APIs return milliseconds. If a timestamp is 13 digits long, it is in milliseconds. Divide by 1000 to get seconds.</p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Are Unix timestamps affected by time zones?</summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">No. Unix timestamps always represent UTC seconds regardless of local time zone. The human-readable display shows local time, but the underlying timestamp is always UTC.</p>
          </details>
        </div>
      </div>
    </ToolLayout>
  );
}
