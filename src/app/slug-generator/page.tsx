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
      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
        Enter text
      </label>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='e.g. "My Blog Post Title! (2026)"'
        className="mb-4 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-2 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
      />

      {/* Options */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">Separator:</label>
          <select
            value={separator}
            onChange={(e) => setSeparator(e.target.value)}
            className="rounded-md border border-gray-300 dark:border-gray-600 px-2 py-1 text-sm"
          >
            <option value="-">Hyphen (-)</option>
            <option value="_">Underscore (_)</option>
            <option value=".">Dot (.)</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">Max length:</label>
          <select
            value={maxLength}
            onChange={(e) => setMaxLength(Number(e.target.value))}
            className="rounded-md border border-gray-300 dark:border-gray-600 px-2 py-1 text-sm"
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
      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
        Generated Slug
      </label>
      <div className="flex items-center gap-2">
        <div className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-2 font-mono text-sm select-all">
          {slug || <span className="text-gray-400 dark:text-gray-500">slug-will-appear-here</span>}
        </div>
        <CopyButton text={slug} />
      </div>
      <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
        {slug.length} characters
      </div>

      {/* Live examples */}
      {input && (
        <div className="mt-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 p-3">
          <div className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">Preview in URL:</div>
          <code className="text-sm text-gray-700 dark:text-gray-300">
            https://example.com/blog/<span className="text-blue-600 dark:text-blue-400 font-medium">{slug}</span>
          </code>
        </div>
      )}

      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">What is a URL Slug?</h2>
        <p className="mb-3">
          A slug is the URL-friendly version of a title or text. It contains only lowercase
          letters, numbers, and hyphens. Slugs are used in blog URLs, e-commerce product
          pages, and any web page that needs a clean, readable URL.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Why are slugs important for SEO?</h2>
        <p>
          Search engines prefer clean, descriptive URLs. A slug like &quot;best-coffee-machines-2026&quot;
          is more SEO-friendly than &quot;post?id=12345&quot;. Good slugs improve click-through rates
          and help search engines understand the page content.
        </p>
      </div>
    
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The Slug Generator converts any text into a clean, URL-friendly slug. Slugs are the human-readable portion of a URL that identifies a page, such as &quot;my-blog-post&quot; in &quot;example.com/blog/my-blog-post&quot;. Good slugs improve SEO, readability, and user experience.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Instant Conversion</strong> — Transforms text to a URL-friendly slug in real time as you type.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Special Character Handling</strong> — Removes or transliterates accented characters, symbols, and non-ASCII characters.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Lowercase &amp; Hyphenated</strong> — Converts all text to lowercase and replaces spaces with hyphens for URL compatibility.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Clean Output</strong> — Removes consecutive hyphens, leading/trailing hyphens, and invalid URL characters.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Generating URL slugs for blog posts, product pages, and CMS content</li>
          <li>Creating SEO-friendly URLs that include target keywords</li>
          <li>Converting article titles to slugs for static site generators (Next.js, Hugo, Jekyll)</li>
          <li>Generating file names from titles for content management systems</li>
          <li>Creating clean permalink structures for web applications</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Type or paste your text (e.g., a blog post title) into the input field. The URL-friendly slug is generated instantly. Copy the slug with the Copy button and use it in your URLs.
        </p>
      </div>
    </ToolLayout>
  );
}
