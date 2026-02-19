"use client";

import { useMemo, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

type RedactionMode = "placeholder" | "partial";

type ToggleKey =
  | "emails"
  | "phones"
  | "creditCards"
  | "ibans"
  | "ipv4"
  | "apiKeys"
  | "jwts";

interface ToggleConfig {
  key: ToggleKey;
  label: string;
}

interface Detector {
  key: ToggleKey;
  label: string;
  placeholder: string;
  regex: RegExp;
  validate?: (value: string) => boolean;
}

const SAMPLE_TEXT = `Customer contact:
Name: John Doe
Email: john.doe+test@example.com
Phone: +1 (415) 555-0109
Billing card: 4111 1111 1111 1111
IBAN: DE89 3704 0044 0532 0130 00
Server IP: 192.168.10.44
Token: sk-liveAbCdEfGh1234567890123456
JWT: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTYifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`;

const TOGGLES: ToggleConfig[] = [
  { key: "emails", label: "Emails" },
  { key: "phones", label: "Phones" },
  { key: "creditCards", label: "Credit Cards" },
  { key: "ibans", label: "IBAN" },
  { key: "ipv4", label: "IPv4" },
  { key: "apiKeys", label: "API Keys" },
  { key: "jwts", label: "JWT Tokens" },
];

const DETECTORS: Detector[] = [
  {
    key: "apiKeys",
    label: "API Keys",
    placeholder: "[API_KEY]",
    regex: /\b(?:sk-[A-Za-z0-9_-]{16,}|ghp_[A-Za-z0-9]{30,}|AIza[0-9A-Za-z-_]{20,}|xox[baprs]-[A-Za-z0-9-]{10,})\b/g,
  },
  {
    key: "jwts",
    label: "JWT Tokens",
    placeholder: "[JWT]",
    regex: /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g,
  },
  {
    key: "emails",
    label: "Emails",
    placeholder: "[EMAIL]",
    regex: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
  },
  {
    key: "ibans",
    label: "IBAN",
    placeholder: "[IBAN]",
    regex: /\b[A-Z]{2}\d{2}[A-Z0-9]{11,30}\b/gi,
  },
  {
    key: "creditCards",
    label: "Credit Cards",
    placeholder: "[CREDIT_CARD]",
    regex: /\b(?:\d[ -]*?){13,19}\b/g,
    validate: (value) => luhnValid(value),
  },
  {
    key: "ipv4",
    label: "IPv4",
    placeholder: "[IPV4]",
    regex: /\b(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)\b/g,
  },
  {
    key: "phones",
    label: "Phones",
    placeholder: "[PHONE]",
    regex: /\b(?:\+?\d[\d().\s-]{7,}\d)\b/g,
  },
];

function luhnValid(input: string) {
  const digits = input.replace(/\D/g, "");
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  let doubleNext = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let value = Number(digits[i]);
    if (doubleNext) {
      value *= 2;
      if (value > 9) value -= 9;
    }
    sum += value;
    doubleNext = !doubleNext;
  }

  return sum % 10 === 0;
}

function maskPartial(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return value;
  if (trimmed.length <= 4) return "*".repeat(trimmed.length);
  const visibleStart = 2;
  const visibleEnd = 2;
  return `${trimmed.slice(0, visibleStart)}${"*".repeat(
    Math.max(2, trimmed.length - visibleStart - visibleEnd)
  )}${trimmed.slice(-visibleEnd)}`;
}

