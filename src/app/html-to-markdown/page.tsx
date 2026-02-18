"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function htmlToMarkdown(html: string): string {
  let md = html;

  // Headings
  md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, "# $1\n\n");
  md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, "## $1\n\n");
  md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, "### $1\n\n");
  md = md.replace(/<h4[^>]*>(.*?)<\/h4>/gi, "#### $1\n\n");
  md = md.replace(/<h5[^>]*>(.*?)<\/h5>/gi, "##### $1\n\n");
  md = md.replace(/<h6[^>]*>(.*?)<\/h6>/gi, "###### $1\n\n");

  // Bold and italic
  md = md.replace(/<(strong|b)[^>]*>(.*?)<\/\1>/gi, "**$2**");
  md = md.replace(/<(em|i)[^>]*>(.*?)<\/\1>/gi, "*$2*");
  md = md.replace(/<(del|s|strike)[^>]*>(.*?)<\/\1>/gi, "~~$2~~");

  // Code
  md = md.replace(/<code[^>]*>(.*?)<\/code>/gi, "`$1`");
  md = md.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, "```\n$1\n```\n\n");
  md = md.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, "```\n$1\n```\n\n");

  // Links and images
  md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, "[$2]($1)");
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, "![$2]($1)");
  md = md.replace(/<img[^>]*alt="([^"]*)"[^>]*src="([^"]*)"[^>]*\/?>/gi, "![$1]($2)");
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, "![]($1)");

  // Lists
  md = md.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, content) => {
    return content.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, "- $1\n") + "\n";
  });
  md = md.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, content) => {
    let i = 1;
    return content.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, () => `${i++}. ` + "$1\n") + "\n";
  });

  // Blockquote
  md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, content) => {
    return content.trim().split("\n").map((line: string) => `> ${line.trim()}`).join("\n") + "\n\n";
  });

  // Horizontal rule
  md = md.replace(/<hr[^>]*\/?>/gi, "\n---\n\n");

  // Line breaks and paragraphs
  md = md.replace(/<br[^>]*\/?>/gi, "\n");
  md = md.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, "$1\n\n");

  // Remove remaining HTML tags
  md = md.replace(/<[^>]+>/g, "");

  // Decode common HTML entities
  md = md.replace(/&amp;/g, "&");
  md = md.replace(/&lt;/g, "<");
  md = md.replace(/&gt;/g, ">");
  md = md.replace(/&quot;/g, '"');
  md = md.replace(/&#39;/g, "'");
  md = md.replace(/&nbsp;/g, " ");

  // Clean up excessive newlines
  md = md.replace(/\n{3,}/g, "\n\n");

  return md.trim();
}

const SAMPLE = `<h1>Welcome to CodeUtilo</h1>
<p>This is a <strong>free online</strong> tool for converting <em>HTML to Markdown</em>.</p>
<h2>Features</h2>
<ul>
  <li>Convert <code>&lt;strong&gt;</code> to <strong>bold</strong></li>
  <li>Convert <code>&lt;em&gt;</code> to <em>italic</em></li>
  <li>Handle <a href="https://example.com">links</a> and images</li>
</ul>
<blockquote>This tool processes everything in your browser. No data is sent to any server.</blockquote>
<p>Try it now!</p>`;

export default function HtmlToMarkdown() {
  const [input, setInput] = useState("");

  const output = useMemo(() => {
    if (!input.trim()) return "";
    return htmlToMarkdown(input);
  }, [input]);

  return (
    <ToolLayout
      title="HTML to Markdown Converter Online"
      description="Convert HTML to Markdown format. Handles headings, lists, links, bold, italic, code blocks, and more."
      relatedTools={["markdown-preview", "html-encoder-decoder", "css-minifier"]}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">HTML Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste HTML here..."
            className="h-64 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 font-mono text-xs focus:border-blue-500 dark:border-blue-400 focus:outline-none"
            spellCheck={false}
          />
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => setInput(SAMPLE)}
              className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
            >
              Sample
            </button>
            <button
              onClick={() => setInput("")}
              className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
            >
              Clear
            </button>
          </div>
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Markdown Output</label>
            <CopyButton text={output} />
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="Markdown will appear here..."
            className="h-64 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 font-mono text-xs"
          />
        </div>
      </div>

      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">HTML to Markdown Conversion</h2>
        <p className="mb-3">
          This tool converts common HTML elements to their Markdown equivalents: headings to #,
          bold to **, italic to *, lists to - and numbered items, links to [text](url),
          code blocks to backticks, and blockquotes to &gt;.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">When to Convert</h2>
        <p>
          Convert HTML to Markdown when migrating content between CMS platforms, writing documentation,
          creating README files, or converting web content for use in Markdown-based tools like GitHub,
          Notion, or static site generators.
        </p>
      </div>
    
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The HTML to Markdown is a free online tool available on CodeUtilo. Convert HTML to Markdown format. Handles headings, lists, links, and more. All processing happens directly in your browser — no data is ever sent to any server, ensuring your privacy and security. No signup or installation is required.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> — All html to markdown operations run locally in your browser using JavaScript. Your data never leaves your device.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Instant Results</strong> — Get results immediately as you type or paste your input. No waiting for server responses or page reloads.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> — Use the html to markdown as many times as you need without creating an account or paying anything.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Mobile Friendly</strong> — Works on desktop, tablet, and mobile browsers. Access this tool from any device with an internet connection.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Using the html to markdown for day-to-day development tasks</li>
          <li>Saving time on repetitive tasks by using a browser-based tool instead of writing custom code</li>
          <li>Working on projects where installing software is not an option (school, work, shared computers)</li>
          <li>Quick prototyping and debugging without switching to a terminal or IDE</li>
          <li>Sharing the tool link with colleagues who need the same functionality</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Enter your input in the text area provided and the html to markdown will process it instantly. Use the Copy button to copy the result to your clipboard. All operations are performed locally in your browser — no data is transmitted to any server.
        </p>
      
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Is the HTML to Markdown free to use?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes, the HTML to Markdown is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need.
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
              Yes. The HTML to Markdown is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Do I need to install anything?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. The HTML to Markdown runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately.
            </p>
          </details>
        </div>
</div>
    </ToolLayout>
  );
}
