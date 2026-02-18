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
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The Number Base Converter is a free online tool available on CodeUtilo. Convert numbers between decimal, binary, octal, and hexadecimal. All processing happens directly in your browser — no data is ever sent to any server, ensuring your privacy and security. No signup or installation is required.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> — All number base converter operations run locally in your browser using JavaScript. Your data never leaves your device.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Instant Results</strong> — Get results immediately as you type or paste your input. No waiting for server responses or page reloads.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> — Use the number base converter as many times as you need without creating an account or paying anything.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Mobile Friendly</strong> — Works on desktop, tablet, and mobile browsers. Access this tool from any device with an internet connection.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Using the number base converter for day-to-day development tasks</li>
          <li>Saving time on repetitive tasks by using a browser-based tool instead of writing custom code</li>
          <li>Working on projects where installing software is not an option (school, work, shared computers)</li>
          <li>Quick prototyping and debugging without switching to a terminal or IDE</li>
          <li>Sharing the tool link with colleagues who need the same functionality</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Enter your input in the text area provided and the number base converter will process it instantly. Use the Copy button to copy the result to your clipboard. All operations are performed locally in your browser — no data is transmitted to any server.
        </p>
      
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Is the Number Base Converter free to use?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes, the Number Base Converter is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Is my data safe when using this tool?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Does this tool work on mobile devices?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes. The Number Base Converter is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Do I need to install anything?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. The Number Base Converter runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately.
            </p>
          </details>
        </div>
</div>
    </ToolLayout>
  );
}
