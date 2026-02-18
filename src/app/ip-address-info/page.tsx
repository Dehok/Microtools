"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface IPv4Result {
  valid: true;
  version: "IPv4";
  binary: string;
  hex: string;
  decimal: string;
  ipClass: string;
  defaultMask: string;
  scope: string;
}

interface IPv6Result {
  valid: true;
  version: "IPv6";
  expanded: string;
  compressed: string;
  scope: string;
}

function analyzeIPv4(ip: string): IPv4Result | null {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) return null;

  const binary = parts.map((p) => p.toString(2).padStart(8, "0")).join(".");
  const hex = parts.map((p) => p.toString(16).padStart(2, "0").toUpperCase()).join(":");
  const decimal = ((parts[0] << 24) + (parts[1] << 16) + (parts[2] << 8) + parts[3]) >>> 0;

  // Class
  let ipClass = "";
  let defaultMask = "";
  if (parts[0] <= 127) { ipClass = "A"; defaultMask = "255.0.0.0 (/8)"; }
  else if (parts[0] <= 191) { ipClass = "B"; defaultMask = "255.255.0.0 (/16)"; }
  else if (parts[0] <= 223) { ipClass = "C"; defaultMask = "255.255.255.0 (/24)"; }
  else if (parts[0] <= 239) { ipClass = "D (Multicast)"; defaultMask = "N/A"; }
  else { ipClass = "E (Reserved)"; defaultMask = "N/A"; }

  // Private/Public
  let scope = "Public";
  if (parts[0] === 10) scope = "Private (10.0.0.0/8)";
  else if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) scope = "Private (172.16.0.0/12)";
  else if (parts[0] === 192 && parts[1] === 168) scope = "Private (192.168.0.0/16)";
  else if (parts[0] === 127) scope = "Loopback (127.0.0.0/8)";
  else if (parts[0] === 169 && parts[1] === 254) scope = "Link-local (169.254.0.0/16)";
  else if (parts[0] === 0) scope = "This network";

  return {
    valid: true,
    version: "IPv4",
    binary,
    hex,
    decimal: decimal.toString(),
    ipClass,
    defaultMask,
    scope,
  };
}

function analyzeIPv6(ip: string): IPv6Result | null {
  // Basic IPv6 validation
  const expanded = expandIPv6(ip);
  if (!expanded) return null;

  const groups = expanded.split(":");
  const scope = groups[0] === "fe80" ? "Link-local" :
    groups[0] === "0000" && groups.slice(0, 7).every((g) => g === "0000") && groups[7] === "0001" ? "Loopback (::1)" :
    groups.every((g) => g === "0000") ? "Unspecified (::)" :
    groups[0].startsWith("fc") || groups[0].startsWith("fd") ? "Unique local (private)" :
    "Global unicast";

  return {
    valid: true,
    version: "IPv6",
    expanded,
    compressed: compressIPv6(expanded),
    scope,
  };
}

function expandIPv6(ip: string): string | null {
  if (ip.includes("::")) {
    const parts = ip.split("::");
    if (parts.length > 2) return null;
    const left = parts[0] ? parts[0].split(":") : [];
    const right = parts[1] ? parts[1].split(":") : [];
    const fill = 8 - left.length - right.length;
    if (fill < 0) return null;
    const mid = Array(fill).fill("0000");
    const all = [...left, ...mid, ...right];
    return all.map((g) => g.padStart(4, "0")).join(":");
  }
  const groups = ip.split(":");
  if (groups.length !== 8) return null;
  return groups.map((g) => g.padStart(4, "0")).join(":");
}

function compressIPv6(expanded: string): string {
  const groups = expanded.split(":").map((g) => g.replace(/^0+/, "") || "0");
  let best = { start: -1, len: 0 };
  let cur = { start: -1, len: 0 };
  for (let i = 0; i < groups.length; i++) {
    if (groups[i] === "0") {
      if (cur.start === -1) cur.start = i;
      cur.len++;
      if (cur.len > best.len) best = { ...cur };
    } else {
      cur = { start: -1, len: 0 };
    }
  }
  if (best.len >= 2) {
    const left = groups.slice(0, best.start).join(":");
    const right = groups.slice(best.start + best.len).join(":");
    return `${left}::${right}`;
  }
  return groups.join(":");
}

