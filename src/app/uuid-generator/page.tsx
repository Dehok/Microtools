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
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The UUID Generator creates random universally unique identifiers (UUIDs) following the version 4 (v4) standard. UUIDs are 128-bit identifiers used extensively in software development for database records, API keys, session tokens, and distributed systems where unique identification without central coordination is required.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">UUID v4 Generation</strong> — Creates cryptographically random UUIDs conforming to RFC 4122 version 4 specification.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Bulk Generation</strong> — Generate multiple UUIDs at once for batch operations, database seeding, or test data creation.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">One-Click Copy</strong> — Copy individual UUIDs or all generated UUIDs to your clipboard with a single click.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Instant Generation</strong> — UUIDs are generated using the browser's crypto.getRandomValues() for high-quality randomness.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Creating unique primary keys for database records in PostgreSQL, MongoDB, or other databases</li>
          <li>Generating unique identifiers for API resources, session tokens, or correlation IDs</li>
          <li>Seeding test databases with realistic unique identifiers</li>
          <li>Creating unique filenames or resource identifiers in distributed systems</li>
          <li>Generating tracking IDs for analytics events, logs, or audit trails</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Click the Generate button to create a new UUID. Use the bulk generation option to create multiple UUIDs at once. Click on any UUID to copy it to your clipboard.
        </p>
      </div>
    </ToolLayout>
  );
}
