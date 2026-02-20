"use client";

import { useMemo, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface FingerprintData {
  userAgent: string;
  language: string;
  languages: string;
  platform: string;
  hardwareConcurrency: number | "unknown";
  deviceMemory: number | "unknown";
  maxTouchPoints: number;
  colorDepth: number;
  screenResolution: string;
  viewport: string;
  devicePixelRatio: number;
  timezone: string;
  timezoneOffsetMinutes: number;
  doNotTrack: string;
  cookiesEnabled: boolean;
  canvasHash: string;
  webglVendor: string;
  webglRenderer: string;
  prefersColorScheme: string;
  prefersReducedMotion: string;
}

function hashString(input: string) {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function getCanvasHash() {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 280;
    canvas.height = 70;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "unavailable";

    ctx.textBaseline = "top";
    ctx.font = "16px Arial";
    ctx.fillStyle = "#f60";
    ctx.fillRect(10, 10, 120, 35);
    ctx.fillStyle = "#069";
    ctx.fillText("CodeUtilo fingerprint test", 12, 14);
    ctx.strokeStyle = "rgba(102, 204, 0, 0.8)";
    ctx.arc(220, 30, 18, 0, Math.PI * 2, true);
    ctx.stroke();

    return hashString(canvas.toDataURL());
  } catch {
    return "unavailable";
  }
}

function getWebglInfo() {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      (canvas.getContext("webgl") as WebGLRenderingContext | null) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl) {
      return { vendor: "unavailable", renderer: "unavailable" };
    }

    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info") as
      | { UNMASKED_VENDOR_WEBGL: number; UNMASKED_RENDERER_WEBGL: number }
      | null;

    if (!debugInfo) {
      return { vendor: "available (masked)", renderer: "available (masked)" };
    }

    const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) as string;
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string;
    return { vendor: vendor || "unknown", renderer: renderer || "unknown" };
  } catch {
    return { vendor: "unavailable", renderer: "unavailable" };
  }
}

function collectFingerprint(): FingerprintData {
  const nav = navigator as Navigator & { deviceMemory?: number };
  const webgl = getWebglInfo();
  const doNotTrack =
    navigator.doNotTrack ??
    (window as Window & { doNotTrack?: string }).doNotTrack ??
    (navigator as Navigator & { msDoNotTrack?: string }).msDoNotTrack ??
    "unspecified";

  return {
    userAgent: navigator.userAgent || "unknown",
    language: navigator.language || "unknown",
    languages: navigator.languages?.join(", ") || "unknown",
    platform: navigator.platform || "unknown",
    hardwareConcurrency: navigator.hardwareConcurrency || "unknown",
    deviceMemory: nav.deviceMemory ?? "unknown",
    maxTouchPoints: navigator.maxTouchPoints || 0,
    colorDepth: screen.colorDepth || 0,
    screenResolution: `${screen.width} x ${screen.height}`,
    viewport: `${window.innerWidth} x ${window.innerHeight}`,
    devicePixelRatio: window.devicePixelRatio || 1,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown",
    timezoneOffsetMinutes: new Date().getTimezoneOffset(),
    doNotTrack,
    cookiesEnabled: navigator.cookieEnabled,
    canvasHash: getCanvasHash(),
    webglVendor: webgl.vendor,
    webglRenderer: webgl.renderer,
    prefersColorScheme: window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
    prefersReducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "reduce" : "no-preference",
  };
}

function computeFingerprintScore(data: FingerprintData) {
  let score = 0;
  if (data.canvasHash !== "unavailable") score += 18;
  if (data.webglRenderer !== "unavailable") score += 18;
  if (typeof data.hardwareConcurrency === "number") score += 8;
  if (typeof data.deviceMemory === "number") score += 8;
  if (data.screenResolution !== "0 x 0") score += 7;
  if (data.viewport !== "0 x 0") score += 6;
  if (data.timezone !== "unknown") score += 8;
  if (data.language !== "unknown") score += 4;
  if (data.languages !== "unknown") score += 4;
  if (data.platform !== "unknown") score += 6;
  if (data.colorDepth > 0) score += 4;
  if (data.devicePixelRatio !== 1) score += 5;
  if (data.maxTouchPoints > 0) score += 4;
  return Math.min(100, score);
}

function scoreLabel(score: number) {
  if (score < 35) return "Low uniqueness";
  if (score < 70) return "Medium uniqueness";
  return "High uniqueness";
}

