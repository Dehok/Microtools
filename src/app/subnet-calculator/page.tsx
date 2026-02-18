"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function ipToNumber(ip: string): number {
  const parts = ip.split(".").map(Number);
  return ((parts[0] << 24) + (parts[1] << 16) + (parts[2] << 8) + parts[3]) >>> 0;
}

function numberToIp(n: number): string {
  return [
    (n >>> 24) & 255,
    (n >>> 16) & 255,
    (n >>> 8) & 255,
    n & 255,
  ].join(".");
}

function getIpClass(firstOctet: number): string {
  if (firstOctet <= 127) return "A";
  if (firstOctet <= 191) return "B";
  if (firstOctet <= 223) return "C";
  if (firstOctet <= 239) return "D (Multicast)";
  return "E (Reserved)";
}

function toBinaryMask(cidr: number): string {
  return Array.from({ length: 4 }, (_, i) => {
    const start = i * 8;
    let octet = 0;
    for (let b = 0; b < 8; b++) {
      if (start + b < cidr) octet |= 1 << (7 - b);
    }
    return octet.toString(2).padStart(8, "0");
  }).join(".");
}

interface SubnetResult {
  networkAddress: string;
  broadcastAddress: string;
  firstHost: string;
  lastHost: string;
  subnetMask: string;
  wildcardMask: string;
  totalHosts: number;
  usableHosts: number;
  ipClass: string;
  binaryMask: string;
}

