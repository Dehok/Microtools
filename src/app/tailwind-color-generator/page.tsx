"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

function generatePalette(baseHex: string): { shade: number; hex: string }[] {
  const [h, s] = hexToHsl(baseHex);

  const lightnessMap: Record<number, number> = {
    50: 97, 100: 94, 200: 86, 300: 77, 400: 66,
    500: 50, 600: 40, 700: 32, 800: 24, 900: 17, 950: 10,
  };

  return SHADES.map((shade) => {
    const l = lightnessMap[shade];
    const adjustedS = shade <= 100 ? Math.max(s - 20, 10) : shade >= 900 ? Math.min(s + 10, 100) : s;
    return { shade, hex: hslToHex(h, adjustedS, l) };
  });
}

function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#ffffff";
}

const PRESETS = [
  { name: "Blue", hex: "#3b82f6" },
  { name: "Red", hex: "#ef4444" },
  { name: "Green", hex: "#22c55e" },
  { name: "Purple", hex: "#a855f7" },
  { name: "Orange", hex: "#f97316" },
  { name: "Teal", hex: "#14b8a6" },
  { name: "Pink", hex: "#ec4899" },
  { name: "Indigo", hex: "#6366f1" },
];

export default function TailwindColorGenerator() {
  const [baseColor, setBaseColor] = useState("#3b82f6");
  const [colorName, setColorName] = useState("primary");

  const palette = useMemo(() => generatePalette(baseColor), [baseColor]);

  const tailwindConfig = useMemo(() => {
    const entries = palette.map((p) => `        ${p.shade}: '${p.hex}',`).join("\n");
    return `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n        '${colorName}': {\n${entries}\n        },\n      },\n    },\n  },\n};`;
  }, [palette, colorName]);

  const cssVars = useMemo(() => {
    return palette.map((p) => `  --${colorName}-${p.shade}: ${p.hex};`).join("\n");
  }, [palette, colorName]);

  return (
    <ToolLayout
      title="Tailwind CSS Color Generator"
      description="Generate a full Tailwind CSS color palette from any base color. Get shades 50-950 with ready-to-use config."
      relatedTools={["color-picker", "hex-rgb-converter", "css-gradient-generator"]}
    >
      {/* Controls */}
      <div className="mb-6 flex flex-wrap items-end gap-4">
        <div>
          <label className="mb-1 block text-sm text-gray-600">Base Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={baseColor}
              onChange={(e) => setBaseColor(e.target.value)}
              className="h-10 w-10 cursor-pointer rounded border border-gray-300"
            />
            <input
              type="text"
              value={baseColor}
              onChange={(e) => {
                const v = e.target.value;
                if (/^#[0-9a-fA-F]{6}$/.test(v)) setBaseColor(v);
              }}
              className="w-24 rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm"
              placeholder="#3b82f6"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-600">Color Name</label>
          <input
            type="text"
            value={colorName}
            onChange={(e) => setColorName(e.target.value.replace(/\s/g, "-").toLowerCase())}
            className="w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm"
            placeholder="primary"
          />
        </div>
      </div>

      {/* Presets */}
      <div className="mb-6">
        <label className="mb-2 block text-sm text-gray-600">Presets:</label>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => setBaseColor(preset.hex)}
              className="flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1 text-sm transition-colors hover:border-blue-300"
            >
              <span
                className="inline-block h-4 w-4 rounded-full"
                style={{ backgroundColor: preset.hex }}
              />
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Palette visualization */}
      <div className="mb-6">
        <h3 className="mb-2 text-sm font-medium text-gray-700">Color Palette</h3>
        <div className="flex overflow-hidden rounded-lg">
          {palette.map((p) => (
            <div
              key={p.shade}
              className="flex flex-1 flex-col items-center justify-center py-6 text-xs font-medium"
              style={{ backgroundColor: p.hex, color: getContrastColor(p.hex) }}
            >
              <span className="font-semibold">{p.shade}</span>
              <span className="mt-1 font-mono opacity-80">{p.hex}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Output tabs */}
      <div className="space-y-4">
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Tailwind Config</label>
            <CopyButton text={tailwindConfig} />
          </div>
          <pre className="overflow-x-auto rounded-lg border border-gray-300 bg-gray-50 p-3 font-mono text-sm">
            {tailwindConfig}
          </pre>
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">CSS Variables</label>
            <CopyButton text={`:root {\n${cssVars}\n}`} />
          </div>
          <pre className="overflow-x-auto rounded-lg border border-gray-300 bg-gray-50 p-3 font-mono text-sm">
            {`:root {\n${cssVars}\n}`}
          </pre>
        </div>
      </div>

      {/* SEO Content */}
      <div className="mt-8 border-t border-gray-200 pt-6 text-sm text-gray-600">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          What is a Tailwind Color Palette?
        </h2>
        <p className="mb-3">
          Tailwind CSS uses a numeric shade system (50-950) for colors, where
          lower numbers are lighter and higher numbers are darker. This
          generator creates a complete palette from any base color, matching
          Tailwind&apos;s conventions.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          How to use
        </h2>
        <p>
          Pick a base color or enter a hex value, name your color, and copy
          the generated Tailwind config or CSS variables directly into your
          project. The 500 shade is typically closest to your base color.
        </p>
      </div>
    </ToolLayout>
  );
}