export default function IpAddressInfo() {
  const [input, setInput] = useState("192.168.1.1");

  const result = useMemo(() => {
    const trimmed = input.trim();
    if (!trimmed) return null;

    // Try IPv4
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(trimmed)) {
      return analyzeIPv4(trimmed);
    }

    // Try IPv6
    if (trimmed.includes(":")) {
      return analyzeIPv6(trimmed);
    }

    return null;
  }, [input]);

  return (
    <ToolLayout
      title="IP Address Analyzer — IPv4 & IPv6 Info"
      description="Analyze IP addresses: class, scope (private/public), binary & hex representation. Supports IPv4 and IPv6."
      relatedTools={["number-base-converter", "hash-generator", "chmod-calculator"]}
    >
      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">IP Address</label>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="192.168.1.1 or ::1"
        className="mb-4 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-2 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
        spellCheck={false}
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {["192.168.1.1", "10.0.0.1", "8.8.8.8", "127.0.0.1", "172.16.0.1", "::1"].map((sample) => (
          <button
            key={sample}
            onClick={() => setInput(sample)}
            className={`rounded-lg border px-3 py-1 text-xs font-mono transition-colors ${
              input.trim() === sample
                ? "border-blue-300 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
            }`}
          >
            {sample}
          </button>
        ))}
      </div>

      {!result && input.trim() && (
        <div className="mb-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 px-4 py-2 text-sm text-red-700 dark:text-red-300">
          Invalid IP address format.
        </div>
      )}

      {result && result.version === "IPv4" && (() => {
        const r = result as IPv4Result;
        const rows = [
          { label: "Version", value: r.version },
          { label: "Class", value: r.ipClass },
          { label: "Scope", value: r.scope },
          { label: "Default Mask", value: r.defaultMask },
          { label: "Binary", value: r.binary },
          { label: "Hexadecimal", value: r.hex },
          { label: "Decimal", value: r.decimal },
        ];
        return (
          <div className="space-y-2">
            {rows.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 p-3"
              >
                <div>
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{row.label}</span>
                  <div className="font-mono text-sm text-gray-900 dark:text-gray-100">{row.value}</div>
                </div>
                <CopyButton text={row.value} />
              </div>
            ))}
          </div>
        );
      })()}

      {result && result.version === "IPv6" && (() => {
        const r = result as IPv6Result;
        const rows = [
          { label: "Version", value: r.version },
          { label: "Scope", value: r.scope },
          { label: "Expanded", value: r.expanded },
          { label: "Compressed", value: r.compressed },
        ];
        return (
          <div className="space-y-2">
            {rows.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 p-3"
              >
                <div>
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{row.label}</span>
                  <div className="font-mono text-sm text-gray-900 dark:text-gray-100">{row.value}</div>
                </div>
                <CopyButton text={row.value} />
              </div>
            ))}
          </div>
        );
      })()}

      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">IPv4 Address Classes</h2>
        <p className="mb-3">
          IPv4 addresses are divided into classes: <strong>Class A</strong> (1-127, large networks),
          <strong> Class B</strong> (128-191, medium networks), <strong>Class C</strong> (192-223, small networks),
          <strong> Class D</strong> (224-239, multicast), and <strong>Class E</strong> (240-255, reserved).
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Private vs Public IPs</h2>
        <p>
          Private ranges (10.x, 172.16-31.x, 192.168.x) are for local networks and cannot be
          routed on the internet. Public IPs are globally unique and internet-routable.
          Loopback (127.0.0.1) always refers to the local machine.
        </p>
      </div>
    
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The IP Address Analyzer is a free online tool available on CodeUtilo. Analyze IPv4/IPv6 addresses: class, scope, binary, and hex representation. All processing happens directly in your browser — no data is ever sent to any server, ensuring your privacy and security. No signup or installation is required.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> — All ip address analyzer operations run locally in your browser using JavaScript. Your data never leaves your device.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Instant Results</strong> — Get results immediately as you type or paste your input. No waiting for server responses or page reloads.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> — Use the ip address analyzer as many times as you need without creating an account or paying anything.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Mobile Friendly</strong> — Works on desktop, tablet, and mobile browsers. Access this tool from any device with an internet connection.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Using the ip address analyzer for day-to-day development tasks</li>
          <li>Saving time on repetitive tasks by using a browser-based tool instead of writing custom code</li>
          <li>Working on projects where installing software is not an option (school, work, shared computers)</li>
          <li>Quick prototyping and debugging without switching to a terminal or IDE</li>
          <li>Sharing the tool link with colleagues who need the same functionality</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Enter your input in the text area provided and the ip address analyzer will process it instantly. Use the Copy button to copy the result to your clipboard. All operations are performed locally in your browser — no data is transmitted to any server.
        </p>
      </div>
    </ToolLayout>
  );
}
