"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function formatXml(xml: string, indent: string): string {
  let formatted = "";
  let depth = 0;
  const lines = xml
    .replace(/>\s*</g, ">\n<")
    .replace(/^\s+|\s+$/g, "")
    .split("\n");

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    // Self-closing or processing instruction
    if (line.match(/^<\?/) || line.match(/\/\s*>$/) || line.match(/^<!\[CDATA\[/) || line.match(/^<!--/)) {
      formatted += indent.repeat(depth) + line + "\n";
    }
    // Closing tag
    else if (line.match(/^<\//)) {
      depth = Math.max(0, depth - 1);
      formatted += indent.repeat(depth) + line + "\n";
    }
    // Opening tag (not self-closing)
    else if (line.match(/^<[^/]/) && !line.match(/\/\s*>$/)) {
      formatted += indent.repeat(depth) + line + "\n";
      depth++;
    }
    // Text content or other
    else {
      formatted += indent.repeat(depth) + line + "\n";
    }
  }

  return formatted.trim();
}

function minifyXml(xml: string): string {
  return xml
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/>\s+</g, "><")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function validateXml(xml: string): { valid: boolean; error: string | null } {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, "application/xml");
    const errorNode = doc.querySelector("parsererror");
    if (errorNode) {
      return { valid: false, error: errorNode.textContent || "XML parsing error" };
    }
    return { valid: true, error: null };
  } catch {
    return { valid: false, error: "Failed to parse XML" };
  }
}

const sampleXml = `<?xml version="1.0" encoding="UTF-8"?><catalog><book id="1"><title>XML Developer's Guide</title><author>John Doe</author><price>44.95</price></book><book id="2"><title>Midnight Rain</title><author>Jane Smith</author><price>5.95</price></book></catalog>`;

export default function XmlFormatter() {
  const [input, setInput] = useState(sampleXml);
  const [indentSize, setIndentSize] = useState(2);
  const [mode, setMode] = useState<"format" | "minify">("format");

  const result = useMemo(() => {
    if (!input.trim()) return { output: "", validation: { valid: true, error: null } };

    const validation = validateXml(input);
    const output = mode === "format"
      ? formatXml(input, " ".repeat(indentSize))
      : minifyXml(input);

    return { output, validation };
  }, [input, indentSize, mode]);

  return (
    <ToolLayout
      title="XML Formatter / Beautifier"
      description="Format, beautify, and validate XML data. Minify or pretty-print XML with custom indentation."
      relatedTools={["json-formatter", "sql-formatter", "html-encoder-decoder"]}
    >
      {/* Options */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">Mode:</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as "format" | "minify")}
            className="rounded-md border border-gray-300 dark:border-gray-600 px-2 py-1 text-sm"
          >
            <option value="format">Format / Beautify</option>
            <option value="minify">Minify</option>
          </select>
        </div>
        {mode === "format" && (
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">Indent:</label>
            <select
              value={indentSize}
              onChange={(e) => setIndentSize(Number(e.target.value))}
              className="rounded-md border border-gray-300 dark:border-gray-600 px-2 py-1 text-sm"
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
              <option value={1}>1 tab</option>
            </select>
          </div>
        )}

        {/* Validation badge */}
        {input.trim() && (
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              result.validation.valid
                ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
            }`}
          >
            {result.validation.valid ? "Valid XML" : "Invalid XML"}
          </span>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Input */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Input XML
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={16}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            spellCheck={false}
            placeholder="Paste your XML here..."
          />
        </div>

        {/* Output */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Output
            </label>
            <CopyButton text={result.output} />
          </div>
          <textarea
            value={result.output}
            readOnly
            rows={16}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-2 font-mono text-sm"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Error message */}
      {result.validation.error && (
        <div className="mt-3 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 p-3 text-sm text-red-700 dark:text-red-300">
          {result.validation.error}
        </div>
      )}

      
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The XML Formatter is a free online tool available on CodeUtilo. Format, beautify, and validate XML data with custom indentation. All processing happens directly in your browser — no data is ever sent to any server, ensuring your privacy and security. No signup or installation is required.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> — All xml formatter operations run locally in your browser using JavaScript. Your data never leaves your device.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Instant Results</strong> — Get results immediately as you type or paste your input. No waiting for server responses or page reloads.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> — Use the xml formatter as many times as you need without creating an account or paying anything.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Mobile Friendly</strong> — Works on desktop, tablet, and mobile browsers. Access this tool from any device with an internet connection.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Using the xml formatter for day-to-day development tasks</li>
          <li>Saving time on repetitive tasks by using a browser-based tool instead of writing custom code</li>
          <li>Working on projects where installing software is not an option (school, work, shared computers)</li>
          <li>Quick prototyping and debugging without switching to a terminal or IDE</li>
          <li>Sharing the tool link with colleagues who need the same functionality</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Enter your input in the text area provided and the xml formatter will process it instantly. Use the Copy button to copy the result to your clipboard. All operations are performed locally in your browser — no data is transmitted to any server.
        </p>
      
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Is the XML Formatter free to use?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes, the XML Formatter is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need.
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
              Yes. The XML Formatter is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Do I need to install anything?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. The XML Formatter runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately.
            </p>
          </details>
        </div>
</div>
    </ToolLayout>
  );
}
