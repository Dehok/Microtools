"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function isValidTagName(name: string): boolean {
  return /^[a-zA-Z_][\w.-]*$/.test(name);
}

function sanitizeTagName(name: string): string {
  let tag = name.replace(/[^\w.-]/g, "_");
  if (!/^[a-zA-Z_]/.test(tag)) {
    tag = "_" + tag;
  }
  return tag;
}

function singularize(name: string): string {
  if (name.endsWith("ies")) return name.slice(0, -3) + "y";
  if (name.endsWith("ses") || name.endsWith("xes") || name.endsWith("zes")) return name.slice(0, -2);
  if (name.endsWith("s") && !name.endsWith("ss")) return name.slice(0, -1);
  return "item";
}

function valueToXml(
  value: unknown,
  tagName: string,
  indentSize: number,
  depth: number
): string {
  const pad = " ".repeat(indentSize * depth);
  const safeTag = isValidTagName(tagName) ? tagName : sanitizeTagName(tagName);

  if (value === null || value === undefined) {
    return `${pad}<${safeTag} />`;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return `${pad}<${safeTag} />`;
    }
    const itemTag = singularize(safeTag);
    const items = value
      .map((item) => valueToXml(item, itemTag, indentSize, depth))
      .join("\n");
    return items;
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) {
      return `${pad}<${safeTag} />`;
    }
    const children = entries
      .map(([key, val]) => {
        if (Array.isArray(val)) {
          const childPad = " ".repeat(indentSize * (depth + 1));
          const itemTag = singularize(sanitizeTagName(key));
          if (val.length === 0) {
            return `${childPad}<${sanitizeTagName(key)} />`;
          }
          const wrapTag = isValidTagName(key) ? key : sanitizeTagName(key);
          const items = val
            .map((item) => valueToXml(item, itemTag, indentSize, depth + 2))
            .join("\n");
          return `${childPad}<${wrapTag}>\n${items}\n${childPad}</${wrapTag}>`;
        }
        return valueToXml(val, key, indentSize, depth + 1);
      })
      .join("\n");
    return `${pad}<${safeTag}>\n${children}\n${pad}</${safeTag}>`;
  }

  return `${pad}<${safeTag}>${escapeXml(String(value))}</${safeTag}>`;
}

function jsonToXml(
  jsonStr: string,
  rootName: string,
  indentSize: number,
  includeDeclaration: boolean
): string {
  const parsed = JSON.parse(jsonStr);
  const safeRoot = isValidTagName(rootName) ? rootName : sanitizeTagName(rootName);

  let xml = "";
  if (includeDeclaration) {
    xml += '<?xml version="1.0" encoding="UTF-8"?>\n';
  }

  if (Array.isArray(parsed)) {
    const itemTag = singularize(safeRoot);
    const items = parsed
      .map((item) => valueToXml(item, itemTag, indentSize, 1))
      .join("\n");
    if (parsed.length === 0) {
      xml += `<${safeRoot} />`;
    } else {
      xml += `<${safeRoot}>\n${items}\n</${safeRoot}>`;
    }
  } else if (typeof parsed === "object" && parsed !== null) {
    const entries = Object.entries(parsed as Record<string, unknown>);
    if (entries.length === 0) {
      xml += `<${safeRoot} />`;
    } else {
      const children = entries
        .map(([key, val]) => {
          if (Array.isArray(val)) {
            const childPad = " ".repeat(indentSize);
            const itemTag = singularize(sanitizeTagName(key));
            if (val.length === 0) {
              return `${childPad}<${sanitizeTagName(key)} />`;
            }
            const wrapTag = isValidTagName(key) ? key : sanitizeTagName(key);
            const items = val
              .map((item) => valueToXml(item, itemTag, indentSize, 2))
              .join("\n");
            return `${childPad}<${wrapTag}>\n${items}\n${childPad}</${wrapTag}>`;
          }
          return valueToXml(val, key, indentSize, 1);
        })
        .join("\n");
      xml += `<${safeRoot}>\n${children}\n</${safeRoot}>`;
    }
  } else {
    xml += `<${safeRoot}>${escapeXml(String(parsed))}</${safeRoot}>`;
  }

  return xml;
}

