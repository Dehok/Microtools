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
            <label className="text-sm font-medium text-gray-700">Markdown Input</label>
            <span className="text-xs text-gray-400">{markdown.length} chars</span>
          </div>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="# Write your Markdown here&#10;&#10;Supports **bold**, *italic*, [links](url), `code`, lists, and more..."
            className="h-[500px] w-full rounded-lg border border-gray-300 bg-gray-50 p-3 font-mono text-sm focus:border-blue-500 focus:outline-none"
            spellCheck={false}
          />
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => setMarkdown(SAMPLE)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Load Sample
            </button>
            <button
              onClick={() => setMarkdown("")}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
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
                  tab === "html" ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                HTML Code
              </button>
              <button
                onClick={() => setTab("preview")}
                className={`text-sm font-medium ${
                  tab === "preview" ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
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
              className="h-[500px] w-full rounded-lg border border-gray-300 bg-gray-50 p-3 font-mono text-xs focus:outline-none"
            />
          ) : (
            <div
              className="prose prose-sm h-[500px] max-w-none overflow-y-auto rounded-lg border border-gray-300 bg-white p-4"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )}
        </div>
      </div>

      {/* SEO Content */}
      <div className="mt-8 border-t border-gray-200 pt-6 text-sm text-gray-600">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">What is Markdown?</h2>
        <p className="mb-3">
          Markdown is a lightweight markup language created by John Gruber in 2004. It allows you to
          write formatted text using a plain-text syntax that is easy to read and write. Markdown is
          widely used for README files, documentation, blogs, forums, and messaging applications.
          Files typically use the <strong>.md</strong> or <strong>.markdown</strong> extension.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Why Convert Markdown to HTML?</h2>
        <p className="mb-3">
          While Markdown is great for writing, browsers render HTML. Converting Markdown to HTML lets
          you use your content on websites, in emails, CMS platforms, or any environment that accepts
          HTML. This converter produces clean, semantic HTML without any inline styles or framework-specific
          classes, making it suitable for any project.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Supported Markdown Syntax</h2>
        <p>
          This converter handles all common Markdown elements: headings (<strong>#</strong> through{" "}
          <strong>######</strong>), <strong>**bold**</strong>, <strong>*italic*</strong>,{" "}
          <strong>[links](url)</strong>, <strong>![images](url)</strong>, inline{" "}
          <strong>`code`</strong>, fenced code blocks with language hints, unordered lists (<strong>-</strong>{" "}
          or <strong>*</strong>), ordered lists (<strong>1.</strong>), blockquotes (<strong>&gt;</strong>),
          horizontal rules (<strong>---</strong>), paragraphs, and line breaks.
        </p>
      </div>
    </ToolLayout>
  );
}
