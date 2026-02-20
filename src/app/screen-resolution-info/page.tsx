"use client";

import { useState, useEffect, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";

interface ScreenInfo {
  screenWidth: number;
  screenHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  availWidth: number;
  availHeight: number;
  devicePixelRatio: number;
  colorDepth: number;
  pixelDepth: number;
  orientation: string;
  touchPoints: number;
  userAgent: string;
  platform: string;
  language: string;
  onLine: boolean;
  cookieEnabled: boolean;
}

function getScreenInfo(): ScreenInfo {
  const orientation =
    typeof screen !== "undefined" && screen.orientation
      ? screen.orientation.type
      : window.matchMedia("(orientation: portrait)").matches
      ? "portrait-primary"
      : "landscape-primary";

  return {
    screenWidth: screen.width,
    screenHeight: screen.height,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    availWidth: screen.availWidth,
    availHeight: screen.availHeight,
    devicePixelRatio: window.devicePixelRatio,
    colorDepth: screen.colorDepth,
    pixelDepth: screen.pixelDepth,
    orientation,
    touchPoints: navigator.maxTouchPoints,
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    onLine: navigator.onLine,
    cookieEnabled: navigator.cookieEnabled,
  };
}

function InfoCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string | number | boolean;
  highlight?: boolean;
}) {
  const displayValue =
    typeof value === "boolean" ? (value ? "Yes" : "No") : String(value);

  return (
    <div
      className={`rounded-lg border p-3 ${
        highlight
          ? "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950"
          : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950"
      }`}
    >
      <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {label}
      </div>
      <div
        className={`break-all font-mono text-sm ${
          highlight ? "font-bold text-blue-800 dark:text-blue-200" : "text-gray-800 dark:text-gray-200"
        }`}
      >
        {displayValue}
      </div>
    </div>
  );
}

function renderVisualRepresentation(info: ScreenInfo) {
  const MAX_WIDTH = 280;
  const MAX_HEIGHT = 160;

  const scaleX = MAX_WIDTH / info.screenWidth;
  const scaleY = MAX_HEIGHT / info.screenHeight;
  const scale = Math.min(scaleX, scaleY);

  const screenW = Math.round(info.screenWidth * scale);
  const screenH = Math.round(info.screenHeight * scale);
  const viewW = Math.min(Math.round(info.viewportWidth * scale), screenW);
  const viewH = Math.min(Math.round(info.viewportHeight * scale), screenH);

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="relative rounded border-2 border-gray-400 bg-gray-200 dark:bg-gray-700"
        style={{ width: screenW, height: screenH }}
        title={`Screen: ${info.screenWidth} x ${info.screenHeight}`}
      >
        <div
          className="absolute left-0 top-0 rounded border-2 border-blue-500 dark:border-blue-400 bg-blue-200 opacity-70"
          style={{ width: viewW, height: viewH }}
          title={`Viewport: ${info.viewportWidth} x ${info.viewportHeight}`}
        />
        <span className="absolute bottom-1 right-1 text-[9px] font-bold text-gray-600 dark:text-gray-400">
          Screen
        </span>
        {viewW > 30 && viewH > 14 && (
          <span className="absolute left-1 top-1 text-[9px] font-bold text-blue-700 dark:text-blue-300">
            Viewport
          </span>
        )}
      </div>
      <div className="flex gap-4 text-xs text-gray-600 dark:text-gray-400">
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded border-2 border-gray-400 bg-gray-200 dark:bg-gray-700" />
          Screen ({info.screenWidth}&times;{info.screenHeight})
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded border-2 border-blue-500 dark:border-blue-400 bg-blue-200" />
          Viewport ({info.viewportWidth}&times;{info.viewportHeight})
        </span>
      </div>
    </div>
  );
}

