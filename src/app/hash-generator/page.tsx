"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

async function computeHash(
  algorithm: string,
  text: string
): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

const ALGORITHMS = [
  { id: "SHA-1", label: "SHA-1" },
  { id: "SHA-256", label: "SHA-256" },
  { id: "SHA-384", label: "SHA-384" },
  { id: "SHA-512", label: "SHA-512" },
];

export default function HashGenerator() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [uppercase, setUppercase] = useState(false);

  const handleGenerate = async () => {
    if (!input) return;
    const results: Record<string, string> = {};
    for (const algo of ALGORITHMS) {
      const hash = await computeHash(algo.id, input);
      results[algo.id] = uppercase ? hash.toUpperCase() : hash;
    }
    setHashes(results);
  };

  const handleClear = () => {
    setInput("");
    setHashes({});
  };

  return (
    <ToolLayout
      title="Hash Generator Online — SHA-256, SHA-1, SHA-512"
      description="Generate SHA-1, SHA-256, SHA-384, and SHA-512 hashes from any text. All hashing happens in your browser."
      relatedTools={["password-generator", "base64-encode-decode", "uuid-generator"]}
    >
      {/* Input */}
      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
        Enter text to hash
      </label>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type or paste text here..."
        className="mb-4 h-32 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
        spellCheck={false}
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          onClick={handleGenerate}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Generate Hashes
        </button>
        <button
          onClick={handleClear}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
        >
          Clear
        </button>
        <label className="ml-auto flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
          <input
            type="checkbox"
            checked={uppercase}
            onChange={(e) => setUppercase(e.target.checked)}
            className="rounded border-gray-300 dark:border-gray-600"
          />
          Uppercase
        </label>
      </div>

      {/* Results */}
      {Object.keys(hashes).length > 0 && (
        <div className="space-y-3">
          {ALGORITHMS.map((algo) => (
            <div
              key={algo.id}
              className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 p-3"
            >
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {algo.label}
                </span>
                <CopyButton text={hashes[algo.id] || ""} />
              </div>
              <div className="select-all break-all font-mono text-sm text-gray-800 dark:text-gray-200">
                {hashes[algo.id]}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SEO */}
      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">What is a Hash?</h2>
        <p className="mb-3">
          A hash function takes input data of any size and produces a fixed-size string of
          characters (the hash). Hashes are one-way — you cannot reverse them to get the
          original text. They are used for data integrity, password storage, and digital signatures.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Which algorithm should I use?</h2>
        <p className="mb-3">
          <strong>SHA-256</strong> is the most commonly used and recommended for most purposes.
          SHA-1 is considered weak and should not be used for security. SHA-512 provides the
          highest security but produces longer hashes.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Is this tool secure?</h2>
        <p>
          Yes. All hashing happens locally in your browser using the Web Crypto API. No data
          is sent to any server.
        </p>
      </div>
    </ToolLayout>
  );
}
