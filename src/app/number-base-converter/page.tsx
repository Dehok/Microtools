"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const BASES = [
  { id: 2, label: "Binary", prefix: "0b", placeholder: "101010" },
  { id: 8, label: "Octal", prefix: "0o", placeholder: "52" },
  { id: 10, label: "Decimal", prefix: "", placeholder: "42" },
  { id: 16, label: "Hexadecimal", prefix: "0x", placeholder: "2A" },
] as const;

export default function NumberBaseConverter() {
  const [inputBase, setInputBase] = useState(10);
  const [inputValue, setInputValue] = useState("42");

  const { parsed, error } = useMemo(() => {
    if (!inputValue.trim()) return { parsed: null, error: "" };
    try {
      const num = parseInt(inputValue.trim(), inputBase);
      if (isNaN(num)) return { parsed: null, error: "Invalid number for the selected base." };
      return { parsed: num, error: "" };
    } catch {
      return { parsed: null, error: "Invalid number." };
    }
  }, [inputValue, inputBase]);

  return (
    <ToolLayout
      title="Number Base Converter — Decimal, Binary, Hex, Octal"
      description="Convert numbers between decimal, binary, octal, and hexadecimal instantly. Free online number base converter."
      relatedTools={["hash-generator", "color-picker", "url-encoder-decoder"]}
    >
      {/* Input */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Input Number</label>
        <div className="flex gap-2">
          <select
            value={inputBase}
            onChange={(e) => setInputBase(Number(e.target.value))}
            className="rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm"
          >
            {BASES.map((b) => (
              <option key={b.id} value={b.id}>{b.label} (base {b.id})</option>
            ))}
          </select>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={BASES.find((b) => b.id === inputBase)?.placeholder}
            className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-2 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
            spellCheck={false}
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 px-4 py-2 text-sm text-red-700 dark:text-red-300">{error}</div>
      )}

      {/* Output */}
      {parsed !== null && (
        <div className="space-y-2">
          {BASES.map((base) => {
            const converted = parsed.toString(base.id);
            const display = base.id === 16 ? converted.toUpperCase() : converted;
            return (
              <div
                key={base.id}
                className={`flex items-center justify-between rounded-lg border p-3 ${
                  base.id === inputBase ? "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950" : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950"
                }`}
              >
                <div>
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{base.label}</span>
                  <div className="font-mono text-lg">
                    <span className="text-gray-400 dark:text-gray-500">{base.prefix}</span>
                    <span className="font-bold text-gray-900 dark:text-gray-100">{display}</span>
                  </div>
                </div>
                <CopyButton text={base.prefix + display} />
              </div>
            );
          })}
        </div>
      )}

      {/* Bit info */}
      {parsed !== null && (
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span>Value: <strong>{parsed}</strong></span>
          <span>Bits: <strong>{parsed.toString(2).length}</strong></span>
          <span>Bytes: <strong>{Math.ceil(parsed.toString(2).length / 8)}</strong></span>
        </div>
      )}

      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Number Base Systems</h2>
        <p className="mb-3">
          Computers use different number systems: <strong>binary</strong> (base 2) for machine code,
          <strong> octal</strong> (base 8) for Unix file permissions, <strong>decimal</strong> (base 10)
          for everyday math, and <strong>hexadecimal</strong> (base 16) for memory addresses and colors.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Common Conversions</h2>
        <p>
          Decimal 255 = Binary 11111111 = Hex FF = Octal 377. Hexadecimal is especially common
          in web development for CSS colors (e.g., #FF5733).
        </p>
      </div>
    
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
        <p>The Number Base Converter converts integers between binary (base 2), octal (base 8), decimal (base 10), and hexadecimal (base 16) number systems. It is an essential tool for computer science students, embedded developers, and anyone working with low-level data representations.</p>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Key Features</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong className="text-gray-700 dark:text-gray-300">Multi-Base Conversion</strong> &mdash; Converts a number from any supported base to all other bases simultaneously, showing binary, octal, decimal, and hexadecimal results at once.</li>
          <li><strong className="text-gray-700 dark:text-gray-300">Instant Results</strong> &mdash; Conversion happens as you type, with no button to press. Results update in real time for fast exploration.</li>
          <li><strong className="text-gray-700 dark:text-gray-300">Input Validation</strong> &mdash; Detects invalid characters for the selected base and shows an error instead of silently producing wrong results.</li>
          <li><strong className="text-gray-700 dark:text-gray-300">Copy Buttons</strong> &mdash; Copy any individual result to clipboard with one click for immediate use in your code or documentation.</li>
          <li><strong className="text-gray-700 dark:text-gray-300">Free and No Signup</strong> &mdash; Convert numbers without creating an account or paying anything.</li>
        </ul>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Common Use Cases</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Converting a decimal memory address to hexadecimal for use in assembly language or debugger output</li>
          <li>Converting binary bit patterns from CPU registers or network packets to readable decimal or hex values</li>
          <li>Understanding octal file permission values in Unix and Linux systems such as chmod 755</li>
          <li>Working with color codes that use hexadecimal notation in web development and graphic design</li>
          <li>Studying number systems for a computer science course or certification exam</li>
        </ul>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">How to Use</h2>
        <p>Select the input base (binary, octal, decimal, or hexadecimal) from the dropdown. Type or paste your number into the input field. The converted values for all other bases appear instantly below. Use the copy button next to any result to copy it to clipboard.</p>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">What are the four main number bases used in computing?</summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">Binary (base 2) uses digits 0-1 and represents data at the hardware level. Octal (base 8) uses 0-7 and is common in Unix permissions. Decimal (base 10) is everyday counting. Hexadecimal (base 16) uses 0-9 and A-F and is widely used for memory addresses, color codes, and byte values.</p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">How do I convert a binary number to decimal by hand?</summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">Multiply each binary digit by 2 raised to its position (counting from right, starting at 0), then add the results. For example, 1011 in binary equals 1x8 + 0x4 + 1x2 + 1x1 = 11 in decimal.</p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Why is hexadecimal used so often in programming?</summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">One hexadecimal digit represents exactly four binary bits (a nibble), so two hex digits represent one byte. This makes hex far more compact and readable than binary for memory addresses, color values, and machine code.</p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">What is the maximum integer this tool can convert accurately?</summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">This tool uses JavaScript numbers internally, which are 64-bit floating point. Integers up to 2^53 - 1 (9007199254740991) are represented exactly. Larger integers may lose precision due to floating-point limitations.</p>
          </details>
        </div>
      </div>
    </ToolLayout>
  );
}
