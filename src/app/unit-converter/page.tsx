"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

// ---------------------------------------------------------------------------
// Unit definitions
// Each unit stores a factor relative to the category's base SI unit.
// Temperature is handled separately with conversion functions.
// ---------------------------------------------------------------------------

type UnitEntry = { label: string; factor: number };

const CATEGORIES = [
  "Length",
  "Weight",
  "Temperature",
  "Speed",
  "Area",
  "Volume",
  "Time",
  "Digital Storage",
] as const;

type Category = (typeof CATEGORIES)[number];

// Base unit for each category is the first entry (factor = 1).
const UNITS: Record<Category, UnitEntry[]> = {
  Length: [
    { label: "Meter (m)", factor: 1 },
    { label: "Millimeter (mm)", factor: 0.001 },
    { label: "Centimeter (cm)", factor: 0.01 },
    { label: "Kilometer (km)", factor: 1000 },
    { label: "Inch (in)", factor: 0.0254 },
    { label: "Foot (ft)", factor: 0.3048 },
    { label: "Yard (yd)", factor: 0.9144 },
    { label: "Mile (mi)", factor: 1609.344 },
  ],
  Weight: [
    { label: "Kilogram (kg)", factor: 1 },
    { label: "Milligram (mg)", factor: 0.000001 },
    { label: "Gram (g)", factor: 0.001 },
    { label: "Metric Ton (t)", factor: 1000 },
    { label: "Ounce (oz)", factor: 0.0283495 },
    { label: "Pound (lb)", factor: 0.453592 },
  ],
  Temperature: [
    { label: "Celsius (°C)", factor: 1 },
    { label: "Fahrenheit (°F)", factor: 1 },
    { label: "Kelvin (K)", factor: 1 },
  ],
  Speed: [
    { label: "Meter/second (m/s)", factor: 1 },
    { label: "Kilometer/hour (km/h)", factor: 1 / 3.6 },
    { label: "Miles/hour (mph)", factor: 0.44704 },
    { label: "Knot (kn)", factor: 0.514444 },
  ],
  Area: [
    { label: "Square Meter (m²)", factor: 1 },
    { label: "Square Millimeter (mm²)", factor: 0.000001 },
    { label: "Square Centimeter (cm²)", factor: 0.0001 },
    { label: "Square Kilometer (km²)", factor: 1e6 },
    { label: "Acre", factor: 4046.856 },
    { label: "Hectare (ha)", factor: 10000 },
    { label: "Square Foot (ft²)", factor: 0.092903 },
    { label: "Square Mile (mi²)", factor: 2.58999e6 },
  ],
  Volume: [
    { label: "Liter (l)", factor: 1 },
    { label: "Milliliter (ml)", factor: 0.001 },
    { label: "US Gallon", factor: 3.78541 },
    { label: "US Quart", factor: 0.946353 },
    { label: "US Pint", factor: 0.473176 },
    { label: "US Cup", factor: 0.236588 },
    { label: "US Fluid Ounce (fl oz)", factor: 0.0295735 },
    { label: "Cubic Meter (m³)", factor: 1000 },
  ],
  Time: [
    { label: "Second (s)", factor: 1 },
    { label: "Millisecond (ms)", factor: 0.001 },
    { label: "Minute (min)", factor: 60 },
    { label: "Hour (h)", factor: 3600 },
    { label: "Day", factor: 86400 },
    { label: "Week", factor: 604800 },
    { label: "Month (avg)", factor: 2629746 },
    { label: "Year (avg)", factor: 31556952 },
  ],
  "Digital Storage": [
    { label: "Byte (B)", factor: 1 },
    { label: "Bit (b)", factor: 0.125 },
    { label: "Kilobyte (KB)", factor: 1024 },
    { label: "Megabyte (MB)", factor: 1048576 },
    { label: "Gigabyte (GB)", factor: 1073741824 },
    { label: "Terabyte (TB)", factor: 1099511627776 },
    { label: "Petabyte (PB)", factor: 1.12589990684e15 },
  ],
};

// ---------------------------------------------------------------------------
// Temperature helpers (not factor-based)
// ---------------------------------------------------------------------------

