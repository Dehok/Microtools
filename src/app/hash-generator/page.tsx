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
    
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The Hash Generator creates cryptographic hash values from any text input using popular algorithms including MD5, SHA-1, SHA-256, and SHA-512. Hashing is a one-way function that converts data into a fixed-length string, widely used for data integrity verification, password storage, and digital signatures.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Multiple Algorithms</strong> — Supports MD5, SHA-1, SHA-256, and SHA-512 hash algorithms for various security requirements.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Instant Hashing</strong> — Generates hash values in real time as you type, with no need to submit a form.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Hex Output</strong> — Displays hash values in standard hexadecimal format, compatible with all programming languages and tools.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">One-Click Copy</strong> — Copy any hash value to your clipboard with a single click for easy use in your projects.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Verifying file integrity by comparing hash values before and after transfer</li>
          <li>Generating hash values for password storage and authentication systems</li>
          <li>Creating checksums for data validation and error detection</li>
          <li>Comparing hash outputs across different algorithms for security analysis</li>
          <li>Generating deterministic identifiers from text input for caching or deduplication</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Enter or paste your text into the input area. Hash values for all supported algorithms are generated instantly. Click the Copy button next to any hash to copy it to your clipboard.
        </p>
      
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              What is a hash function?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              A hash function takes any input and produces a fixed-length output (the hash). The same input always produces the same hash, but it&apos;s computationally infeasible to reverse the process or find two inputs with the same hash.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Which hash algorithm should I use?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              For general purposes, use SHA-256. MD5 and SHA-1 are considered insecure for cryptographic use. For password hashing, use bcrypt, scrypt, or Argon2 instead.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Is MD5 secure?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. MD5 is cryptographically broken — collision attacks are practical and fast. Don&apos;t use MD5 for security purposes. It&apos;s still acceptable for checksums and non-security data integrity checks.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Can I reverse a hash to get the original text?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Hash functions are one-way by design. You cannot mathematically reverse a hash. However, short or common inputs can be found using rainbow tables or brute force, which is why strong passwords are important.
            </p>
          </details>
        </div>
</div>
    </ToolLayout>
  );
}
