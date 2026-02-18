"use client";

import { useState, useMemo, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

// --- Color conversion helpers ---

function hslToRgb(
  h: number,
  s: number,
  l: number
): { r: number; g: number; b: number } {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color);
  };
  return { r: f(0), g: f(8), b: f(4) };
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((v) =>
        Math.max(0, Math.min(255, v))
          .toString(16)
          .padStart(2, "0")
      )
      .join("")
  );
}

function hslToHex(h: number, s: number, l: number): string {
  const { r, g, b } = hslToRgb(h, s, l);
  return rgbToHex(r, g, b);
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleaned = hex.replace("#", "");
  if (cleaned.length !== 6) return null;
  const num = parseInt(cleaned, 16);
  if (isNaN(num)) return null;
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const rgb = hexToRgb(hex);
  if (!rgb) return { h: 0, s: 0, l: 50 };
  let { r, g, b } = rgb;
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function getContrastColor(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return "#000000";
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5 ? "#000000" : "#ffffff";
}

// --- Palette generation modes ---

function normalizeHue(h: number): number {
  return ((h % 360) + 360) % 360;
}

function randomHslColor(): { h: number; s: number; l: number } {
  const h = Math.floor(Math.random() * 360);
  const s = Math.floor(Math.random() * 31) + 60; // 60-90
  const l = Math.floor(Math.random() * 31) + 40; // 40-70
  return { h, s, l };
}

function generateRandomPalette(): string[] {
  return Array.from({ length: 5 }, () => {
    const { h, s, l } = randomHslColor();
    return hslToHex(h, s, l);
  });
}

function generateAnalogousPalette(baseHex: string): string[] {
  const { h, s, l } = hexToHsl(baseHex);
  const offsets = [-60, -30, 0, 30, 60];
  return offsets.map((offset) =>
    hslToHex(normalizeHue(h + offset), s, l)
  );
}

function generateComplementaryPalette(baseHex: string): string[] {
  const { h, s, l } = hexToHsl(baseHex);
  const complement = normalizeHue(h + 180);
  return [
    hslToHex(h, s, l),
    hslToHex(h, Math.max(s - 15, 10), Math.min(l + 15, 85)),
    hslToHex(h, Math.min(s + 10, 100), Math.max(l - 15, 20)),
    hslToHex(complement, s, l),
    hslToHex(complement, Math.max(s - 15, 10), Math.min(l + 15, 85)),
  ];
}

function generateTriadicPalette(baseHex: string): string[] {
  const { h, s, l } = hexToHsl(baseHex);
  const h2 = normalizeHue(h + 120);
  const h3 = normalizeHue(h + 240);
  return [
    hslToHex(h, s, l),
    hslToHex(h, Math.max(s - 10, 10), Math.min(l + 15, 85)),
    hslToHex(h2, s, l),
    hslToHex(h3, s, l),
    hslToHex(h3, Math.max(s - 10, 10), Math.max(l - 15, 20)),
  ];
}

function generateMonochromaticPalette(baseHex: string): string[] {
  const { h, s } = hexToHsl(baseHex);
  const lightnessSteps = [85, 70, 55, 40, 25];
  return lightnessSteps.map((l) => hslToHex(h, s, l));
}

// --- Types ---

type PaletteMode =
  | "random"
  | "analogous"
  | "complementary"
  | "triadic"
  | "monochromatic";

interface PaletteColor {
  hex: string;
  locked: boolean;
}

// --- Component ---

export default function ColorPaletteGenerator() {
  const [mode, setMode] = useState<PaletteMode>("random");
  const [baseColor, setBaseColor] = useState("#3b82f6");
  const [colors, setColors] = useState<PaletteColor[]>(() =>
    generateRandomPalette().map((hex) => ({ hex, locked: false }))
  );
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const needsBaseColor = mode !== "random";

  const generatePalette = useCallback(() => {
    let newHexes: string[];

    switch (mode) {
      case "analogous":
        newHexes = generateAnalogousPalette(baseColor);
        break;
      case "complementary":
        newHexes = generateComplementaryPalette(baseColor);
        break;
      case "triadic":
        newHexes = generateTriadicPalette(baseColor);
        break;
      case "monochromatic":
        newHexes = generateMonochromaticPalette(baseColor);
        break;
      default:
        newHexes = generateRandomPalette();
    }

    setColors((prev) =>
      prev.map((color, i) =>
        color.locked ? color : { hex: newHexes[i], locked: false }
      )
    );
  }, [mode, baseColor]);

  const toggleLock = useCallback((index: number) => {
    setColors((prev) =>
      prev.map((c, i) => (i === index ? { ...c, locked: !c.locked } : c))
    );
  }, []);

  const copyHex = useCallback(async (hex: string, index: number) => {
    try {
      await navigator.clipboard.writeText(hex.toUpperCase());
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch {
      // clipboard may not be available
    }
  }, []);

  // Compute color details with useMemo (no setState inside)
  const colorDetails = useMemo(() => {
    return colors.map((c) => {
      const rgb = hexToRgb(c.hex);
      const hsl = hexToHsl(c.hex);
      return {
        hex: c.hex.toUpperCase(),
        rgb: rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : "rgb(0, 0, 0)",
        hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
        contrast: getContrastColor(c.hex),
      };
    });
  }, [colors]);

  const cssVariablesText = useMemo(() => {
    const vars = colors
      .map((c, i) => `  --palette-color-${i + 1}: ${c.hex.toUpperCase()};`)
      .join("\n");
    return `:root {\n${vars}\n}`;
  }, [colors]);

  const MODES: { value: PaletteMode; label: string }[] = [
    { value: "random", label: "Random" },
    { value: "analogous", label: "Analogous" },
    { value: "complementary", label: "Complementary" },
    { value: "triadic", label: "Triadic" },
    { value: "monochromatic", label: "Monochromatic" },
  ];

  return (
    <ToolLayout
      title="Color Palette Generator"
      description="Generate beautiful color palettes with multiple harmony modes. Lock colors you like, regenerate the rest, and export as CSS variables."
      relatedTools={[
        "color-picker",
        "hex-rgb-converter",
        "tailwind-color-generator",
      ]}
    >
      {/* Controls */}
      <div className="mb-6 flex flex-wrap items-end gap-4">
        {/* Mode select */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Mode
          </label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as PaletteMode)}
            className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
          >
            {MODES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Base color picker (shown for non-random modes) */}
        {needsBaseColor && (
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Base Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                className="h-10 w-10 cursor-pointer rounded border border-gray-300 dark:border-gray-600"
              />
              <input
                type="text"
                value={baseColor}
                onChange={(e) => {
                  const v = e.target.value;
                  if (/^#[0-9a-fA-F]{6}$/.test(v)) setBaseColor(v);
                }}
                className="w-24 rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
                placeholder="#3b82f6"
              />
            </div>
          </div>
        )}

        {/* Generate button */}
        <button
          onClick={generatePalette}
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
        >
          Generate New Palette
        </button>
      </div>

      {/* Palette swatches */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-5">
        {colors.map((color, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-xl border border-gray-300 dark:border-gray-600 transition-shadow hover:shadow-md"
          >
            {/* Color swatch */}
            <button
              onClick={() => copyHex(color.hex, index)}
              className="block h-28 w-full cursor-pointer border-none sm:h-32"
              style={{ backgroundColor: color.hex }}
              title={`Click to copy ${color.hex.toUpperCase()}`}
            >
              <span
                className="text-sm font-semibold opacity-0 transition-opacity group-hover:opacity-100"
                style={{ color: colorDetails[index].contrast }}
              >
                {copiedIndex === index ? "Copied!" : "Click to copy"}
              </span>
            </button>

            {/* Lock button */}
            <button
              onClick={() => toggleLock(index)}
              className={`absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full text-sm transition-all ${
                color.locked
                  ? "bg-white dark:bg-gray-900/90 text-gray-800 dark:text-gray-200 shadow-sm"
                  : "bg-black/20 text-white opacity-0 group-hover:opacity-100"
              }`}
              title={color.locked ? "Unlock color" : "Lock color"}
            >
              {color.locked ? "\u{1F512}" : "\u{1F513}"}
            </button>

            {/* Color info */}
            <div className="bg-white dark:bg-gray-900 p-3">
              <div className="mb-1 flex items-center justify-between">
                <span className="font-mono text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {colorDetails[index].hex}
                </span>
                <CopyButton text={colorDetails[index].hex} />
              </div>
              <div className="space-y-0.5 text-xs text-gray-500 dark:text-gray-400">
                <div className="font-mono">{colorDetails[index].rgb}</div>
                <div className="font-mono">{colorDetails[index].hsl}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Full palette strip (for quick visual overview) */}
      <div className="mb-6">
        <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Palette Preview
        </h3>
        <div className="flex overflow-hidden rounded-lg">
          {colors.map((color, index) => (
            <div
              key={index}
              className="flex h-12 flex-1 items-center justify-center"
              style={{ backgroundColor: color.hex }}
            >
              <span
                className="font-mono text-xs font-medium"
                style={{ color: colorDetails[index].contrast }}
              >
                {colorDetails[index].hex}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* CSS Variables export */}
      <div>
        <div className="mb-1 flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            CSS Variables
          </label>
          <CopyButton text={cssVariablesText} />
        </div>
        <pre className="overflow-x-auto rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 font-mono text-sm">
          {cssVariablesText}
        </pre>
      </div>

      {/* SEO Content */}
      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
          What is a Color Palette Generator?
        </h2>
        <p className="mb-3">
          A color palette generator creates harmonious sets of colors based on
          color theory principles. Whether you are designing a website, creating
          a brand identity, or working on digital art, a well-chosen color
          palette ensures visual consistency and appeal.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
          Color Harmony Modes Explained
        </h2>
        <p className="mb-3">
          <strong>Random</strong> generates five colors with good saturation and
          lightness for instant inspiration.{" "}
          <strong>Analogous</strong> colors sit next to each other on the color
          wheel, creating a serene and comfortable design.{" "}
          <strong>Complementary</strong> uses colors opposite each other on the
          wheel for high contrast and vibrant looks.{" "}
          <strong>Triadic</strong> uses three evenly spaced colors for a balanced
          yet colorful palette.{" "}
          <strong>Monochromatic</strong> varies the lightness and saturation of a
          single hue for a cohesive, elegant feel.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
          How to Use This Tool
        </h2>
        <p>
          Select a harmony mode, pick a base color (for non-random modes), and
          click &quot;Generate New Palette.&quot; Lock any colors you want to
          keep, then regenerate to replace only the unlocked ones. Copy
          individual HEX values by clicking on swatches, or export the entire
          palette as CSS custom properties for your project.
        </p>
      </div>
    </ToolLayout>
  );
}
