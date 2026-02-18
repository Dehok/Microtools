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
      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
          What is a UUID?
        </h2>
        <p className="mb-3">
          A UUID (Universally Unique Identifier) is a 128-bit label used to
          uniquely identify objects in computer systems. UUID v4 is generated
          using random numbers and is the most commonly used version.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
          UUID format
        </h2>
        <p>
          A standard UUID looks like: 550e8400-e29b-41d4-a716-446655440000. It
          consists of 32 hexadecimal digits displayed in 5 groups separated by
          hyphens (8-4-4-4-12).
        </p>
      </div>
    </ToolLayout>
  );
}
