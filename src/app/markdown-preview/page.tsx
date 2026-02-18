"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function parseMarkdown(md: string): string {
  let html = md;

  // Code blocks (```)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-gray-100 dark:bg-gray-800 rounded p-3 overflow-x-auto text-sm font-mono my-2"><code>$2</code></pre>');

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 rounded px-1.5 py-0.5 text-sm font-mono">$1</code>');

  // Headers
  html = html.replace(/^######\s+(.+)$/gm, '<h6 class="text-sm font-bold mt-4 mb-1">$1</h6>');
  html = html.replace(/^#####\s+(.+)$/gm, '<h5 class="text-base font-bold mt-4 mb-1">$1</h5>');
  html = html.replace(/^####\s+(.+)$/gm, '<h4 class="text-lg font-bold mt-4 mb-1">$1</h4>');
  html = html.replace(/^###\s+(.+)$/gm, '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>');
  html = html.replace(/^##\s+(.+)$/gm, '<h2 class="text-2xl font-bold mt-6 mb-2">$1</h2>');
  html = html.replace(/^#\s+(.+)$/gm, '<h1 class="text-3xl font-bold mt-6 mb-3">$1</h1>');

  // Bold & italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Strikethrough
  html = html.replace(/~~(.+?)~~/g, "<del>$1</del>");

  // Links
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-blue-600 dark:text-blue-400 underline" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  // Images
  html = html.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    '<img src="$2" alt="$1" class="max-w-full rounded my-2" />'
  );

  // Blockquotes
  html = html.replace(
    /^>\s+(.+)$/gm,
    '<blockquote class="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic text-gray-600 dark:text-gray-400 my-2">$1</blockquote>'
  );

  // Horizontal rule
  html = html.replace(/^---$/gm, '<hr class="my-4 border-gray-300 dark:border-gray-600" />');

  // Unordered lists
  html = html.replace(/^[-*]\s+(.+)$/gm, '<li class="ml-4 list-disc">$1</li>');

  // Ordered lists
  html = html.replace(/^\d+\.\s+(.+)$/gm, '<li class="ml-4 list-decimal">$1</li>');

  // Paragraphs
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
        trimmed.startsWith("<li") ||
        trimmed.startsWith("<ul") ||
        trimmed.startsWith("<ol")
      )
        return trimmed;
      return `<p class="my-2">${trimmed.replace(/\n/g, "<br />")}</p>`;
    })
    .join("\n");

  return html;
}

const SAMPLE = `# Welcome to Markdown Preview

## Features

This tool supports **bold**, *italic*, and ~~strikethrough~~ text.

### Code

Inline \`code\` and code blocks:

\`\`\`javascript
function hello() {
  console.log("Hello, CodeUtilo!");
}
\`\`\`

### Lists

- Item one
- Item two
- Item three

### Links & Quotes

[Visit CodeUtilo](https://www.codeutilo.com)

> This is a blockquote. It can contain **formatted** text.

---

*Start writing your Markdown on the left!*`;

export default function MarkdownPreview() {
  const [markdown, setMarkdown] = useState(SAMPLE);
  const [tab, setTab] = useState<"preview" | "html">("preview");

  const html = useMemo(() => parseMarkdown(markdown), [markdown]);

  return (
    <ToolLayout
      title="Markdown Preview & Editor Online"
      description="Write Markdown and see the rendered preview in real time. Supports headings, bold, italic, code blocks, lists, links, and more."
      relatedTools={["json-formatter", "word-counter", "lorem-ipsum-generator"]}
    >
      <div className="grid gap-4 md:grid-cols-2">
        {/* Editor */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Markdown</label>
            <span className="text-xs text-gray-400 dark:text-gray-500">{markdown.length} chars</span>
          </div>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="Write your Markdown here..."
            className="h-[500px] w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
            spellCheck={false}
          />
        </div>

        {/* Preview */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setTab("preview")}
                className={`text-sm font-medium ${
                  tab === "preview" ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:text-gray-400"
                }`}
              >
                Preview
              </button>
              <button
                onClick={() => setTab("html")}
                className={`text-sm font-medium ${
                  tab === "html" ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:text-gray-400"
                }`}
              >
                HTML
              </button>
            </div>
            <CopyButton text={tab === "html" ? html : markdown} />
          </div>
          {tab === "preview" ? (
            <div
              className="h-[500px] overflow-y-auto rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 p-4 text-sm"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ) : (
            <textarea
              value={html}
              readOnly
              className="h-[500px] w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 font-mono text-xs"
            />
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => setMarkdown("")}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
        >
          Clear
        </button>
        <button
          onClick={() => setMarkdown(SAMPLE)}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
        >
          Load Sample
        </button>
      </div>

      {/* SEO */}
      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">What is Markdown?</h2>
        <p className="mb-3">
          Markdown is a lightweight markup language that lets you format text using simple
          syntax. It is widely used in README files, documentation, blogs, forums (like Reddit),
          and messaging apps. Markdown files use the .md extension.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Markdown Cheat Sheet</h2>
        <p>
          <strong># Heading 1</strong>, <strong>## Heading 2</strong>, <strong>**bold**</strong>,
          <strong> *italic*</strong>, <strong>`code`</strong>, <strong>[link](url)</strong>,
          <strong> ![image](url)</strong>, <strong>- list item</strong>, <strong>&gt; blockquote</strong>,
          <strong> --- horizontal rule</strong>.
        </p>
      </div>
    </ToolLayout>
  );
}
