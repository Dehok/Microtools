"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const CONVERSIONS = [
  {
    id: "upper",
    label: "UPPERCASE",
    fn: (s: string) => s.toUpperCase(),
  },
  {
    id: "lower",
    label: "lowercase",
    fn: (s: string) => s.toLowerCase(),
  },
  {
    id: "title",
    label: "Title Case",
    fn: (s: string) =>
      s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()),
  },
  {
    id: "sentence",
    label: "Sentence case",
    fn: (s: string) =>
      s.toLowerCase().replace(/(^\s*|[.!?]\s+)(\w)/g, (_, p, c) => p + c.toUpperCase()),
  },
  {
    id: "camel",
    label: "camelCase",
    fn: (s: string) =>
      s
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()),
  },
  {
    id: "pascal",
    label: "PascalCase",
    fn: (s: string) =>
      s
        .toLowerCase()
        .replace(/(^|[^a-zA-Z0-9]+)(.)/g, (_, _sep, c) => c.toUpperCase()),
  },
  {
    id: "snake",
    label: "snake_case",
    fn: (s: string) =>
      s
        .replace(/([a-z])([A-Z])/g, "$1_$2")
        .replace(/[\s\-]+/g, "_")
        .toLowerCase(),
  },
  {
    id: "kebab",
    label: "kebab-case",
    fn: (s: string) =>
      s
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .replace(/[\s_]+/g, "-")
        .toLowerCase(),
  },
  {
    id: "constant",
    label: "CONSTANT_CASE",
    fn: (s: string) =>
      s
        .replace(/([a-z])([A-Z])/g, "$1_$2")
        .replace(/[\s\-]+/g, "_")
        .toUpperCase(),
  },
  {
    id: "dot",
    label: "dot.case",
    fn: (s: string) =>
      s
        .replace(/([a-z])([A-Z])/g, "$1.$2")
        .replace(/[\s_\-]+/g, ".")
        .toLowerCase(),
  },
  {
    id: "alternate",
    label: "aLtErNaTiNg",
    fn: (s: string) =>
      s
        .split("")
        .map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()))
        .join(""),
  },
  {
    id: "inverse",
    label: "iNVERSE cASE",
    fn: (s: string) =>
      s
        .split("")
        .map((c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()))
        .join(""),
  },
];

export default function TextCaseConverter() {
  const [input, setInput] = useState("Hello World, this is a Sample Text!");

  return (
    <ToolLayout
      title="Text Case Converter Online"
      description="Convert text between uppercase, lowercase, title case, camelCase, snake_case, kebab-case, and more. Free online tool."
      relatedTools={["word-counter", "slug-generator", "lorem-ipsum-generator"]}
    >
      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Input Text</label>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type or paste your text here..."
        className="mb-4 h-28 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
        spellCheck={false}
      />

      {input.trim() && (
        <div className="space-y-2">
          {CONVERSIONS.map((conv) => {
            const result = conv.fn(input);
            return (
              <div
                key={conv.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 p-3"
              >
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{conv.label}</span>
                  <div className="truncate font-mono text-sm text-gray-900 dark:text-gray-100">{result}</div>
                </div>
                <CopyButton text={result} />
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Text Case Styles</h2>
        <p className="mb-3">
          Different naming conventions are used in programming and writing. <strong>camelCase</strong> and
          <strong> PascalCase</strong> are common in JavaScript and TypeScript. <strong>snake_case</strong> is
          standard in Python and Ruby. <strong>kebab-case</strong> is used in CSS and URL slugs.
          <strong> CONSTANT_CASE</strong> is used for constants in many languages.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">When to Use Each Case</h2>
        <p>
          Use <strong>Title Case</strong> for headings, <strong>UPPERCASE</strong> for emphasis or constants,
          <strong> Sentence case</strong> for regular text, and language-specific conventions (camelCase,
          snake_case, etc.) for variable and function naming.
        </p>
      </div>
    </ToolLayout>
  );
}
