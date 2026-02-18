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

const EXAMPLE = `p-4 flex bg-red-500 text-white items-center mt-2 hover:bg-red-600 rounded-lg shadow-md w-full justify-between font-bold text-lg mb-4 border border-gray-200 transition duration-200 cursor-pointer relative z-10 overflow-hidden`;

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
        <button onClick={() => setInput(EXAMPLE)} className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200">Load Example</button>
        <button onClick={() => setInput("")} className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200">Clear</button>
      </div>

      {/* Input */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">Input (class string, className=&quot;...&quot;, or class=&quot;...&quot;)</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='p-4 flex bg-red-500 text-white items-center mt-2 hover:bg-red-600 rounded-lg'
          className="h-32 w-full rounded-lg border border-gray-300 p-3 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          spellCheck={false}
        />
      </div>

      {/* Output */}
      {result.sorted && (
        <>
          <div className="mb-4">
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Sorted Output</label>
              <CopyButton text={result.sorted} />
            </div>
            <div className="rounded-lg border border-green-200 bg-green-50 p-3 font-mono text-sm text-gray-800">
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
            <div className="rounded-lg bg-blue-50 px-3 py-2 text-sm">
              <span className="font-medium text-blue-700">{result.classes.length}</span>{" "}
              <span className="text-blue-600">classes</span>
            </div>
            <div className="rounded-lg bg-purple-50 px-3 py-2 text-sm">
              <span className="font-medium text-purple-700">{result.categories.size}</span>{" "}
              <span className="text-purple-600">categories</span>
            </div>
            <div className="rounded-lg bg-yellow-50 px-3 py-2 text-sm">
              <span className="font-medium text-yellow-700">{movedClasses.size}</span>{" "}
              <span className="text-yellow-600">moved</span>
            </div>
          </div>

          {/* Categories Breakdown */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">Category Breakdown</label>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from(result.categories.entries()).map(([cat, classes]) => (
                <div key={cat} className="rounded-lg border border-gray-200 p-3">
                  <div className="mb-1 text-xs font-medium text-gray-500">{cat}</div>
                  <div className="flex flex-wrap gap-1">
                    {classes.map((cls, i) => (
                      <span key={i} className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-700">{cls}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* SEO Content */}
      <section className="mt-12 space-y-6 text-gray-700">
        <h2 className="text-2xl font-bold text-gray-900">Why Sort Tailwind CSS Classes?</h2>
        <p>
          Sorting Tailwind CSS classes in a consistent order improves code readability and maintainability.
          The recommended order follows the &ldquo;outside-in&rdquo; principle: layout first, then spacing, sizing,
          typography, visual styles, and finally state variants. This is the same order used by
          prettier-plugin-tailwindcss, the official Prettier plugin.
        </p>
        <h2 className="text-2xl font-bold text-gray-900">How Does the Sorting Work?</h2>
        <p>
          Classes are grouped into categories: Layout, Flexbox/Grid, Spacing, Sizing, Typography, Backgrounds,
          Borders, Effects, Filters, Transitions, Transforms, and Interactivity. Within each category, classes
          maintain their relative order. Responsive and state variants (hover:, focus:, sm:, md:) are sorted
          after their base classes.
        </p>
        <h2 className="text-2xl font-bold text-gray-900">How to Use This Tool</h2>
        <p>
          Paste your Tailwind class string, a className=&ldquo;...&rdquo; attribute from JSX, or a class=&ldquo;...&rdquo;
          from HTML. The tool extracts and sorts the classes automatically. Yellow-highlighted classes in the output
          indicate classes that were moved from their original position.
        </p>
      </section>
    </ToolLayout>
  );
}
