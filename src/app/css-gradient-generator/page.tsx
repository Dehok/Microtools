"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface ColorStop {
  color: string;
  position: number;
}

const PRESETS = [
  { name: "Sunset", stops: [{ color: "#FF6B6B", position: 0 }, { color: "#FFA500", position: 100 }], angle: 135 },
  { name: "Ocean", stops: [{ color: "#667eea", position: 0 }, { color: "#764ba2", position: 100 }], angle: 135 },
  { name: "Mint", stops: [{ color: "#a8e063", position: 0 }, { color: "#56ab2f", position: 100 }], angle: 135 },
  { name: "Aurora", stops: [{ color: "#00d2ff", position: 0 }, { color: "#3a7bd5", position: 100 }], angle: 90 },
  { name: "Fire", stops: [{ color: "#f12711", position: 0 }, { color: "#f5af19", position: 100 }], angle: 45 },
  { name: "Twilight", stops: [{ color: "#0f0c29", position: 0 }, { color: "#302b63", position: 50 }, { color: "#24243e", position: 100 }], angle: 180 },
  { name: "Rainbow", stops: [{ color: "#ff0000", position: 0 }, { color: "#ff8800", position: 20 }, { color: "#ffff00", position: 40 }, { color: "#00ff00", position: 60 }, { color: "#0000ff", position: 80 }, { color: "#8800ff", position: 100 }], angle: 90 },
  { name: "Night Sky", stops: [{ color: "#141E30", position: 0 }, { color: "#243B55", position: 100 }], angle: 180 },
];

export default function CssGradientGenerator() {
  const [type, setType] = useState<"linear" | "radial">("linear");
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState<ColorStop[]>([
    { color: "#667eea", position: 0 },
    { color: "#764ba2", position: 100 },
  ]);

  const css = useMemo(() => {
    const stopsStr = stops.map((s) => `${s.color} ${s.position}%`).join(", ");
    if (type === "linear") {
      return `background: linear-gradient(${angle}deg, ${stopsStr});`;
    }
    return `background: radial-gradient(circle, ${stopsStr});`;
  }, [type, angle, stops]);

  const updateStop = (index: number, field: "color" | "position", value: string | number) => {
    setStops(stops.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  };

  const addStop = () => {
    if (stops.length >= 8) return;
    const lastPos = stops[stops.length - 1]?.position || 0;
    setStops([...stops, { color: "#ffffff", position: Math.min(lastPos + 20, 100) }]);
  };

  const removeStop = (index: number) => {
    if (stops.length <= 2) return;
    setStops(stops.filter((_, i) => i !== index));
  };

  return (
    <ToolLayout
      title="CSS Gradient Generator — Linear & Radial"
      description="Create beautiful CSS gradients with a visual editor. Linear and radial gradients with multiple color stops and presets."
      relatedTools={["color-picker", "hex-rgb-converter", "css-minifier"]}
    >
      {/* Preview */}
      <div
        className="mb-6 h-48 rounded-lg border border-gray-200"
        style={{
          background:
            type === "linear"
              ? `linear-gradient(${angle}deg, ${stops.map((s) => `${s.color} ${s.position}%`).join(", ")})`
              : `radial-gradient(circle, ${stops.map((s) => `${s.color} ${s.position}%`).join(", ")})`,
        }}
      />

      {/* Type & angle */}
      <div className="mb-4 flex flex-wrap gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setType("linear")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              type === "linear" ? "bg-blue-600 text-white" : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Linear
          </button>
          <button
            onClick={() => setType("radial")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              type === "radial" ? "bg-blue-600 text-white" : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Radial
          </button>
        </div>

        {type === "linear" && (
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Angle:</label>
            <input
              type="range"
              min="0"
              max="360"
              value={angle}
              onChange={(e) => setAngle(parseInt(e.target.value))}
              className="w-32"
            />
            <span className="w-12 text-sm font-mono text-gray-700">{angle}°</span>
          </div>
        )}
      </div>

      {/* Color stops */}
      <div className="mb-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Color Stops</h3>
          <button
            onClick={addStop}
            disabled={stops.length >= 8}
            className="rounded border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-40"
          >
            + Add Stop
          </button>
        </div>
        {stops.map((stop, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="color"
              value={stop.color}
              onChange={(e) => updateStop(i, "color", e.target.value)}
              className="h-8 w-8 cursor-pointer rounded border border-gray-300"
            />
            <input
              type="text"
              value={stop.color}
              onChange={(e) => updateStop(i, "color", e.target.value)}
              className="w-24 rounded border border-gray-300 bg-gray-50 px-2 py-1 font-mono text-xs"
            />
            <input
              type="range"
              min="0"
              max="100"
              value={stop.position}
              onChange={(e) => updateStop(i, "position", parseInt(e.target.value))}
              className="flex-1"
            />
            <span className="w-10 text-xs font-mono text-gray-500">{stop.position}%</span>
            {stops.length > 2 && (
              <button
                onClick={() => removeStop(i)}
                className="rounded px-1.5 py-0.5 text-xs text-red-500 hover:bg-red-50"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      {/* CSS output */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">CSS Code</label>
          <CopyButton text={css} />
        </div>
        <pre className="mt-1 rounded-lg border border-gray-200 bg-gray-900 p-3 font-mono text-sm text-green-400">
          {css}
        </pre>
      </div>

      {/* Presets */}
      <h3 className="mb-2 text-sm font-semibold text-gray-900">Presets</h3>
      <div className="mb-4 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.name}
            onClick={() => { setStops(p.stops); setAngle(p.angle); setType("linear"); }}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
          >
            <span
              className="inline-block h-4 w-4 rounded"
              style={{
                background: `linear-gradient(${p.angle}deg, ${p.stops.map((s) => `${s.color} ${s.position}%`).join(", ")})`,
              }}
            />
            {p.name}
          </button>
        ))}
      </div>

      <div className="mt-8 border-t border-gray-200 pt-6 text-sm text-gray-600">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">CSS Gradients</h2>
        <p className="mb-3">
          CSS gradients create smooth color transitions. <strong>Linear gradients</strong> flow in
          a straight line at a specified angle. <strong>Radial gradients</strong> radiate outward
          from a center point. Both support multiple color stops.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Browser Support</h2>
        <p>
          CSS gradients are supported in all modern browsers without vendor prefixes. They render
          at any resolution (vector-based), making them perfect for backgrounds, buttons, and
          decorative elements.
        </p>
      </div>
    </ToolLayout>
  );
}
