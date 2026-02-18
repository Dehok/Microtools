"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

// ---------------------------------------------------------------------------
// Unit definitions
// ---------------------------------------------------------------------------

type UnitDef = {
  label: string;   // Full name
  abbr: string;    // Abbreviation shown in results
  binaryFactor: number; // Factor relative to 1 Bit (binary: 1024-based)
  decimalFactor: number; // Factor relative to 1 Bit (decimal: 1000-based)
};

// All factors are relative to 1 Bit.
// Binary: 1 Byte = 8 bits, 1 KiB = 8*1024 bits, etc.
// Decimal: 1 Byte = 8 bits, 1 KB = 8*1000 bits, etc.
const UNITS: UnitDef[] = [
  { label: "Bit",       abbr: "b",   binaryFactor: 1,                      decimalFactor: 1 },
  { label: "Byte",      abbr: "B",   binaryFactor: 8,                      decimalFactor: 8 },
  { label: "Kilobyte",  abbr: "KB",  binaryFactor: 8 * 1024,               decimalFactor: 8 * 1000 },
  { label: "Megabyte",  abbr: "MB",  binaryFactor: 8 * 1024 ** 2,          decimalFactor: 8 * 1000 ** 2 },
  { label: "Gigabyte",  abbr: "GB",  binaryFactor: 8 * 1024 ** 3,          decimalFactor: 8 * 1000 ** 3 },
  { label: "Terabyte",  abbr: "TB",  binaryFactor: 8 * 1024 ** 4,          decimalFactor: 8 * 1000 ** 4 },
  { label: "Petabyte",  abbr: "PB",  binaryFactor: 8 * 1024 ** 5,          decimalFactor: 8 * 1000 ** 5 },
  { label: "Exabyte",   abbr: "EB",  binaryFactor: 8 * 1024 ** 6,          decimalFactor: 8 * 1000 ** 6 },
];

// Binary-mode display abbreviations (IEC standard for KiB, MiB…)
const BINARY_ABBR: Record<string, string> = {
  Bit:       "b",
  Byte:      "B",
  Kilobyte:  "KiB",
  Megabyte:  "MiB",
  Gigabyte:  "GiB",
  Terabyte:  "TiB",
  Petabyte:  "PiB",
  Exabyte:   "EiB",
};

// ---------------------------------------------------------------------------
// Quick presets: [label, value, unit label]
// ---------------------------------------------------------------------------
const PRESETS: [string, number, string][] = [
  ["1 MB",           1,    "Megabyte"],
  ["1 GB",           1,    "Gigabyte"],
  ["4.7 GB (DVD)",   4.7,  "Gigabyte"],
  ["25 GB (Blu-ray)",25,   "Gigabyte"],
  ["1 TB",           1,    "Terabyte"],
];

// ---------------------------------------------------------------------------
// Real-world equivalents (based on decimal bytes)
// Photo ~3 MB JPEG, Song ~4 MB MP3, Video ~1 GB/hour HD
// ---------------------------------------------------------------------------
function getEquivalents(valueInBytes: number): { icon: string; text: string }[] {
  const PHOTO_BYTES  = 3 * 1_000_000;         // 3 MB
  const SONG_BYTES   = 4 * 1_000_000;         // 4 MB MP3
  const VIDEO_BYTES  = 1_000_000_000;         // 1 GB per hour HD
  const EBOOK_BYTES  = 1 * 1_000_000;         // 1 MB ebook
  const EMAIL_BYTES  = 75 * 1_000;            // 75 KB email

  const results: { icon: string; text: string }[] = [];

  const photos = valueInBytes / PHOTO_BYTES;
  if (photos >= 0.01) {
    results.push({ icon: "Photos", text: formatEquiv(photos, "photo") });
  }

  const songs = valueInBytes / SONG_BYTES;
  if (songs >= 0.01) {
    results.push({ icon: "Songs", text: formatEquiv(songs, "song") });
  }

  const hours = valueInBytes / VIDEO_BYTES;
  if (hours >= 0.001) {
    results.push({ icon: "Video", text: formatEquiv(hours, "hour", "hours") + " of HD video" });
  }

  const ebooks = valueInBytes / EBOOK_BYTES;
  if (ebooks >= 0.01) {
    results.push({ icon: "Ebooks", text: formatEquiv(ebooks, "ebook") });
  }

  const emails = valueInBytes / EMAIL_BYTES;
  if (emails >= 0.01) {
    results.push({ icon: "Emails", text: formatEquiv(emails, "email") });
  }

  return results;
}

