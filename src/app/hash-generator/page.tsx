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
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
        <p>The Hash Generator computes cryptographic hash digests of text input using MD5, SHA-1, SHA-256, and SHA-512 algorithms. Hashing is fundamental to data integrity verification, password storage, digital signatures, and checksums in modern software development.</p>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Key Features</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong className="text-gray-700 dark:text-gray-300">Four Hash Algorithms</strong> &mdash; Generates MD5, SHA-1, SHA-256, and SHA-512 digests simultaneously so you can compare outputs and choose the right algorithm for your use case.</li>
          <li><strong className="text-gray-700 dark:text-gray-300">Uppercase &amp; Lowercase Output</strong> &mdash; Toggle between uppercase and lowercase hex output to match the format expected by your application or comparison target.</li>
          <li><strong className="text-gray-700 dark:text-gray-300">Real-Time Hashing</strong> &mdash; Hash values update instantly as you type, so you can see how small changes in input produce completely different output (the avalanche effect).</li>
          <li><strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> &mdash; All hashing runs locally in your browser using the Web Crypto API. Your input text never leaves your device.</li>
          <li><strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> &mdash; Use this tool as many times as you need without creating an account or paying anything.</li>
        </ul>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Common Use Cases</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Verifying file integrity by comparing SHA-256 checksums before and after download or transfer</li>
          <li>Generating a hash of a password to compare against a stored hash during authentication testing</li>
          <li>Computing MD5 checksums to detect accidental data corruption in files or database records</li>
          <li>Creating content-addressable cache keys by hashing request parameters or file contents</li>
          <li>Learning how the avalanche effect works by observing that one character change completely changes the hash</li>
        </ul>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">How to Use</h2>
        <p>Type or paste text into the input field. Hash values for MD5, SHA-1, SHA-256, and SHA-512 appear immediately below. Use the Uppercase toggle to switch between hex case formats. Click the Copy icon next to any hash to copy it to your clipboard.</p>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">What is the difference between MD5, SHA-1, and SHA-256?</summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">MD5 produces a 128-bit hash and is fast but cryptographically broken. SHA-1 produces 160 bits and is also deprecated for security use. SHA-256 (part of SHA-2) produces 256 bits and is currently secure for most applications.</p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Can I reverse a hash to get the original text?</summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">No. Cryptographic hashes are one-way functions by design. You cannot mathematically reverse a hash. Attackers may use precomputed rainbow tables for common passwords, which is why salting is important for password hashing.</p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Should I use this tool to hash passwords?</summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">No. This tool uses raw hash functions, which are not suitable for password storage. Use a dedicated password hashing algorithm like bcrypt, Argon2, or PBKDF2, which include salting and cost factors.</p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">What is the avalanche effect?</summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">The avalanche effect means that a tiny change in input (even one character) produces a completely different hash output. This property ensures that two similar inputs cannot be distinguished from their hashes alone.</p>
          </details>
        </div>
      </div>
    </ToolLayout>
  );
}
