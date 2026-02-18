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
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The Base64 Encoder/Decoder is a free online tool that converts text to Base64-encoded strings and decodes Base64 back to readable text. Base64 encoding is commonly used in web development, email protocols, and data serialization to safely transmit binary data as ASCII text.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Encode to Base64</strong> — Converts any text or string into its Base64-encoded representation using the standard Base64 alphabet.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Decode from Base64</strong> — Converts Base64-encoded strings back into their original readable text format.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Instant Results</strong> — Encoding and decoding happen in real time as you type, with no need to click a button.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">UTF-8 Support</strong> — Handles Unicode and special characters correctly by encoding text as UTF-8 before Base64 conversion.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Encoding data for embedding in HTML data URIs (e.g., inline images or fonts)</li>
          <li>Decoding Base64 strings from API responses, cookies, or authentication tokens</li>
          <li>Preparing binary data for transmission in JSON, XML, or email attachments</li>
          <li>Debugging encoded values in URLs, headers, or configuration files</li>
          <li>Learning and experimenting with Base64 encoding for educational purposes</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Select the mode (Encode or Decode) and paste your text into the input area. The result appears instantly in the output. Use the Copy button to copy the encoded or decoded text to your clipboard.
        </p>
      
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              What is Base64 encoding?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Base64 is a method of encoding binary data into ASCII text using 64 characters (A-Z, a-z, 0-9, +, /). It&apos;s commonly used to embed images in HTML, transmit data in URLs, and encode email attachments.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Is Base64 encoding the same as encryption?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. Base64 is an encoding scheme, not encryption. Anyone can decode Base64 text back to its original form. It provides no security — it&apos;s only used to safely transmit binary data as text.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Why does Base64 increase the size of data?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Base64 encoding increases data size by approximately 33% because it represents 3 bytes of binary data using 4 ASCII characters. This trade-off is necessary for safe text-based transmission.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Does this tool handle Unicode characters?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes. The tool encodes text as UTF-8 before Base64 conversion, ensuring that special characters, emojis, and non-Latin scripts are handled correctly.
            </p>
          </details>
        </div>
</div>
    </ToolLayout>
  );
}