function formatEquiv(n: number, singular: string, plural?: string): string {
  const label = n === 1 ? singular : (plural ?? singular + "s");
  if (n < 0.01) return `< 0.01 ${label}`;
  if (n >= 1_000_000_000) return `~${(n / 1_000_000_000).toPrecision(3)} billion ${label}`;
  if (n >= 1_000_000) return `~${(n / 1_000_000).toPrecision(3)} million ${label}`;
  if (n >= 1_000) return `~${(n / 1_000).toPrecision(3)}k ${label}`;
  if (n < 1) return `~${n.toPrecision(2)} ${label}`;
  return `~${parseFloat(n.toPrecision(4))} ${label}`;
}

// ---------------------------------------------------------------------------
// Number formatting helper
// ---------------------------------------------------------------------------
function formatNumber(n: number): string {
  if (!isFinite(n)) return "—";
  if (n === 0) return "0";
  const abs = Math.abs(n);
  if (abs >= 1e-4 && abs < 1e15) {
    return parseFloat(n.toPrecision(10)).toString();
  }
  return n.toExponential(6);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function DataSizeConverter() {
  const [inputValue, setInputValue] = useState("1");
  const [fromUnit, setFromUnit]     = useState("Megabyte");
  const [isBinary, setIsBinary]     = useState(false); // false = decimal, true = binary

  // ---- Preset handler ----
  function applyPreset(value: number, unit: string) {
    setInputValue(String(value));
    setFromUnit(unit);
  }

  // ---- Swap: pick the first result row that isn't the source, use its value ----
  function handleSwap() {
    const num = parseFloat(inputValue);
    if (isNaN(num)) return;

    const fromDef = UNITS.find((u) => u.label === fromUnit);
    if (!fromDef) return;

    // Pick the next unit in the list (wrap around)
    const currentIndex = UNITS.findIndex((u) => u.label === fromUnit);
    const nextIndex = (currentIndex + 1) % UNITS.length;
    const nextDef = UNITS[nextIndex];

    const factor = isBinary ? fromDef.binaryFactor : fromDef.decimalFactor;
    const nextFactor = isBinary ? nextDef.binaryFactor : nextDef.decimalFactor;

    // Convert: bits_in = num * factor; next_value = bits_in / nextFactor
    const bitsIn = num * factor;
    const converted = bitsIn / nextFactor;

    setInputValue(formatNumber(converted));
    setFromUnit(nextDef.label);
  }

  // ---- Conversion logic (useMemo — no setState calls inside) ----
  const { conversions, valueInBytes, error } = useMemo(() => {
    const trimmed = inputValue.trim();
    if (trimmed === "") return { conversions: null, valueInBytes: 0, error: "" };

    const num = parseFloat(trimmed);
    if (isNaN(num)) return { conversions: null, valueInBytes: 0, error: "Please enter a valid number." };
    if (num < 0) return { conversions: null, valueInBytes: 0, error: "Value must be 0 or greater." };

    const fromDef = UNITS.find((u) => u.label === fromUnit);
    if (!fromDef) return { conversions: null, valueInBytes: 0, error: "Unknown unit." };

    const fromFactor = isBinary ? fromDef.binaryFactor : fromDef.decimalFactor;

    // Convert input to bits (base unit for all calculations)
    const bits = num * fromFactor;

    const rows = UNITS.map((u) => {
      const factor = isBinary ? u.binaryFactor : u.decimalFactor;
      const converted = bits / factor;
      const abbr = isBinary ? BINARY_ABBR[u.label] : u.abbr;
      return {
        label: u.label,
        abbr,
        value: formatNumber(converted),
        rawValue: converted,
        isSource: u.label === fromUnit,
      };
    });

    // valueInBytes for real-world equivalents (use decimal bytes)
    const byteDecimalFactor = UNITS.find((u) => u.label === "Byte")!.decimalFactor;
    const vib = bits / byteDecimalFactor;

    return { conversions: rows, valueInBytes: vib, error: "" };
  }, [inputValue, fromUnit, isBinary]);

  const equivalents = useMemo(() => {
    if (valueInBytes <= 0) return [];
    return getEquivalents(valueInBytes);
  }, [valueInBytes]);

  return (
    <ToolLayout
      title="Data Size Converter — Bits, Bytes, KB, MB, GB, TB"
      description="Convert data sizes between bits, bytes, kilobytes, megabytes, gigabytes, terabytes, petabytes, and exabytes. Supports both binary (1024) and decimal (1000) standards."
      relatedTools={["unit-converter", "number-base-converter", "byte-counter"]}
    >
      {/* Binary / Decimal toggle */}
      <div className="mb-5 flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Mode:</span>
        <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden text-sm font-medium">
          <button
            onClick={() => setIsBinary(false)}
            className={`px-4 py-1.5 transition-colors ${
              !isBinary
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
            }`}
          >
            Decimal (1000-based)
          </button>
          <button
            onClick={() => setIsBinary(true)}
            className={`px-4 py-1.5 transition-colors border-l border-gray-300 dark:border-gray-600 ${
              isBinary
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
            }`}
          >
            Binary (1024-based)
          </button>
        </div>
      </div>

      {/* Mode info badge */}
      <div className="mb-5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 px-4 py-2 text-xs text-gray-600 dark:text-gray-400">
        {isBinary
          ? "Binary mode: 1 KiB = 1024 B, 1 MiB = 1024 KiB — used by RAM, operating systems (Windows)."
          : "Decimal mode: 1 KB = 1000 B, 1 MB = 1000 KB — used by hard drives, SSDs, and network speeds."}
      </div>

      {/* Input row */}
      <div className="mb-5 flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[140px]">
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Value</label>
          <input
            type="number"
            min="0"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-2 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
            placeholder="Enter value"
          />
        </div>

        <div className="flex-1 min-w-[180px]">
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Unit</label>
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
          >
            {UNITS.map((u) => (
              <option key={u.label} value={u.label}>
                {u.label} ({isBinary ? BINARY_ABBR[u.label] : u.abbr})
              </option>
            ))}
          </select>
        </div>

        <div>
          <button
            onClick={handleSwap}
            title="Switch to next unit"
            className="rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-800"
          >
            &#8645; Swap
          </button>
        </div>
      </div>

      {/* Quick presets */}
      <div className="mb-5">
        <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Quick Presets:</div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(([label, value, unit]) => (
            <button
              key={label}
              onClick={() => applyPreset(value, unit)}
              className="rounded-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors hover:border-blue-400 hover:bg-blue-50 dark:bg-blue-950 dark:hover:bg-blue-950 hover:text-blue-700 dark:text-blue-300"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 px-4 py-2 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Results table */}
      {conversions && (
        <>
          <div className="mb-6 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950">
                  <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Unit</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Abbreviation</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Value</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {conversions.map((row, i) => (
                  <tr
                    key={row.label}
                    className={`${i !== 0 ? "border-t border-gray-200 dark:border-gray-700" : ""} ${
                      row.isSource ? "bg-blue-50 dark:bg-blue-950" : "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
                    }`}
                  >
                    <td className="px-4 py-2 font-medium text-gray-800 dark:text-gray-200">
                      {row.label}
                      {row.isSource && (
                        <span className="ml-2 rounded-full bg-blue-100 dark:bg-blue-900 px-1.5 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-300">
                          input
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2 font-mono text-gray-500 dark:text-gray-400">{row.abbr}</td>
                    <td className="px-4 py-2 font-mono font-bold text-gray-900 dark:text-gray-100">{row.value}</td>
                    <td className="px-4 py-2 text-right">
                      <CopyButton text={row.value} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Real-world equivalents */}
          {equivalents.length > 0 && (
            <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <div className="mb-2 text-sm font-semibold text-amber-800">
                Real-World Equivalents (approximate, decimal bytes)
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {equivalents.map((eq) => (
                  <div key={eq.icon} className="flex items-start gap-2 text-sm text-amber-900">
                    <span className="font-semibold text-amber-700 min-w-[60px]">{eq.icon}:</span>
                    <span>{eq.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* SEO content */}
      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">About the Data Size Converter</h2>
        <p className="mb-3">
          This free online tool instantly converts data sizes between <strong>bits</strong>,{" "}
          <strong>bytes</strong>, <strong>kilobytes</strong>, <strong>megabytes</strong>,{" "}
          <strong>gigabytes</strong>, <strong>terabytes</strong>, <strong>petabytes</strong>, and{" "}
          <strong>exabytes</strong>. All calculations happen in your browser — no data is sent to any
          server.
        </p>

        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Binary vs. Decimal (1024 vs. 1000)</h2>
        <p className="mb-3">
          There are two competing standards for data size prefixes. The <strong>decimal (SI)</strong>{" "}
          standard used by hard drive manufacturers and network equipment defines 1 KB as 1,000 bytes,
          1 MB as 1,000,000 bytes, and so on. The <strong>binary (IEC)</strong> standard — used by
          operating systems like Windows for RAM and file sizes — defines 1 KiB as 1,024 bytes, 1 MiB
          as 1,048,576 bytes, and so on. This is why a hard drive advertised as 1 TB shows up as
          roughly 931 GiB in Windows.
        </p>

        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Key Data Size Facts</h2>
        <ul className="mb-3 list-disc pl-5 space-y-1">
          <li>1 Byte = 8 Bits — the fundamental unit of digital storage.</li>
          <li>Decimal: 1 KB = 1,000 B | 1 MB = 1,000,000 B | 1 GB = 1,000,000,000 B</li>
          <li>Binary: 1 KiB = 1,024 B | 1 MiB = 1,048,576 B | 1 GiB = 1,073,741,824 B</li>
          <li>1 TB (decimal) &#8776; 931 GiB (binary) — explains the &quot;missing space&quot; on drives.</li>
          <li>A standard DVD holds 4.7 GB; a single-layer Blu-ray disc holds 25 GB.</li>
          <li>1 Petabyte = 1,000 Terabytes = about 500 billion pages of text.</li>
        </ul>

        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Common Data Size Conversions</h2>
        <ul className="mb-3 list-disc pl-5 space-y-1">
          <li>1 MB = 1,000 KB = 8,000,000 bits (decimal)</li>
          <li>1 GB = 1,024 MB (binary) or 1,000 MB (decimal)</li>
          <li>1 TB = 1,024 GB (binary) or 1,000 GB (decimal)</li>
          <li>Internet speed is measured in Mbps (megabits per second) — 8 Mbps downloads 1 MB/s.</li>
          <li>A typical MP3 song is around 4 MB; a 4K movie can be 50–100 GB.</li>
        </ul>

        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">How to Use This Tool</h2>
        <p>
          Enter any numeric value, choose the source unit from the dropdown, and select either
          Decimal (1000-based) or Binary (1024-based) mode. The table instantly shows the equivalent
          in every other unit. Use the quick presets for common reference sizes, or click Swap to
          switch to the next unit while keeping the equivalent value.
        </p>
      </div>
    
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The Data Size Converter is a free online tool available on CodeUtilo. Convert between bytes, KB, MB, GB, TB, and PB. Binary and decimal units. All processing happens directly in your browser — no data is ever sent to any server, ensuring your privacy and security. No signup or installation is required.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> — All data size converter operations run locally in your browser using JavaScript. Your data never leaves your device.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Instant Results</strong> — Get results immediately as you type or paste your input. No waiting for server responses or page reloads.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> — Use the data size converter as many times as you need without creating an account or paying anything.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Mobile Friendly</strong> — Works on desktop, tablet, and mobile browsers. Access this tool from any device with an internet connection.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Using the data size converter for day-to-day development tasks</li>
          <li>Saving time on repetitive tasks by using a browser-based tool instead of writing custom code</li>
          <li>Working on projects where installing software is not an option (school, work, shared computers)</li>
          <li>Quick prototyping and debugging without switching to a terminal or IDE</li>
          <li>Sharing the tool link with colleagues who need the same functionality</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Enter your input in the text area provided and the data size converter will process it instantly. Use the Copy button to copy the result to your clipboard. All operations are performed locally in your browser — no data is transmitted to any server.
        </p>
      </div>
    </ToolLayout>
  );
}
