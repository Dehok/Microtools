"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface Corners {
  topLeft: number;
  topRight: number;
  bottomRight: number;
  bottomLeft: number;
}

const PRESETS: { name: string; corners: Corners; unit: "px" | "%" }[] = [
  { name: "Circle", corners: { topLeft: 50, topRight: 50, bottomRight: 50, bottomLeft: 50 }, unit: "%" },
  { name: "Pill", corners: { topLeft: 100, topRight: 100, bottomRight: 100, bottomLeft: 100 }, unit: "px" },
  { name: "Rounded", corners: { topLeft: 12, topRight: 12, bottomRight: 12, bottomLeft: 12 }, unit: "px" },
  { name: "Squircle", corners: { topLeft: 30, topRight: 30, bottomRight: 30, bottomLeft: 30 }, unit: "%" },
  { name: "Leaf", corners: { topLeft: 50, topRight: 0, bottomRight: 50, bottomLeft: 0 }, unit: "%" },
  { name: "Drop", corners: { topLeft: 50, topRight: 50, bottomRight: 50, bottomLeft: 0 }, unit: "%" },
];

export default function BorderRadiusGenerator() {
  const [corners, setCorners] = useState<Corners>({
    topLeft: 20,
    topRight: 20,
    bottomRight: 20,
    bottomLeft: 20,
  });
  const [unit, setUnit] = useState<"px" | "%">("px");
  const [linked, setLinked] = useState(false);
  const [bgColor, setBgColor] = useState("#3b82f6");
  const [borderColor, setBorderColor] = useState("#1e40af");
  const [borderWidth, setBorderWidth] = useState(3);

  const maxValue = unit === "px" ? 100 : 50;

  const css = useMemo(() => {
    const { topLeft, topRight, bottomRight, bottomLeft } = corners;
    const u = unit;
    const allSame = topLeft === topRight && topRight === bottomRight && bottomRight === bottomLeft;

    const lines: string[] = [];

    if (allSame) {
      lines.push(`border-radius: ${topLeft}${u};`);
    } else {
      lines.push(`border-radius: ${topLeft}${u} ${topRight}${u} ${bottomRight}${u} ${bottomLeft}${u};`);
    }

    if (borderWidth > 0) {
      lines.push(`border: ${borderWidth}px solid ${borderColor};`);
    }

    return lines.join("\n");
  }, [corners, unit, borderColor, borderWidth]);

  const updateCorner = (key: keyof Corners, value: number) => {
    if (linked) {
      setCorners({ topLeft: value, topRight: value, bottomRight: value, bottomLeft: value });
    } else {
      setCorners((prev) => ({ ...prev, [key]: value }));
    }
  };

  const applyPreset = (preset: (typeof PRESETS)[number]) => {
    setCorners(preset.corners);
    setUnit(preset.unit);
  };

  const cornerKeys: { key: keyof Corners; label: string }[] = [
    { key: "topLeft", label: "Top-Left" },
    { key: "topRight", label: "Top-Right" },
    { key: "bottomRight", label: "Bottom-Right" },
    { key: "bottomLeft", label: "Bottom-Left" },
  ];

  return (
    <ToolLayout
      title="CSS Border Radius Generator"
      description="Create CSS border-radius values with a visual editor. Adjust each corner individually or link them together, pick from presets, and copy the generated CSS."
      relatedTools={["box-shadow-generator", "css-gradient-generator", "css-minifier"]}
    >
      {/* Preview */}
      <div className="mb-6 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-8">
        <div
          className="h-52 w-52 transition-all duration-200"
          style={{
            backgroundColor: bgColor,
            borderRadius: `${corners.topLeft}${unit} ${corners.topRight}${unit} ${corners.bottomRight}${unit} ${corners.bottomLeft}${unit}`,
            border: borderWidth > 0 ? `${borderWidth}px solid ${borderColor}` : "none",
          }}
        />
      </div>

      {/* Controls grid */}
      <div className="mb-6 grid gap-6 md:grid-cols-2">
        {/* Corner sliders */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Corner Radii</h3>
            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <input
                type="checkbox"
                checked={linked}
                onChange={(e) => {
                  setLinked(e.target.checked);
                  if (e.target.checked) {
                    const val = corners.topLeft;
                    setCorners({ topLeft: val, topRight: val, bottomRight: val, bottomLeft: val });
                  }
                }}
                className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-400"
              />
              Link corners
            </label>
          </div>

          <div className="space-y-3">
            {cornerKeys.map(({ key, label }) => (
              <div key={key} className="flex items-center gap-3">
                <label className="w-28 text-sm text-gray-600 dark:text-gray-400">{label}</label>
                <input
                  type="range"
                  min="0"
                  max={maxValue}
                  value={corners[key]}
                  onChange={(e) => updateCorner(key, parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="w-14 text-right font-mono text-sm text-gray-700 dark:text-gray-300">
                  {corners[key]}{unit}
                </span>
              </div>
            ))}
          </div>

          {/* Unit toggle */}
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Unit:</span>
            <button
              onClick={() => setUnit("px")}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
                unit === "px"
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
              }`}
            >
              px
            </button>
            <button
              onClick={() => setUnit("%")}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
                unit === "%"
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
              }`}
            >
              %
            </button>
          </div>
        </div>

        {/* Style controls */}
        <div>
          <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">Style</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <label className="w-28 text-sm text-gray-600 dark:text-gray-400">Background</label>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="h-8 w-8 cursor-pointer rounded border border-gray-300 dark:border-gray-600"
              />
              <input
                type="text"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-24 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-2 py-1 font-mono text-xs"
              />
            </div>

            <div className="flex items-center gap-3">
              <label className="w-28 text-sm text-gray-600 dark:text-gray-400">Border Color</label>
              <input
                type="color"
                value={borderColor}
                onChange={(e) => setBorderColor(e.target.value)}
                className="h-8 w-8 cursor-pointer rounded border border-gray-300 dark:border-gray-600"
              />
              <input
                type="text"
                value={borderColor}
                onChange={(e) => setBorderColor(e.target.value)}
                className="w-24 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-2 py-1 font-mono text-xs"
              />
            </div>

            <div className="flex items-center gap-3">
              <label className="w-28 text-sm text-gray-600 dark:text-gray-400">Border Width</label>
              <input
                type="range"
                min="0"
                max="20"
                value={borderWidth}
                onChange={(e) => setBorderWidth(parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="w-14 text-right font-mono text-sm text-gray-700 dark:text-gray-300">{borderWidth}px</span>
            </div>
          </div>
        </div>
      </div>

      {/* Presets */}
      <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">Presets</h3>
      <div className="mb-6 flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.name}
            onClick={() => applyPreset(preset)}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
          >
            <span
              className="inline-block h-4 w-4 bg-blue-500"
              style={{
                borderRadius: `${preset.corners.topLeft}${preset.unit} ${preset.corners.topRight}${preset.unit} ${preset.corners.bottomRight}${preset.unit} ${preset.corners.bottomLeft}${preset.unit}`,
              }}
            />
            {preset.name}
          </button>
        ))}
      </div>

      {/* CSS output */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">CSS Code</label>
          <CopyButton text={css} />
        </div>
        <pre className="mt-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-900 p-3 font-mono text-sm text-green-400">
          {css}
        </pre>
      </div>

      {/* SEO content */}
      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">CSS Border Radius</h2>
        <p className="mb-3">
          The <strong>border-radius</strong> CSS property rounds the corners of an element. You can
          set all four corners to the same value for uniform rounding, or specify each corner
          individually: <code className="rounded bg-gray-100 dark:bg-gray-800 px-1 py-0.5 text-xs">border-radius: top-left top-right bottom-right bottom-left</code>.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Pixels vs Percentages</h2>
        <p className="mb-3">
          Use <strong>px</strong> for a fixed radius regardless of element size. Use <strong>%</strong> for
          a radius relative to the element dimensions -- setting <code className="rounded bg-gray-100 dark:bg-gray-800 px-1 py-0.5 text-xs">border-radius: 50%</code> on
          a square element creates a perfect circle.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Common Shapes</h2>
        <p>
          <strong>Circle:</strong> 50% on all corners (square element). <strong>Pill:</strong> a large
          px value (e.g., 100px) on a rectangle. <strong>Leaf/Drop:</strong> mix 0 and 50% on
          opposite corners for organic shapes. All modern browsers fully support border-radius
          without vendor prefixes.
        </p>
      </div>
    
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The CSS Border Radius Generator is a free online tool available on CodeUtilo. Create CSS border-radius values with a visual editor. Adjust each corner individually. All processing happens directly in your browser — no data is ever sent to any server, ensuring your privacy and security. No signup or installation is required.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> — All css border radius generator operations run locally in your browser using JavaScript. Your data never leaves your device.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Instant Results</strong> — Get results immediately as you type or paste your input. No waiting for server responses or page reloads.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> — Use the css border radius generator as many times as you need without creating an account or paying anything.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Mobile Friendly</strong> — Works on desktop, tablet, and mobile browsers. Access this tool from any device with an internet connection.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Using the css border radius generator for day-to-day development tasks</li>
          <li>Saving time on repetitive tasks by using a browser-based tool instead of writing custom code</li>
          <li>Working on projects where installing software is not an option (school, work, shared computers)</li>
          <li>Quick prototyping and debugging without switching to a terminal or IDE</li>
          <li>Sharing the tool link with colleagues who need the same functionality</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Enter your input in the text area provided and the css border radius generator will process it instantly. Use the Copy button to copy the result to your clipboard. All operations are performed locally in your browser — no data is transmitted to any server.
        </p>
      </div>
    </ToolLayout>
  );
}
