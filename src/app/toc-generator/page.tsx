"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const DEFAULT_MARKDOWN = `# Introduction
## Getting Started
### Installation
### Configuration
## Usage
### Basic Usage
### Advanced Features
#### Custom Plugins
#### Themes
## API Reference
### Methods
### Events
## Contributing
## License`;

interface Heading {
  level: number;
  text: string;
  slug: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function TocGenerator() {
  const [input, setInput] = useState(DEFAULT_MARKDOWN);
  const [maxDepth, setMaxDepth] = useState(3);
  const [ordered, setOrdered] = useState(false);
  const [skipH1, setSkipH1] = useState(false);

  const result = useMemo(() => {
    if (!input.trim()) {
      return { toc: "", headings: [] as Heading[], error: "" };
    }

    try {
      const lines = input.split("\n");
      const headings: Heading[] = [];

      for (const line of lines) {
        const match = line.match(/^(#{1,6})\s+(.+)$/);
        if (match) {
          const level = match[1].length;
          const text = match[2].trim();
          headings.push({ level, text, slug: slugify(text) });
        }
      }

      if (headings.length === 0) {
        return { toc: "", headings: [], error: "No headings found in the input." };
      }

      // Filter by options
      const filtered = headings.filter((h) => {
        if (skipH1 && h.level === 1) return false;
        if (h.level > maxDepth) return false;
        return true;
      });

      if (filtered.length === 0) {
        return {
          toc: "",
          headings,
          error: "All headings were filtered out. Try adjusting max depth or skip H1 options.",
        };
      }

      // Find minimum level for proper indentation
      const minLevel = Math.min(...filtered.map((h) => h.level));

      // Build TOC markdown
      const tocLines = filtered.map((h, i) => {
        const indent = "  ".repeat(h.level - minLevel);
        const bullet = ordered ? `${i + 1}.` : "-";
        return `${indent}${bullet} [${h.text}](#${h.slug})`;
      });

      return { toc: tocLines.join("\n"), headings: filtered, error: "" };
    } catch {
      return { toc: "", headings: [] as Heading[], error: "Failed to parse markdown input." };
    }
  }, [input, maxDepth, ordered, skipH1]);

  return (
    <ToolLayout
      title="Table of Contents Generator"
      description="Generate a table of contents from Markdown headings. Create linked TOC with anchor links for README files, documentation, and articles."
      relatedTools={["markdown-preview", "markdown-table-generator", "slug-generator"]}
    >
      {/* Input */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Markdown Input
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={14}
          placeholder="Paste your markdown content here..."
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-2 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
          spellCheck={false}
        />
      </div>

      {/* Options */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">Max depth:</label>
          <select
            value={maxDepth}
            onChange={(e) => setMaxDepth(Number(e.target.value))}
            className="rounded-md border border-gray-300 dark:border-gray-600 px-2 py-1 text-sm"
          >
            {[1, 2, 3, 4, 5, 6].map((d) => (
              <option key={d} value={d}>
                H1{d > 1 ? `\u2013H${d}` : " only"}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">List style:</label>
          <select
            value={ordered ? "ordered" : "unordered"}
            onChange={(e) => setOrdered(e.target.value === "ordered")}
            className="rounded-md border border-gray-300 dark:border-gray-600 px-2 py-1 text-sm"
          >
            <option value="unordered">Unordered (-)</option>
            <option value="ordered">Ordered (1.)</option>
          </select>
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
          <input
            type="checkbox"
            checked={skipH1}
            onChange={(e) => setSkipH1(e.target.checked)}
            className="rounded border-gray-300 dark:border-gray-600"
          />
          Skip H1
        </label>
      </div>

      {/* Error */}
      {result.error && (
        <div className="mb-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 p-3 text-sm text-red-700 dark:text-red-300">
          {result.error}
        </div>
      )}

      {/* Generated TOC */}
      {result.toc && (
        <>
          <div className="mb-4">
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Generated TOC (Markdown)
              </label>
              <CopyButton text={result.toc} />
            </div>
            <pre className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 p-3 font-mono text-xs overflow-x-auto whitespace-pre-wrap">
              {result.toc}
            </pre>
          </div>

          {/* Rendered Preview */}
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Preview
            </label>
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 text-sm">
              {ordered ? (
                <ol className="list-decimal space-y-1 pl-5">
                  {result.headings.map((h, i) => {
                    const minLevel = Math.min(...result.headings.map((x) => x.level));
                    return (
                      <li
                        key={i}
                        style={{ marginLeft: `${(h.level - minLevel) * 20}px` }}
                      >
                        <a
                          href={`#${h.slug}`}
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                          onClick={(e) => e.preventDefault()}
                        >
                          {h.text}
                        </a>
                      </li>
                    );
                  })}
                </ol>
              ) : (
                <ul className="list-disc space-y-1 pl-5">
                  {result.headings.map((h, i) => {
                    const minLevel = Math.min(...result.headings.map((x) => x.level));
                    return (
                      <li
                        key={i}
                        style={{ marginLeft: `${(h.level - minLevel) * 20}px` }}
                      >
                        <a
                          href={`#${h.slug}`}
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                          onClick={(e) => e.preventDefault()}
                        >
                          {h.text}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="mb-4 text-xs text-gray-400 dark:text-gray-500">
            {result.headings.length} heading{result.headings.length !== 1 ? "s" : ""} found
          </div>
        </>
      )}

      {/* SEO Content */}
      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
          What is a Table of Contents?
        </h2>
        <p className="mb-3">
          A Table of Contents (TOC) is a navigational aid that lists the headings and
          subheadings of a document with links to each section. In Markdown documents,
          a TOC uses anchor links that let readers jump directly to the section they
          need.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
          How Does the TOC Generator Work?
        </h2>
        <p className="mb-3">
          This tool parses Markdown headings (lines starting with #) from your content
          and generates a structured, linked list. Each heading is converted into an
          anchor link by slugifying the text: converting to lowercase, replacing spaces
          with hyphens, and removing special characters. The result is a ready-to-use
          Markdown TOC you can paste into your README, documentation, or blog post.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
          When to Use a Table of Contents
        </h2>
        <p>
          A TOC is essential for long documents, README files, wikis, and technical
          documentation. GitHub, GitLab, and most Markdown renderers automatically
          generate anchor IDs for headings, so the links produced by this tool work
          out of the box. Adding a TOC improves readability, helps users find
          information quickly, and is considered a best practice for any document
          longer than a few sections.
        </p>
      </div>
    </ToolLayout>
  );
}
