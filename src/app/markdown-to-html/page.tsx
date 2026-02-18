"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function markdownToHtml(md: string): string {
  if (!md.trim()) return "";

  let html = md;

  // Step 1: Protect code blocks (``` ... ```)
  const codeBlocks: string[] = [];
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const escaped = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    const langAttr = lang ? ` class="language-${lang}"` : "";
    codeBlocks.push(`<pre><code${langAttr}>${escaped}</code></pre>`);
    return `%%CODEBLOCK_${codeBlocks.length - 1}%%`;
  });

  // Protect inline code
  const inlineCodes: string[] = [];
  html = html.replace(/`([^`]+)`/g, (_, code) => {
    const escaped = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    inlineCodes.push(`<code>${escaped}</code>`);
    return `%%INLINECODE_${inlineCodes.length - 1}%%`;
  });

  // Step 2: Block elements

  // Headings
  html = html.replace(/^######\s+(.+)$/gm, "<h6>$1</h6>");
  html = html.replace(/^#####\s+(.+)$/gm, "<h5>$1</h5>");
  html = html.replace(/^####\s+(.+)$/gm, "<h4>$1</h4>");
  html = html.replace(/^###\s+(.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^##\s+(.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^#\s+(.+)$/gm, "<h1>$1</h1>");

  // Horizontal rules (must be before list processing)
  html = html.replace(/^---+$/gm, "<hr />");

  // Blockquotes
  html = html.replace(/^(?:>\s+(.+)\n?)+/gm, (match) => {
    const lines = match
      .split("\n")
      .filter((l) => l.trim())
      .map((l) => l.replace(/^>\s+/, "").trim());
    return `<blockquote>\n<p>${lines.join("<br />\n")}</p>\n</blockquote>`;
  });

  // Unordered lists (- or *)
  html = html.replace(/^(?:[-*]\s+.+\n?)+/gm, (match) => {
    const items = match
      .trim()
      .split("\n")
      .filter((l) => l.trim())
      .map((l) => `  <li>${l.replace(/^[-*]\s+/, "")}</li>`)
      .join("\n");
    return `<ul>\n${items}\n</ul>`;
  });

  // Ordered lists
  html = html.replace(/^(?:\d+\.\s+.+\n?)+/gm, (match) => {
    const items = match
      .trim()
      .split("\n")
      .filter((l) => l.trim())
      .map((l) => `  <li>${l.replace(/^\d+\.\s+/, "")}</li>`)
      .join("\n");
    return `<ol>\n${items}\n</ol>`;
  });

  // Step 3: Inline elements

  // Images (before links to avoid conflict)
  html = html.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    '<img src="$2" alt="$1" />'
  );

  // Links
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2">$1</a>'
  );

  // Bold & italic combined
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // Italic
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Strikethrough
  html = html.replace(/~~(.+?)~~/g, "<del>$1</del>");

  // Step 4: Paragraphs - wrap remaining plain text blocks
  html = html
    .split("\n\n")
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      if (
        trimmed.startsWith("<h") ||
        trimmed.startsWith("<pre") ||
        trimmed.startsWith("<blockquote") ||
        trimmed.startsWith("<hr") ||
        trimmed.startsWith("<ul") ||
        trimmed.startsWith("<ol") ||
        trimmed.startsWith("<img") ||
        trimmed.startsWith("%%CODEBLOCK")
      )
        return trimmed;
      return `<p>${trimmed.replace(/\n/g, "<br />\n")}</p>`;
    })
    .join("\n\n");

  // Step 5: Restore protected code blocks and inline code
  codeBlocks.forEach((block, i) => {
    html = html.replace(`%%CODEBLOCK_${i}%%`, block);
  });
  inlineCodes.forEach((code, i) => {
    html = html.replace(`%%INLINECODE_${i}%%`, code);
  });

  return html.trim();
}

const SAMPLE = `# Markdown to HTML

## Introduction

This tool converts **Markdown** to clean, semantic *HTML*. It runs entirely in your browser.

