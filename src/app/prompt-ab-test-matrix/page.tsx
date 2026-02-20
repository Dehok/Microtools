"use client";

import { useMemo, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface Variant {
  id: string;
  tone: string;
  length: string;
  format: string;
  prompt: string;
}

const SAMPLE_BASE_PROMPT = `You are a product support assistant.
Answer user questions about billing incidents and propose concrete next steps.`;

const DEFAULT_TONES = "neutral, professional, friendly";
const DEFAULT_LENGTHS = "short, medium, detailed";
const DEFAULT_FORMATS = "plain text, bullet list, json";
const DEFAULT_USER_INPUT = "Customer was charged twice and asks for immediate refund status.";

function parseOptions(input: string) {
  return Array.from(
    new Set(
      input
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    )
  );
}

function estimateTokens(text: string) {
  if (!text) return 0;
  const ascii = (text.match(/[\x00-\x7F]/g) || []).length;
  const nonAscii = text.length - ascii;
  return Math.max(1, Math.ceil(ascii / 4 + nonAscii / 1.6));
}

function formatInstruction(format: string) {
  const lower = format.toLowerCase();
  if (lower.includes("json")) return "Return only valid JSON.";
  if (lower.includes("bullet")) return "Use bullet points for each key item.";
  if (lower.includes("table")) return "Return a compact markdown table.";
  return "Use plain text paragraphs.";
}

function lengthInstruction(length: string) {
  const lower = length.toLowerCase();
  if (lower.includes("short")) return "Keep response under 90 words.";
  if (lower.includes("medium")) return "Keep response between 120 and 180 words.";
  if (lower.includes("detailed")) return "Provide detailed response up to 280 words.";
  return `Follow requested length style: ${length}.`;
}

function escapeCsv(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

export default function PromptAbTestMatrixPage() {
  const [basePrompt, setBasePrompt] = useState("");
  const [tonesRaw, setTonesRaw] = useState(DEFAULT_TONES);
  const [lengthsRaw, setLengthsRaw] = useState(DEFAULT_LENGTHS);
  const [formatsRaw, setFormatsRaw] = useState(DEFAULT_FORMATS);
  const [userInput, setUserInput] = useState("");
  const [maxVariants, setMaxVariants] = useState(36);

  const result = useMemo(() => {
    const tones = parseOptions(tonesRaw);
    const lengths = parseOptions(lengthsRaw);
    const formats = parseOptions(formatsRaw);

    const variants: Variant[] = [];
    for (const tone of tones) {
      for (const length of lengths) {
        for (const format of formats) {
          if (variants.length >= maxVariants) break;
          const id = `ab-${String(variants.length + 1).padStart(3, "0")}`;
          const prompt = `${basePrompt.trim()}

Style controls:
- Tone: ${tone}
- ${lengthInstruction(length)}
- ${formatInstruction(format)}
- Keep instructions deterministic and avoid extra filler.`;
          variants.push({ id, tone, length, format, prompt });
        }
      }
    }

    return { tones, lengths, formats, variants };
  }, [basePrompt, formatsRaw, lengthsRaw, maxVariants, tonesRaw]);

  const jsonl = useMemo(
    () =>
      result.variants
        .map((variant) =>
          JSON.stringify({
            custom_id: variant.id,
            metadata: { tone: variant.tone, length: variant.length, format: variant.format },
            prompt: variant.prompt,
            user_input: userInput || "Sample user input",
          })
        )
        .join("\n"),
    [result.variants, userInput]
  );

  const csv = useMemo(() => {
    const header = "id,tone,length,format,tokens,prompt";
    const rows = result.variants.map((variant) =>
      [
        escapeCsv(variant.id),
        escapeCsv(variant.tone),
        escapeCsv(variant.length),
        escapeCsv(variant.format),
        escapeCsv(String(estimateTokens(variant.prompt))),
        escapeCsv(variant.prompt),
      ].join(",")
    );
    return [header, ...rows].join("\n");
  }, [result.variants]);

  const summary = useMemo(
    () =>
      [
        "Prompt A/B Matrix Summary",
        `Tones: ${result.tones.length}`,
        `Lengths: ${result.lengths.length}`,
        `Formats: ${result.formats.length}`,
        `Generated variants: ${result.variants.length}`,
      ].join("\n"),
    [result]
  );

  return (
    <ToolLayout
      title="Prompt A/B Test Matrix"
      description="Generate systematic prompt variant matrices across tone, length, and output format dimensions."
      relatedTools={["prompt-regression-suite-builder", "prompt-diff-optimizer", "llm-response-grader"]}
    >
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          onClick={() => {
            setBasePrompt(SAMPLE_BASE_PROMPT);
            setUserInput(DEFAULT_USER_INPUT);
            setTonesRaw(DEFAULT_TONES);
            setLengthsRaw(DEFAULT_LENGTHS);
            setFormatsRaw(DEFAULT_FORMATS);
            setMaxVariants(27);
          }}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Load sample
        </button>
        <button
          onClick={() => {
            setBasePrompt("");
            setUserInput("");
          }}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Clear prompts
        </button>
        <CopyButton text={summary} />
      </div>

      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Base prompt</label>
      <textarea
        value={basePrompt}
        onChange={(event) => setBasePrompt(event.target.value)}
        rows={7}
        className="mb-4 w-full rounded-lg border border-gray-300 bg-white p-3 text-sm dark:border-gray-600 dark:bg-gray-900"
      />

      <div className="mb-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <label className="text-sm text-gray-700 dark:text-gray-300">
          Tone options (comma-separated)
          <input
            value={tonesRaw}
            onChange={(event) => setTonesRaw(event.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
          />
        </label>
        <label className="text-sm text-gray-700 dark:text-gray-300">
          Length options
          <input
            value={lengthsRaw}
            onChange={(event) => setLengthsRaw(event.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
          />
        </label>
        <label className="text-sm text-gray-700 dark:text-gray-300">
          Format options
          <input
            value={formatsRaw}
            onChange={(event) => setFormatsRaw(event.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
          />
        </label>
        <label className="text-sm text-gray-700 dark:text-gray-300">
          Max variants
          <input
            type="number"
            min={1}
            max={200}
            step={1}
            value={maxVariants}
            onChange={(event) => setMaxVariants(Math.max(1, Number(event.target.value) || 1))}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
          />
        </label>
      </div>

      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Test user input</label>
      <textarea
        value={userInput}
        onChange={(event) => setUserInput(event.target.value)}
        rows={3}
        className="mb-4 w-full rounded-lg border border-gray-300 bg-white p-3 text-sm dark:border-gray-600 dark:bg-gray-900"
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-4">
        <StatCard label="Tones" value={String(result.tones.length)} />
        <StatCard label="Lengths" value={String(result.lengths.length)} />
        <StatCard label="Formats" value={String(result.formats.length)} />
        <StatCard label="Variants" value={String(result.variants.length)} />
      </div>

      <div className="mb-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300">
          Variant preview
        </div>
        <div className="max-h-[340px] overflow-auto">
          {result.variants.length === 0 ? (
            <p className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Add base prompt and options.</p>
          ) : (
            result.variants.map((variant) => (
              <div key={variant.id} className="border-b border-gray-100 px-3 py-3 text-sm dark:border-gray-800">
                <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className="font-mono">{variant.id}</span>
                  <span>tone: {variant.tone}</span>
                  <span>length: {variant.length}</span>
                  <span>format: {variant.format}</span>
                  <span>tokens ~{estimateTokens(variant.prompt)}</span>
                </div>
                <p className="line-clamp-3 text-gray-700 dark:text-gray-300">{variant.prompt}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">JSONL export</p>
            <CopyButton text={jsonl} />
          </div>
          <textarea
            value={jsonl}
            onChange={() => {}}
            rows={10}
            readOnly
            className="w-full rounded-lg border border-gray-300 bg-white p-3 font-mono text-xs dark:border-gray-600 dark:bg-gray-900"
          />
        </div>
        <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">CSV export</p>
            <CopyButton text={csv} />
          </div>
          <textarea
            value={csv}
            onChange={() => {}}
            rows={10}
            readOnly
            className="w-full rounded-lg border border-gray-300 bg-white p-3 font-mono text-xs dark:border-gray-600 dark:bg-gray-900"
          />
        </div>
      </div>

      <div className="mt-12 space-y-6 border-t border-gray-200 pt-8 text-sm leading-relaxed text-gray-600 dark:border-gray-700 dark:text-gray-400">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
        <p>
          Prompt A/B Test Matrix generates consistent variant grids for repeatable experimentation across style and
          format dimensions.
        </p>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is this random generation?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. Variants are deterministic cartesian combinations of your option sets.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Can I cap total variants?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes. Use the max variants field to limit matrix size.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is text uploaded?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. All generation is browser-side only.
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
