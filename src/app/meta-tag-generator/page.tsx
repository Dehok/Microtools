"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function charCountColor(len: number, min: number, max: number): string {
  if (len === 0) return "text-gray-400 dark:text-gray-500";
  if (len <= min) return "text-green-600 dark:text-green-400";
  if (len <= max) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
}

export default function MetaTagGenerator() {
  const [pageTitle, setPageTitle] = useState("My Awesome Page");
  const [metaDescription, setMetaDescription] = useState(
    "A brief description of the page content for search engines."
  );
  const [keywords, setKeywords] = useState("web, tools, generator");
  const [author, setAuthor] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [robotsIndex, setRobotsIndex] = useState("index");
  const [robotsFollow, setRobotsFollow] = useState("follow");
  const [viewport, setViewport] = useState("width=device-width, initial-scale=1.0");
  const [charset, setCharset] = useState("UTF-8");
  const [language, setLanguage] = useState("en");

  const generatedTags = useMemo(() => {
    const lines: string[] = [];

    if (charset) {
      lines.push(`<meta charset="${charset}">`);
    }
    if (viewport) {
      lines.push(`<meta name="viewport" content="${viewport}">`);
    }
    if (pageTitle) {
      lines.push(`<title>${pageTitle}</title>`);
    }
    if (metaDescription) {
      lines.push(`<meta name="description" content="${metaDescription}">`);
    }
    if (keywords) {
      lines.push(`<meta name="keywords" content="${keywords}">`);
    }
    if (author) {
      lines.push(`<meta name="author" content="${author}">`);
    }
    lines.push(`<meta name="robots" content="${robotsIndex}, ${robotsFollow}">`);
    if (canonicalUrl) {
      lines.push(`<link rel="canonical" href="${canonicalUrl}">`);
    }
    if (language) {
      lines.push(`<html lang="${language}">`);
    }

    return lines.join("\n");
  }, [
    pageTitle,
    metaDescription,
    keywords,
    author,
    canonicalUrl,
    robotsIndex,
    robotsFollow,
    viewport,
    charset,
    language,
  ]);

  return (
    <ToolLayout
      title="Meta Tag Generator — HTML Meta Tags for SEO"
      description="Generate HTML meta tags for your web pages. Optimize title, description, keywords, robots, and more for better search engine visibility."
      relatedTools={["og-meta-generator", "robots-txt-generator", "url-parser"]}
    >
      <div className="grid gap-6 md:grid-cols-2">
        {/* Form */}
        <div className="space-y-3">
          {/* Page Title */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Page Title
            </label>
            <input
              type="text"
              value={pageTitle}
              onChange={(e) => setPageTitle(e.target.value)}
              placeholder="My Awesome Page"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-2 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
            />
            <div
              className={`mt-0.5 text-right text-[10px] ${charCountColor(
                pageTitle.length,
                50,
                60
              )}`}
            >
              {pageTitle.length}/60 chars
              {pageTitle.length > 0 && pageTitle.length <= 50 && " (good)"}
              {pageTitle.length > 50 && pageTitle.length <= 60 && " (recommended limit)"}
              {pageTitle.length > 60 && " (too long)"}
            </div>
          </div>

          {/* Meta Description */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Meta Description
            </label>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              rows={3}
              placeholder="A brief description of the page content..."
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-2 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
            />
            <div
              className={`mt-0.5 text-right text-[10px] ${charCountColor(
                metaDescription.length,
                150,
                160
              )}`}
            >
              {metaDescription.length}/160 chars
              {metaDescription.length > 0 &&
                metaDescription.length <= 150 &&
                " (good)"}
              {metaDescription.length > 150 &&
                metaDescription.length <= 160 &&
                " (recommended limit)"}
              {metaDescription.length > 160 && " (too long)"}
            </div>
          </div>

          {/* Keywords */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Keywords
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="keyword1, keyword2, keyword3"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-2 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
            />
          </div>

          {/* Author */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Author
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="John Doe"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-2 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
            />
          </div>

          {/* Canonical URL */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Canonical URL
            </label>
            <input
              type="text"
              value={canonicalUrl}
              onChange={(e) => setCanonicalUrl(e.target.value)}
              placeholder="https://example.com/page"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-2 text-sm font-mono focus:border-blue-500 dark:border-blue-400 focus:outline-none"
            />
          </div>

          {/* Robots */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Robots Index
              </label>
              <select
                value={robotsIndex}
                onChange={(e) => setRobotsIndex(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm"
              >
                <option value="index">index</option>
                <option value="noindex">noindex</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Robots Follow
              </label>
              <select
                value={robotsFollow}
                onChange={(e) => setRobotsFollow(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm"
              >
                <option value="follow">follow</option>
                <option value="nofollow">nofollow</option>
              </select>
            </div>
          </div>

          {/* Viewport, Charset, Language */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Viewport
            </label>
            <input
              type="text"
              value={viewport}
              onChange={(e) => setViewport(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-2 text-sm font-mono focus:border-blue-500 dark:border-blue-400 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Charset
              </label>
              <select
                value={charset}
                onChange={(e) => setCharset(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm"
              >
                <option value="UTF-8">UTF-8</option>
                <option value="ISO-8859-1">ISO-8859-1</option>
                <option value="Windows-1252">Windows-1252</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm"
              >
                <option value="en">English (en)</option>
                <option value="es">Spanish (es)</option>
                <option value="fr">French (fr)</option>
                <option value="de">German (de)</option>
                <option value="cs">Czech (cs)</option>
                <option value="pt">Portuguese (pt)</option>
                <option value="zh">Chinese (zh)</option>
                <option value="ja">Japanese (ja)</option>
                <option value="ko">Korean (ko)</option>
                <option value="ar">Arabic (ar)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Preview & Output */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Generated Meta Tags
            </label>
            <CopyButton text={generatedTags} />
          </div>
          <pre className="max-h-96 overflow-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 p-3 font-mono text-[11px] whitespace-pre-wrap">
            {generatedTags}
          </pre>

          {/* Quick tips */}
          <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 dark:bg-blue-950 p-3">
            <h3 className="mb-1 text-xs font-semibold text-blue-800 dark:text-blue-200">
              Quick Tips
            </h3>
            <ul className="space-y-1 text-xs text-blue-700 dark:text-blue-300">
              <li>
                Keep your title between <strong>50-60</strong> characters
              </li>
              <li>
                Keep your description between <strong>150-160</strong>{" "}
                characters
              </li>
              <li>
                Use <strong>noindex</strong> for pages you do not want in search
                results
              </li>
              <li>
                Always set a <strong>canonical URL</strong> to avoid duplicate
                content issues
              </li>
            </ul>
          </div>
        </div>
      </div>

      
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The Meta Tag Generator is a free online tool available on CodeUtilo. Generate HTML meta tags for SEO. Title, description, viewport, robots, and canonical tags. All processing happens directly in your browser — no data is ever sent to any server, ensuring your privacy and security. No signup or installation is required.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> — All meta tag generator operations run locally in your browser using JavaScript. Your data never leaves your device.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Instant Results</strong> — Get results immediately as you type or paste your input. No waiting for server responses or page reloads.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> — Use the meta tag generator as many times as you need without creating an account or paying anything.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Mobile Friendly</strong> — Works on desktop, tablet, and mobile browsers. Access this tool from any device with an internet connection.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Using the meta tag generator for day-to-day development tasks</li>
          <li>Saving time on repetitive tasks by using a browser-based tool instead of writing custom code</li>
          <li>Working on projects where installing software is not an option (school, work, shared computers)</li>
          <li>Quick prototyping and debugging without switching to a terminal or IDE</li>
          <li>Sharing the tool link with colleagues who need the same functionality</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Enter your input in the text area provided and the meta tag generator will process it instantly. Use the Copy button to copy the result to your clipboard. All operations are performed locally in your browser — no data is transmitted to any server.
        </p>
      </div>
    </ToolLayout>
  );
}
