"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

const PRESETS = [
  { label: "16:9 (HD)", w: 1920, h: 1080 },
  { label: "4:3 (Classic)", w: 1024, h: 768 },
  { label: "1:1 (Square)", w: 1080, h: 1080 },
  { label: "21:9 (Ultra-wide)", w: 2560, h: 1080 },
  { label: "9:16 (Story/Reel)", w: 1080, h: 1920 },
  { label: "3:2 (Photo)", w: 1500, h: 1000 },
  { label: "4:5 (Instagram)", w: 1080, h: 1350 },
  { label: "2:1 (Twitter header)", w: 1500, h: 750 },
];

export default function AspectRatioCalculator() {
  const [width, setWidth] = useState("1920");
  const [height, setHeight] = useState("1080");
  const [lockRatio, setLockRatio] = useState(false);
  const [targetW, setTargetW] = useState("1280");
  const [targetH, setTargetH] = useState("");

  const ratio = useMemo(() => {
    const w = parseInt(width);
    const h = parseInt(height);
    if (!w || !h || w <= 0 || h <= 0) return null;
    const d = gcd(w, h);
    return { x: w / d, y: h / d, decimal: (w / h).toFixed(4) };
  }, [width, height]);

  const scaled = useMemo(() => {
    if (!ratio) return null;
    const tw = parseInt(targetW);
    const th = parseInt(targetH);
    if (tw && tw > 0) {
      return { w: tw, h: Math.round(tw / (ratio.x / ratio.y)) };
    }
    if (th && th > 0) {
      return { w: Math.round(th * (ratio.x / ratio.y)), h: th };
    }
    return null;
  }, [ratio, targetW, targetH]);

  const handleTargetW = (val: string) => {
    setTargetW(val);
    setTargetH("");
  };

  const handleTargetH = (val: string) => {
    setTargetH(val);
    setTargetW("");
  };

  return (
    <ToolLayout
      title="Aspect Ratio Calculator — Resize & Scale"
      description="Calculate aspect ratios, resize dimensions proportionally, and find equivalent sizes. Free online calculator for designers."
      relatedTools={["color-picker", "css-minifier", "number-base-converter"]}
    >
      {/* Main dimensions */}
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Width</label>
          <input
            type="number"
            value={width}
            onChange={(e) => {
              setWidth(e.target.value);
              if (lockRatio && ratio) {
                const w = parseInt(e.target.value);
                if (w > 0) setHeight(Math.round(w / (ratio.x / ratio.y)).toString());
              }
            }}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-2 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Height</label>
          <input
            type="number"
            value={height}
            onChange={(e) => {
              setHeight(e.target.value);
              if (lockRatio && ratio) {
                const h = parseInt(e.target.value);
                if (h > 0) setWidth(Math.round(h * (ratio.x / ratio.y)).toString());
              }
            }}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-2 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
          />
        </div>
      </div>

      <label className="mb-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <input
          type="checkbox"
          checked={lockRatio}
          onChange={(e) => setLockRatio(e.target.checked)}
          className="rounded border-gray-300 dark:border-gray-600"
        />
        Lock aspect ratio when changing dimensions
      </label>

      {/* Result */}
      {ratio && (
        <div className="mb-6 rounded-lg border border-blue-100 bg-blue-50 dark:bg-blue-950 p-4 text-center">
          <div className="mb-1 text-sm font-medium text-blue-600 dark:text-blue-400">Aspect Ratio</div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl font-bold text-blue-800 dark:text-blue-200">
              {ratio.x}:{ratio.y}
            </span>
            <CopyButton text={`${ratio.x}:${ratio.y}`} />
          </div>
          <div className="mt-1 text-sm text-blue-600 dark:text-blue-400">Decimal: {ratio.decimal}</div>
        </div>
      )}

      {/* Scale calculator */}
      {ratio && (
        <div className="mb-6">
          <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">Scale to New Size</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">New width</label>
              <input
                type="number"
                value={targetW}
                onChange={(e) => handleTargetW(e.target.value)}
                placeholder="Enter width..."
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-2 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">New height</label>
              <input
                type="number"
                value={targetH}
                onChange={(e) => handleTargetH(e.target.value)}
                placeholder="Enter height..."
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-2 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
              />
            </div>
          </div>
          {scaled && (
            <div className="mt-2 flex items-center gap-2 rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950 px-4 py-2 text-sm text-green-700 dark:text-green-300">
              <span>
                Scaled size: <strong>{scaled.w} × {scaled.h}</strong>
              </span>
              <CopyButton text={`${scaled.w}x${scaled.h}`} />
            </div>
          )}
        </div>
      )}

      {/* Presets */}
      <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">Common Ratios</h3>
      <div className="mb-4 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => {
              setWidth(p.w.toString());
              setHeight(p.h.toString());
            }}
            className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">What is Aspect Ratio?</h2>
        <p className="mb-3">
          Aspect ratio is the proportional relationship between width and height. It is expressed
          as two numbers separated by a colon (e.g., 16:9). Maintaining aspect ratio when resizing
          prevents images and videos from being stretched or distorted.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Common Aspect Ratios</h2>
        <p>
          <strong>16:9</strong> is standard for HD video and monitors. <strong>4:3</strong> is the classic
          TV/monitor format. <strong>1:1</strong> is square (Instagram posts). <strong>9:16</strong> is
          vertical (Stories, Reels, TikTok). <strong>21:9</strong> is ultra-wide cinema format.
        </p>
      </div>
    
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The Aspect Ratio Calculator is a free online tool available on CodeUtilo. Calculate aspect ratios and resize dimensions proportionally. All processing happens directly in your browser — no data is ever sent to any server, ensuring your privacy and security. No signup or installation is required.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> — All aspect ratio calculator operations run locally in your browser using JavaScript. Your data never leaves your device.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Instant Results</strong> — Get results immediately as you type or paste your input. No waiting for server responses or page reloads.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> — Use the aspect ratio calculator as many times as you need without creating an account or paying anything.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Mobile Friendly</strong> — Works on desktop, tablet, and mobile browsers. Access this tool from any device with an internet connection.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Using the aspect ratio calculator for day-to-day development tasks</li>
          <li>Saving time on repetitive tasks by using a browser-based tool instead of writing custom code</li>
          <li>Working on projects where installing software is not an option (school, work, shared computers)</li>
          <li>Quick prototyping and debugging without switching to a terminal or IDE</li>
          <li>Sharing the tool link with colleagues who need the same functionality</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Enter your input in the text area provided and the aspect ratio calculator will process it instantly. Use the Copy button to copy the result to your clipboard. All operations are performed locally in your browser — no data is transmitted to any server.
        </p>
      
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Is the Aspect Ratio Calculator free to use?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes, the Aspect Ratio Calculator is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need.
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
              Yes. The Aspect Ratio Calculator is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Do I need to install anything?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. The Aspect Ratio Calculator runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately.
            </p>
          </details>
        </div>
</div>
    </ToolLayout>
  );
}
