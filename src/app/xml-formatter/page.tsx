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
      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
          What is XML?
        </h2>
        <p className="mb-3">
          XML (Extensible Markup Language) is a markup language used to store
          and transport data. It is widely used in web services (SOAP, RSS),
          configuration files, and data interchange between systems.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
          How to format XML
        </h2>
        <p>
          Paste your XML into the input field and the formatter will
          automatically beautify it with proper indentation. You can also
          minify XML to remove whitespace and reduce file size. The validator
          checks for well-formed XML structure.
        </p>
      </div>
    </ToolLayout>
  );
}
