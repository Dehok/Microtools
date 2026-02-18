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

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0")).join("")}`.toUpperCase();
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

const PRESETS = [
  { hex: "#FF0000", name: "Red" },
  { hex: "#00FF00", name: "Green" },
  { hex: "#0000FF", name: "Blue" },
  { hex: "#FFFF00", name: "Yellow" },
  { hex: "#FF00FF", name: "Magenta" },
  { hex: "#00FFFF", name: "Cyan" },
  { hex: "#FFFFFF", name: "White" },
  { hex: "#000000", name: "Black" },
  { hex: "#FF5733", name: "Vermilion" },
  { hex: "#3498DB", name: "Steel Blue" },
  { hex: "#2ECC71", name: "Emerald" },
  { hex: "#9B59B6", name: "Amethyst" },
];

export default function HexRgbConverter() {
  const [hexInput, setHexInput] = useState("#3498DB");
  const [rInput, setRInput] = useState("52");
  const [gInput, setGInput] = useState("152");
  const [bInput, setBInput] = useState("219");

  const fromHex = useMemo(() => {
    const rgb = hexToRgb(hexInput);
    if (!rgb) return null;
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    return { ...rgb, ...hsl, hex: hexInput.startsWith("#") ? hexInput.toUpperCase() : `#${hexInput}`.toUpperCase() };
  }, [hexInput]);

  const fromRgb = useMemo(() => {
    const r = parseInt(rInput), g = parseInt(gInput), b = parseInt(bInput);
    if ([r, g, b].some((v) => isNaN(v) || v < 0 || v > 255)) return null;
    const hex = rgbToHex(r, g, b);
    const hsl = rgbToHsl(r, g, b);
    return { r, g, b, hex, ...hsl };
  }, [rInput, gInput, bInput]);

  const setFromHexResult = () => {
    if (fromHex) {
      setRInput(fromHex.r.toString());
      setGInput(fromHex.g.toString());
      setBInput(fromHex.b.toString());
    }
  };

  const setFromRgbResult = () => {
    if (fromRgb) {
      setHexInput(fromRgb.hex);
    }
  };

  return (
    <ToolLayout
      title="HEX to RGB & RGB to HEX Converter"
      description="Convert between HEX and RGB color values. Also shows HSL values. Free online color converter."
      relatedTools={["color-picker", "css-minifier", "aspect-ratio-calculator"]}
    >
      <div className="grid gap-6 md:grid-cols-2">
        {/* HEX to RGB */}
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">HEX → RGB</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={hexInput}
              onChange={(e) => setHexInput(e.target.value)}
              placeholder="#3498DB"
              className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-2 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
              spellCheck={false}
            />
            <button
              onClick={setFromHexResult}
              className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Convert
            </button>
          </div>
          {fromHex && (
            <div className="mt-3 space-y-2">
              <div
                className="h-16 rounded-lg border border-gray-200 dark:border-gray-700"
                style={{ backgroundColor: fromHex.hex }}
              />
              <div className="flex items-center justify-between rounded bg-gray-50 dark:bg-gray-950 px-3 py-1.5 text-sm">
                <span className="text-gray-500 dark:text-gray-400">RGB:</span>
                <span className="flex items-center gap-1 font-mono">
                  rgb({fromHex.r}, {fromHex.g}, {fromHex.b})
                  <CopyButton text={`rgb(${fromHex.r}, ${fromHex.g}, ${fromHex.b})`} />
                </span>
              </div>
              <div className="flex items-center justify-between rounded bg-gray-50 dark:bg-gray-950 px-3 py-1.5 text-sm">
                <span className="text-gray-500 dark:text-gray-400">HSL:</span>
                <span className="flex items-center gap-1 font-mono">
                  hsl({fromHex.h}, {fromHex.s}%, {fromHex.l}%)
                  <CopyButton text={`hsl(${fromHex.h}, ${fromHex.s}%, ${fromHex.l}%)`} />
                </span>
              </div>
            </div>
          )}
        </div>

        {/* RGB to HEX */}
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">RGB → HEX</h3>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="mb-0.5 block text-xs text-gray-500 dark:text-gray-400">R (0-255)</label>
              <input
                type="number"
                min="0" max="255"
                value={rInput}
                onChange={(e) => setRInput(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-2 py-2 text-center font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-0.5 block text-xs text-gray-500 dark:text-gray-400">G (0-255)</label>
              <input
                type="number"
                min="0" max="255"
                value={gInput}
                onChange={(e) => setGInput(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-2 py-2 text-center font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-0.5 block text-xs text-gray-500 dark:text-gray-400">B (0-255)</label>
              <input
                type="number"
                min="0" max="255"
                value={bInput}
                onChange={(e) => setBInput(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-2 py-2 text-center font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
              />
            </div>
          </div>
          <button
            onClick={setFromRgbResult}
            className="mt-2 w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Convert
          </button>
          {fromRgb && (
            <div className="mt-3 space-y-2">
              <div
                className="h-16 rounded-lg border border-gray-200 dark:border-gray-700"
                style={{ backgroundColor: fromRgb.hex }}
              />
              <div className="flex items-center justify-between rounded bg-gray-50 dark:bg-gray-950 px-3 py-1.5 text-sm">
                <span className="text-gray-500 dark:text-gray-400">HEX:</span>
                <span className="flex items-center gap-1 font-mono">
                  {fromRgb.hex}
                  <CopyButton text={fromRgb.hex} />
                </span>
              </div>
              <div className="flex items-center justify-between rounded bg-gray-50 dark:bg-gray-950 px-3 py-1.5 text-sm">
                <span className="text-gray-500 dark:text-gray-400">HSL:</span>
                <span className="flex items-center gap-1 font-mono">
                  hsl({fromRgb.h}, {fromRgb.s}%, {fromRgb.l}%)
                  <CopyButton text={`hsl(${fromRgb.h}, ${fromRgb.s}%, ${fromRgb.l}%)`} />
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Color presets */}
      <div className="mt-6">
        <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">Quick Colors</h3>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.hex}
              onClick={() => { setHexInput(p.hex); const rgb = hexToRgb(p.hex); if (rgb) { setRInput(rgb.r.toString()); setGInput(rgb.g.toString()); setBInput(rgb.b.toString()); } }}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-1 text-xs hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
              title={p.name}
            >
              <span className="inline-block h-4 w-4 rounded" style={{ backgroundColor: p.hex }} />
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">HEX vs RGB Color Formats</h2>
        <p className="mb-3">
          <strong>HEX</strong> colors use a 6-digit hexadecimal code (e.g., #3498DB). Each pair of digits
          represents Red, Green, and Blue intensity (00-FF). <strong>RGB</strong> uses decimal values
          (0-255) for each channel, e.g., rgb(52, 152, 219).
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">When to Use Each</h2>
        <p>
          HEX is most common in CSS and web design. RGB is common in graphic design tools and programmatic
          color manipulation. HSL (Hue, Saturation, Lightness) is more intuitive for adjusting colors.
        </p>
      </div>
    
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The HEX ↔ RGB Converter is a free online tool available on CodeUtilo. Convert between HEX, RGB, and HSL color values. All processing happens directly in your browser — no data is ever sent to any server, ensuring your privacy and security. No signup or installation is required.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> — All hex ↔ rgb converter operations run locally in your browser using JavaScript. Your data never leaves your device.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Instant Results</strong> — Get results immediately as you type or paste your input. No waiting for server responses or page reloads.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> — Use the hex ↔ rgb converter as many times as you need without creating an account or paying anything.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Mobile Friendly</strong> — Works on desktop, tablet, and mobile browsers. Access this tool from any device with an internet connection.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Using the hex ↔ rgb converter for day-to-day development tasks</li>
          <li>Saving time on repetitive tasks by using a browser-based tool instead of writing custom code</li>
          <li>Working on projects where installing software is not an option (school, work, shared computers)</li>
          <li>Quick prototyping and debugging without switching to a terminal or IDE</li>
          <li>Sharing the tool link with colleagues who need the same functionality</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Enter your input in the text area provided and the hex ↔ rgb converter will process it instantly. Use the Copy button to copy the result to your clipboard. All operations are performed locally in your browser — no data is transmitted to any server.
        </p>
      </div>
    </ToolLayout>
  );
}
