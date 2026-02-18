"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function UrlEncoderDecoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [error, setError] = useState("");
  const [encodeType, setEncodeType] = useState<"component" | "full">("component");

  const handleConvert = () => {
    setError("");
    if (!input.trim()) {
      setError("Please enter a URL or text.");
      return;
    }
    try {
      if (mode === "encode") {
        setOutput(
          encodeType === "component"
            ? encodeURIComponent(input)
            : encodeURI(input)
        );
      } else {
        setOutput(
          encodeType === "component"
            ? decodeURIComponent(input.trim())
            : decodeURI(input.trim())
        );
      }
    } catch {
      setError("Invalid input. Please check your text and try again.");
      setOutput("");
    }
  };

  const handleSwap = () => {
    setInput(output);
    setOutput("");
    setMode(mode === "encode" ? "decode" : "encode");
  };

  return (
    <ToolLayout
      title="URL Encoder & Decoder Online"
      description="Encode or decode URLs and query string parameters. Handles special characters, spaces, and unicode."
      relatedTools={["base64-encode-decode", "hash-generator", "json-formatter"]}
    >
      {/* Mode */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setMode("encode")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            mode === "encode"
              ? "bg-blue-600 text-white"
              : "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
          }`}
        >
          Encode
        </button>
        <button
          onClick={() => setMode("decode")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            mode === "decode"
              ? "bg-blue-600 text-white"
              : "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
          }`}
        >
          Decode
        </button>
        <select
          value={encodeType}
          onChange={(e) => setEncodeType(e.target.value as "component" | "full")}
          className="ml-auto rounded-md border border-gray-300 dark:border-gray-600 px-2 py-1 text-sm"
        >
          <option value="component">encodeURIComponent</option>
          <option value="full">encodeURI (full URL)</option>
        </select>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 px-4 py-2 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Input */}
      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {mode === "encode" ? "Text / URL to encode" : "Encoded URL to decode"}
      </label>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={
          mode === "encode"
            ? "hello world & foo=bar"
            : "hello%20world%20%26%20foo%3Dbar"
        }
        className="mb-4 h-32 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
        spellCheck={false}
      />

      <div className="mb-4 flex gap-2">
        <button
          onClick={handleConvert}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          {mode === "encode" ? "Encode" : "Decode"}
        </button>
        <button
          onClick={handleSwap}
          disabled={!output}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800 disabled:opacity-40"
        >
          Swap
        </button>
        <button
          onClick={() => { setInput(""); setOutput(""); setError(""); }}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
        >
          Clear
        </button>
      </div>

      <div className="mb-1 flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Result</label>
        <CopyButton text={output} />
      </div>
      <textarea
        value={output}
        readOnly
        placeholder="Result will appear here..."
        className="h-32 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 font-mono text-sm"
      />

      {/* SEO */}
      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">What is URL Encoding?</h2>
        <p className="mb-3">
          URL encoding (percent-encoding) replaces unsafe characters with a &quot;%&quot; followed by
          two hexadecimal digits. For example, a space becomes %20 and an ampersand becomes %26.
          This ensures URLs are transmitted correctly over the internet.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">encodeURI vs encodeURIComponent</h2>
        <p>
          <strong>encodeURIComponent</strong> encodes everything except letters, digits, and a few
          special characters. Use it for query string values. <strong>encodeURI</strong> preserves
          characters that are part of a valid URL structure (like :, /, ?, #). Use it for full URLs.
        </p>
      </div>
    
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The URL Encoder/Decoder converts special characters in URLs to their percent-encoded equivalents and back. URL encoding (also called percent encoding) replaces unsafe characters with a % followed by their hexadecimal value, ensuring URLs are valid and can be transmitted safely across the internet.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Encode URLs</strong> — Converts special characters (spaces, &amp;, =, ?, etc.) to percent-encoded format.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Decode URLs</strong> — Converts percent-encoded strings back to their original readable characters.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Full Character Support</strong> — Handles Unicode characters, query parameters, and fragment identifiers correctly.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Real-Time Results</strong> — Encoding and decoding happen instantly as you type.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Encoding query parameters before appending them to URLs in web applications</li>
          <li>Decoding URLs from API responses, logs, or analytics data</li>
          <li>Preparing URLs with special characters for use in HTML, JavaScript, or API calls</li>
          <li>Debugging URL encoding issues in web applications and redirects</li>
          <li>Encoding file paths and resource identifiers for use in REST APIs</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Select Encode or Decode mode. Paste your URL or text into the input field. The encoded or decoded result appears instantly. Copy the result with the Copy button.
        </p>
      
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Why do URLs need encoding?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              URLs can only contain a limited set of ASCII characters. Special characters like spaces, &amp;, =, and non-ASCII characters must be percent-encoded (e.g., space → %20) to be valid in URLs.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              What is the difference between encodeURI and encodeURIComponent?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              encodeURI() encodes a complete URI, preserving characters like :, /, ?, and #. encodeURIComponent() encodes everything except letters, digits, and a few special characters — use it for encoding individual query parameter values.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              What does %20 mean in a URL?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              %20 is the percent-encoded representation of a space character. Sometimes you&apos;ll also see + used for spaces in query strings (application/x-www-form-urlencoded), but %20 is the standard URL encoding.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Is URL encoding reversible?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes. URL encoding is a simple, reversible transformation. Any percent-encoded string can be decoded back to its original characters using this tool or the decodeURIComponent() function in JavaScript.
            </p>
          </details>
        </div>
</div>
    </ToolLayout>
  );
}
