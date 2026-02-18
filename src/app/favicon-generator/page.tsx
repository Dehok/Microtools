"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function FaviconGenerator() {
  const [emoji, setEmoji] = useState("🚀");
  const [text, setText] = useState("");
  const [bgColor, setBgColor] = useState("#3b82f6");
  const [textColor, setTextColor] = useState("#ffffff");
  const [shape, setShape] = useState<"circle" | "square" | "rounded">("rounded");
  const [fontSize, setFontSize] = useState(28);

  const displayChar = text || emoji;

  const svg = useMemo(() => {
    const size = 48;
    const radius = shape === "circle" ? size / 2 : shape === "rounded" ? 8 : 0;

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${radius}" fill="${bgColor}"/>
  <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-family="Arial, sans-serif" font-size="${fontSize}" fill="${textColor}">${displayChar}</text>
</svg>`;
  }, [bgColor, textColor, shape, fontSize, displayChar]);

  const dataUri = useMemo(() => {
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }, [svg]);

  const htmlLink = `<link rel="icon" href="${dataUri}" type="image/svg+xml" />`;

  const svgFavicon = `<link rel="icon" href="/favicon.svg" type="image/svg+xml" />`;

  return (
    <ToolLayout
      title="Favicon Generator — SVG Favicon Maker"
      description="Generate SVG favicons with emoji, text, or initials. Copy the SVG or data URI for instant use. No upload needed."
      relatedTools={["placeholder-image", "color-picker", "og-meta-generator"]}
    >
      <div className="grid gap-6 md:grid-cols-2">
        {/* Controls */}
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Emoji (click to pick)</label>
            <div className="flex flex-wrap gap-1">
              {["🚀", "⚡", "🔥", "💡", "🎯", "⭐", "🌍", "💎", "🎉", "🛠️", "📦", "🎨"].map((e) => (
                <button
                  key={e}
                  onClick={() => { setEmoji(e); setText(""); }}
                  className={`rounded border px-2 py-1 text-lg ${emoji === e && !text ? "border-blue-300 bg-blue-50 dark:bg-blue-950" : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Or custom text / initials</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 2))}
              placeholder="MT"
              maxLength={2}
              className="w-24 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-2 text-center text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Background</label>
              <div className="flex gap-1">
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-8 w-8 cursor-pointer rounded border" />
                <input type="text" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="flex-1 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-2 py-1 font-mono text-xs" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Text Color</label>
              <div className="flex gap-1">
                <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="h-8 w-8 cursor-pointer rounded border" />
                <input type="text" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="flex-1 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-2 py-1 font-mono text-xs" />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Shape</label>
            <div className="flex gap-2">
              {(["square", "rounded", "circle"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setShape(s)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                    shape === s ? "bg-blue-600 text-white" : "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Font Size: {fontSize}px</label>
            <input type="range" min="12" max="40" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} className="w-full" />
          </div>
        </div>

        {/* Preview */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Preview</label>
          <div className="mb-4 flex items-center gap-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
            <div className="text-center">
              <div className="mb-1 text-xs text-gray-400 dark:text-gray-500">48×48</div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={dataUri} alt="Favicon 48px" width={48} height={48} />
            </div>
            <div className="text-center">
              <div className="mb-1 text-xs text-gray-400 dark:text-gray-500">32×32</div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={dataUri} alt="Favicon 32px" width={32} height={32} />
            </div>
            <div className="text-center">
              <div className="mb-1 text-xs text-gray-400 dark:text-gray-500">16×16</div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={dataUri} alt="Favicon 16px" width={16} height={16} />
            </div>
            <div className="text-center">
              <div className="mb-1 text-xs text-gray-400 dark:text-gray-500">Browser tab</div>
              <div className="flex items-center gap-1 rounded-t bg-gray-100 dark:bg-gray-800 px-2 py-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={dataUri} alt="Tab" width={16} height={16} />
                <span className="text-xs text-gray-600 dark:text-gray-400">My Page</span>
              </div>
            </div>
          </div>

          {/* Outputs */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">SVG Code</label>
                <CopyButton text={svg} />
              </div>
              <pre className="mt-1 max-h-20 overflow-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 p-2 font-mono text-[10px]">{svg}</pre>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">HTML (inline data URI)</label>
                <CopyButton text={htmlLink} />
              </div>
              <pre className="mt-1 max-h-16 overflow-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 p-2 font-mono text-[10px] break-all">{htmlLink}</pre>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">HTML (external file)</label>
                <CopyButton text={svgFavicon} />
              </div>
              <pre className="mt-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 p-2 font-mono text-[10px]">{svgFavicon}</pre>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Why SVG Favicons?</h2>
        <p className="mb-3">
          SVG favicons are lightweight, scalable, and supported by all modern browsers.
          They look crisp on any display density and can even respond to dark mode with CSS
          media queries inside the SVG.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">How to Use</h2>
        <p>
          Save the SVG code as <code>favicon.svg</code> in your public folder, or use the inline
          data URI directly in your HTML head. SVG favicons are supported in Chrome, Firefox,
          Edge, and Safari 15+.
        </p>
      </div>
    
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The Favicon Generator is a free online tool available on CodeUtilo. Generate SVG favicons with emoji, text, or initials. No upload needed. All processing happens directly in your browser — no data is ever sent to any server, ensuring your privacy and security. No signup or installation is required.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> — All favicon generator operations run locally in your browser using JavaScript. Your data never leaves your device.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Instant Results</strong> — Get results immediately as you type or paste your input. No waiting for server responses or page reloads.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> — Use the favicon generator as many times as you need without creating an account or paying anything.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Mobile Friendly</strong> — Works on desktop, tablet, and mobile browsers. Access this tool from any device with an internet connection.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Using the favicon generator for day-to-day development tasks</li>
          <li>Saving time on repetitive tasks by using a browser-based tool instead of writing custom code</li>
          <li>Working on projects where installing software is not an option (school, work, shared computers)</li>
          <li>Quick prototyping and debugging without switching to a terminal or IDE</li>
          <li>Sharing the tool link with colleagues who need the same functionality</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Enter your input in the text area provided and the favicon generator will process it instantly. Use the Copy button to copy the result to your clipboard. All operations are performed locally in your browser — no data is transmitted to any server.
        </p>
      
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Is the Favicon Generator free to use?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes, the Favicon Generator is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need.
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
              Yes. The Favicon Generator is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Do I need to install anything?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. The Favicon Generator runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately.
            </p>
          </details>
        </div>
</div>
    </ToolLayout>
  );
}
