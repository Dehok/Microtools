"use client";

import { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function EpochConverter() {
  const [epoch, setEpoch] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [currentEpoch, setCurrentEpoch] = useState(Math.floor(Date.now() / 1000));
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
    </ToolLayout>
  );
}
