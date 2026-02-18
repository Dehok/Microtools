"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function textToBinary(text: string): string {
  return text
    .split("")
    .map((c) => c.charCodeAt(0).toString(2).padStart(8, "0"))
    .join(" ");
}

function binaryToText(binary: string): string {
  return binary
    .trim()
    .split(/\s+/)
    .map((b) => {
      const num = parseInt(b, 2);
      if (isNaN(num)) return "?";
      return String.fromCharCode(num);
    })
    .join("");
}

function textToHex(text: string): string {
  return text
    .split("")
    .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0").toUpperCase())
    .join(" ");
}

function textToOctal(text: string): string {
  return text
    .split("")
    .map((c) => c.charCodeAt(0).toString(8).padStart(3, "0"))
    .join(" ");
}

function textToDecimal(text: string): string {
  return text
    .split("")
    .map((c) => c.charCodeAt(0).toString())
    .join(" ");
}

export default function TextToBinary() {
  const [input, setInput] = useState("Hello!");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const results = useMemo(() => {
    if (!input.trim()) return null;
    if (mode === "encode") {
      return {
        binary: textToBinary(input),
        hex: textToHex(input),
        octal: textToOctal(input),
        decimal: textToDecimal(input),
      };
    }
    return {
      text: binaryToText(input),
    };
  }, [input, mode]);

  return (
    <ToolLayout
      title="Text to Binary Converter — Binary, Hex, Octal, Decimal"
      description="Convert text to binary, hexadecimal, octal, or decimal. Decode binary back to text. Free online converter."
      relatedTools={["number-base-converter", "base64-encode-decode", "morse-code"]}
    >
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => { setMode("encode"); setInput("Hello!"); }}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            mode === "encode" ? "bg-blue-600 text-white" : "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
          }`}
        >
          Text → Binary
        </button>
        <button
          onClick={() => { setMode("decode"); setInput("01001000 01100101 01101100 01101100 01101111 00100001"); }}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            mode === "decode" ? "bg-blue-600 text-white" : "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
          }`}
        >
          Binary → Text
        </button>
      </div>

      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {mode === "encode" ? "Text Input" : "Binary Input"}
      </label>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={mode === "encode" ? "Enter text..." : "Enter binary (e.g. 01001000 01101001)..."}
        className="mb-4 h-24 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
        spellCheck={false}
      />

      {results && mode === "encode" && (
        <div className="space-y-2">
          {[
            { label: "Binary", value: results.binary! },
            { label: "Hexadecimal", value: results.hex! },
            { label: "Octal", value: results.octal! },
            { label: "Decimal", value: results.decimal! },
          ].map((r) => (
            <div key={r.label} className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{r.label}</span>
                <CopyButton text={r.value} />
              </div>
              <div className="font-mono text-sm text-gray-900 dark:text-gray-100 break-all">{r.value}</div>
            </div>
          ))}
        </div>
      )}

      {results && mode === "decode" && (
        <div className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950 p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Decoded Text</span>
            <CopyButton text={results.text!} />
          </div>
          <div className="text-lg font-medium text-blue-900">{results.text}</div>
        </div>
      )}

      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">How Text-to-Binary Works</h2>
        <p className="mb-3">
          Each character has a numeric value (ASCII/Unicode code point). This number is then
          converted to its binary (base 2), hexadecimal (base 16), octal (base 8), or decimal
          representation. For example, &quot;A&quot; = 65 = 01000001 in binary.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">ASCII Table Basics</h2>
        <p>
          ASCII uses 7 bits (0-127) for English letters, digits, and symbols. Extended ASCII
          uses 8 bits (0-255). Unicode extends this to support all world languages and emoji.
        </p>
      </div>
    </ToolLayout>
  );
}
