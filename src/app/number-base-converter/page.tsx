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
        <label className="mb-1 block text-sm font-medium text-gray-700">Input Number</label>
        <div className="flex gap-2">
          <select
            value={inputBase}
            onChange={(e) => setInputBase(Number(e.target.value))}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
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
            className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none"
            spellCheck={false}
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>
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
                  base.id === inputBase ? "border-blue-200 bg-blue-50" : "border-gray-200 bg-gray-50"
                }`}
              >
                <div>
                  <span className="text-xs font-semibold text-gray-500">{base.label}</span>
                  <div className="font-mono text-lg">
                    <span className="text-gray-400">{base.prefix}</span>
                    <span className="font-bold text-gray-900">{display}</span>
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
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
          <span>Value: <strong>{parsed}</strong></span>
          <span>Bits: <strong>{parsed.toString(2).length}</strong></span>
          <span>Bytes: <strong>{Math.ceil(parsed.toString(2).length / 8)}</strong></span>
        </div>
      )}

      <div className="mt-8 border-t border-gray-200 pt-6 text-sm text-gray-600">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Number Base Systems</h2>
        <p className="mb-3">
          Computers use different number systems: <strong>binary</strong> (base 2) for machine code,
          <strong> octal</strong> (base 8) for Unix file permissions, <strong>decimal</strong> (base 10)
          for everyday math, and <strong>hexadecimal</strong> (base 16) for memory addresses and colors.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Common Conversions</h2>
        <p>
          Decimal 255 = Binary 11111111 = Hex FF = Octal 377. Hexadecimal is especially common
          in web development for CSS colors (e.g., #FF5733).
        </p>
      </div>
    </ToolLayout>
  );
}
