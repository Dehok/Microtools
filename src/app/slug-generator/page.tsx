"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function generateSlug(text: string, separator: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")   // remove special chars
    .trim()
    .replace(/\s+/g, separator)      // spaces → separator
    .replace(new RegExp(`\\${separator}+`, "g"), separator); // collapse separators
}

export default function SlugGenerator() {
  const [input, setInput] = useState("");
  const [separator, setSeparator] = useState("-");
  const [maxLength, setMaxLength] = useState(0); // 0 = unlimited

  const slug = (() => {
    let s = generateSlug(input, separator);
    if (maxLength > 0 && s.length > maxLength) {
      s = s.slice(0, maxLength).replace(new RegExp(`\\${separator}$`), "");
    }
    return s;
  })();

  return (
    <ToolLayout
      title="URL Slug Generator Online"
      description="Convert any text into a clean, URL-friendly slug. Removes special characters, diacritics, and spaces."
      relatedTools={["url-encoder-decoder", "word-counter", "lorem-ipsum-generator"]}
    >
      {/* Input */}
      <label className="mb-1 block text-sm font-medium text-gray-700">
        Enter text
      </label>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='e.g. "My Blog Post Title! (2026)"'
        className="mb-4 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
      />

      {/* Options */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Separator:</label>
          <select
            value={separator}
            onChange={(e) => setSeparator(e.target.value)}
            className="rounded-md border border-gray-300 px-2 py-1 text-sm"
          >
            <option value="-">Hyphen (-)</option>
            <option value="_">Underscore (_)</option>
            <option value=".">Dot (.)</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Max length:</label>
          <select
            value={maxLength}
            onChange={(e) => setMaxLength(Number(e.target.value))}
            className="rounded-md border border-gray-300 px-2 py-1 text-sm"
          >
            <option value={0}>Unlimited</option>
            <option value={30}>30 chars</option>
            <option value={50}>50 chars</option>
            <option value={75}>75 chars</option>
            <option value={100}>100 chars</option>
          </select>
        </div>
      </div>

      {/* Output */}
      <label className="mb-1 block text-sm font-medium text-gray-700">
        Generated Slug
      </label>
      <div className="flex items-center gap-2">
        <div className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 font-mono text-sm select-all">
          {slug || <span className="text-gray-400">slug-will-appear-here</span>}
        </div>
        <CopyButton text={slug} />
      </div>
      <div className="mt-2 text-xs text-gray-400">
        {slug.length} characters
      </div>

      {/* Live examples */}
      {input && (
        <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
          <div className="mb-1 text-xs font-medium text-gray-500">Preview in URL:</div>
          <code className="text-sm text-gray-700">
            https://example.com/blog/<span className="text-blue-600 font-medium">{slug}</span>
          </code>
        </div>
      )}

      <div className="mt-8 border-t border-gray-200 pt-6 text-sm text-gray-600">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">What is a URL Slug?</h2>
        <p className="mb-3">
          A slug is the URL-friendly version of a title or text. It contains only lowercase
          letters, numbers, and hyphens. Slugs are used in blog URLs, e-commerce product
          pages, and any web page that needs a clean, readable URL.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Why are slugs important for SEO?</h2>
        <p>
          Search engines prefer clean, descriptive URLs. A slug like &quot;best-coffee-machines-2026&quot;
          is more SEO-friendly than &quot;post?id=12345&quot;. Good slugs improve click-through rates
          and help search engines understand the page content.
        </p>
      </div>
    </ToolLayout>
  );
}
