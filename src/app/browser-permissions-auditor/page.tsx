"use client";

import { useMemo, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

type AuditStatus = PermissionState | "unsupported" | "error";

interface PermissionTarget {
  name: string;
  label: string;
}

interface PermissionResult {
  name: string;
  label: string;
  status: AuditStatus;
}

const TARGETS: PermissionTarget[] = [
  { name: "geolocation", label: "Geolocation" },
  { name: "notifications", label: "Notifications" },
  { name: "camera", label: "Camera" },
  { name: "microphone", label: "Microphone" },
  { name: "clipboard-read", label: "Clipboard Read" },
  { name: "clipboard-write", label: "Clipboard Write" },
  { name: "persistent-storage", label: "Persistent Storage" },
];

function statusClass(status: AuditStatus) {
  if (status === "granted") return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300";
  if (status === "prompt") return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300";
  if (status === "denied") return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300";
  return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
}

async function runAudit(): Promise<PermissionResult[]> {
  if (typeof window === "undefined") return [];

  if (!("permissions" in navigator) || typeof navigator.permissions.query !== "function") {
    return TARGETS.map((target) => ({ ...target, status: "unsupported" }));
  }

  const results: PermissionResult[] = [];
  for (const target of TARGETS) {
    try {
      const response = await navigator.permissions.query({
        name: target.name as PermissionName,
      });
      results.push({ ...target, status: response.state });
    } catch {
      results.push({ ...target, status: "unsupported" });
    }
  }
  return results;
}

export default function BrowserPermissionsAuditorPage() {
  const [results, setResults] = useState<PermissionResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [auditedAt, setAuditedAt] = useState<Date | null>(null);

  const capabilities = useMemo(
    () => ({
      secureContext: typeof window !== "undefined" ? window.isSecureContext : false,
      permissionsApi: typeof navigator !== "undefined" && "permissions" in navigator,
      geolocationApi: typeof navigator !== "undefined" && "geolocation" in navigator,
      mediaDevicesApi: typeof navigator !== "undefined" && "mediaDevices" in navigator,
      clipboardApi: typeof navigator !== "undefined" && "clipboard" in navigator,
    }),
    []
  );

  const counts = useMemo(() => {
    const granted = results.filter((item) => item.status === "granted").length;
    const prompt = results.filter((item) => item.status === "prompt").length;
    const denied = results.filter((item) => item.status === "denied").length;
    const unsupported = results.filter((item) => item.status === "unsupported" || item.status === "error").length;
    return { granted, prompt, denied, unsupported };
  }, [results]);

  const reportText = useMemo(
    () =>
      [
        "Browser Permissions Auditor",
        `Audited at: ${auditedAt ? auditedAt.toISOString() : "Not audited yet"}`,
        "",
        `Secure context: ${capabilities.secureContext ? "Yes" : "No"}`,
        `Permissions API available: ${capabilities.permissionsApi ? "Yes" : "No"}`,
        "",
        ...results.map((result) => `${result.label}: ${result.status}`),
      ].join("\n"),
    [auditedAt, capabilities.permissionsApi, capabilities.secureContext, results]
  );

  return (
    <ToolLayout
      title="Browser Permissions Auditor"
      description="Audit browser permission states (granted, prompt, denied) locally with no data upload."
      relatedTools={["browser-fingerprint-checker", "webrtc-leak-test", "screen-resolution-info"]}
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          onClick={async () => {
            setLoading(true);
            const nextResults = await runAudit();
            setResults(nextResults);
            setAuditedAt(new Date());
            setLoading(false);
          }}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Running audit..." : "Run permission audit"}
        </button>
        <CopyButton text={reportText} />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {auditedAt ? `Last audit: ${auditedAt.toLocaleString()}` : "No audit yet"}
        </p>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-4">
        <StatCard label="Granted" value={counts.granted.toString()} />
        <StatCard label="Prompt" value={counts.prompt.toString()} />
        <StatCard label="Denied" value={counts.denied.toString()} />
        <StatCard label="Unsupported" value={counts.unsupported.toString()} />
      </div>

      <div className="mb-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300">
          Permission states
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {(results.length > 0 ? results : TARGETS.map((target) => ({ ...target, status: "unsupported" as AuditStatus }))).map((row) => (
            <div key={row.name} className="flex items-center justify-between px-3 py-2 text-sm">
              <span className="text-gray-700 dark:text-gray-300">{row.label}</span>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusClass(row.status)}`}>{row.status}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
        <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Capability checks</p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <Capability label="Secure context (HTTPS)" value={capabilities.secureContext} />
          <Capability label="Permissions API" value={capabilities.permissionsApi} />
          <Capability label="Geolocation API" value={capabilities.geolocationApi} />
          <Capability label="MediaDevices API" value={capabilities.mediaDevicesApi} />
          <Capability label="Clipboard API" value={capabilities.clipboardApi} />
        </div>
      </div>

      <div className="mt-12 space-y-6 border-t border-gray-200 pt-8 text-sm leading-relaxed text-gray-600 dark:border-gray-700 dark:text-gray-400">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
        <p>
          Browser Permissions Auditor checks what your current browser reports for key permissions. It is useful for
          privacy audits, QA checks, and debugging feature access issues.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Why do some permissions show unsupported?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Not every browser implements every permission in the Permissions API.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Does this request new permissions?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. It reads reported states only. It does not trigger camera, microphone, or geolocation prompts.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is any data sent to a server?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. Audit results stay in your browser.
            </p>
          </details>
        </div>
      </div>
    </ToolLayout>
  );
}

function Capability({ label, value }: { label: string; value: boolean }) {
  return (
    <div className="rounded-lg border border-gray-200 p-2 text-sm dark:border-gray-700">
      <p className="text-gray-600 dark:text-gray-400">{label}</p>
      <p className="font-medium text-gray-900 dark:text-gray-100">{value ? "Available" : "Unavailable"}</p>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-200 p-3 text-center dark:border-gray-700">
      <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  );
}