export default function PiiRedactorPage() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<RedactionMode>("placeholder");
  const [toggles, setToggles] = useState<Record<ToggleKey, boolean>>({
    emails: true,
    phones: true,
    creditCards: true,
    ibans: true,
    ipv4: true,
    apiKeys: true,
    jwts: true,
  });

  const output = useMemo(() => {
    const counts: Record<ToggleKey, number> = {
      emails: 0,
      phones: 0,
      creditCards: 0,
      ibans: 0,
      ipv4: 0,
      apiKeys: 0,
      jwts: 0,
    };

    let redacted = input;
    for (const detector of DETECTORS) {
      if (!toggles[detector.key]) continue;
      const regex = new RegExp(detector.regex.source, detector.regex.flags);
      redacted = redacted.replace(regex, (match: string) => {
        if (detector.validate && !detector.validate(match)) return match;
        counts[detector.key] += 1;
        return mode === "placeholder" ? detector.placeholder : maskPartial(match);
      });
    }

    const total = Object.values(counts).reduce((sum, value) => sum + value, 0);
    return { redacted, counts, total };
  }, [input, mode, toggles]);

  const summaryText = useMemo(
    () =>
      [
        `Total redactions: ${output.total}`,
        ...TOGGLES.map((toggle) => `${toggle.label}: ${output.counts[toggle.key]}`),
        "",
        output.redacted,
      ].join("\n"),
    [output]
  );

  return (
    <ToolLayout
      title="PII Redactor (Privacy Text Sanitizer)"
      description="Redact personal and sensitive data from text locally in your browser."
      relatedTools={["invisible-character-detector", "text-case-converter", "diff-checker"]}
    >
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          onClick={() => setInput(SAMPLE_TEXT)}
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

      <div className="mb-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
          <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Redaction mode</p>
          <div className="flex gap-3 text-sm">
            <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <input
                type="radio"
                name="mode"
                checked={mode === "placeholder"}
                onChange={() => setMode("placeholder")}
                className="accent-blue-600"
              />
              Placeholder tags
            </label>
            <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <input
                type="radio"
                name="mode"
                checked={mode === "partial"}
                onChange={() => setMode("partial")}
                className="accent-blue-600"
              />
              Partial masking
            </label>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
          <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Detect and redact</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {TOGGLES.map((toggle) => (
              <label key={toggle.key} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={toggles[toggle.key]}
                  onChange={(event) =>
                    setToggles((prev) => ({ ...prev, [toggle.key]: event.target.checked }))
                  }
                  className="accent-blue-600"
                />
                {toggle.label}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Input text</label>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            rows={16}
            placeholder="Paste text containing personal or sensitive data..."
            className="w-full rounded-lg border border-gray-300 bg-white p-3 font-mono text-sm dark:border-gray-600 dark:bg-gray-900"
            spellCheck={false}
          />
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Redacted output</label>
            <CopyButton text={output.redacted} />
          </div>
          <textarea
            value={output.redacted}
            onChange={() => {}}
            rows={16}
            className="w-full rounded-lg border border-gray-300 bg-white p-3 font-mono text-sm dark:border-gray-600 dark:bg-gray-900"
            spellCheck={false}
            readOnly
          />
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-center dark:border-blue-900 dark:bg-blue-950">
          <div className="text-xl font-bold text-blue-700 dark:text-blue-300">{output.total}</div>
          <div className="text-xs text-blue-700 dark:text-blue-300">Total Redactions</div>
        </div>
        {TOGGLES.slice(0, 3).map((toggle) => (
          <div key={toggle.key} className="rounded-lg border border-gray-200 p-3 text-center dark:border-gray-700">
            <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{output.counts[toggle.key]}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{toggle.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-4">
        {TOGGLES.slice(3).map((toggle) => (
          <div key={toggle.key} className="rounded-lg border border-gray-200 p-3 text-center dark:border-gray-700">
            <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{output.counts[toggle.key]}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{toggle.label}</div>
          </div>
        ))}
        <div className="flex items-center justify-center">
          <CopyButton text={summaryText} />
        </div>
      </div>

      <div className="mt-12 space-y-6 border-t border-gray-200 pt-8 text-sm leading-relaxed text-gray-600 dark:border-gray-700 dark:text-gray-400">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
        <p>
          PII Redactor helps sanitize text before sharing logs, support tickets, or AI prompts. It detects common
          personal/sensitive patterns and replaces them using placeholders or partial masking.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is detection perfect?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. Pattern-based detection can miss uncommon formats or flag false positives. Always review output.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is my text uploaded?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. All processing is local in your browser.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Placeholder vs partial mask?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Placeholders hide full values with tags like [EMAIL]. Partial mask preserves a little context.
            </p>
          </details>
        </div>
      </div>
    </ToolLayout>
  );
}
