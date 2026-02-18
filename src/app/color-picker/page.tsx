"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleaned = hex.replace("#", "");
  if (cleaned.length !== 6) return null;
  const num = parseInt(cleaned, 16);
  if (isNaN(num)) return null;
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b].map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0")).join("")
  );
}

function rgbToHsl(
  r: number,
  g: number,
  b: number
): { h: number; s: number; l: number } {
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

export default function ColorPicker() {
  const [hex, setHex] = useState("#3b82f6");
  const [r, setR] = useState(59);
  const [g, setG] = useState(130);
  const [b, setB] = useState(246);

  const hsl = rgbToHsl(r, g, b);

  const updateFromHex = useCallback((newHex: string) => {
    setHex(newHex);
    const rgb = hexToRgb(newHex);
    if (rgb) { setR(rgb.r); setG(rgb.g); setB(rgb.b); }
  }, []);

  const updateFromRgb = useCallback((nr: number, ng: number, nb: number) => {
    setR(nr); setG(ng); setB(nb);
    setHex(rgbToHex(nr, ng, nb));
  }, []);

  const handleColorInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFromHex(e.target.value);
  };

  const hexString = hex.toUpperCase();
  const rgbString = `rgb(${r}, ${g}, ${b})`;
  const hslString = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

  return (
    <ToolLayout
      title="Color Picker — HEX, RGB & HSL Converter"
      description="Pick colors visually and convert between HEX, RGB, and HSL formats. Copy CSS-ready color values instantly."
      relatedTools={["json-formatter", "password-generator", "markdown-preview"]}
    >
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left: picker + preview */}
        <div>
          {/* Native color picker */}
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Pick a color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={hex}
                onChange={handleColorInput}
                className="h-12 w-20 cursor-pointer rounded border border-gray-300 dark:border-gray-600"
              />
              <div
                className="h-12 flex-1 rounded-lg border border-gray-200 dark:border-gray-700"
                style={{ backgroundColor: hex }}
              />
            </div>
          </div>

          {/* HEX input */}
          <div className="mb-3">
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">HEX</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={hex}
                onChange={(e) => {
                  const val = e.target.value.startsWith("#") ? e.target.value : "#" + e.target.value;
                  setHex(val);
                  const rgb = hexToRgb(val);
                  if (rgb) { setR(rgb.r); setG(rgb.g); setB(rgb.b); }
                }}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-1.5 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
                maxLength={7}
              />
              <CopyButton text={hexString} />
            </div>
          </div>

          {/* RGB inputs */}
          <div className="mb-3">
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">RGB</label>
            <div className="flex gap-2">
              {[
                { label: "R", value: r, set: (v: number) => updateFromRgb(v, g, b) },
                { label: "G", value: g, set: (v: number) => updateFromRgb(r, v, b) },
                { label: "B", value: b, set: (v: number) => updateFromRgb(r, g, v) },
              ].map((ch) => (
                <div key={ch.label} className="flex-1">
                  <span className="text-xs text-gray-400 dark:text-gray-500">{ch.label}</span>
                  <input
                    type="number"
                    min={0}
                    max={255}
                    value={ch.value}
                    onChange={(e) => ch.set(Math.min(255, Math.max(0, Number(e.target.value))))}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-2 py-1.5 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
                  />
                </div>
              ))}
              <div className="flex items-end">
                <CopyButton text={rgbString} />
              </div>
            </div>
          </div>
        </div>

        {/* Right: values */}
        <div>
          <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">CSS Values</h3>
          <div className="space-y-2">
            {[
              { label: "HEX", value: hexString },
              { label: "RGB", value: rgbString },
              { label: "HSL", value: hslString },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 px-3 py-2"
              >
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 w-10">{row.label}</span>
                <code className="select-all font-mono text-sm text-gray-800 dark:text-gray-200">
                  {row.value}
                </code>
                <CopyButton text={row.value} />
              </div>
            ))}
          </div>

          {/* Color preview swatches */}
          <h3 className="mb-2 mt-6 text-sm font-semibold text-gray-900 dark:text-gray-100">
            Shades
          </h3>
          <div className="flex gap-1 overflow-hidden rounded-lg">
            {[0.2, 0.4, 0.6, 0.8, 1.0].map((opacity) => (
              <div
                key={opacity}
                className="h-10 flex-1"
                style={{ backgroundColor: hex, opacity }}
                title={`${Math.round(opacity * 100)}%`}
              />
            ))}
          </div>

          <h3 className="mb-2 mt-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
            With black & white text
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <div
              className="rounded-lg p-3 text-center text-sm font-medium"
              style={{ backgroundColor: hex, color: "#ffffff" }}
            >
              White text
            </div>
            <div
              className="rounded-lg p-3 text-center text-sm font-medium"
              style={{ backgroundColor: hex, color: "#000000" }}
            >
              Black text
            </div>
          </div>
        </div>
      </div>

      {/* SEO */}
      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">What is a Color Picker?</h2>
        <p className="mb-3">
          A color picker lets you select colors visually and get their values in different
          formats (HEX, RGB, HSL). These values can be used directly in CSS, design tools,
          and image editors.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">HEX vs RGB vs HSL</h2>
        <p>
          <strong>HEX</strong> is the most common format in web design (#FF5733).
          <strong> RGB</strong> defines colors by red, green, and blue components (0-255).
          <strong> HSL</strong> uses hue (0-360), saturation (0-100%), and lightness (0-100%),
          making it more intuitive for adjusting colors.
        </p>
      </div>
    </ToolLayout>
  );
}
