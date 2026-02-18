"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function rot13(text: string): string {
  return text.replace(/[a-zA-Z]/g, (c) => {
    const base = c <= "Z" ? 65 : 97;
    return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
  });
}

function rot47(text: string): string {
  return text.replace(/[!-~]/g, (c) => {
    return String.fromCharCode(((c.charCodeAt(0) - 33 + 47) % 94) + 33);
  });
}

function caesar(text: string, shift: number): string {
  return text.replace(/[a-zA-Z]/g, (c) => {
    const base = c <= "Z" ? 65 : 97;
    return String.fromCharCode(((c.charCodeAt(0) - base + shift + 26) % 26) + base);
  });
}

export default function Rot13() {
  const [input, setInput] = useState("Hello, World! This is a secret message.");
  const [shift, setShift] = useState(13);

  const results = useMemo(() => {
    if (!input) return { rot13: "", rot47: "", caesar: "" };
    return {
      rot13: rot13(input),
      rot47: rot47(input),
      caesar: caesar(input, shift),
    };
  }, [input, shift]);

  return (
    <ToolLayout
      title="ROT13 Encoder/Decoder — Caesar Cipher Online"
      description="Encode and decode text with ROT13, ROT47, or custom Caesar cipher shift. Free online encryption tool."
      relatedTools={["base64-encode-decode", "morse-code", "hash-generator"]}
    >
      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Input Text</label>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter text to encode/decode..."
        className="mb-4 h-24 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
        spellCheck={false}
      />

      <div className="space-y-3">
        {/* ROT13 */}
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">ROT13</span>
            <CopyButton text={results.rot13} />
          </div>
          <div className="font-mono text-sm text-gray-900 dark:text-gray-100 break-all">{results.rot13}</div>
        </div>

        {/* ROT47 */}
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">ROT47</span>
            <CopyButton text={results.rot47} />
          </div>
          <div className="font-mono text-sm text-gray-900 dark:text-gray-100 break-all">{results.rot47}</div>
        </div>

        {/* Custom Caesar */}
        <div className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950 p-3">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Caesar Shift</span>
              <input
                type="number"
                min="1"
                max="25"
                value={shift}
                onChange={(e) => setShift(Math.max(1, Math.min(25, parseInt(e.target.value) || 1)))}
                className="w-16 rounded border border-blue-300 bg-white dark:bg-gray-900 px-2 py-0.5 text-center text-sm"
              />
            </div>
            <CopyButton text={results.caesar} />
          </div>
          <div className="font-mono text-sm text-blue-900 break-all">{results.caesar}</div>
        </div>
      </div>

      {/* Decode hint */}
      <div className="mt-4 rounded-lg border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950 px-4 py-2 text-sm text-yellow-700 dark:text-yellow-300">
        ROT13 is its own inverse — applying ROT13 twice returns the original text. Paste encoded text above to decode it.
      </div>

      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">What is ROT13?</h2>
        <p className="mb-3">
          ROT13 is a simple letter substitution cipher that replaces each letter with the letter
          13 positions after it in the alphabet. Since the alphabet has 26 letters, applying ROT13
          twice returns the original text, making it its own inverse.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">ROT13 vs ROT47 vs Caesar Cipher</h2>
        <p>
          <strong>ROT13</strong> only affects letters. <strong>ROT47</strong> extends rotation to
          all printable ASCII characters (numbers, symbols included). <strong>Caesar cipher</strong> is
          the general form with any shift value (ROT13 is Caesar with shift=13).
        </p>
      </div>
    </ToolLayout>
  );
}