function toBaseCelsius(value: number, fromLabel: string): number {
  if (fromLabel.includes("°C")) return value;
  if (fromLabel.includes("°F")) return (value - 32) * (5 / 9);
  if (fromLabel.includes("K")) return value - 273.15;
  return value;
}

function fromBaseCelsius(celsius: number, toLabel: string): number {
  if (toLabel.includes("°C")) return celsius;
  if (toLabel.includes("°F")) return celsius * (9 / 5) + 32;
  if (toLabel.includes("K")) return celsius + 273.15;
  return celsius;
}

// ---------------------------------------------------------------------------
// Number formatting helper
// ---------------------------------------------------------------------------

function formatNumber(n: number): string {
  if (!isFinite(n)) return "—";
  // Use up to 8 significant digits, strip trailing zeros
  const abs = Math.abs(n);
  if (abs === 0) return "0";
  if (abs >= 1e-4 && abs < 1e13) {
    const str = parseFloat(n.toPrecision(8)).toString();
    return str;
  }
  return n.toExponential(6);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function UnitConverter() {
  const [activeCategory, setActiveCategory] = useState<Category>("Length");
  const [inputValue, setInputValue] = useState("1");
  const [fromUnit, setFromUnit] = useState(UNITS["Length"][0].label);

  // When category changes, reset fromUnit to the first unit in that category
  function handleCategoryChange(cat: Category) {
    setActiveCategory(cat);
    setFromUnit(UNITS[cat][0].label);
    setInputValue("1");
  }

  // When fromUnit changes via dropdown
  function handleFromUnitChange(label: string) {
    setFromUnit(label);
  }

  // Swap: pick the first "other" unit as from and set its value to the first conversion result
  function handleSwap() {
    const units = UNITS[activeCategory];
    const currentIndex = units.findIndex((u) => u.label === fromUnit);
    const nextIndex = currentIndex === 0 ? 1 : 0;
    const nextUnit = units[nextIndex];

    // Calculate the converted value for nextUnit to use as new input
    const num = parseFloat(inputValue);
    if (!isNaN(num)) {
      let converted: number;
      if (activeCategory === "Temperature") {
        const celsius = toBaseCelsius(num, fromUnit);
        converted = fromBaseCelsius(celsius, nextUnit.label);
      } else {
        const fromEntry = units.find((u) => u.label === fromUnit);
        if (!fromEntry) return;
        const baseValue = num * fromEntry.factor;
        converted = baseValue / nextUnit.factor;
      }
      setInputValue(formatNumber(converted));
    }
    setFromUnit(nextUnit.label);
  }

  const { conversions, error } = useMemo(() => {
    const num = parseFloat(inputValue);
    if (inputValue.trim() === "") return { conversions: null, error: "" };
    if (isNaN(num)) return { conversions: null, error: "Please enter a valid number." };

    const units = UNITS[activeCategory];

    if (activeCategory === "Temperature") {
      const celsius = toBaseCelsius(num, fromUnit);
      return {
        conversions: units.map((u) => ({
          label: u.label,
          value: formatNumber(fromBaseCelsius(celsius, u.label)),
        })),
        error: "",
      };
    }

    const fromEntry = units.find((u) => u.label === fromUnit);
    if (!fromEntry) return { conversions: null, error: "Unknown unit." };

    // Convert input to the base unit, then to each target unit
    const baseValue = num * fromEntry.factor;

    return {
      conversions: units.map((u) => ({
        label: u.label,
        value: formatNumber(baseValue / u.factor),
      })),
      error: "",
    };
  }, [inputValue, fromUnit, activeCategory]);

  const currentUnits = UNITS[activeCategory];

  return (
    <ToolLayout
      title="Unit Converter — Length, Weight, Temperature & More"
      description="Convert between units of length, weight, temperature, speed, area, volume, time, and digital storage. Free online unit conversion tool."
      relatedTools={["data-size-converter", "px-converter", "number-base-converter"]}
    >
      {/* Category tabs */}
      <div className="mb-5 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              activeCategory === cat
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:bg-gray-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Input row */}
      <div className="mb-5 flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[140px]">
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Value</label>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-2 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
            placeholder="Enter value"
          />
        </div>

        <div className="flex-1 min-w-[180px]">
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">From Unit</label>
          <select
            value={fromUnit}
            onChange={(e) => handleFromUnitChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
          >
            {currentUnits.map((u) => (
              <option key={u.label} value={u.label}>
                {u.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <button
            onClick={handleSwap}
            title="Swap units"
            className="rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-800"
          >
            ⇄ Swap
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 px-4 py-2 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Results grid */}
      {conversions && (
        <div className="grid gap-2 sm:grid-cols-2">
          {conversions.map((row) => {
            const isSource = row.label === fromUnit;
            return (
              <div
                key={row.label}
                className={`flex items-center justify-between rounded-lg border p-3 ${
                  isSource
                    ? "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950"
                    : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950"
                }`}
              >
                <div className="min-w-0 flex-1 pr-2">
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">{row.label}</div>
                  <div className="truncate font-mono text-sm font-bold text-gray-900 dark:text-gray-100">
                    {row.value}
                  </div>
                </div>
                <CopyButton text={row.value} />
              </div>
            );
          })}
        </div>
      )}

      {/* SEO content */}
      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">About Unit Converter</h2>
        <p className="mb-3">
          This free online unit converter handles 8 measurement categories: <strong>Length</strong>,{" "}
          <strong>Weight</strong>, <strong>Temperature</strong>, <strong>Speed</strong>,{" "}
          <strong>Area</strong>, <strong>Volume</strong>, <strong>Time</strong>, and{" "}
          <strong>Digital Storage</strong>. Enter a value, select the source unit, and all equivalent
          values are computed instantly in your browser — no server required.
        </p>

        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">How Unit Conversion Works</h2>
        <p className="mb-3">
          Each unit within a category is defined by a conversion factor relative to a common base
          unit (e.g., meters for length, kilograms for weight). To convert from unit A to unit B, the
          input is first converted to the base unit, then divided by the factor of unit B. Temperature
          is a special case — Celsius, Fahrenheit, and Kelvin use offset formulas rather than simple
          multiplication.
        </p>

        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Common Conversions</h2>
        <ul className="mb-3 list-disc pl-5 space-y-1">
          <li>1 mile = 1.60934 km | 1 inch = 2.54 cm | 1 foot = 30.48 cm</li>
          <li>1 pound = 453.592 g | 1 ounce = 28.3495 g | 1 metric ton = 1000 kg</li>
          <li>0°C = 32°F = 273.15 K | 100°C = 212°F = 373.15 K</li>
          <li>1 GB = 1024 MB = 1,073,741,824 bytes | 1 TB = 1024 GB</li>
          <li>1 US gallon = 3.78541 liters | 1 liter = 33.814 fl oz</li>
        </ul>

        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Digital Storage Units</h2>
        <p>
          Digital storage uses binary prefixes: 1 KB = 1024 bytes (not 1000). This tool follows the
          traditional binary convention used by operating systems. 1 MB = 1,048,576 bytes, 1 GB =
          1,073,741,824 bytes. The bit is the smallest unit — 8 bits make one byte.
        </p>
      </div>
    
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The Unit Converter is a free online tool available on CodeUtilo. Convert between units of length, weight, temperature, speed, area, and volume. All processing happens directly in your browser — no data is ever sent to any server, ensuring your privacy and security. No signup or installation is required.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> — All unit converter operations run locally in your browser using JavaScript. Your data never leaves your device.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Instant Results</strong> — Get results immediately as you type or paste your input. No waiting for server responses or page reloads.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> — Use the unit converter as many times as you need without creating an account or paying anything.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Mobile Friendly</strong> — Works on desktop, tablet, and mobile browsers. Access this tool from any device with an internet connection.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Using the unit converter for day-to-day development tasks</li>
          <li>Saving time on repetitive tasks by using a browser-based tool instead of writing custom code</li>
          <li>Working on projects where installing software is not an option (school, work, shared computers)</li>
          <li>Quick prototyping and debugging without switching to a terminal or IDE</li>
          <li>Sharing the tool link with colleagues who need the same functionality</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Enter your input in the text area provided and the unit converter will process it instantly. Use the Copy button to copy the result to your clipboard. All operations are performed locally in your browser — no data is transmitted to any server.
        </p>
      </div>
    </ToolLayout>
  );
}