export default function BrowserFingerprintCheckerPage() {
  const [data, setData] = useState<FingerprintData>(() => collectFingerprint());
  const [scannedAt, setScannedAt] = useState(() => new Date());

  const score = useMemo(() => computeFingerprintScore(data), [data]);
  const label = useMemo(() => scoreLabel(score), [score]);

  const reportText = useMemo(
    () =>
      [
        `Browser Fingerprint Checker`,
        `Scanned at: ${scannedAt.toISOString()}`,
        `Score: ${score}/100 (${label})`,
        "",
        `User Agent: ${data.userAgent}`,
        `Language: ${data.language}`,
        `Languages: ${data.languages}`,
        `Platform: ${data.platform}`,
        `CPU Cores: ${data.hardwareConcurrency}`,
        `Device Memory: ${data.deviceMemory}`,
        `Touch Points: ${data.maxTouchPoints}`,
        `Screen: ${data.screenResolution}`,
        `Viewport: ${data.viewport}`,
        `DPR: ${data.devicePixelRatio}`,
        `Color Depth: ${data.colorDepth}`,
        `Timezone: ${data.timezone}`,
        `Timezone Offset: ${data.timezoneOffsetMinutes} minutes`,
        `Do Not Track: ${data.doNotTrack}`,
        `Cookies Enabled: ${data.cookiesEnabled ? "Yes" : "No"}`,
        `Canvas Hash: ${data.canvasHash}`,
        `WebGL Vendor: ${data.webglVendor}`,
        `WebGL Renderer: ${data.webglRenderer}`,
        `Preferred Color Scheme: ${data.prefersColorScheme}`,
        `Reduced Motion: ${data.prefersReducedMotion}`,
      ].join("\n"),
    [data, scannedAt, score, label]
  );

  return (
    <ToolLayout
      title="Browser Fingerprint Checker"
      description="Inspect browser/device fingerprint signals locally. No data is uploaded."
      relatedTools={["webrtc-leak-test", "screen-resolution-info", "ip-address-info"]}
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          onClick={() => {
            setData(collectFingerprint());
            setScannedAt(new Date());
          }}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Refresh fingerprint
        </button>
        <CopyButton text={reportText} />
        <p className="text-xs text-gray-500 dark:text-gray-400">Last scan: {scannedAt.toLocaleString()}</p>
      </div>

      <div className="mb-5 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
        <p className="text-xs uppercase tracking-wide text-blue-700 dark:text-blue-300">Estimated uniqueness</p>
        <div className="mt-1 text-2xl font-bold text-blue-800 dark:text-blue-200">
          {score}/100 <span className="text-base font-medium">({label})</span>
        </div>
        <p className="mt-1 text-xs text-blue-700 dark:text-blue-300">
          This is a heuristic signal score, not a cryptographic identifier.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <InfoCard label="Language" value={data.language} />
        <InfoCard label="Languages" value={data.languages} />
        <InfoCard label="Platform" value={data.platform} />
        <InfoCard label="CPU Cores" value={data.hardwareConcurrency} />
        <InfoCard label="Device Memory (GB)" value={data.deviceMemory} />
        <InfoCard label="Touch Points" value={data.maxTouchPoints} />
        <InfoCard label="Screen Resolution" value={data.screenResolution} />
        <InfoCard label="Viewport" value={data.viewport} />
        <InfoCard label="Device Pixel Ratio" value={data.devicePixelRatio} />
        <InfoCard label="Color Depth" value={data.colorDepth} />
        <InfoCard label="Timezone" value={data.timezone} />
        <InfoCard label="TZ Offset (min)" value={data.timezoneOffsetMinutes} />
        <InfoCard label="Do Not Track" value={data.doNotTrack} />
        <InfoCard label="Cookies Enabled" value={data.cookiesEnabled ? "Yes" : "No"} />
        <InfoCard label="Color Scheme" value={data.prefersColorScheme} />
        <InfoCard label="Reduced Motion" value={data.prefersReducedMotion} />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <InfoCard label="Canvas Fingerprint Hash" value={data.canvasHash} mono />
        <InfoCard label="WebGL Vendor / Renderer" value={`${data.webglVendor} | ${data.webglRenderer}`} mono />
      </div>

      <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-950">
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">User Agent</p>
        <p className="break-all font-mono text-xs text-gray-700 dark:text-gray-300">{data.userAgent}</p>
      </div>

      <div className="mt-12 space-y-6 border-t border-gray-200 pt-8 text-sm leading-relaxed text-gray-600 dark:border-gray-700 dark:text-gray-400">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
        <p>
          Browser Fingerprint Checker shows common browser/device signals that can be combined for probabilistic
          tracking. It helps you audit how much passive metadata your browser exposes during normal browsing.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is this a full anti-tracking test?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. It is a practical signal inspector for key fingerprint inputs, not a complete privacy audit suite.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is any data uploaded to a server?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. Collection and scoring happen entirely in your browser.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Why does my score change between browsers?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Different browsers expose different APIs and values, so the available signal set and resulting score can
              differ.
            </p>
          </details>
        </div>
      </div>
    </ToolLayout>
  );
}

function InfoCard({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string | number;
  mono?: boolean;
}) {
  return (
    <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
      <p className="mb-1 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</p>
      <p className={`${mono ? "font-mono text-xs break-all" : "text-sm"} text-gray-900 dark:text-gray-100`}>
        {String(value)}
      </p>
    </div>
  );
}
