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
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
        <p>The URL Encoder/Decoder converts special characters in URLs to their percent-encoded equivalents and decodes percent-encoded strings back to readable text. URL encoding is essential for safely transmitting data through query strings, form submissions, and REST API parameters.</p>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Key Features</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong className="text-gray-700 dark:text-gray-300">Encode URL Components</strong> &mdash; Converts spaces, special characters, and non-ASCII text to percent-encoded sequences safe for use in query strings and URI components.</li>
          <li><strong className="text-gray-700 dark:text-gray-300">Decode Percent-Encoded URLs</strong> &mdash; Converts %XX sequences back to their original characters so you can read the actual content of encoded URLs and query parameters.</li>
          <li><strong className="text-gray-700 dark:text-gray-300">Swap Direction</strong> &mdash; Toggle between Encode and Decode mode instantly with the Swap button for quick round-trip testing of URL values.</li>
          <li><strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> &mdash; All operations run locally in your browser. Your data never leaves your device.</li>
          <li><strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> &mdash; Use this tool as many times as you need without creating an account or paying anything.</li>
        </ul>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Common Use Cases</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Encoding user-entered search queries before appending them to API request URLs as query parameters</li>
          <li>Decoding percent-encoded URLs in browser network logs to read the actual parameter values passed</li>
          <li>Fixing broken URLs containing spaces or special characters in HTML href attributes</li>
          <li>Encoding OAuth redirect URIs and callback URLs that contain slashes and colons</li>
          <li>Decoding obfuscated tracking URLs in marketing emails to see the actual destination</li>
        </ul>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">How to Use</h2>
        <p>Select Encode or Decode mode with the toggle at the top. Paste your URL or text into the input field and click the action button. The encoded or decoded result appears instantly in the output area. Use the Copy button to copy the result to your clipboard.</p>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">What is the difference between encodeURI and encodeURIComponent?</summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">encodeURI encodes a full URL, leaving structural characters like /, ?, and # intact. encodeURIComponent encodes every special character, making it suitable for individual query parameter values. This tool uses the component encoding.</p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Why does a space become %20 or +?</summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">%20 is the standard percent-encoding of a space (RFC 3986). The + sign represents a space in the older application/x-www-form-urlencoded format used by HTML forms. Both decode to a space character.</p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Can I encode an entire URL at once?</summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">You can paste a full URL but only the parts that need encoding (query values, path segments with special characters) should be encoded. Encoding the entire URL including the protocol and slashes will break it.</p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Does URL encoding support Unicode characters?</summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">Yes. Non-ASCII characters like accented letters and emoji are first UTF-8 encoded, then each byte is percent-encoded. For example, the euro sign &euro; becomes %E2%82%AC.</p>
          </details>
        </div>
      </div>
    </ToolLayout>
  );
}