### Supported Features

- **Headings** from h1 to h6
- **Bold**, *italic*, and ~~strikethrough~~ text
- [Links](https://www.codeutilo.com) and images
- Inline \`code\` and fenced code blocks
- Ordered and unordered lists
- Blockquotes and horizontal rules

### Code Example

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

> Markdown is the most popular lightweight markup language used across GitHub, documentation sites, and blogs.

---

1. Write Markdown on the left
2. See HTML output on the right
3. Copy and use anywhere

*Try editing this sample to explore all features!*`;

export default function MarkdownToHtml() {
  const [markdown, setMarkdown] = useState("");
  const [tab, setTab] = useState<"html" | "preview">("html");

  const html = useMemo(() => markdownToHtml(markdown), [markdown]);

  return (
    <ToolLayout
      title="Markdown to HTML Converter"
      description="Convert Markdown to clean, semantic HTML. Supports headings, bold, italic, links, images, code blocks, lists, blockquotes, and more."
      relatedTools={["html-to-markdown", "markdown-preview", "markdown-table-generator"]}
    >
      <div className="grid gap-4 md:grid-cols-2">
        {/* Markdown Input */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Markdown Input</label>
            <span className="text-xs text-gray-400 dark:text-gray-500">{markdown.length} chars</span>
          </div>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="# Write your Markdown here&#10;&#10;Supports **bold**, *italic*, [links](url), `code`, lists, and more..."
            className="h-[500px] w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
            spellCheck={false}
          />
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => setMarkdown(SAMPLE)}
              className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
            >
              Load Sample
            </button>
            <button
              onClick={() => setMarkdown("")}
              className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
            >
              Clear
            </button>
          </div>
        </div>

        {/* HTML Output */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setTab("html")}
                className={`text-sm font-medium ${
                  tab === "html" ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:text-gray-400"
                }`}
              >
                HTML Code
              </button>
              <button
                onClick={() => setTab("preview")}
                className={`text-sm font-medium ${
                  tab === "preview" ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:text-gray-400"
                }`}
              >
                Preview
              </button>
            </div>
            <CopyButton text={html} />
          </div>
          {tab === "html" ? (
            <textarea
              value={html}
              readOnly
              placeholder="HTML output will appear here..."
              className="h-[500px] w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 font-mono text-xs focus:outline-none"
            />
          ) : (
            <div
              className="prose prose-sm h-[500px] max-w-none overflow-y-auto rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 p-4"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )}
        </div>
      </div>

      
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The Markdown to HTML is a free online tool available on CodeUtilo. Convert Markdown text to clean HTML code. Supports headings, lists, links, and code blocks. All processing happens directly in your browser — no data is ever sent to any server, ensuring your privacy and security. No signup or installation is required.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> — All markdown to html operations run locally in your browser using JavaScript. Your data never leaves your device.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Instant Results</strong> — Get results immediately as you type or paste your input. No waiting for server responses or page reloads.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> — Use the markdown to html as many times as you need without creating an account or paying anything.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Mobile Friendly</strong> — Works on desktop, tablet, and mobile browsers. Access this tool from any device with an internet connection.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Using the markdown to html for day-to-day development tasks</li>
          <li>Saving time on repetitive tasks by using a browser-based tool instead of writing custom code</li>
          <li>Working on projects where installing software is not an option (school, work, shared computers)</li>
          <li>Quick prototyping and debugging without switching to a terminal or IDE</li>
          <li>Sharing the tool link with colleagues who need the same functionality</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Enter your input in the text area provided and the markdown to html will process it instantly. Use the Copy button to copy the result to your clipboard. All operations are performed locally in your browser — no data is transmitted to any server.
        </p>
      
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Is the Markdown to HTML free to use?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes, the Markdown to HTML is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need.
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
              Yes. The Markdown to HTML is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Do I need to install anything?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. The Markdown to HTML runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately.
            </p>
          </details>
        </div>
</div>
    </ToolLayout>
  );
}
