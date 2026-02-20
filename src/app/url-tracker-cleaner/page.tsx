"use client";

import { useMemo, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const SAMPLE_URLS = `https://example.com/blog/post?utm_source=newsletter&utm_medium=email&utm_campaign=launch&ref=twitter
https://shop.example.com/product/123?gclid=abc123&utm_term=shoes&fbclid=XYZ987
https://example.org/page?mc_cid=7a8b9c&mc_eid=42&feature=main`;

const TRACKING_PARAMS = new Set([
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_id",
  "utm_name",
  "utm_reader",
  "utm_referrer",
  "utm_social",
  "utm_social-type",
  "gclid",
  "dclid",
  "fbclid",
  "msclkid",
  "igshid",
  "yclid",
  "mc_cid",
  "mc_eid",
  "mkt_tok",
  "_hsenc",
  "_hsmi",
  "vero_conv",
  "vero_id",
  "oly_anon_id",
  "oly_enc_id",
  "ref",
  "ref_src",
  "source",
  "si",
]);

function sanitizeUrl(raw: string, removeAllQuery: boolean, stripHash: boolean) {
  const trimmed = raw.trim();
  if (!trimmed) return { ok: false as const, original: raw, cleaned: "", removed: 0 };

  let candidate = trimmed;
  if (!/^https?:\/\//i.test(candidate)) candidate = `https://${candidate}`;

  try {
    const url = new URL(candidate);
    let removed = 0;

    if (removeAllQuery) {
      removed = Array.from(url.searchParams.keys()).length;
      url.search = "";
    } else {
      const keys = Array.from(url.searchParams.keys());
      for (const key of keys) {
        if (TRACKING_PARAMS.has(key.toLowerCase()) || key.toLowerCase().startsWith("utm_")) {
          url.searchParams.delete(key);
          removed += 1;
        }
      }
    }

    if (stripHash) url.hash = "";

    const cleaned = `${url.origin}${url.pathname}${url.search}${url.hash}`;
    return { ok: true as const, original: raw, cleaned, removed };
  } catch {
    return { ok: false as const, original: raw, cleaned: "", removed: 0 };
  }
}

export default function UrlTrackerCleanerPage() {
  const [input, setInput] = useState("");
  const [removeAllQuery, setRemoveAllQuery] = useState(false);
  const [stripHash, setStripHash] = useState(false);
  const [dedupeOutput, setDedupeOutput] = useState(true);

  const result = useMemo(() => {
    const lines = input.split(/\r?\n/);
    const parsed = lines.map((line) => sanitizeUrl(line, removeAllQuery, stripHash));
    const valid = parsed.filter((item) => item.ok);
    const invalid = parsed.filter((item) => !item.ok && item.original.trim() !== "");
    const removedCount = valid.reduce((sum, item) => sum + item.removed, 0);

    let cleanedList = valid.map((item) => item.cleaned);
    if (dedupeOutput) cleanedList = Array.from(new Set(cleanedList));

    return {
      cleanedText: cleanedList.join("\n"),
      total: lines.filter((line) => line.trim() !== "").length,
      valid: valid.length,
      invalid: invalid.length,
      removedCount,
      invalidLines: invalid.map((item) => item.original.trim()),
    };
  }, [dedupeOutput, input, removeAllQuery, stripHash]);

  return (
    <ToolLayout
      title="URL Tracker Cleaner"
      description="Remove UTM and tracking query parameters from URLs in bulk. Clean links before sharing."
      relatedTools={["url-parser", "meta-tag-generator", "open-graph-preview"]}
    >
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          onClick={() => setInput(SAMPLE_URLS)}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Load sample
        </button>
        <button
          onClick={() => setInput("")}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Clear
        </button>
      </div>

      <div className="mb-4 grid gap-2 sm:grid-cols-3">
        <label className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-300">
          <input type="checkbox" checked={removeAllQuery} onChange={(event) => setRemoveAllQuery(event.target.checked)} className="accent-blue-600" />
          Remove all query params
        </label>
        <label className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-300">
          <input type="checkbox" checked={stripHash} onChange={(event) => setStripHash(event.target.checked)} className="accent-blue-600" />
          Remove hash fragment
        </label>
        <label className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-300">
          <input type="checkbox" checked={dedupeOutput} onChange={(event) => setDedupeOutput(event.target.checked)} className="accent-blue-600" />
          Deduplicate output
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Input URLs (one per line)</label>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            rows={12}
            placeholder="Paste URLs here..."
            className="w-full rounded-lg border border-gray-300 bg-white p-3 font-mono text-sm dark:border-gray-600 dark:bg-gray-900"
          />
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Cleaned URLs</label>
            <CopyButton text={result.cleanedText} />
          </div>
          <textarea
            value={result.cleanedText}
            onChange={() => {}}
            rows={12}
            readOnly
            className="w-full rounded-lg border border-gray-300 bg-white p-3 font-mono text-sm dark:border-gray-600 dark:bg-gray-900"
          />
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <StatCard label="Input URLs" value={result.total.toLocaleString()} />
        <StatCard label="Valid URLs" value={result.valid.toLocaleString()} />
        <StatCard label="Invalid URLs" value={result.invalid.toLocaleString()} />
        <StatCard label="Tracking Params Removed" value={result.removedCount.toLocaleString()} />
      </div>

      {result.invalidLines.length > 0 && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950">
          <p className="mb-2 text-sm font-medium text-amber-800 dark:text-amber-200">Invalid lines skipped</p>
          <ul className="list-disc space-y-1 pl-5 text-xs text-amber-700 dark:text-amber-300">
            {result.invalidLines.slice(0, 10).map((line, index) => (
              <li key={`${line}-${index}`} className="break-all font-mono">
                {line}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-12 space-y-6 border-t border-gray-200 pt-8 text-sm leading-relaxed text-gray-600 dark:border-gray-700 dark:text-gray-400">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
        <p>
          URL Tracker Cleaner strips common marketing and analytics parameters such as <code>utm_*</code>,{" "}
          <code>gclid</code>, and <code>fbclid</code>. It helps produce cleaner, privacy-friendlier share links.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Will this break links?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Usually no, but some websites use query params for app logic. Verify important links after cleaning.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Can I remove all query params?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes. Enable &quot;Remove all query params&quot; for maximum cleanup.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Are URLs uploaded?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. Processing is fully local in your browser.
            </p>
          </details>
        </div>
      </div>
    </ToolLayout>
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
