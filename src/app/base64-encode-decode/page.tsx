"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function Base64Tool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [error, setError] = useState("");

  const handleConvert = () => {
    setError("");
    if (!input.trim()) {
      setError("Please enter some text.");
      return;
    }
    try {
      if (mode === "encode") {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input.trim()))));
      }
    } catch {
      setError(
        mode === "decode"
          ? "Invalid Base64 string. Please check your input."
          : "Could not encode the input."
      );
      setOutput("");
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  const handleSwap = () => {
    setInput(output);
    setOutput("");
    setMode(mode === "encode" ? "decode" : "encode");
  };

  return (
    <ToolLayout
      title="Base64 Encode & Decode Online"
      description="Encode text to Base64 or decode Base64 to plain text instantly. Supports UTF-8 characters."
      relatedTools={["json-formatter", "uuid-generator", "word-counter"]}
    >
      {/* Mode toggle */}
      <div className="mb-4 flex gap-2">
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
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 px-4 py-2 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Input */}
      <div className="mb-1 flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {mode === "encode" ? "Text to encode" : "Base64 to decode"}
        </label>
        <span className="text-xs text-gray-400 dark:text-gray-500">{input.length} characters</span>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={
          mode === "encode"
            ? "Enter text to encode to Base64..."
            : "Enter Base64 string to decode..."
        }
        className="mb-4 h-36 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
        spellCheck={false}
      />

      {/* Buttons */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={handleConvert}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          {mode === "encode" ? "Encode to Base64" : "Decode from Base64"}
        </button>
        <button
          onClick={handleSwap}
          disabled={!output}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800 disabled:opacity-40"
        >
          Swap
        </button>
        <button
          onClick={handleClear}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
        >
          Clear
        </button>
      </div>

      {/* Output */}
      <div className="mb-1 flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Result</label>
        <CopyButton text={output} />
      </div>
      <textarea
        value={output}
        readOnly
        placeholder="Result will appear here..."
        className="h-36 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 font-mono text-sm"
      />

      
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
        <p>The Base64 Encoder/Decoder converts text to Base64-encoded strings and decodes Base64 back to readable text. Base64 encoding is widely used to safely transmit binary data as ASCII text in web applications, email protocols, JWT tokens, and data URLs.</p>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Key Features</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong className="text-gray-700 dark:text-gray-300">Encode to Base64</strong> &mdash; Converts any plain text or Unicode characters into its Base64-encoded representation using the standard RFC 4648 alphabet.</li>
          <li><strong className="text-gray-700 dark:text-gray-300">Decode from Base64</strong> &mdash; Converts Base64-encoded strings back into their original readable text, revealing the content of any Base64 payload.</li>
          <li><strong className="text-gray-700 dark:text-gray-300">Swap Direction</strong> &mdash; One-click Swap button moves the output back to the input and toggles mode for quick round-trip testing.</li>
          <li><strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> &mdash; All operations run locally in your browser. Your data never leaves your device.</li>
          <li><strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> &mdash; Use this tool as many times as you need without creating an account or paying anything.</li>
        </ul>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Common Use Cases</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Decoding Base64 strings embedded in JWT tokens to inspect their claims and expiration timestamps</li>
          <li>Encoding images or binary files to Base64 data URIs for embedding directly in HTML or CSS stylesheets</li>
          <li>Decoding Base64 values from API responses, HTTP Authorization headers, or cookie values</li>
          <li>Encoding configuration secrets and API keys for environment variables or base64-encoded config files</li>
          <li>Testing and debugging Base64 encoding in web applications before deployment</li>
        </ul>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">How to Use</h2>
        <p>Select Encode or Decode mode using the buttons at the top. Paste your text into the input area and click the action button. The result appears in the output field below. Use the Swap button to reverse the operation, and Copy to copy the result to your clipboard.</p>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">What is Base64 encoding?</summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">Base64 represents binary data using 64 printable ASCII characters (A&ndash;Z, a&ndash;z, 0&ndash;9, +, /). It allows binary content to be safely transmitted over channels that only support text, such as email or JSON.</p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Is Base64 encoding the same as encryption?</summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">No. Base64 is an encoding scheme, not encryption. Anyone can decode Base64 text instantly. It provides no security and should never be used to protect sensitive data.</p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Why does Base64 increase data size?</summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">Base64 represents 3 bytes of binary data using 4 ASCII characters, increasing size by approximately 33%. This overhead is the trade-off for safe text-based transmission.</p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Does this tool handle Unicode and emoji?</summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">Yes. The tool encodes text as UTF-8 before Base64 conversion, correctly handling all Unicode characters including accented letters, Chinese characters, and emoji.</p>
          </details>
        </div>
      </div>
    </ToolLayout>
  );
}
