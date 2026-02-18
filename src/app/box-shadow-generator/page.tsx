"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const PRESETS = [
  { name: "Subtle", x: 0, y: 1, blur: 3, spread: 0, color: "#00000012", inset: false },
  { name: "Medium", x: 0, y: 4, blur: 6, spread: -1, color: "#0000001a", inset: false },
  { name: "Large", x: 0, y: 10, blur: 15, spread: -3, color: "#0000001a", inset: false },
  { name: "XL", x: 0, y: 20, blur: 25, spread: -5, color: "#0000001a", inset: false },
  { name: "Inner", x: 0, y: 2, blur: 4, spread: 0, color: "#0000001a", inset: true },
  { name: "Outline", x: 0, y: 0, blur: 0, spread: 3, color: "#3b82f680", inset: false },
  { name: "Layered", x: 0, y: 1, blur: 2, spread: 0, color: "#0000000d", inset: false },
  { name: "Hard", x: 5, y: 5, blur: 0, spread: 0, color: "#000000", inset: false },
];

export default function BoxShadowGenerator() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(4);
  const [blur, setBlur] = useState(6);
  const [spread, setSpread] = useState(-1);
  const [color, setColor] = useState("#0000001a");
  const [inset, setInset] = useState(false);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [boxColor, setBoxColor] = useState("#ffffff");

  const css = useMemo(() => {
    const parts = [inset ? "inset" : "", `${x}px`, `${y}px`, `${blur}px`, `${spread}px`, color]
      .filter(Boolean)
      .join(" ");
    return `box-shadow: ${parts};`;
  }, [x, y, blur, spread, color, inset]);

  return (
    <ToolLayout
      title="CSS Box Shadow Generator — Visual Editor"
      description="Create CSS box shadows with a visual editor. Adjust offset, blur, spread, and color. Copy ready-to-use CSS code."
      relatedTools={["css-gradient-generator", "color-picker", "css-minifier"]}
    >
      {/* Preview */}
      <div
        className="mb-6 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 p-12"
        style={{ backgroundColor: bgColor }}
      >
        <div
          className="h-32 w-48 rounded-lg"
          style={{
            backgroundColor: boxColor,
            boxShadow: `${inset ? "inset " : ""}${x}px ${y}px ${blur}px ${spread}px ${color}`,
          }}
        />
      </div>

      {/* Controls */}
      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        {[
          { label: "Offset X", value: x, set: setX, min: -50, max: 50 },
          { label: "Offset Y", value: y, set: setY, min: -50, max: 50 },
          { label: "Blur", value: blur, set: setBlur, min: 0, max: 100 },
          { label: "Spread", value: spread, set: setSpread, min: -50, max: 50 },
        ].map((ctrl) => (
          <div key={ctrl.label}>
            <label className="mb-1 flex items-center justify-between text-xs font-medium text-gray-700 dark:text-gray-300">
              {ctrl.label}
              <span className="font-mono text-gray-500 dark:text-gray-400">{ctrl.value}px</span>
            </label>
            <input
              type="range"
              min={ctrl.min}
              max={ctrl.max}
              value={ctrl.value}
              onChange={(e) => ctrl.set(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap gap-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Shadow Color</label>
          <div className="flex gap-1">
            <input type="color" value={color.slice(0, 7)} onChange={(e) => setColor(e.target.value + color.slice(7))} className="h-8 w-8 cursor-pointer rounded border" />
            <input type="text" value={color} onChange={(e) => setColor(e.target.value)} className="w-24 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-2 py-1 font-mono text-xs" />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Background</label>
          <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-8 w-8 cursor-pointer rounded border" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Box Color</label>
          <input type="color" value={boxColor} onChange={(e) => setBoxColor(e.target.value)} className="h-8 w-8 cursor-pointer rounded border" />
        </div>
        <label className="flex items-end gap-1.5 pb-1 text-sm text-gray-600 dark:text-gray-400">
          <input type="checkbox" checked={inset} onChange={(e) => setInset(e.target.checked)} className="rounded border-gray-300 dark:border-gray-600" />
          Inset
        </label>
      </div>

      {/* CSS output */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">CSS Code</label>
          <CopyButton text={css} />
        </div>
        <pre className="mt-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-900 p-3 font-mono text-sm text-green-400">{css}</pre>
      </div>

      {/* Presets */}
      <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">Presets</h3>
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.name}
            onClick={() => { setX(p.x); setY(p.y); setBlur(p.blur); setSpread(p.spread); setColor(p.color); setInset(p.inset); }}
            className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">CSS Box Shadow</h2>
        <p className="mb-3">
          The <code>box-shadow</code> property adds shadow effects to elements. It takes values for
          horizontal offset, vertical offset, blur radius, spread radius, and color. The optional
          <code> inset</code> keyword creates an inner shadow.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Performance Tips</h2>
        <p>
          Box shadows with large blur values can impact rendering performance, especially during
          animations. For better performance, use <code>filter: drop-shadow()</code> for simple
          shadows or pre-render complex shadows as images.
        </p>
      </div>
    
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The CSS Box Shadow Generator is a free online tool available on CodeUtilo. Create box shadows with a visual editor. Adjust offset, blur, spread, and color. All processing happens directly in your browser — no data is ever sent to any server, ensuring your privacy and security. No signup or installation is required.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> — All css box shadow generator operations run locally in your browser using JavaScript. Your data never leaves your device.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Instant Results</strong> — Get results immediately as you type or paste your input. No waiting for server responses or page reloads.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> — Use the css box shadow generator as many times as you need without creating an account or paying anything.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Mobile Friendly</strong> — Works on desktop, tablet, and mobile browsers. Access this tool from any device with an internet connection.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Using the css box shadow generator for day-to-day development tasks</li>
          <li>Saving time on repetitive tasks by using a browser-based tool instead of writing custom code</li>
          <li>Working on projects where installing software is not an option (school, work, shared computers)</li>
          <li>Quick prototyping and debugging without switching to a terminal or IDE</li>
          <li>Sharing the tool link with colleagues who need the same functionality</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Enter your input in the text area provided and the css box shadow generator will process it instantly. Use the Copy button to copy the result to your clipboard. All operations are performed locally in your browser — no data is transmitted to any server.
        </p>
      
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Is the CSS Box Shadow Generator free to use?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes, the CSS Box Shadow Generator is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need.
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
              Yes. The CSS Box Shadow Generator is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Do I need to install anything?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. The CSS Box Shadow Generator runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately.
            </p>
          </details>
        </div>
</div>
    </ToolLayout>
  );
}