const SAMPLE = JSON.stringify(
  {
    user: {
      name: "John Doe",
      age: 30,
      active: true,
      email: null,
    },
    tags: ["developer", "typescript", "react"],
    orders: [
      { id: 101, total: 29.99, items: ["book", "pen"] },
      { id: 102, total: 49.99, items: ["laptop"] },
    ],
  },
  null,
  2
);

export default function JsonToXml() {
  const [input, setInput] = useState(SAMPLE);
  const [rootName, setRootName] = useState("root");
  const [indentSize, setIndentSize] = useState(2);
  const [includeDeclaration, setIncludeDeclaration] = useState(true);

  const { xml, error } = useMemo(() => {
    if (!input.trim()) return { xml: "", error: "" };
    try {
      const result = jsonToXml(input, rootName || "root", indentSize, includeDeclaration);
      return { xml: result, error: "" };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Invalid JSON";
      return { xml: "", error: msg };
    }
  }, [input, rootName, indentSize, includeDeclaration]);

  return (
    <ToolLayout
      title="JSON to XML Converter"
      description="Convert JSON data to XML format online. Handles nested objects, arrays, and primitives with configurable options."
      relatedTools={["xml-formatter", "json-formatter", "yaml-json-converter"]}
    >
      {/* Options */}
      <div className="mb-4 flex flex-wrap items-end gap-4">
        <div>
          <label className="mb-1 block text-xs text-gray-500">Root element</label>
          <input
            type="text"
            value={rootName}
            onChange={(e) => setRootName(e.target.value)}
            placeholder="root"
            className="w-32 rounded-lg border border-gray-300 bg-gray-50 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-gray-500">Indent</label>
          <div className="flex gap-2">
            <button
              onClick={() => setIndentSize(2)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                indentSize === 2
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              2 spaces
            </button>
            <button
              onClick={() => setIndentSize(4)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                indentSize === 4
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              4 spaces
            </button>
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={includeDeclaration}
            onChange={(e) => setIncludeDeclaration(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          XML declaration
        </label>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Editor columns */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">JSON Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={'{\n  "name": "value",\n  "items": [1, 2, 3]\n}'}
            className="h-72 w-full rounded-lg border border-gray-300 bg-gray-50 p-3 font-mono text-xs focus:border-blue-500 focus:outline-none"
            spellCheck={false}
          />
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => setInput(SAMPLE)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Sample
            </button>
            <button
              onClick={() => setInput("")}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Clear
            </button>
          </div>
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">XML Output</label>
            <CopyButton text={xml} />
          </div>
          <textarea
            value={error ? "" : xml}
            readOnly
            placeholder="XML output will appear here..."
            className="h-72 w-full rounded-lg border border-gray-300 bg-gray-50 p-3 font-mono text-xs"
          />
        </div>
      </div>

      {/* SEO content */}
      <div className="mt-8 border-t border-gray-200 pt-6 text-sm text-gray-600">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">JSON to XML Conversion</h2>
        <p className="mb-3">
          This tool converts JSON data into well-formed XML. Objects become elements with child
          elements for each key. Arrays are wrapped in a parent element, with each item in a
          singularized child element (e.g., <code className="rounded bg-gray-100 px-1">&lt;tags&gt;</code>{" "}
          becomes <code className="rounded bg-gray-100 px-1">&lt;tag&gt;</code> items). Primitive
          values become text content, and null values produce self-closing empty elements.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Options</h2>
        <p className="mb-3">
          Customize the root element name, choose between 2 or 4 space indentation, and toggle the
          XML declaration header (<code className="rounded bg-gray-100 px-1">&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;</code>).
          The conversion handles nested objects and arrays recursively to any depth.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">When to Use This</h2>
        <p>
          Use this converter when integrating with APIs or systems that require XML format, migrating
          data between JSON and XML services, or generating XML configuration files from JSON data.
          All processing happens in your browser — no data is sent to any server.
        </p>
      </div>
    </ToolLayout>
  );
}
