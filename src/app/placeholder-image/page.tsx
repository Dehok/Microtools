"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function PlaceholderImage() {
  const [width, setWidth] = useState("600");
  const [height, setHeight] = useState("400");
  const [bgColor, setBgColor] = useState("#e2e8f0");
  const [textColor, setTextColor] = useState("#64748b");
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState("auto");

  const displayText = text || `${width}×${height}`;
  const computedFontSize =
    fontSize === "auto"
      ? Math.max(12, Math.min(parseInt(width) || 600, parseInt(height) || 400) / 8)
      : parseInt(fontSize);

  const svg = useMemo(() => {
    const w = parseInt(width) || 600;
    const h = parseInt(height) || 400;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="100%" height="100%" fill="${bgColor}"/>
  <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-family="Arial, sans-serif" font-size="${computedFontSize}" fill="${textColor}">${displayText}</text>
</svg>`;
  }, [width, height, bgColor, textColor, displayText, computedFontSize]);

  const dataUri = useMemo(() => {
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }, [svg]);

  const imgTag = `<img src="${dataUri}" alt="${displayText}" width="${width}" height="${height}" />`;

  return (
    <ToolLayout
      title="Placeholder Image Generator — SVG Placeholders"
      description="Generate lightweight SVG placeholder images with custom dimensions, colors, and text. No external service needed."
      relatedTools={["color-picker", "aspect-ratio-calculator", "lorem-ipsum-generator"]}
    >
      <div className="grid gap-6 md:grid-cols-2">
        {/* Controls */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">Width (px)</label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">Height (px)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">Background</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="h-9 w-9 cursor-pointer rounded border border-gray-300"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-2 py-1 font-mono text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">Text Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="h-9 w-9 cursor-pointer rounded border border-gray-300"
                />
                <input
                  type="text"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-2 py-1 font-mono text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">
              Custom Text (empty = dimensions)
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={`${width}×${height}`}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">Font Size</label>
            <select
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="auto">Auto</option>
              <option value="12">12px</option>
              <option value="16">16px</option>
              <option value="24">24px</option>
              <option value="32">32px</option>
              <option value="48">48px</option>
              <option value="64">64px</option>
            </select>
          </div>

          {/* Quick sizes */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">Quick Sizes</label>
            <div className="flex flex-wrap gap-1">
              {[
                ["150", "150"],
                ["300", "200"],
                ["600", "400"],
                ["800", "600"],
                ["1200", "630"],
                ["1920", "1080"],
                ["1080", "1080"],
                ["1080", "1920"],
              ].map(([w, h]) => (
                <button
                  key={`${w}x${h}`}
                  onClick={() => { setWidth(w); setHeight(h); }}
                  className="rounded border border-gray-200 bg-white px-2 py-1 text-[10px] font-mono text-gray-600 hover:bg-gray-50"
                >
                  {w}×{h}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Preview */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Preview</label>
          <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-white p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={dataUri}
              alt={displayText}
              className="max-h-64 max-w-full"
            />
          </div>
        </div>
      </div>

      {/* Output codes */}
      <div className="mt-6 space-y-3">
        <div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">SVG Code</label>
            <CopyButton text={svg} />
          </div>
          <pre className="mt-1 max-h-24 overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-3 font-mono text-xs">
            {svg}
          </pre>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Data URI</label>
            <CopyButton text={dataUri} />
          </div>
          <div className="mt-1 max-h-16 overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-3 font-mono text-xs break-all">
            {dataUri}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">HTML &lt;img&gt; Tag</label>
            <CopyButton text={imgTag} />
          </div>
          <div className="mt-1 max-h-16 overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-3 font-mono text-xs break-all">
            {imgTag}
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-gray-200 pt-6 text-sm text-gray-600">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Why SVG Placeholders?</h2>
        <p className="mb-3">
          SVG placeholder images are lightweight (just a few bytes of text), infinitely scalable,
          and require no external server or service. They work offline and load instantly.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Use Cases</h2>
        <p>
          Use placeholder images during web development, in mockups and wireframes, as fallback
          images, in documentation, or for testing responsive layouts with different image sizes.
        </p>
      </div>
    </ToolLayout>
  );
}
