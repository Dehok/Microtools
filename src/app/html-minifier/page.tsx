"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

// ---------- Minifier ----------

function minifyHTML(html: string): string {
  return html
    // Remove HTML comments (but keep IE conditionals)
    .replace(/<!--(?!\[if)[\s\S]*?-->/g, "")
    // Collapse whitespace between tags
    .replace(/>\s+</g, "><")
    // Trim leading/trailing whitespace in text nodes
    .replace(/^\s+|\s+$/gm, "")
    // Collapse multiple spaces into one (inside tags / attributes)
    .replace(/[ \t]+/g, " ")
    // Remove newlines
    .replace(/\n+/g, "")
    .trim();
}

// ---------- Beautifier ----------

type IndentStyle = "2" | "4" | "tab";

function getIndent(style: IndentStyle): string {
  if (style === "tab") return "\t";
  if (style === "4") return "    ";
  return "  ";
}

// Tags that are self-closing (void elements)
const VOID_TAGS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input",
  "link", "meta", "param", "source", "track", "wbr",
]);

// Tags whose content should not be re-indented (preserve inner whitespace)
const RAW_TAGS = new Set(["script", "style", "pre", "textarea"]);

function beautifyHTML(html: string, indentStyle: IndentStyle): string {
  const indent = getIndent(indentStyle);
  const result: string[] = [];
  let level = 0;
  let insideRaw = false;
  let rawTag = "";

  // Tokenize: match tags, comments, and text nodes
  const TOKEN = /<!--[\s\S]*?-->|<\/?[a-zA-Z][^\s>\/]*(?:\s[^>]*)?\s*\/?>|[^<]+/g;
  let match: RegExpExecArray | null;

  while ((match = TOKEN.exec(html)) !== null) {
    const token = match[0];

    // --- Comment ---
    if (token.startsWith("<!--")) {
      result.push(indent.repeat(level) + token.trim());
      continue;
    }

    // --- Tag ---
    if (token.startsWith("<")) {
      const tagMatch = token.match(/^<\/?([a-zA-Z][^\s>\/]*)/);
      const tagName = tagMatch ? tagMatch[1].toLowerCase() : "";
      const isClosing = token.startsWith("</");
      const isSelfClose = token.endsWith("/>") || VOID_TAGS.has(tagName);

      // Handle raw tag end
      if (isClosing && RAW_TAGS.has(tagName) && insideRaw && tagName === rawTag) {
        insideRaw = false;
        level = Math.max(0, level - 1);
        result.push(indent.repeat(level) + token.trim());
        continue;
      }

      // Inside raw block: just push verbatim
      if (insideRaw) {
        result.push(token);
        continue;
      }

      if (isClosing) {
        level = Math.max(0, level - 1);
        result.push(indent.repeat(level) + token.trim());
      } else if (isSelfClose) {
        result.push(indent.repeat(level) + token.trim());
      } else {
        result.push(indent.repeat(level) + token.trim());
        level++;
        // Enter raw block
        if (RAW_TAGS.has(tagName)) {
          insideRaw = true;
          rawTag = tagName;
        }
      }
      continue;
    }

    // --- Text node ---
    const text = token.trim();
    if (text === "") continue;

    if (insideRaw) {
      // Preserve raw text as-is but push each line with current indent
      const lines = token.split("\n");
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed) result.push(indent.repeat(level) + trimmed);
      }
    } else {
      result.push(indent.repeat(level) + text);
    }
  }

  return result.join("\n").trim();
}

// ---------- Sample HTML ----------

