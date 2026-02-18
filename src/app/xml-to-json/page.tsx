"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const SAMPLE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<library>
  <book id="1" genre="fiction">
    <title>The Great Gatsby</title>
    <author>F. Scott Fitzgerald</author>
    <year>1925</year>
    <tags>
      <tag>classic</tag>
      <tag>american</tag>
      <tag>novel</tag>
    </tags>
  </book>
  <book id="2" genre="science">
    <title>A Brief History of Time</title>
    <author>Stephen Hawking</author>
    <year>1988</year>
    <tags>
      <tag>science</tag>
      <tag>physics</tag>
    </tags>
  </book>
</library>`;

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

function xmlNodeToJson(node: Element, compact: boolean): JsonValue {
  const result: { [key: string]: JsonValue } = {};

  // Add attributes as @attributes object
  if (node.attributes && node.attributes.length > 0) {
    const attrs: { [key: string]: string } = {};
    for (let i = 0; i < node.attributes.length; i++) {
      const attr = node.attributes[i];
      attrs[attr.name] = attr.value;
    }
    result["@attributes"] = attrs;
  }

  const childNodes = Array.from(node.childNodes);

  // Separate element children from text nodes
  const elementChildren = childNodes.filter(
    (n) => n.nodeType === Node.ELEMENT_NODE
  ) as Element[];
  const textNodes = childNodes.filter(
    (n) => n.nodeType === Node.TEXT_NODE && n.textContent?.trim()
  );

  if (elementChildren.length === 0) {
    // Leaf node
    const text = textNodes.map((t) => t.textContent ?? "").join("").trim();
    if (compact && !result["@attributes"]) {
      // In compact mode, return bare string for simple text-only nodes
      return text;
    }
    if (text) {
      result["#text"] = text;
    }
  } else {
    // Has element children - group by tag name
    const grouped: { [tag: string]: Element[] } = {};
    for (const child of elementChildren) {
      if (!grouped[child.tagName]) {
        grouped[child.tagName] = [];
      }
      grouped[child.tagName].push(child);
    }

    for (const [tag, elements] of Object.entries(grouped)) {
      if (elements.length === 1) {
        result[tag] = xmlNodeToJson(elements[0], compact);
      } else {
        result[tag] = elements.map((el) => xmlNodeToJson(el, compact));
      }
    }

    // Mixed content: also capture text if present
    if (!compact && textNodes.length > 0) {
      const text = textNodes.map((t) => t.textContent ?? "").join("").trim();
      if (text) {
        result["#text"] = text;
      }
    }
  }

  return result;
}

function convertXmlToJson(xmlString: string, compact: boolean): { json: string; error: string } {
  if (!xmlString.trim()) {
    return { json: "", error: "" };
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlString, "application/xml");

    // Check for parse errors
    const parseError = doc.querySelector("parsererror");
    if (parseError) {
      const errorText = parseError.textContent ?? "Invalid XML";
      // Extract a cleaner error message
      const lines = errorText.split("\n").map((l) => l.trim()).filter(Boolean);
      return { json: "", error: lines[0] || "Invalid XML" };
    }

    const root = doc.documentElement;
    if (!root) {
      return { json: "", error: "No root element found." };
    }

    const jsonObj: { [key: string]: JsonValue } = {};
    jsonObj[root.tagName] = xmlNodeToJson(root, compact);

    return { json: JSON.stringify(jsonObj, null, 2), error: "" };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Conversion failed";
    return { json: "", error: msg };
  }
}

export default function XmlToJson() {
  const [input, setInput] = useState("");
  const [compact, setCompact] = useState(false);
  const [indent, setIndent] = useState<2 | 4>(2);

  const { json, error } = useMemo(() => {
    const result = convertXmlToJson(input, compact);
    if (!result.json) return result;
    // Re-format with chosen indentation
    try {
      const parsed = JSON.parse(result.json);
      return { json: JSON.stringify(parsed, null, indent), error: "" };
    } catch {
      return result;
    }
  }, [input, compact, indent]);

  const handleSample = () => {
    setInput(SAMPLE_XML);
  };

  const handleClear = () => {
    setInput("");
  };

  return (
    <ToolLayout
      title="XML to JSON Converter Online"
      description="Convert XML data to JSON format instantly in your browser. Supports attributes, repeated elements, and compact mode. Free and private - no data is sent to any server."
      relatedTools={["json-to-xml", "xml-formatter", "json-formatter"]}
    >
      {/* Options bar */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button
          onClick={handleSample}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Load Example
        </button>
        <button
          onClick={handleClear}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Clear
        </button>

        <div className="ml-auto flex flex-wrap items-center gap-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={compact}
              onChange={(e) => setCompact(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600"
            />
            Compact mode
          </label>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Indent:</label>
            <select
              value={indent}
              onChange={(e) => setIndent(Number(e.target.value) as 2 | 4)}
              className="rounded-md border border-gray-300 px-2 py-1 text-sm"
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
            </select>
          </div>
        </div>
      </div>

      {/* Compact mode info */}
      {compact && (
        <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-700">
          Compact mode: simple text-only elements are returned as plain strings instead of objects with a <code className="font-mono">#text</code> key.
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          <span className="font-medium">XML Error:</span> {error}
        </div>
      )}

      {/* Editor panels */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              XML Input
            </label>
            <span className="text-xs text-gray-400">
              {input.length} characters
            </span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={"<root>\n  <element>value</element>\n</root>"}
            className="h-80 w-full rounded-lg border border-gray-300 bg-gray-50 p-3 font-mono text-sm focus:border-blue-500 focus:outline-none"
            spellCheck={false}
          />
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              JSON Output
            </label>
            <CopyButton text={json} />
          </div>
          <textarea
            value={json}
            readOnly
            placeholder="Converted JSON will appear here..."
            className="h-80 w-full rounded-lg border border-gray-300 bg-gray-50 p-3 font-mono text-sm"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Stats row */}
      {json && (
        <div className="mt-3 flex gap-4 text-xs text-gray-500">
          <span>Input: {input.length} chars</span>
          <span>Output: {json.length} chars</span>
        </div>
      )}

      {/* SEO Content */}
      <div className="mt-8 border-t border-gray-200 pt-6 text-sm text-gray-600">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          What is an XML to JSON Converter?
        </h2>
        <p className="mb-3">
          An XML to JSON converter transforms data from XML (eXtensible Markup Language)
          format into JSON (JavaScript Object Notation) format. JSON is widely used in
          modern web APIs and applications because it is lighter, easier to parse in
          JavaScript, and more human-readable than XML for most use cases.
        </p>

        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          How the Conversion Works
        </h2>
        <p className="mb-2">
          This tool uses the browser&apos;s built-in <code className="rounded bg-gray-100 px-1 font-mono">DOMParser</code> to
          parse your XML client-side and then recursively walks the DOM tree to produce
          a JSON representation:
        </p>
        <ul className="mb-3 ml-4 list-disc space-y-1">
          <li>
            <strong>Element attributes</strong> are stored under an <code className="rounded bg-gray-100 px-1 font-mono">@attributes</code> key.
          </li>
          <li>
            <strong>Text content</strong> of leaf elements is stored under a <code className="rounded bg-gray-100 px-1 font-mono">#text</code> key
            (or as a bare string in compact mode).
          </li>
          <li>
            <strong>Repeated sibling elements</strong> with the same tag name are
            automatically grouped into a JSON array.
          </li>
          <li>
            <strong>Single child elements</strong> become nested JSON objects.
          </li>
        </ul>

        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          Compact Mode Explained
        </h2>
        <p className="mb-3">
          When <strong>Compact mode</strong> is enabled, simple text-only elements
          (elements that have no attributes and contain only text) are represented
          as plain strings instead of <code className="rounded bg-gray-100 px-1 font-mono">{"{ \"#text\": \"...\" }"}</code> objects.
          This produces cleaner, smaller JSON for typical data files but may lose
          precision for documents with mixed content.
        </p>

        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          Common Use Cases
        </h2>
        <ul className="mb-3 ml-4 list-disc space-y-1">
          <li>Migrating data from legacy XML APIs to modern REST/JSON APIs</li>
          <li>Processing RSS or Atom feeds in JavaScript applications</li>
          <li>Converting configuration files from XML to JSON format</li>
          <li>Working with SOAP web service responses</li>
          <li>Transforming SVG or other XML-based data for processing</li>
        </ul>

        <h2 className="mb-3 text-lg font-semibold text-gray-900">FAQ</h2>
        <p className="mb-1 font-medium">Is my XML data sent to a server?</p>
        <p className="mb-3">
          No. All conversion happens entirely in your browser using the built-in
          DOMParser API. Your data never leaves your device.
        </p>
        <p className="mb-1 font-medium">
          Why do repeated elements become arrays?
        </p>
        <p className="mb-3">
          When multiple sibling elements share the same tag name, it is the most
          natural JSON representation - similar to how XML lists are typically
          modelled. A single element stays as an object to avoid unnecessary arrays.
        </p>
        <p className="mb-1 font-medium">
          What happens to XML processing instructions and comments?
        </p>
        <p>
          XML comments and processing instructions (such as <code className="rounded bg-gray-100 px-1 font-mono">&lt;?xml ...?&gt;</code>)
          are ignored during conversion. Only element nodes, their attributes, and
          text content are included in the JSON output.
        </p>
      </div>
    </ToolLayout>
  );
}
