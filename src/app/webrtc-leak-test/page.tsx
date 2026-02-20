"use client";

import { useMemo, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

type LeakType = "public-ipv4" | "private-ipv4" | "private-ipv6" | "ipv6" | "mdns";

interface LeakItem {
  address: string;
  type: LeakType;
}

function isIpv4(value: string) {
  const match = value.match(/^(\d{1,3}\.){3}\d{1,3}$/);
  if (!match) return false;
  return value.split(".").every((part) => Number(part) >= 0 && Number(part) <= 255);
}

function isPrivateIpv4(value: string) {
  const [a, b] = value.split(".").map(Number);
  if (a === 10) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 127) return true;
  if (a === 169 && b === 254) return true;
  return false;
}

function isIpv6(value: string) {
  return value.includes(":") && /^[0-9a-f:]+$/i.test(value);
}

function isPrivateIpv6(value: string) {
  const lower = value.toLowerCase();
  return lower.startsWith("fc") || lower.startsWith("fd") || lower.startsWith("fe80") || lower === "::1";
}

function classifyAddress(address: string): LeakType {
  const lower = address.toLowerCase();
  if (lower.endsWith(".local")) return "mdns";
  if (isIpv4(address)) return isPrivateIpv4(address) ? "private-ipv4" : "public-ipv4";
  if (isIpv6(address)) return isPrivateIpv6(address) ? "private-ipv6" : "ipv6";
  return "mdns";
}

function extractAddresses(candidate: string) {
  const cleanTokens = candidate
    .split(/\s+/)
    .map((token) => token.trim().replace(/[,[\]]/g, ""))
    .filter(Boolean);

  const addresses = new Set<string>();
  for (const token of cleanTokens) {
    if (token.endsWith(".local")) {
      addresses.add(token);
      continue;
    }
    if (isIpv4(token)) {
      addresses.add(token);
      continue;
    }
    if (token.includes(":")) {
      const normalized = token.split("%")[0];
      if (isIpv6(normalized)) addresses.add(normalized);
    }
  }
  return Array.from(addresses);
}

async function runWebRtcLeakScan(timeoutMs = 7000): Promise<LeakItem[]> {
  if (typeof window === "undefined" || !("RTCPeerConnection" in window)) {
    throw new Error("WebRTC is not supported in this browser.");
  }

  const RTCPeerConnectionImpl = window.RTCPeerConnection;
  const pc = new RTCPeerConnectionImpl({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }],
  });

  const addresses = new Set<string>();

  return new Promise<LeakItem[]>(async (resolve, reject) => {
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      pc.onicecandidate = null;
      pc.onicecandidateerror = null;
      pc.close();

      const items = Array.from(addresses)
        .sort((a, b) => a.localeCompare(b))
        .map((address) => ({ address, type: classifyAddress(address) }));
      resolve(items);
    };

    const timer = window.setTimeout(finish, timeoutMs);

    pc.onicecandidate = (event) => {
      if (!event.candidate) {
        finish();
        return;
      }
      const candidate = event.candidate.candidate;
      for (const address of extractAddresses(candidate)) {
        addresses.add(address);
      }
    };

    pc.onicecandidateerror = () => {
      // Some browsers emit candidate errors with restrictive network setup.
    };

    try {
      pc.createDataChannel("probe");
      const offer = await pc.createOffer({ offerToReceiveAudio: false, offerToReceiveVideo: false });
      await pc.setLocalDescription(offer);
    } catch (error) {
      clearTimeout(timer);
      pc.close();
      reject(error);
    }
  });
}

function badgeClass(type: LeakType) {
  if (type === "public-ipv4") return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300";
  if (type === "private-ipv4" || type === "private-ipv6")
    return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300";
  if (type === "ipv6") return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300";
  return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
}

export default function WebRtcLeakTestPage() {
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<LeakItem[]>([]);
  const [lastScan, setLastScan] = useState<Date | null>(null);

  const summary = useMemo(() => {
    const publicIpv4 = results.filter((item) => item.type === "public-ipv4").length;
    const local = results.filter((item) => item.type === "private-ipv4" || item.type === "private-ipv6").length;
    const mdns = results.filter((item) => item.type === "mdns").length;
    return { publicIpv4, local, mdns };
  }, [results]);

  const reportText = useMemo(
    () =>
      [
        "WebRTC Leak Test Report",
        `Scanned at: ${lastScan ? lastScan.toISOString() : "not run"}`,
        `Found addresses: ${results.length}`,
        `Public IPv4: ${summary.publicIpv4}`,
        `Private/local: ${summary.local}`,
        `mDNS obfuscated: ${summary.mdns}`,
        "",
        ...results.map((item) => `${item.address} (${item.type})`),
      ].join("\n"),
    [lastScan, results, summary]
  );

  return (
    <ToolLayout
      title="WebRTC Leak Test"
      description="Check if WebRTC reveals local/public IP addresses through ICE candidates."
      relatedTools={["browser-fingerprint-checker", "ip-address-info", "screen-resolution-info"]}
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          onClick={async () => {
            setRunning(true);
            setError("");
            setResults([]);
            try {
              const items = await runWebRtcLeakScan();
              setResults(items);
              setLastScan(new Date());
            } catch (err) {
              setError(err instanceof Error ? err.message : "Could not run WebRTC test.");
            } finally {
              setRunning(false);
            }
          }}
          disabled={running}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {running ? "Scanning..." : "Run WebRTC Test"}
        </button>
        <CopyButton text={reportText} />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {lastScan ? `Last scan: ${lastScan.toLocaleString()}` : "No scan yet"}
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <SummaryCard label="Public IPv4" value={summary.publicIpv4} />
        <SummaryCard label="Private / Local" value={summary.local} />
        <SummaryCard label="mDNS Obfuscated" value={summary.mdns} />
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300">
          Detected ICE addresses
        </div>
        <div className="max-h-72 overflow-auto">
          {results.length === 0 ? (
            <p className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
              Run the test to collect WebRTC candidates.
            </p>
          ) : (
            results.map((item) => (
              <div
                key={`${item.type}-${item.address}`}
                className="flex items-center justify-between border-b border-gray-100 px-3 py-2 text-sm dark:border-gray-800"
              >
                <span className="font-mono text-xs text-gray-800 dark:text-gray-200">{item.address}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${badgeClass(item.type)}`}>
                  {item.type}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-12 space-y-6 border-t border-gray-200 pt-8 text-sm leading-relaxed text-gray-600 dark:border-gray-700 dark:text-gray-400">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
        <p>
          WebRTC Leak Test inspects ICE candidate strings produced by your browser and highlights possible address
          exposure categories. It is useful when validating VPN, proxy, or privacy browser setup.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Does a detected local IP always mean a leak?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Not always. Local candidates can appear in normal ICE gathering, but they can still matter in privacy
              threat models.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Why do I only see .local addresses?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Many browsers use mDNS hostnames to reduce direct local IP exposure in ICE candidates.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is the scan remote?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. Candidate parsing and reporting run locally in your browser. Only standard STUN signaling is used by
              WebRTC itself.
            </p>
          </details>
        </div>
      </div>
    </ToolLayout>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-gray-200 p-3 text-center dark:border-gray-700">
      <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  );
}