const SAMPLE = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Example Page</title>
<!-- This comment will be removed when minifying -->
<style>body{margin:0;font-family:sans-serif}h1{color:#333}</style>
</head>
<body>
<header><h1>Hello World</h1><nav><a href="/">Home</a><a href="/about">About</a></nav></header>
<main><p>This is a    sample HTML page   with extra whitespace.</p></main>
<footer><p>&copy; 2026 CodeUtilo</p></footer>
</body>
</html>`;

// ---------- Component ----------

export default function HTMLMinifier() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [indentStyle, setIndentStyle] = useState<IndentStyle>("2");

  const stats = useMemo(() => {
    const orig = input.length;
    const out = output.length;
    const saved = orig > 0 && out > 0 ? orig - out : 0;
    const percent = orig > 0 && saved > 0
      ? ((saved / orig) * 100).toFixed(1)
      : "0";
    return { orig, out, saved, percent };
  }, [input, output]);

  const handleMinify = () => {
    if (!input.trim()) return;
    setOutput(minifyHTML(input));
  };

  const handleBeautify = () => {
    if (!input.trim()) return;
    setOutput(beautifyHTML(input, indentStyle));
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
  };

  const handleSample = () => {
    setInput(SAMPLE);
    setOutput("");
  };

  return (
    <ToolLayout
      title="HTML Minifier & Beautifier Online"
      description="Minify HTML to reduce file size or beautify compressed HTML for readability. Free online HTML formatter and compressor."
      relatedTools={["css-minifier", "js-minifier", "xml-formatter"]}
    >
      {/* Controls */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          onClick={handleMinify}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Minify
        </button>
        <button
          onClick={handleBeautify}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
        >
          Beautify
        </button>

        {/* Indent selector (only relevant for beautify) */}
        <select
          value={indentStyle}
          onChange={(e) => setIndentStyle(e.target.value as IndentStyle)}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 focus:border-blue-500 dark:border-blue-400 focus:outline-none"
          title="Indent style for Beautify"
        >
          <option value="2">2 spaces</option>
          <option value="4">4 spaces</option>
          <option value="tab">Tab</option>
        </select>

        <button
          onClick={handleClear}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
        >
          Clear
        </button>
        <button
          onClick={handleSample}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
        >
          Sample
        </button>

        {stats.saved > 0 && (
          <span className="ml-auto text-sm font-medium text-green-600 dark:text-green-400">
            Saved {stats.saved} bytes ({stats.percent}%)
          </span>
        )}
      </div>

      {/* Stats bar */}
      {(stats.orig > 0 || stats.out > 0) && (
        <div className="mb-4 flex flex-wrap gap-4 rounded-lg bg-gray-50 dark:bg-gray-950 px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
          <span>
            Original: <strong className="text-gray-900 dark:text-gray-100">{stats.orig.toLocaleString()} chars</strong>
          </span>
          <span>
            Output: <strong className="text-gray-900 dark:text-gray-100">{stats.out.toLocaleString()} chars</strong>
          </span>
          {stats.saved > 0 && (
            <span>
              Reduction: <strong className="text-green-700 dark:text-green-300">{stats.percent}%</strong>
            </span>
          )}
          {stats.out > stats.orig && stats.orig > 0 && (
            <span className="text-amber-600">
              Expanded by {(stats.out - stats.orig).toLocaleString()} chars (beautified)
            </span>
          )}
        </div>
      )}

      {/* Textareas */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Input HTML</label>
            <span className="text-xs text-gray-400 dark:text-gray-500">{input.length} chars</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your HTML here..."
            className="h-80 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
            spellCheck={false}
          />
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Output</label>
            <CopyButton text={output} />
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="Result will appear here..."
            className="h-80 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 font-mono text-sm"
            spellCheck={false}
          />
        </div>
      </div>

      {/* SEO content */}
      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">What is HTML Minification?</h2>
        <p className="mb-3">
          HTML minification is the process of removing unnecessary characters from HTML source
          code without changing its functionality. This includes stripping whitespace, line
          breaks, comments, and other non-essential characters. The result is a smaller file
          that browsers download faster, directly improving page load time and Core Web Vitals scores.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">What does this tool remove?</h2>
        <p className="mb-3">
          The minifier removes HTML comments, collapses consecutive whitespace between tags,
          and trims leading/trailing spaces from each line. IE conditional comments
          (<code className="rounded bg-gray-100 dark:bg-gray-800 px-1 font-mono">{"<!--[if IE]>...<![endif]-->"}</code>)
          are preserved since they affect browser behavior.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">When to use HTML Beautify?</h2>
        <p className="mb-3">
          Beautifying HTML adds proper indentation and line breaks, making the markup much
          easier to read and maintain. It is useful when you receive a minified HTML file
          and need to understand or debug its structure. You can choose between 2-space,
          4-space, or tab indentation to match your coding style.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">How much can HTML be compressed?</h2>
        <p>
          Typical HTML files can be reduced by 10–30% through minification alone, depending
          on how much whitespace and how many comments the original file contains.
          When combined with server-side Gzip or Brotli compression, total transfer size
          reductions of 60–80% are common. Most modern web servers and CDNs apply
          text compression automatically, so minification provides an additional layer of savings.
        </p>
      </div>
    
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The HTML Minifier is a free online tool available on CodeUtilo. Minify or beautify HTML code. Remove whitespace and comments to reduce file size. All processing happens directly in your browser — no data is ever sent to any server, ensuring your privacy and security. No signup or installation is required.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> — All html minifier operations run locally in your browser using JavaScript. Your data never leaves your device.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Instant Results</strong> — Get results immediately as you type or paste your input. No waiting for server responses or page reloads.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> — Use the html minifier as many times as you need without creating an account or paying anything.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Mobile Friendly</strong> — Works on desktop, tablet, and mobile browsers. Access this tool from any device with an internet connection.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Using the html minifier for day-to-day development tasks</li>
          <li>Saving time on repetitive tasks by using a browser-based tool instead of writing custom code</li>
          <li>Working on projects where installing software is not an option (school, work, shared computers)</li>
          <li>Quick prototyping and debugging without switching to a terminal or IDE</li>
          <li>Sharing the tool link with colleagues who need the same functionality</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Enter your input in the text area provided and the html minifier will process it instantly. Use the Copy button to copy the result to your clipboard. All operations are performed locally in your browser — no data is transmitted to any server.
        </p>
      
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Is the HTML Minifier free to use?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes, the HTML Minifier is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Is my data safe when using this tool?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Does this tool work on mobile devices?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes. The HTML Minifier is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Do I need to install anything?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. The HTML Minifier runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately.
            </p>
          </details>
        </div>
</div>
    </ToolLayout>
  );
}
