"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const CATEGORY_ORDER: [string, string[]][] = [
  ["Layout", ["container", "block", "inline-block", "inline", "flex", "inline-flex", "grid", "inline-grid", "table", "hidden", "visible", "invisible", "overflow", "static", "fixed", "absolute", "relative", "sticky", "inset", "top", "right", "bottom", "left", "z", "float", "clear", "isolate", "isolation"]],
  ["Flex/Grid", ["flex-row", "flex-col", "flex-wrap", "flex-nowrap", "flex-1", "flex-auto", "flex-initial", "flex-none", "grow", "shrink", "basis", "items", "justify", "self", "place", "gap", "grid-cols", "grid-rows", "col-span", "col-start", "col-end", "row-span", "row-start", "row-end", "auto-cols", "auto-rows", "order"]],
  ["Spacing", ["p-", "px-", "py-", "pt-", "pr-", "pb-", "pl-", "ps-", "pe-", "m-", "mx-", "my-", "mt-", "mr-", "mb-", "ml-", "ms-", "me-", "space-x", "space-y"]],
  ["Sizing", ["w-", "min-w", "max-w", "h-", "min-h", "max-h", "size-"]],
  ["Typography", ["font-", "text-", "leading-", "tracking-", "whitespace-", "break-", "truncate", "uppercase", "lowercase", "capitalize", "normal-case", "italic", "not-italic", "underline", "overline", "line-through", "no-underline", "antialiased", "subpixel"]],
  ["Backgrounds", ["bg-"]],
  ["Borders", ["border", "rounded", "ring", "divide", "outline"]],
  ["Effects", ["shadow", "opacity", "mix-blend", "bg-blend"]],
  ["Filters", ["blur", "brightness", "contrast", "drop-shadow", "grayscale", "hue-rotate", "invert", "saturate", "sepia", "backdrop"]],
  ["Transitions", ["transition", "duration", "ease", "delay", "animate"]],
  ["Transforms", ["transform", "scale", "rotate", "translate", "skew", "origin"]],
  ["Interactivity", ["cursor", "select", "resize", "scroll", "snap", "touch", "appearance", "pointer-events", "will-change"]],
];

const VARIANT_ORDER = ["sm:", "md:", "lg:", "xl:", "2xl:", "dark:", "hover:", "focus:", "focus-within:", "focus-visible:", "active:", "visited:", "disabled:", "first:", "last:", "odd:", "even:", "group-hover:", "peer-"];

function getClassPriority(cls: string): number {
  let base = cls;
  let variantPriority = 0;

  for (let v = 0; v < VARIANT_ORDER.length; v++) {
    if (base.startsWith(VARIANT_ORDER[v])) {
      base = base.slice(VARIANT_ORDER[v].length);
      variantPriority = (v + 1) * 1000;
      break;
    }
  }

  const isNegative = base.startsWith("-");
  if (isNegative) base = base.slice(1);

  for (let c = 0; c < CATEGORY_ORDER.length; c++) {
    const prefixes = CATEGORY_ORDER[c][1];
    for (let p = 0; p < prefixes.length; p++) {
      if (base === prefixes[p] || base.startsWith(prefixes[p])) {
        return variantPriority + c * 100 + p;
      }
    }
  }
  return variantPriority + 9999;
}

