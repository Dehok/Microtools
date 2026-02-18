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
        className="mb-6 h-48 rounded-lg border border-gray-200 dark:border-gray-700"
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
              type === "linear" ? "bg-blue-600 text-white" : "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
            }`}
          >
            Linear
          </button>
          <button
            onClick={() => setType("radial")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              type === "radial" ? "bg-blue-600 text-white" : "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
            }`}
          >
            Radial
          </button>
        </div>

        {type === "linear" && (
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">Angle:</label>
            <input
              type="range"
              min="0"
              max="360"
              value={angle}
              onChange={(e) => setAngle(parseInt(e.target.value))}
              className="w-32"
            />
            <span className="w-12 text-sm font-mono text-gray-700 dark:text-gray-300">{angle}°</span>
          </div>
        )}
      </div>

      {/* Color stops */}
      <div className="mb-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Color Stops</h3>
          <button
            onClick={addStop}
            disabled={stops.length >= 8}
            className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800 disabled:opacity-40"
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
              className="h-8 w-8 cursor-pointer rounded border border-gray-300 dark:border-gray-600"
            />
            <input
              type="text"
              value={stop.color}
              onChange={(e) => updateStop(i, "color", e.target.value)}
              className="w-24 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-2 py-1 font-mono text-xs"
            />
            <input
              type="range"
              min="0"
              max="100"
              value={stop.position}
              onChange={(e) => updateStop(i, "position", parseInt(e.target.value))}
              className="flex-1"
            />
            <span className="w-10 text-xs font-mono text-gray-500 dark:text-gray-400">{stop.position}%</span>
            {stops.length > 2 && (
              <button
                onClick={() => removeStop(i)}
                className="rounded px-1.5 py-0.5 text-xs text-red-500 dark:text-red-400 hover:bg-red-50 dark:bg-red-950 dark:hover:bg-red-950"
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
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">CSS Code</label>
          <CopyButton text={css} />
        </div>
        <pre className="mt-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-900 p-3 font-mono text-sm text-green-400">
          {css}
        </pre>
      </div>

      {/* Presets */}
      <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">Presets</h3>
      <div className="mb-4 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.name}
            onClick={() => { setStops(p.stops); setAngle(p.angle); setType("linear"); }}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
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

      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">CSS Gradients</h2>
        <p className="mb-3">
          CSS gradients create smooth color transitions. <strong>Linear gradients</strong> flow in
          a straight line at a specified angle. <strong>Radial gradients</strong> radiate outward
          from a center point. Both support multiple color stops.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Browser Support</h2>
        <p>
          CSS gradients are supported in all modern browsers without vendor prefixes. They render
          at any resolution (vector-based), making them perfect for backgrounds, buttons, and
          decorative elements.
        </p>
      </div>
    
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The CSS Gradient Generator is a free online tool available on CodeUtilo. Create CSS linear and radial gradients with a visual editor and presets. All processing happens directly in your browser — no data is ever sent to any server, ensuring your privacy and security. No signup or installation is required.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> — All css gradient generator operations run locally in your browser using JavaScript. Your data never leaves your device.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Instant Results</strong> — Get results immediately as you type or paste your input. No waiting for server responses or page reloads.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> — Use the css gradient generator as many times as you need without creating an account or paying anything.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Mobile Friendly</strong> — Works on desktop, tablet, and mobile browsers. Access this tool from any device with an internet connection.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Using the css gradient generator for day-to-day development tasks</li>
          <li>Saving time on repetitive tasks by using a browser-based tool instead of writing custom code</li>
          <li>Working on projects where installing software is not an option (school, work, shared computers)</li>
          <li>Quick prototyping and debugging without switching to a terminal or IDE</li>
          <li>Sharing the tool link with colleagues who need the same functionality</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Enter your input in the text area provided and the css gradient generator will process it instantly. Use the Copy button to copy the result to your clipboard. All operations are performed locally in your browser — no data is transmitted to any server.
        </p>
      
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Is the CSS Gradient Generator free to use?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes, the CSS Gradient Generator is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need.
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
              Yes. The CSS Gradient Generator is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Do I need to install anything?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. The CSS Gradient Generator runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately.
            </p>
          </details>
        </div>
</div>
    </ToolLayout>
  );
}
