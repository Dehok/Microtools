"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace("#", "");
  let r: number, g: number, b: number;

  if (clean.length === 3) {
    r = parseInt(clean[0] + clean[0], 16);
    g = parseInt(clean[1] + clean[1], 16);
    b = parseInt(clean[2] + clean[2], 16);
  } else if (clean.length === 6) {
    r = parseInt(clean.slice(0, 2), 16);
    g = parseInt(clean.slice(2, 4), 16);
    b = parseInt(clean.slice(4, 6), 16);
  } else {
    return null;
  }

  if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
  return { r, g, b };
}

function relativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r / 255, g / 255, b / 255].map((c) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

interface WcagResult {
  label: string;
  requiredRatio: number;
  pass: boolean;
}

function evaluateWcag(ratio: number): WcagResult[] {
  return [
    { label: "AA Normal Text", requiredRatio: 4.5, pass: ratio >= 4.5 },
    { label: "AA Large Text", requiredRatio: 3, pass: ratio >= 3 },
    { label: "AAA Normal Text", requiredRatio: 7, pass: ratio >= 7 },
    { label: "AAA Large Text", requiredRatio: 4.5, pass: ratio >= 4.5 },
  ];
}

export default function ColorContrastChecker() {
  const [textColor, setTextColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#FFFFFF");

  const contrastData = useMemo(() => {
    const textRgb = hexToRgb(textColor);
    const bgRgb = hexToRgb(bgColor);

    if (!textRgb || !bgRgb) {
      return null;
    }

    const textLum = relativeLuminance(textRgb.r, textRgb.g, textRgb.b);
    const bgLum = relativeLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
    const ratio = contrastRatio(textLum, bgLum);
    const wcag = evaluateWcag(ratio);

    return { ratio, wcag };
  }, [textColor, bgColor]);

  const handleSwap = () => {
    setTextColor(bgColor);
    setBgColor(textColor);
  };

  const handleTextColorPicker = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextColor(e.target.value.toUpperCase());
  };

  const handleBgColorPicker = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBgColor(e.target.value.toUpperCase());
  };

  const handleTextHexInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.startsWith("#")
      ? e.target.value
      : "#" + e.target.value;
    setTextColor(val.toUpperCase());
  };

  const handleBgHexInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.startsWith("#")
      ? e.target.value
      : "#" + e.target.value;
    setBgColor(val.toUpperCase());
  };

  const validTextHex = hexToRgb(textColor) !== null;
  const validBgHex = hexToRgb(bgColor) !== null;
  const safeTextColor = validTextHex ? textColor : "#000000";
  const safeBgColor = validBgHex ? bgColor : "#FFFFFF";

  return (
    <ToolLayout
      title="Color Contrast Checker — WCAG Compliance"
      description="Check color contrast ratios for WCAG 2.1 accessibility compliance. Test text and background color combinations for AA and AAA standards."
      relatedTools={["color-picker", "hex-rgb-converter", "tailwind-color-generator"]}
    >
      {/* Color Inputs */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Text Color */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Text Color
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={validTextHex ? textColor : "#000000"}
              onChange={handleTextColorPicker}
              className="h-10 w-14 cursor-pointer rounded border border-gray-300 dark:border-gray-600"
            />
            <input
              type="text"
              value={textColor}
              onChange={handleTextHexInput}
              placeholder="#000000"
              maxLength={7}
              spellCheck={false}
              className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-2 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
            />
            <CopyButton text={textColor} />
          </div>
          {!validTextHex && textColor.length > 1 && (
            <p className="mt-1 text-xs text-red-500 dark:text-red-400">Invalid HEX color</p>
          )}
        </div>

        {/* Background Color */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Background Color
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={validBgHex ? bgColor : "#FFFFFF"}
              onChange={handleBgColorPicker}
              className="h-10 w-14 cursor-pointer rounded border border-gray-300 dark:border-gray-600"
            />
            <input
              type="text"
              value={bgColor}
              onChange={handleBgHexInput}
              placeholder="#FFFFFF"
              maxLength={7}
              spellCheck={false}
              className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-2 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
            />
            <CopyButton text={bgColor} />
          </div>
          {!validBgHex && bgColor.length > 1 && (
            <p className="mt-1 text-xs text-red-500 dark:text-red-400">Invalid HEX color</p>
          )}
        </div>
      </div>

      {/* Swap Button */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={handleSwap}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800 active:bg-gray-100 dark:bg-gray-800 dark:active:bg-gray-800"
        >
          Swap Colors
        </button>
      </div>

      {/* Contrast Ratio */}
      {contrastData && (
        <div className="mt-6">
          <div className="mb-4 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Contrast Ratio</p>
            <p className="text-5xl font-bold text-gray-900 dark:text-gray-100">
              {contrastData.ratio.toFixed(2)}
              <span className="text-2xl text-gray-400 dark:text-gray-500">:1</span>
            </p>
          </div>

          {/* Live Preview */}
          <div className="mb-6 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
            <div
              className="p-6"
              style={{ backgroundColor: safeBgColor }}
            >
              <p
                className="text-2xl font-bold"
                style={{ color: safeTextColor }}
              >
                Large Text Preview (24px bold)
              </p>
              <p
                className="mt-2 text-base"
                style={{ color: safeTextColor }}
              >
                Normal text preview (16px). The quick brown fox jumps over the
                lazy dog. This sample text helps you evaluate readability with
                your chosen color combination.
              </p>
              <p
                className="mt-2 text-sm"
                style={{ color: safeTextColor }}
              >
                Small text preview (14px). Check if this is still readable for
                your users.
              </p>
            </div>
          </div>

          {/* WCAG Results */}
          <div className="grid gap-3 sm:grid-cols-2">
            {contrastData.wcag.map((result) => (
              <div
                key={result.label}
                className={`flex items-center justify-between rounded-lg border px-4 py-3 ${
                  result.pass
                    ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950"
                    : "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950"
                }`}
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {result.label}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Requires {result.requiredRatio}:1
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-sm font-bold ${
                    result.pass
                      ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                      : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                  }`}
                >
                  {result.pass ? "PASS" : "FAIL"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The Color Contrast Checker is a free online tool available on CodeUtilo. Check WCAG 2.1 color contrast ratios. Validate AA and AAA accessibility standards. All processing happens directly in your browser — no data is ever sent to any server, ensuring your privacy and security. No signup or installation is required.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> — All color contrast checker operations run locally in your browser using JavaScript. Your data never leaves your device.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Instant Results</strong> — Get results immediately as you type or paste your input. No waiting for server responses or page reloads.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> — Use the color contrast checker as many times as you need without creating an account or paying anything.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Mobile Friendly</strong> — Works on desktop, tablet, and mobile browsers. Access this tool from any device with an internet connection.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Using the color contrast checker for day-to-day development tasks</li>
          <li>Saving time on repetitive tasks by using a browser-based tool instead of writing custom code</li>
          <li>Working on projects where installing software is not an option (school, work, shared computers)</li>
          <li>Quick prototyping and debugging without switching to a terminal or IDE</li>
          <li>Sharing the tool link with colleagues who need the same functionality</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Enter your input in the text area provided and the color contrast checker will process it instantly. Use the Copy button to copy the result to your clipboard. All operations are performed locally in your browser — no data is transmitted to any server.
        </p>
      
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Is the Color Contrast Checker free to use?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes, the Color Contrast Checker is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need.
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
              Yes. The Color Contrast Checker is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Do I need to install anything?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. The Color Contrast Checker runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately.
            </p>
          </details>
        </div>
</div>
    </ToolLayout>
  );
}