function extractClasses(input: string): string {
  const classNameMatch = input.match(/class(?:Name)?\s*=\s*["'`]([^"'`]+)["'`]/);
  if (classNameMatch) return classNameMatch[1];
  return input;
}

const EXAMPLE = `p-4 flex bg-red-500 text-white items-center mt-2 hover:bg-red-600 rounded-lg shadow-md w-full justify-between font-bold text-lg mb-4 border border-gray-200 dark:border-gray-700 transition duration-200 cursor-pointer relative z-10 overflow-hidden`;

export default function TailwindClassSorterPage() {
  const [input, setInput] = useState("");

  const result = useMemo(() => {
    if (!input.trim()) return { sorted: "", classes: [] as string[], categories: new Map<string, string[]>() };
    const raw = extractClasses(input.trim());
    const classes = raw.split(/\s+/).filter(Boolean);
    const sorted = [...classes].sort((a, b) => getClassPriority(a) - getClassPriority(b));

    const categories = new Map<string, string[]>();
    for (const cls of sorted) {
      let base = cls;
      for (const v of VARIANT_ORDER) {
        if (base.startsWith(v)) { base = base.slice(v.length); break; }
      }
      if (base.startsWith("-")) base = base.slice(1);
      let catName = "Other";
      for (const [name, prefixes] of CATEGORY_ORDER) {
        if (prefixes.some((p) => base === p || base.startsWith(p))) {
          catName = name;
          break;
        }
      }
      if (!categories.has(catName)) categories.set(catName, []);
      categories.get(catName)!.push(cls);
    }

    return { sorted: sorted.join(" "), classes: sorted, categories };
  }, [input]);

  const movedClasses = useMemo(() => {
    if (!input.trim() || !result.sorted) return new Set<string>();
    const original = extractClasses(input.trim()).split(/\s+/).filter(Boolean);
    const sorted = result.classes;
    const moved = new Set<string>();
    for (let i = 0; i < original.length; i++) {
      if (original[i] !== sorted[i]) moved.add(original[i]);
    }
    return moved;
  }, [input, result]);

  return (
    <ToolLayout
      title="Tailwind Class Sorter"
      description="Sort Tailwind CSS classes in the recommended order. Paste your class string and get sorted output."
      relatedTools={["tailwind-color-generator", "css-grid-generator", "flexbox-generator"]}
    >
      {/* Buttons */}
      <div className="mb-4 flex gap-2">
        <button onClick={() => setInput(EXAMPLE)} className="rounded-lg bg-gray-100 dark:bg-gray-800 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:bg-gray-700">Load Example</button>
        <button onClick={() => setInput("")} className="rounded-lg bg-gray-100 dark:bg-gray-800 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:bg-gray-700">Clear</button>
      </div>

      {/* Input */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Input (class string, className=&quot;...&quot;, or class=&quot;...&quot;)</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='p-4 flex bg-red-500 text-white items-center mt-2 hover:bg-red-600 rounded-lg'
          className="h-32 w-full rounded-lg border border-gray-300 dark:border-gray-600 p-3 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          spellCheck={false}
        />
      </div>

      {/* Output */}
      {result.sorted && (
        <>
          <div className="mb-4">
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sorted Output</label>
              <CopyButton text={result.sorted} />
            </div>
            <div className="rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950 p-3 font-mono text-sm text-gray-800 dark:text-gray-200">
              {result.classes.map((cls, i) => (
                <span key={i}>
                  <span className={movedClasses.has(cls) ? "rounded bg-yellow-200 px-0.5" : ""}>{cls}</span>
                  {i < result.classes.length - 1 ? " " : ""}
                </span>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="mb-4 flex flex-wrap gap-3">
            <div className="rounded-lg bg-blue-50 dark:bg-blue-950 px-3 py-2 text-sm">
              <span className="font-medium text-blue-700 dark:text-blue-300">{result.classes.length}</span>{" "}
              <span className="text-blue-600 dark:text-blue-400">classes</span>
            </div>
            <div className="rounded-lg bg-purple-50 dark:bg-purple-950 px-3 py-2 text-sm">
              <span className="font-medium text-purple-700 dark:text-purple-300">{result.categories.size}</span>{" "}
              <span className="text-purple-600 dark:text-purple-400">categories</span>
            </div>
            <div className="rounded-lg bg-yellow-50 dark:bg-yellow-950 px-3 py-2 text-sm">
              <span className="font-medium text-yellow-700 dark:text-yellow-300">{movedClasses.size}</span>{" "}
              <span className="text-yellow-600 dark:text-yellow-400">moved</span>
            </div>
          </div>

          {/* Categories Breakdown */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Category Breakdown</label>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from(result.categories.entries()).map(([cat, classes]) => (
                <div key={cat} className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                  <div className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">{cat}</div>
                  <div className="flex flex-wrap gap-1">
                    {classes.map((cls, i) => (
                      <span key={i} className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 font-mono text-xs text-gray-700 dark:text-gray-300">{cls}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The Tailwind Class Sorter is a free online tool available on CodeUtilo. Sort Tailwind CSS classes in the recommended order. Paste your class string and get sorted output. All processing happens directly in your browser — no data is ever sent to any server, ensuring your privacy and security. No signup or installation is required.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> — All tailwind class sorter operations run locally in your browser using JavaScript. Your data never leaves your device.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Instant Results</strong> — Get results immediately as you type or paste your input. No waiting for server responses or page reloads.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> — Use the tailwind class sorter as many times as you need without creating an account or paying anything.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Mobile Friendly</strong> — Works on desktop, tablet, and mobile browsers. Access this tool from any device with an internet connection.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Using the tailwind class sorter for day-to-day development tasks</li>
          <li>Saving time on repetitive tasks by using a browser-based tool instead of writing custom code</li>
          <li>Working on projects where installing software is not an option (school, work, shared computers)</li>
          <li>Quick prototyping and debugging without switching to a terminal or IDE</li>
          <li>Sharing the tool link with colleagues who need the same functionality</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Enter your input in the text area provided and the tailwind class sorter will process it instantly. Use the Copy button to copy the result to your clipboard. All operations are performed locally in your browser — no data is transmitted to any server.
        </p>
      </div>
    </ToolLayout>
  );
}
