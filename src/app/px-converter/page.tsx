"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function PxConverter() {
  const [value, setValue] = useState("16");
  const [fromUnit, setFromUnit] = useState("px");
  const [baseFontSize, setBaseFontSize] = useState(16);

  const conversions = useMemo(() => {
    const num = parseFloat(value);
    if (isNaN(num)) return null;

    let px: number;
    switch (fromUnit) {
      case "px": px = num; break;
      case "rem": px = num * baseFontSize; break;
      case "em": px = num * baseFontSize; break;
      case "pt": px = num * (96 / 72); break;
      case "vw": px = num * (1920 / 100); break;
      case "vh": px = num * (1080 / 100); break;
      case "%": px = num * baseFontSize / 100; break;
      default: px = num;
    }

    return {
      px: px.toFixed(4).replace(/\.?0+$/, ""),
      rem: (px / baseFontSize).toFixed(4).replace(/\.?0+$/, ""),
      em: (px / baseFontSize).toFixed(4).replace(/\.?0+$/, ""),
      pt: (px * (72 / 96)).toFixed(4).replace(/\.?0+$/, ""),
      vw: (px / (1920 / 100)).toFixed(4).replace(/\.?0+$/, ""),
      vh: (px / (1080 / 100)).toFixed(4).replace(/\.?0+$/, ""),
      percent: ((px / baseFontSize) * 100).toFixed(4).replace(/\.?0+$/, ""),
    };
  }, [value, fromUnit, baseFontSize]);

  // Common px to rem table
  const commonSizes = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 80, 96];

  return (
    <ToolLayout
      title="PX to REM / EM Converter — CSS Unit Calculator"
      description="Convert between px, rem, em, pt, vw, vh, and percent. Includes a handy conversion table. Free online CSS unit converter."
      relatedTools={["css-minifier", "css-gradient-generator", "aspect-ratio-calculator"]}
    >
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Value</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-2 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">From Unit</label>
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm"
          >
            <option value="px">Pixels (px)</option>
            <option value="rem">REM</option>
            <option value="em">EM</option>
            <option value="pt">Points (pt)</option>
            <option value="vw">Viewport Width (vw)</option>
            <option value="vh">Viewport Height (vh)</option>
            <option value="%">Percent (%)</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Base Font Size</label>
          <div className="flex gap-1">
            <input
              type="number"
              value={baseFontSize}
              onChange={(e) => setBaseFontSize(parseInt(e.target.value) || 16)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-2 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
            />
            <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">px</span>
          </div>
        </div>
      </div>

      {conversions && (
        <div className="mb-6 space-y-2">
          {[
            { label: "Pixels (px)", value: conversions.px, unit: "px" },
            { label: "REM", value: conversions.rem, unit: "rem" },
            { label: "EM", value: conversions.em, unit: "em" },
            { label: "Points (pt)", value: conversions.pt, unit: "pt" },
            { label: "Viewport Width (vw)", value: conversions.vw, unit: "vw" },
            { label: "Viewport Height (vh)", value: conversions.vh, unit: "vh" },
            { label: "Percent (%)", value: conversions.percent, unit: "%" },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 p-3">
              <div>
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{row.label}</span>
                <div className="font-mono text-sm text-gray-900 dark:text-gray-100">
                  {row.value}{row.unit}
                </div>
              </div>
              <CopyButton text={`${row.value}${row.unit}`} />
            </div>
          ))}
        </div>
      )}

      {/* Quick reference table */}
      <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">PX to REM Quick Reference (base: {baseFontSize}px)</h3>
      <div className="mb-4 grid grid-cols-3 gap-1 text-xs sm:grid-cols-6">
        {commonSizes.map((px) => (
          <div key={px} className="rounded border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 px-2 py-1.5 text-center">
            <div className="font-bold text-gray-900 dark:text-gray-100">{px}px</div>
            <div className="font-mono text-gray-500 dark:text-gray-400">{(px / baseFontSize).toFixed(4).replace(/\.?0+$/, "")}rem</div>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">PX vs REM vs EM</h2>
        <p className="mb-3">
          <strong>px</strong> is an absolute unit. <strong>rem</strong> is relative to the root
          font size (html element). <strong>em</strong> is relative to the parent element&apos;s
          font size. Using rem/em makes your designs more accessible and responsive.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Why Use REM?</h2>
        <p>
          REM units respect user browser font-size settings, improving accessibility. If a user
          increases their default font size, rem-based layouts scale proportionally while px-based
          layouts stay fixed.
        </p>
      </div>
    
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The PX / REM / EM Converter is a free online tool available on CodeUtilo. Convert between px, rem, em, pt, vw, vh, and percent CSS units. All processing happens directly in your browser — no data is ever sent to any server, ensuring your privacy and security. No signup or installation is required.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> — All px / rem / em converter operations run locally in your browser using JavaScript. Your data never leaves your device.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Instant Results</strong> — Get results immediately as you type or paste your input. No waiting for server responses or page reloads.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> — Use the px / rem / em converter as many times as you need without creating an account or paying anything.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Mobile Friendly</strong> — Works on desktop, tablet, and mobile browsers. Access this tool from any device with an internet connection.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Using the px / rem / em converter for day-to-day development tasks</li>
          <li>Saving time on repetitive tasks by using a browser-based tool instead of writing custom code</li>
          <li>Working on projects where installing software is not an option (school, work, shared computers)</li>
          <li>Quick prototyping and debugging without switching to a terminal or IDE</li>
          <li>Sharing the tool link with colleagues who need the same functionality</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Enter your input in the text area provided and the px / rem / em converter will process it instantly. Use the Copy button to copy the result to your clipboard. All operations are performed locally in your browser — no data is transmitted to any server.
        </p>
      </div>
    </ToolLayout>
  );
}
