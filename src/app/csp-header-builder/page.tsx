"use client";

import { useMemo, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function splitSources(raw: string) {
  return raw
    .split(/[\n, ]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function unique(values: string[]) {
  return Array.from(new Set(values));
}

export default function CspHeaderBuilderPage() {
  const [defaultSelf, setDefaultSelf] = useState(true);
  const [scriptSelf, setScriptSelf] = useState(true);
  const [scriptUnsafeInline, setScriptUnsafeInline] = useState(false);
  const [scriptUnsafeEval, setScriptUnsafeEval] = useState(false);
  const [styleSelf, setStyleSelf] = useState(true);
  const [styleUnsafeInline, setStyleUnsafeInline] = useState(true);
  const [imgSources, setImgSources] = useState("'self' data: https:");
  const [connectSources, setConnectSources] = useState("'self'");
  const [fontSources, setFontSources] = useState("'self' https:");
  const [frameAncestorsNone, setFrameAncestorsNone] = useState(true);
  const [baseUriNone, setBaseUriNone] = useState(true);
  const [objectNone, setObjectNone] = useState(true);
  const [upgradeInsecure, setUpgradeInsecure] = useState(false);

  const result = useMemo(() => {
    const directives: string[] = [];

    if (defaultSelf) directives.push(`default-src 'self'`);

    const script = [];
    if (scriptSelf) script.push("'self'");
    if (scriptUnsafeInline) script.push("'unsafe-inline'");
    if (scriptUnsafeEval) script.push("'unsafe-eval'");
    if (script.length > 0) directives.push(`script-src ${unique(script).join(" ")}`);

    const style = [];
    if (styleSelf) style.push("'self'");
    if (styleUnsafeInline) style.push("'unsafe-inline'");
    if (style.length > 0) directives.push(`style-src ${unique(style).join(" ")}`);

    const img = splitSources(imgSources);
    if (img.length > 0) directives.push(`img-src ${unique(img).join(" ")}`);

    const connect = splitSources(connectSources);
    if (connect.length > 0) directives.push(`connect-src ${unique(connect).join(" ")}`);

    const font = splitSources(fontSources);
    if (font.length > 0) directives.push(`font-src ${unique(font).join(" ")}`);

    if (frameAncestorsNone) directives.push("frame-ancestors 'none'");
    if (baseUriNone) directives.push("base-uri 'none'");
    if (objectNone) directives.push("object-src 'none'");
    if (upgradeInsecure) directives.push("upgrade-insecure-requests");

    const policy = directives.join("; ");
    const header = policy ? `Content-Security-Policy: ${policy}` : "";

    const warnings: string[] = [];
    if (scriptUnsafeInline) warnings.push("script-src includes 'unsafe-inline'. XSS risk increases.");
    if (scriptUnsafeEval) warnings.push("script-src includes 'unsafe-eval'. Avoid in production when possible.");
    if (styleUnsafeInline) warnings.push("style-src includes 'unsafe-inline'. Consider nonce/hash based styles.");
    if (!frameAncestorsNone) warnings.push("frame-ancestors is not locked down. Clickjacking surface may increase.");
    if (!baseUriNone) warnings.push("base-uri is not set to 'none'. Base tag injection protection is weaker.");
    if (!objectNone) warnings.push("object-src is not set to 'none'. Legacy plugin surface may remain open.");
    if (!defaultSelf) warnings.push("default-src is missing. Add fallback source restrictions.");

    return { header, warnings };
  }, [
    baseUriNone,
    connectSources,
    defaultSelf,
    fontSources,
    frameAncestorsNone,
    imgSources,
    objectNone,
    scriptSelf,
    scriptUnsafeEval,
    scriptUnsafeInline,
    styleSelf,
    styleUnsafeInline,
    upgradeInsecure,
  ]);

  return (
    <ToolLayout
      title="CSP Header Builder"
      description="Build Content-Security-Policy headers visually and audit common risky directives."
      relatedTools={["meta-tag-generator", "cookie-audit-parser", "prompt-security-scanner"]}
    >
      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Toggle label="default-src 'self'" value={defaultSelf} onChange={setDefaultSelf} />
        <Toggle label="script-src 'self'" value={scriptSelf} onChange={setScriptSelf} />
        <Toggle label="script 'unsafe-inline'" value={scriptUnsafeInline} onChange={setScriptUnsafeInline} />
        <Toggle label="script 'unsafe-eval'" value={scriptUnsafeEval} onChange={setScriptUnsafeEval} />
        <Toggle label="style-src 'self'" value={styleSelf} onChange={setStyleSelf} />
        <Toggle label="style 'unsafe-inline'" value={styleUnsafeInline} onChange={setStyleUnsafeInline} />
        <Toggle label="frame-ancestors 'none'" value={frameAncestorsNone} onChange={setFrameAncestorsNone} />
        <Toggle label="base-uri 'none'" value={baseUriNone} onChange={setBaseUriNone} />
        <Toggle label="object-src 'none'" value={objectNone} onChange={setObjectNone} />
        <Toggle label="upgrade-insecure-requests" value={upgradeInsecure} onChange={setUpgradeInsecure} />
      </div>

      <div className="mb-4 grid gap-3 md:grid-cols-3">
        <SourceField label="img-src sources" value={imgSources} onChange={setImgSources} />
        <SourceField label="connect-src sources" value={connectSources} onChange={setConnectSources} />
        <SourceField label="font-src sources" value={fontSources} onChange={setFontSources} />
      </div>

      <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Generated Header</p>
          <CopyButton text={result.header} />
        </div>
        <pre className="whitespace-pre-wrap break-words rounded bg-gray-50 p-3 text-xs text-gray-800 dark:bg-gray-950 dark:text-gray-200">
          {result.header || "No policy generated yet."}
        </pre>
      </div>

      <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950">
        <p className="mb-1 text-sm font-medium text-amber-800 dark:text-amber-200">Policy warnings</p>
        {result.warnings.length === 0 ? (
          <p className="text-xs text-amber-700 dark:text-amber-300">No common high-risk flags detected.</p>
        ) : (
          <ul className="list-disc space-y-1 pl-5 text-xs text-amber-700 dark:text-amber-300">
            {result.warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-12 space-y-6 border-t border-gray-200 pt-8 text-sm leading-relaxed text-gray-600 dark:border-gray-700 dark:text-gray-400">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
        <p>
          CSP Header Builder helps construct Content-Security-Policy values with safer defaults. It is useful when
          hardening web apps against script injection and resource loading abuse.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is this a full CSP validator?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. It is a practical generator and risk hinting tool, not a full browser compatibility validator.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Should I allow &apos;unsafe-inline&apos; in production?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Prefer nonce/hash strategies instead. &apos;unsafe-inline&apos; weakens XSS protections significantly.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is any policy data uploaded?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. Header generation runs entirely in your browser.
            </p>
          </details>
        </div>
      </div>
    </ToolLayout>
  );
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-300">
      <input type="checkbox" checked={value} onChange={(event) => onChange(event.target.checked)} className="accent-blue-600" />
      {label}
    </label>
  );
}

function SourceField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <label className="text-sm text-gray-700 dark:text-gray-300">
      {label}
      <textarea
        rows={3}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-2 font-mono text-xs dark:border-gray-600 dark:bg-gray-900"
      />
    </label>
  );
}
