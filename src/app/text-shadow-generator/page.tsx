"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface Shadow {
  id: number;
  x: number;
  y: number;
  blur: number;
  color: string;
  opacity: number;
}

let nextId = 1;

function createShadow(overrides: Partial<Omit<Shadow, "id">> = {}): Shadow {
  return {
    id: nextId++,
    x: 2,
    y: 2,
    blur: 4,
    color: "#000000",
    opacity: 70,
    ...overrides,
  };
}

function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
}

interface Preset {
  name: string;
  shadows: Omit<Shadow, "id">[];
}

const PRESETS: Preset[] = [
  {
    name: "Simple",
    shadows: [{ x: 2, y: 2, blur: 4, color: "#000000", opacity: 50 }],
  },
  {
    name: "Outline",
    shadows: [
      { x: -1, y: -1, blur: 0, color: "#000000", opacity: 100 },
      { x: 1, y: -1, blur: 0, color: "#000000", opacity: 100 },
      { x: -1, y: 1, blur: 0, color: "#000000", opacity: 100 },
      { x: 1, y: 1, blur: 0, color: "#000000", opacity: 100 },
    ],
  },
  {
    name: "Neon",
    shadows: [
      { x: 0, y: 0, blur: 7, color: "#00ffff", opacity: 100 },
      { x: 0, y: 0, blur: 10, color: "#00ffff", opacity: 100 },
      { x: 0, y: 0, blur: 21, color: "#00ffff", opacity: 100 },
      { x: 0, y: 0, blur: 42, color: "#0077ff", opacity: 80 },
    ],
  },
  {
    name: "Fire",
    shadows: [
      { x: 0, y: -2, blur: 4, color: "#ffcc00", opacity: 100 },
      { x: 0, y: -4, blur: 10, color: "#ff6600", opacity: 80 },
      { x: 0, y: -6, blur: 20, color: "#ff0000", opacity: 60 },
      { x: 0, y: -8, blur: 30, color: "#990000", opacity: 40 },
    ],
  },
  {
    name: "3D",
    shadows: [
      { x: 1, y: 1, blur: 0, color: "#cccccc", opacity: 100 },
      { x: 2, y: 2, blur: 0, color: "#b3b3b3", opacity: 100 },
      { x: 3, y: 3, blur: 0, color: "#999999", opacity: 100 },
      { x: 4, y: 4, blur: 0, color: "#808080", opacity: 100 },
      { x: 5, y: 5, blur: 0, color: "#666666", opacity: 100 },
    ],
  },
  {
    name: "Retro",
    shadows: [
      { x: 3, y: 3, blur: 0, color: "#ff6b6b", opacity: 100 },
      { x: 6, y: 6, blur: 0, color: "#feca57", opacity: 100 },
      { x: 9, y: 9, blur: 0, color: "#48dbfb", opacity: 100 },
    ],
  },
  {
    name: "Glitch",
    shadows: [
      { x: -3, y: 0, blur: 0, color: "#ff0000", opacity: 80 },
      { x: 3, y: 0, blur: 0, color: "#00ffff", opacity: 80 },
    ],
  },
];