export default function ScreenResolutionInfo() {
  const [info, setInfo] = useState<ScreenInfo | null>(null);
  const [copied, setCopied] = useState(false);

  const refreshInfo = useCallback(() => {
    setInfo(getScreenInfo());
  }, []);

  useEffect(() => {
    const initialTimer = window.setTimeout(refreshInfo, 0);
    window.addEventListener("resize", refreshInfo);
    window.addEventListener("online", refreshInfo);
    window.addEventListener("offline", refreshInfo);
    return () => {
      window.clearTimeout(initialTimer);
      window.removeEventListener("resize", refreshInfo);
      window.removeEventListener("online", refreshInfo);
      window.removeEventListener("offline", refreshInfo);
    };
  }, [refreshInfo]);

  const buildCopyText = useCallback(() => {
    if (!info) return "";
    return [
      `Screen Resolution:     ${info.screenWidth} x ${info.screenHeight} px`,
      `Viewport Size:         ${info.viewportWidth} x ${info.viewportHeight} px`,
      `Available Screen:      ${info.availWidth} x ${info.availHeight} px`,
      `Device Pixel Ratio:    ${info.devicePixelRatio}`,
      `Color Depth:           ${info.colorDepth} bit`,
      `Pixel Depth:           ${info.pixelDepth} bit`,
      `Orientation:           ${info.orientation}`,
      `Touch Support:         ${info.touchPoints} point(s)`,
      `Platform:              ${info.platform}`,
      `Language:              ${info.language}`,
      `Online Status:         ${info.onLine ? "Online" : "Offline"}`,
      `Cookies Enabled:       ${info.cookieEnabled ? "Yes" : "No"}`,
      `User Agent:            ${info.userAgent}`,
    ].join("\n");
  }, [info]);

  const handleCopyAll = useCallback(async () => {
    const text = buildCopyText();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [buildCopyText]);

  if (!info) {
    return (
      <ToolLayout
        title="Screen Resolution Info"
        description="Instantly detect your screen resolution, viewport size, device pixel ratio, and other display properties."
        relatedTools={["aspect-ratio-calculator", "color-picker", "keyboard-event-tester"]}
      >
        <div className="py-12 text-center text-gray-500 dark:text-gray-400">Loading display info...</div>
      </ToolLayout>
    );
  }

  return (
    <ToolLayout
      title="Screen Resolution Info"
      description="Instantly detect your screen resolution, viewport size, device pixel ratio, and other display properties."
      relatedTools={["aspect-ratio-calculator", "color-picker", "keyboard-event-tester"]}
    >
      {/* Visual representation */}
      <div className="mb-6 flex flex-col items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 p-4">
        <h2 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          Screen vs Viewport (scaled)
        </h2>
        {renderVisualRepresentation(info)}
      </div>

      {/* Copy All button */}
      <div className="mb-5 flex justify-end">
        <button
          onClick={handleCopyAll}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            copied
              ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border border-green-300"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {copied ? "Copied!" : "Copy All"}
        </button>
      </div>

      {/* Display info */}
      <div className="mb-4">
        <h2 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
          Display
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <InfoCard
            label="Screen Resolution"
            value={`${info.screenWidth} x ${info.screenHeight} px`}
            highlight
          />
          <InfoCard
            label="Viewport Size"
            value={`${info.viewportWidth} x ${info.viewportHeight} px`}
            highlight
          />
          <InfoCard
            label="Available Screen"
            value={`${info.availWidth} x ${info.availHeight} px`}
          />
          <InfoCard
            label="Device Pixel Ratio"
            value={info.devicePixelRatio}
            highlight
          />
          <InfoCard
            label="Color Depth"
            value={`${info.colorDepth} bit`}
          />
          <InfoCard
            label="Pixel Depth"
            value={`${info.pixelDepth} bit`}
          />
          <InfoCard
            label="Orientation"
            value={info.orientation}
          />
          <InfoCard
            label="Touch Support"
            value={
              info.touchPoints === 0
                ? "None (mouse)"
                : `${info.touchPoints} point(s)`
            }
          />
        </div>
      </div>

      {/* Browser / System info */}
      <div className="mb-4">
        <h2 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
          Browser &amp; System
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <InfoCard label="Platform" value={info.platform} />
          <InfoCard label="Language" value={info.language} />
          <InfoCard label="Online Status" value={info.onLine ? "Online" : "Offline"} />
          <InfoCard label="Cookies Enabled" value={info.cookieEnabled} />
        </div>
      </div>

      {/* User Agent */}
      <div className="mb-2">
        <h2 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
          User Agent
        </h2>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 p-3">
          <p className="break-all font-mono text-xs text-gray-700 dark:text-gray-300">{info.userAgent}</p>
        </div>
      </div>

      {/* Live update notice */}
      <p className="mt-3 text-right text-xs text-gray-400 dark:text-gray-500">
        Values update automatically on window resize.
      </p>

      {/* SEO content */}
      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          What is Screen Resolution?
        </h2>
        <p>
          Screen resolution refers to the total number of pixels displayed on your monitor,
          expressed as width &times; height (e.g., 1920&times;1080). A higher resolution means
          more pixels are packed into the display, resulting in sharper and more detailed images.
          This tool reads the value directly from <code className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">screen.width</code> and{" "}
          <code className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">screen.height</code> via the browser&rsquo;s Web API.
        </p>

        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Screen Resolution vs Viewport Size
        </h2>
        <p>
          The <strong>screen resolution</strong> is the physical resolution of your entire monitor.
          The <strong>viewport size</strong> is the visible area of the browser window (
          <code className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">window.innerWidth</code> &times;{" "}
          <code className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">window.innerHeight</code>), which changes when you resize
          the browser or open developer tools. Web developers use the viewport size to design
          responsive layouts that adapt to different screen sizes.
        </p>

        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          What is Device Pixel Ratio (DPR)?
        </h2>
        <p>
          Device Pixel Ratio (DPR) is the ratio of physical pixels to CSS logical pixels on your
          screen. A DPR of 2 (common on Retina/HiDPI displays) means one CSS pixel maps to a 2&times;2
          block of physical pixels, making text and images appear sharper. DPR is important for
          serving correctly scaled images (using <code className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">srcset</code>) and
          for canvas-based rendering.
        </p>

        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Why Check Your Display Info?
        </h2>
        <p>
          Knowing your screen resolution and viewport dimensions is useful for web developers,
          designers, and QA testers when debugging responsive design issues, reporting bugs,
          or optimizing layouts. This tool detects all relevant display properties in real time
          directly in your browser — no installation or permissions required.
        </p>
      </div>
    
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The Screen Resolution Info is a free online tool available on CodeUtilo. View your screen resolution, viewport size, DPR, color depth, and device info. All processing happens directly in your browser — no data is ever sent to any server, ensuring your privacy and security. No signup or installation is required.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> — All screen resolution info operations run locally in your browser using JavaScript. Your data never leaves your device.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Instant Results</strong> — Get results immediately as you type or paste your input. No waiting for server responses or page reloads.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> — Use the screen resolution info as many times as you need without creating an account or paying anything.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Mobile Friendly</strong> — Works on desktop, tablet, and mobile browsers. Access this tool from any device with an internet connection.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Using the screen resolution info for day-to-day development tasks</li>
          <li>Saving time on repetitive tasks by using a browser-based tool instead of writing custom code</li>
          <li>Working on projects where installing software is not an option (school, work, shared computers)</li>
          <li>Quick prototyping and debugging without switching to a terminal or IDE</li>
          <li>Sharing the tool link with colleagues who need the same functionality</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Enter your input in the text area provided and the screen resolution info will process it instantly. Use the Copy button to copy the result to your clipboard. All operations are performed locally in your browser — no data is transmitted to any server.
        </p>
      
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Is the Screen Resolution Info free to use?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes, the Screen Resolution Info is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need.
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
              Yes. The Screen Resolution Info is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Do I need to install anything?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. The Screen Resolution Info runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately.
            </p>
          </details>
        </div>
</div>
    </ToolLayout>
  );
}
