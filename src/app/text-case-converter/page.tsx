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
    
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
        <p>The Text Case Converter instantly transforms your text between uppercase, lowercase, title case, sentence case, camelCase, PascalCase, snake_case, kebab-case, and more. It is perfect for developers formatting variable names, writers fixing capitalization, and anyone needing consistent text styling.</p>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Key Features</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong className="text-gray-700 dark:text-gray-300">Multiple Case Formats</strong> &mdash; Converts text to uppercase, lowercase, title case, sentence case, camelCase, PascalCase, snake_case, kebab-case, and CONSTANT_CASE in one place.</li>
          <li><strong className="text-gray-700 dark:text-gray-300">Instant Conversion</strong> &mdash; Results appear immediately as you type or paste text, with no button press needed.</li>
          <li><strong className="text-gray-700 dark:text-gray-300">Developer-Friendly Formats</strong> &mdash; Includes camelCase, PascalCase, snake_case, and kebab-case used in variable naming conventions across programming languages.</li>
          <li><strong className="text-gray-700 dark:text-gray-300">Copy to Clipboard</strong> &mdash; One-click copy button for each output format makes it easy to paste the result directly into your code or document.</li>
          <li><strong className="text-gray-700 dark:text-gray-300">Free and No Signup</strong> &mdash; Convert text case without creating an account or paying anything.</li>
        </ul>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Common Use Cases</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Converting a user-input string to snake_case for use as a Python variable or database column name</li>
          <li>Transforming a blog post title to title case for consistent heading capitalization</li>
          <li>Converting a phrase to camelCase or PascalCase for JavaScript function or class names</li>
          <li>Fixing ALL CAPS text copied from a legacy system back to readable sentence case</li>
          <li>Converting words to kebab-case for use as CSS class names or URL slugs</li>
        </ul>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">How to Use</h2>
        <p>Paste or type your text in the input field. All case conversions appear instantly in the output panels below. Click the Copy button next to any format to copy that result to clipboard. No settings or configuration required.</p>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">What is the difference between camelCase and PascalCase?</summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">In camelCase the first word is lowercase and subsequent words are capitalized (myVariableName). In PascalCase (also called UpperCamelCase) every word including the first is capitalized (MyVariableName). PascalCase is common for class names while camelCase is used for variables and function names.</p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">When should I use snake_case vs kebab-case?</summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">snake_case (underscores) is standard for Python variables, function names, and database column names. kebab-case (hyphens) is used for CSS class names, HTML attributes, and URL slugs. JavaScript and TypeScript typically use camelCase for variables and PascalCase for classes.</p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Does title case capitalize every word?</summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">Standard title case capitalizes major words but lowercases short prepositions (of, in, at), conjunctions (and, but, or), and articles (a, an, the) unless they are the first word. Simple title case tools may capitalize all words regardless of grammatical function.</p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">How is sentence case different from lowercase?</summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">Sentence case capitalizes only the first letter of the first word in each sentence, matching normal written English. Lowercase converts all characters to lowercase with no capitalization at all. Sentence case is more readable for body text while lowercase is often used for technical identifiers.</p>
          </details>
        </div>
      </div>
    </ToolLayout>
  );
}