export default function TextShadowGenerator() {
  const [shadows, setShadows] = useState<Shadow[]>([createShadow()]);
  const [previewText, setPreviewText] = useState("Sample Text");
  const [fontSize, setFontSize] = useState(48);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [textColor, setTextColor] = useState("#333333");
  const [activeIndex, setActiveIndex] = useState(0);

  const addShadow = () => {
    setShadows((prev) => [...prev, createShadow()]);
  };

  const removeShadow = (id: number) => {
    setShadows((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      if (filtered.length === 0) return [createShadow()];
      return filtered;
    });
    setActiveIndex((prev) => Math.min(prev, shadows.length - 2));
  };

  const updateShadow = (id: number, field: keyof Omit<Shadow, "id">, value: number | string) => {
    setShadows((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const applyPreset = (preset: Preset) => {
    const newShadows = preset.shadows.map((s) => createShadow(s));
    setShadows(newShadows);
    setActiveIndex(0);
  };

  const shadowValue = useMemo(() => {
    return shadows
      .map((s) => `${s.x}px ${s.y}px ${s.blur}px ${hexToRgba(s.color, s.opacity)}`)
      .join(", ");
  }, [shadows]);

  const css = useMemo(() => {
    const lines = shadows.map(
      (s) => `  ${s.x}px ${s.y}px ${s.blur}px ${hexToRgba(s.color, s.opacity)}`
    );
    if (lines.length === 1) {
      return `text-shadow:${lines[0].trimStart()};`;
    }
    return `text-shadow:\n${lines.join(",\n")};`;
  }, [shadows]);

  const activeShadow = shadows[activeIndex] || shadows[0];

  return (
    <ToolLayout
      title="CSS Text Shadow Generator — Visual Editor"
      description="Create CSS text-shadow effects with a visual editor. Multiple shadow layers, presets, and live preview. Copy ready-to-use CSS code."
      relatedTools={["box-shadow-generator", "css-gradient-generator", "text-case-converter"]}
    >
      {/* Live Preview */}
      <div
        className="mb-6 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 p-8"
        style={{ backgroundColor: bgColor, minHeight: "160px" }}
      >
        <span
          style={{
            fontSize: `${fontSize}px`,
            color: textColor,
            textShadow: shadowValue,
            fontWeight: 700,
            lineHeight: 1.2,
            textAlign: "center",
            wordBreak: "break-word",
          }}
        >
          {previewText || "Sample Text"}
        </span>
      </div>

      {/* Preview Text + Font Size */}
      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Preview Text</label>
          <input
            type="text"
            value={previewText}
            onChange={(e) => setPreviewText(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-2 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter preview text..."
          />
        </div>
        <div>
          <label className="mb-1 flex items-center justify-between text-xs font-medium text-gray-700 dark:text-gray-300">
            Font Size
            <span className="font-mono text-gray-500 dark:text-gray-400">{fontSize}px</span>
          </label>
          <input
            type="range"
            min={24}
            max={72}
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Color Controls */}
      <div className="mb-4 flex flex-wrap gap-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Text Color</label>
          <div className="flex items-center gap-1.5">
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="h-8 w-8 cursor-pointer rounded border"
            />
            <input
              type="text"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="w-20 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-2 py-1 font-mono text-xs"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Background</label>
          <div className="flex items-center gap-1.5">
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="h-8 w-8 cursor-pointer rounded border"
            />
            <input
              type="text"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-20 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-2 py-1 font-mono text-xs"
            />
          </div>
        </div>
      </div>

      {/* Presets */}
      <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">Presets</h3>
      <div className="mb-6 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.name}
            onClick={() => applyPreset(p)}
            className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:bg-blue-950 dark:hover:bg-blue-950"
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Shadow Layers */}
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Shadow Layers ({shadows.length})
          </h3>
          <button
            onClick={addShadow}
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
          >
            + Add Shadow
          </button>
        </div>

        {/* Layer Tabs */}
        <div className="mb-3 flex flex-wrap gap-1">
          {shadows.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setActiveIndex(i)}
              className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                i === activeIndex
                  ? "bg-blue-600 text-white"
                  : "border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
              }`}
            >
              Layer {i + 1}
              {shadows.length > 1 && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    removeShadow(s.id);
                  }}
                  className={`ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] leading-none ${
                    i === activeIndex
                      ? "hover:bg-blue-500"
                      : "hover:bg-gray-200 dark:bg-gray-700"
                  }`}
                >
                  x
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Active Shadow Controls */}
        {activeShadow && (
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 flex items-center justify-between text-xs font-medium text-gray-700 dark:text-gray-300">
                  X Offset
                  <span className="font-mono text-gray-500 dark:text-gray-400">{activeShadow.x}px</span>
                </label>
                <input
                  type="range"
                  min={-50}
                  max={50}
                  value={activeShadow.x}
                  onChange={(e) => updateShadow(activeShadow.id, "x", parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="mb-1 flex items-center justify-between text-xs font-medium text-gray-700 dark:text-gray-300">
                  Y Offset
                  <span className="font-mono text-gray-500 dark:text-gray-400">{activeShadow.y}px</span>
                </label>
                <input
                  type="range"
                  min={-50}
                  max={50}
                  value={activeShadow.y}
                  onChange={(e) => updateShadow(activeShadow.id, "y", parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="mb-1 flex items-center justify-between text-xs font-medium text-gray-700 dark:text-gray-300">
                  Blur Radius
                  <span className="font-mono text-gray-500 dark:text-gray-400">{activeShadow.blur}px</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={50}
                  value={activeShadow.blur}
                  onChange={(e) => updateShadow(activeShadow.id, "blur", parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="mb-1 flex items-center justify-between text-xs font-medium text-gray-700 dark:text-gray-300">
                  Opacity
                  <span className="font-mono text-gray-500 dark:text-gray-400">{activeShadow.opacity}%</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={activeShadow.opacity}
                  onChange={(e) => updateShadow(activeShadow.id, "opacity", parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Shadow Color</label>
              <div className="flex items-center gap-1.5">
                <input
                  type="color"
                  value={activeShadow.color}
                  onChange={(e) => updateShadow(activeShadow.id, "color", e.target.value)}
                  className="h-8 w-8 cursor-pointer rounded border"
                />
                <input
                  type="text"
                  value={activeShadow.color}
                  onChange={(e) => updateShadow(activeShadow.id, "color", e.target.value)}
                  className="w-24 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1 font-mono text-xs"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CSS Output */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">CSS Code</label>
          <CopyButton text={css} />
        </div>
        <pre className="mt-1 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-900 p-3 font-mono text-sm text-green-400">
          {css}
        </pre>
      </div>

      {/* SEO Content */}
      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">CSS Text Shadow</h2>
        <p className="mb-3">
          The <code className="rounded bg-gray-100 dark:bg-gray-800 px-1 py-0.5 text-xs">text-shadow</code> CSS
          property adds shadow effects to text. It accepts values for horizontal offset, vertical
          offset, blur radius, and color. You can apply multiple shadows by separating each shadow
          definition with a comma.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Syntax</h2>
        <pre className="mb-3 rounded-lg bg-gray-100 dark:bg-gray-800 p-3 font-mono text-xs text-gray-800 dark:text-gray-200">
          text-shadow: offset-x offset-y blur-radius color;
        </pre>
        <p className="mb-3">
          Unlike <code className="rounded bg-gray-100 dark:bg-gray-800 px-1 py-0.5 text-xs">box-shadow</code>,
          text-shadow does not support the <code className="rounded bg-gray-100 dark:bg-gray-800 px-1 py-0.5 text-xs">spread</code> or{" "}
          <code className="rounded bg-gray-100 dark:bg-gray-800 px-1 py-0.5 text-xs">inset</code> values. However,
          layering multiple text shadows can produce stunning effects like neon glows, 3D lettering,
          fire effects, retro outlines, and glitch typography.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Performance Tips</h2>
        <p>
          Text shadows with large blur values on long blocks of text can impact rendering
          performance, especially during animations or scrolling. For decorative headings, text
          shadows are ideal. For body text, keep shadow effects subtle or avoid them entirely to
          maintain readability and performance.
        </p>
      </div>
    </ToolLayout>
  );
}