export default function SubnetCalculator() {
  const [ip, setIp] = useState("192.168.1.0");
  const [cidr, setCidr] = useState(24);

  const { results, error } = useMemo<{ results: SubnetResult | null; error: string }>(() => {
    const trimmed = ip.trim();
    if (!trimmed) return { results: null, error: "" };

    // Validate IP
    const parts = trimmed.split(".");
    if (parts.length !== 4) return { results: null, error: "Invalid IP address format. Use dotted decimal (e.g. 192.168.1.0)." };

    const octets = parts.map(Number);
    if (octets.some((o) => isNaN(o) || o < 0 || o > 255)) {
      return { results: null, error: "Each octet must be a number between 0 and 255." };
    }

    const ipNum = ipToNumber(trimmed);

    // Subnet mask from CIDR
    const maskNum = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
    const wildcardNum = (~maskNum) >>> 0;

    // Network and broadcast
    const networkNum = (ipNum & maskNum) >>> 0;
    const broadcastNum = (networkNum | wildcardNum) >>> 0;

    // Total hosts
    const totalHosts = Math.pow(2, 32 - cidr);

    // First and last usable host
    let firstHost: string;
    let lastHost: string;
    let usableHosts: number;

    if (cidr === 32) {
      firstHost = numberToIp(networkNum);
      lastHost = numberToIp(networkNum);
      usableHosts = 1;
    } else if (cidr === 31) {
      // Point-to-point link (RFC 3021)
      firstHost = numberToIp(networkNum);
      lastHost = numberToIp(broadcastNum);
      usableHosts = 2;
    } else {
      firstHost = numberToIp(networkNum + 1);
      lastHost = numberToIp(broadcastNum - 1);
      usableHosts = totalHosts - 2;
    }

    return {
      results: {
        networkAddress: numberToIp(networkNum),
        broadcastAddress: numberToIp(broadcastNum),
        firstHost,
        lastHost,
        subnetMask: numberToIp(maskNum),
        wildcardMask: numberToIp(wildcardNum),
        totalHosts,
        usableHosts,
        ipClass: getIpClass(octets[0]),
        binaryMask: toBinaryMask(cidr),
      },
      error: "",
    };
  }, [ip, cidr]);

  const allResultsText = results
    ? [
        `Network Address: ${results.networkAddress}`,
        `Broadcast Address: ${results.broadcastAddress}`,
        `First Host: ${results.firstHost}`,
        `Last Host: ${results.lastHost}`,
        `Subnet Mask: ${results.subnetMask}`,
        `Wildcard Mask: ${results.wildcardMask}`,
        `Total Hosts: ${results.totalHosts.toLocaleString()}`,
        `Usable Hosts: ${results.usableHosts.toLocaleString()}`,
        `IP Class: ${results.ipClass}`,
        `Binary Subnet Mask: ${results.binaryMask}`,
      ].join("\n")
    : "";

  return (
    <ToolLayout
      title="Subnet Calculator — CIDR, Netmask & IP Range"
      description="Calculate subnet details from any IP address and CIDR prefix. Get network address, broadcast, host range, subnet mask, and more."
      relatedTools={["ip-address-info", "number-base-converter", "chmod-calculator"]}
    >
      {/* Inputs */}
      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            IP Address
          </label>
          <input
            type="text"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            placeholder="192.168.1.0"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-2 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
            spellCheck={false}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            CIDR Prefix
          </label>
          <select
            value={cidr}
            onChange={(e) => setCidr(Number(e.target.value))}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-2 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
          >
            {Array.from({ length: 33 }, (_, i) => (
              <option key={i} value={i}>
                /{i}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick presets */}
      <div className="mb-4 flex flex-wrap gap-2">
        {[
          { label: "192.168.1.0/24", ip: "192.168.1.0", cidr: 24 },
          { label: "10.0.0.0/8", ip: "10.0.0.0", cidr: 8 },
          { label: "172.16.0.0/12", ip: "172.16.0.0", cidr: 12 },
          { label: "192.168.0.0/16", ip: "192.168.0.0", cidr: 16 },
          { label: "10.1.1.0/28", ip: "10.1.1.0", cidr: 28 },
        ].map((preset) => (
          <button
            key={preset.label}
            onClick={() => {
              setIp(preset.ip);
              setCidr(preset.cidr);
            }}
            className={`rounded-lg border px-3 py-1 text-xs font-mono transition-colors ${
              ip.trim() === preset.ip && cidr === preset.cidr
                ? "border-blue-300 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 px-4 py-2 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Results */}
      {results && (
        <>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Results</h3>
            <CopyButton text={allResultsText} />
          </div>

          <div className="space-y-2">
            {[
              { label: "Network Address", value: results.networkAddress },
              { label: "Broadcast Address", value: results.broadcastAddress },
              { label: "First Host", value: results.firstHost },
              { label: "Last Host", value: results.lastHost },
              { label: "Subnet Mask", value: results.subnetMask },
              { label: "Wildcard Mask", value: results.wildcardMask },
              { label: "Total Hosts", value: results.totalHosts.toLocaleString() },
              { label: "Usable Hosts", value: results.usableHosts.toLocaleString() },
              { label: "IP Class", value: results.ipClass },
              { label: "Binary Subnet Mask", value: results.binaryMask },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 p-3"
              >
                <div>
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    {row.label}
                  </span>
                  <div className="font-mono text-sm text-gray-900 dark:text-gray-100">
                    {row.value}
                  </div>
                </div>
                <CopyButton text={row.value} />
              </div>
            ))}
          </div>
        </>
      )}

      
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The Subnet Calculator is a free online tool available on CodeUtilo. Calculate subnet details from CIDR notation. Network, broadcast, host range, and netmask. All processing happens directly in your browser — no data is ever sent to any server, ensuring your privacy and security. No signup or installation is required.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> — All subnet calculator operations run locally in your browser using JavaScript. Your data never leaves your device.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Instant Results</strong> — Get results immediately as you type or paste your input. No waiting for server responses or page reloads.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> — Use the subnet calculator as many times as you need without creating an account or paying anything.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Mobile Friendly</strong> — Works on desktop, tablet, and mobile browsers. Access this tool from any device with an internet connection.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Using the subnet calculator for day-to-day development tasks</li>
          <li>Saving time on repetitive tasks by using a browser-based tool instead of writing custom code</li>
          <li>Working on projects where installing software is not an option (school, work, shared computers)</li>
          <li>Quick prototyping and debugging without switching to a terminal or IDE</li>
          <li>Sharing the tool link with colleagues who need the same functionality</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Enter your input in the text area provided and the subnet calculator will process it instantly. Use the Copy button to copy the result to your clipboard. All operations are performed locally in your browser — no data is transmitted to any server.
        </p>
      </div>
    </ToolLayout>
  );
}
