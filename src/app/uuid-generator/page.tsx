"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([generateUUID()]);
  const [count, setCount] = useState(1);
  const [uppercase, setUppercase] = useState(false);
  const [noDashes, setNoDashes] = useState(false);

  const handleGenerate = () => {
    const newUuids = Array.from({ length: count }, () => {
      let uuid = generateUUID();
      if (uppercase) uuid = uuid.toUpperCase();
      if (noDashes) uuid = uuid.replace(/-/g, "");
      return uuid;
    });
    setUuids(newUuids);
  };

  const allText = uuids.join("\n");

  return (
    <ToolLayout
      title="UUID Generator Online"
      description="Generate random UUIDs (v4) instantly. Bulk generation, uppercase, and no-dash options available."
      relatedTools={["json-formatter", "base64-encode-decode", "lorem-ipsum-generator"]}
    >
      {/* Options */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">Count:</label>
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="rounded-md border border-gray-300 dark:border-gray-600 px-2 py-1 text-sm"
          >
            {[1, 5, 10, 25, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <label className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
          <input
            type="checkbox"
            checked={uppercase}
            onChange={(e) => setUppercase(e.target.checked)}
            className="rounded border-gray-300 dark:border-gray-600"
          />
          Uppercase
        </label>
        <label className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
          <input
            type="checkbox"
            checked={noDashes}
            onChange={(e) => setNoDashes(e.target.checked)}
            className="rounded border-gray-300 dark:border-gray-600"
          />
          No dashes
        </label>
      </div>

      {/* Generate button */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={handleGenerate}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Generate UUID{count > 1 ? "s" : ""}
        </button>
        <CopyButton text={allText} />
      </div>

      {/* Results */}
      <div className="rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3">
        {uuids.map((uuid, i) => (
          <div
            key={i}
            className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 py-1.5 font-mono text-sm last:border-0"
          >
            <span className="select-all">{uuid}</span>
          </div>
        ))}
      </div>

      
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
        <p>The UUID Generator creates cryptographically random version 4 UUIDs (Universally Unique Identifiers) following RFC 4122. UUIDs are 128-bit identifiers used as primary keys in databases, API resource IDs, session tokens, and anywhere you need globally unique values without central coordination.</p>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Key Features</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong className="text-gray-700 dark:text-gray-300">Bulk Generation</strong> &mdash; Generate up to 100 UUIDs in a single click using the Count selector, ideal for database seeding and test data creation.</li>
          <li><strong className="text-gray-700 dark:text-gray-300">Uppercase &amp; No-Dash Options</strong> &mdash; Toggle uppercase output or strip dashes for UUID formats required by specific databases or APIs.</li>
          <li><strong className="text-gray-700 dark:text-gray-300">Copy All at Once</strong> &mdash; The Copy All button copies every generated UUID to your clipboard as newline-separated values for batch use.</li>
          <li><strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> &mdash; All operations run locally in your browser. Your data never leaves your device.</li>
          <li><strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> &mdash; Use this tool as many times as you need without creating an account or paying anything.</li>
        </ul>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Common Use Cases</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Generating unique primary keys for new database records in PostgreSQL, MySQL, or MongoDB</li>
          <li>Creating unique correlation IDs for distributed system requests and API call tracing</li>
          <li>Seeding development databases with realistic unique identifiers for testing</li>
          <li>Generating unique filenames for uploaded files to avoid name collisions in storage systems</li>
          <li>Creating idempotency keys for payment APIs and other sensitive transactional operations</li>
        </ul>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">How to Use</h2>
        <p>Select the number of UUIDs to generate from the Count dropdown, then optionally check Uppercase or No Dashes to customize the format. Click Generate to create fresh UUIDs. Click any individual UUID to select it, or use Copy All to copy the entire list to your clipboard.</p>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">What is UUID v4 and how is it different from v1?</summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">UUID v4 is fully random (except for a few version bits), providing strong unpredictability. UUID v1 uses a timestamp and MAC address, making it sequential but potentially exposing machine information. This tool generates v4 UUIDs.</p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Are UUIDs truly unique?</summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">In practice, yes. The probability of two v4 UUIDs colliding is approximately 1 in 5.3 &times; 10&sup3;&#8310;. You would need to generate billions per second for decades to have even a small chance of a collision.</p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Can I use UUIDs as primary keys in SQL databases?</summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">Yes. PostgreSQL, MySQL, and SQL Server all support UUID primary keys natively. They enable distributed ID generation without coordination, at the cost of slightly larger indexes compared to sequential integers.</p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">What is a GUID? Is it the same as a UUID?</summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">GUID (Globally Unique Identifier) is Microsoft&apos;s term for the same concept. GUIDs and UUIDs use the same 128-bit format and are fully interchangeable in practice.</p>
          </details>
        </div>
      </div>
    </ToolLayout>
  );
}
