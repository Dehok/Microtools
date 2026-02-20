"use client";

import { useMemo, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

type EntityType = "email" | "phone" | "card" | "ip" | "person";

interface PatternDef {
  type: EntityType;
  regex: RegExp;
}

interface MatchItem {
  type: EntityType;
  value: string;
  start: number;
  end: number;
}

interface MappingItem {
  placeholder: string;
  value: string;
  type: EntityType;
}

const SAMPLE_TEXT = `Customer: John Doe
Email: john.doe@example.com
Phone: +1 415-555-0199
Card used: 4111 1111 1111 1111
IP address: 203.0.113.42
Secondary contact: Jane Smith`;

const PATTERNS: PatternDef[] = [
  { type: "email", regex: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi },
  { type: "phone", regex: /\b(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]?\d{4}\b/g },
  { type: "card", regex: /\b(?:\d[ -]*?){13,19}\b/g },
  { type: "ip", regex: /\b(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\b/g },
  { type: "person", regex: /\b[A-Z][a-z]{2,}\s+[A-Z][a-z]{2,}\b/g },
];

function typeLabel(type: EntityType) {
  if (type === "email") return "EMAIL";
  if (type === "phone") return "PHONE";
  if (type === "card") return "CARD";
  if (type === "ip") return "IP";
  return "PERSON";
}

function detectMatches(text: string): MatchItem[] {
  const raw: MatchItem[] = [];
  for (const pattern of PATTERNS) {
    const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
      raw.push({
        type: pattern.type,
        value: match[0],
        start: match.index,
        end: match.index + match[0].length,
      });
      if (regex.lastIndex === match.index) regex.lastIndex += 1;
    }
  }

  raw.sort((a, b) => a.start - b.start || (b.end - b.start) - (a.end - a.start));
  const filtered: MatchItem[] = [];
  for (const item of raw) {
    const overlap = filtered.some((x) => !(item.end <= x.start || item.start >= x.end));
    if (!overlap) filtered.push(item);
  }
  return filtered;
}

function pseudonymize(text: string, matches: MatchItem[]) {
  const counters: Record<EntityType, number> = {
    email: 0,
    phone: 0,
    card: 0,
    ip: 0,
    person: 0,
  };
  const valueMap = new Map<string, string>();
  const mappings: MappingItem[] = [];
  let output = text;

  const sorted = [...matches].sort((a, b) => b.start - a.start);
  for (const match of sorted) {
    const key = `${match.type}:${match.value}`;
    let placeholder = valueMap.get(key);
    if (!placeholder) {
      counters[match.type] += 1;
      placeholder = `[${typeLabel(match.type)}_${counters[match.type]}]`;
      valueMap.set(key, placeholder);
      mappings.push({ placeholder, value: match.value, type: match.type });
    }

    output = `${output.slice(0, match.start)}${placeholder}${output.slice(match.end)}`;
  }

  mappings.sort((a, b) => a.placeholder.localeCompare(b.placeholder));
  return { output, mappings };
}

function restoreText(text: string, mappings: MappingItem[]) {
  let restored = text;
  for (const item of mappings) {
    restored = restored.split(item.placeholder).join(item.value);
  }
  return restored;
}

function parseMappingJson(value: string) {
  try {
    const parsed = JSON.parse(value) as MappingItem[];
    if (!Array.isArray(parsed)) return { ok: false as const, error: "Mapping JSON must be an array." };
    const valid = parsed.every(
      (item) =>
        item &&
        typeof item.placeholder === "string" &&
        typeof item.value === "string" &&
        typeof item.type === "string"
    );
    if (!valid) return { ok: false as const, error: "Invalid mapping object format." };
    return { ok: true as const, value: parsed };
  } catch (error) {
    return { ok: false as const, error: (error as Error).message };
  }
}

export default function SensitiveDataPseudonymizerPage() {
  const [sourceText, setSourceText] = useState("");
  const [restoreInput, setRestoreInput] = useState("");
  const [restoreMapInput, setRestoreMapInput] = useState("");

  const generated = useMemo(() => {
    const matches = detectMatches(sourceText);
    const { output, mappings } = pseudonymize(sourceText, matches);
    const counts = {
      email: mappings.filter((m) => m.type === "email").length,
      phone: mappings.filter((m) => m.type === "phone").length,
      card: mappings.filter((m) => m.type === "card").length,
      ip: mappings.filter((m) => m.type === "ip").length,
      person: mappings.filter((m) => m.type === "person").length,
    };
    return { matches, output, mappings, counts };
  }, [sourceText]);

  const restoreResult = useMemo(() => {
    const parsed = parseMappingJson(restoreMapInput);
    if (!parsed.ok) return { text: "", error: parsed.error };
    return { text: restoreText(restoreInput, parsed.value), error: null as string | null };
  }, [restoreInput, restoreMapInput]);

  const summary = useMemo(
    () =>
      [
        "Sensitive Data Pseudonymizer",
        `Entities replaced: ${generated.mappings.length}`,
        `Emails: ${generated.counts.email}, Phones: ${generated.counts.phone}, Cards: ${generated.counts.card}, IPs: ${generated.counts.ip}, Persons: ${generated.counts.person}`,
      ].join("\n"),
    [generated]
  );

  return (
    <ToolLayout
      title="Sensitive Data Pseudonymizer"
      description="Replace personal and sensitive identifiers with reversible placeholders before sending text to AI models."
      relatedTools={["prompt-policy-firewall", "pii-redactor", "secret-detector-for-code-snippets"]}
    >
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          onClick={() => {
            setSourceText(SAMPLE_TEXT);
            setRestoreInput("");
            setRestoreMapInput("");
          }}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Load sample
        </button>
        <button
          onClick={() => {
            setSourceText("");
            setRestoreInput("");
            setRestoreMapInput("");
          }}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Clear
        </button>
        <button
          onClick={() => {
            setRestoreInput(generated.output);
            setRestoreMapInput(JSON.stringify(generated.mappings, null, 2));
          }}
          className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
        >
          Use generated for restore
        </button>
        <CopyButton text={summary} />
      </div>

      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Source text</label>
      <textarea
        value={sourceText}
        onChange={(event) => setSourceText(event.target.value)}
        rows={9}
        placeholder="Paste text containing personal or sensitive data..."
        className="mb-4 w-full rounded-lg border border-gray-300 bg-white p-3 text-sm dark:border-gray-600 dark:bg-gray-900"
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-5">
        <StatCard label="Replacements" value={`${generated.mappings.length}`} />
        <StatCard label="Emails" value={`${generated.counts.email}`} />
        <StatCard label="Phones" value={`${generated.counts.phone}`} />
        <StatCard label="Cards" value={`${generated.counts.card}`} />
        <StatCard label="Persons/IPs" value={`${generated.counts.person + generated.counts.ip}`} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Pseudonymized text</p>
            <CopyButton text={generated.output} />
          </div>
          <textarea
            value={generated.output}
            onChange={() => {}}
            readOnly
            rows={10}
            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm dark:border-gray-600 dark:bg-gray-900"
          />
        </div>
        <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Mapping JSON</p>
            <CopyButton text={JSON.stringify(generated.mappings, null, 2)} />
          </div>
          <textarea
            value={JSON.stringify(generated.mappings, null, 2)}
            onChange={() => {}}
            readOnly
            rows={10}
            className="w-full rounded-lg border border-gray-300 bg-white p-3 font-mono text-xs dark:border-gray-600 dark:bg-gray-900"
          />
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
        <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Restore mode</p>
        <div className="grid gap-3 md:grid-cols-2">
          <textarea
            value={restoreInput}
            onChange={(event) => setRestoreInput(event.target.value)}
            rows={8}
            placeholder="Pseudonymized text to restore..."
            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm dark:border-gray-600 dark:bg-gray-900"
          />
          <textarea
            value={restoreMapInput}
            onChange={(event) => setRestoreMapInput(event.target.value)}
            rows={8}
            placeholder="Mapping JSON..."
            className="w-full rounded-lg border border-gray-300 bg-white p-3 font-mono text-xs dark:border-gray-600 dark:bg-gray-900"
          />
        </div>
        {restoreResult.error && <p className="mt-2 text-xs text-red-600 dark:text-red-400">Restore error: {restoreResult.error}</p>}
        {!restoreResult.error && (
          <div className="mt-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Restored text</p>
              <CopyButton text={restoreResult.text} />
            </div>
            <textarea
              value={restoreResult.text}
              onChange={() => {}}
              readOnly
              rows={7}
              className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm dark:border-gray-600 dark:bg-gray-900"
            />
          </div>
        )}
      </div>

      <div className="mt-12 space-y-6 border-t border-gray-200 pt-8 text-sm leading-relaxed text-gray-600 dark:border-gray-700 dark:text-gray-400">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
        <p>
          Sensitive Data Pseudonymizer replaces personal data with deterministic placeholders so you can safely share
          text with AI systems while keeping reversible local mapping.
        </p>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is restore reversible?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes, if you keep the mapping JSON generated for that text.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is detection perfect?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. It catches common patterns and should be reviewed manually for edge cases.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is data uploaded?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. Pseudonymization runs fully in your browser.
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
