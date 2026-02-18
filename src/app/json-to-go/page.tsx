"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

// Convert a JSON key to PascalCase Go field name
function toPascalCase(key: string): string {
  return key
    .replace(/[-_\s]+(.)/g, (_, c) => c.toUpperCase())
    .replace(/^(.)/, (c) => c.toUpperCase());
}

// Determine Go type from a JSON value
function getGoType(
  value: unknown,
  fieldName: string,
  inlineNested: boolean,
  useTags: boolean,
  useOmit: boolean,
  extraStructs: Map<string, string>
): string {
  if (value === null) return "interface{}";
  if (typeof value === "boolean") return "bool";
  if (typeof value === "string") return "string";
  if (typeof value === "number") {
    return Number.isInteger(value) ? "int64" : "float64";
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return "[]interface{}";

    // Check if all items are the same basic type
    const firstItem = value[0];
    if (firstItem === null) return "[]interface{}";
    if (typeof firstItem === "boolean") return "[]bool";
    if (typeof firstItem === "string") return "[]string";
    if (typeof firstItem === "number") {
      return Number.isInteger(firstItem) ? "[]int64" : "[]float64";
    }
    if (typeof firstItem === "object" && !Array.isArray(firstItem)) {
      const itemTypeName = toPascalCase(fieldName) + "Item";
      const innerType = buildStruct(
        firstItem as Record<string, unknown>,
        itemTypeName,
        inlineNested,
        useTags,
        useOmit,
        extraStructs
      );
      if (inlineNested) {
        return `[]${innerType}`;
      }
      if (!extraStructs.has(itemTypeName)) {
        extraStructs.set(itemTypeName, innerType);
      }
      return `[]${itemTypeName}`;
    }
    // Mixed array
    return "[]interface{}";
  }

  if (typeof value === "object") {
    const typeName = toPascalCase(fieldName);
    const innerType = buildStruct(
      value as Record<string, unknown>,
      typeName,
      inlineNested,
      useTags,
      useOmit,
      extraStructs
    );
    if (inlineNested) {
      return innerType;
    }
    if (!extraStructs.has(typeName)) {
      extraStructs.set(typeName, innerType);
    }
    return typeName;
  }

  return "interface{}";
}

// Build a Go struct definition string for an object
function buildStruct(
  obj: Record<string, unknown>,
  name: string,
  inlineNested: boolean,
  useTags: boolean,
  useOmit: boolean,
  extraStructs: Map<string, string>
): string {
  const entries = Object.entries(obj);

  if (entries.length === 0) {
    if (inlineNested) return "struct{}";
    return `type ${name} struct{}`;
  }

  const fields = entries.map(([key, val]) => {
    const goFieldName = toPascalCase(key);
    const goType = getGoType(val, key, inlineNested, useTags, useOmit, extraStructs);

    let tag = "";
    if (useTags) {
      const omit = useOmit ? ",omitempty" : "";
      tag = ` \`json:"${key}${omit}"\``;
    }

    return `\t${goFieldName} ${goType}${tag}`;
  });

  const body = fields.join("\n");

  if (inlineNested) {
    return `struct {\n${body}\n}`;
  }

  return `type ${name} struct {\n${body}\n}`;
}

// Main conversion function: JSON string → Go struct code
function jsonToGoStruct(
  jsonStr: string,
  structName: string,
  inlineNested: boolean,
  useTags: boolean,
  useOmit: boolean
): string {
  const parsed: unknown = JSON.parse(jsonStr);

  // Handle top-level array
  if (Array.isArray(parsed)) {
    if (parsed.length === 0) {
      return `type ${structName} []interface{}`;
    }
    const firstItem = parsed[0];
    if (typeof firstItem === "object" && firstItem !== null && !Array.isArray(firstItem)) {
      const extraStructs = new Map<string, string>();
      const itemName = structName + "Item";
      const itemStruct = buildStruct(
        firstItem as Record<string, unknown>,
        itemName,
        inlineNested,
        useTags,
        useOmit,
        extraStructs
      );

      const parts: string[] = [];
      if (!inlineNested) {
        // Add dependent structs first (reverse insertion order)
        const depStructs = Array.from(extraStructs.values()).reverse();
        parts.push(...depStructs);
        parts.push(itemStruct);
      }
      parts.push(`type ${structName} []${itemName}`);

      return parts.join("\n\n");
    }
    return `type ${structName} []interface{}`;
  }

  // Handle top-level primitives
  if (typeof parsed !== "object" || parsed === null) {
    return `// Cannot generate struct from primitive value\ntype ${structName} interface{}`;
  }

  // Handle top-level object
  const extraStructs = new Map<string, string>();
  const rootStruct = buildStruct(
    parsed as Record<string, unknown>,
    structName,
    inlineNested,
    useTags,
    useOmit,
    extraStructs
  );

  if (inlineNested) {
    return rootStruct;
  }

  // For separate structs: dependent types first, root last
  const depStructs = Array.from(extraStructs.values()).reverse();
  const parts = [...depStructs, rootStruct];
  return parts.join("\n\n");
}

const SAMPLE = JSON.stringify(
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    is_active: true,
    score: 9.5,
    address: {
      street: "123 Main St",
      city: "Prague",
      zip: "11000",
    },
    tags: ["developer", "golang"],
    orders: [
      { id: 101, total: 29.99, items: 3 },
      { id: 102, total: 49.99, items: 1 },
    ],
  },
  null,
  2
);

export default function JsonToGo() {
  const [input, setInput] = useState(SAMPLE);
  const [structName, setStructName] = useState("AutoGenerated");
  const [useTags, setUseTags] = useState(true);
  const [useOmit, setUseOmit] = useState(false);
  const [inlineNested, setInlineNested] = useState(false);

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: "", error: "" };
    try {
      const name = structName.trim() || "AutoGenerated";
      const result = jsonToGoStruct(input, name, inlineNested, useTags, useOmit);
      return { output: result, error: "" };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Invalid JSON";
      return { output: "", error: msg };
    }
  }, [input, structName, useTags, useOmit, inlineNested]);

  return (
    <ToolLayout
      title="JSON to Go Struct — Convert JSON to Golang Structs Online"
      description="Instantly convert JSON data to Go struct definitions. Supports nested objects, arrays, json tags, omitempty, and separate or inline struct generation."
      relatedTools={["json-to-typescript", "json-formatter", "json-stringify"]}
    >
      {/* Options bar */}
      <div className="mb-4 flex flex-wrap items-end gap-4">
        <div>
          <label className="mb-1 block text-xs text-gray-500">Struct name</label>
          <input
            type="text"
            value={structName}
            onChange={(e) => setStructName(e.target.value)}
            placeholder="AutoGenerated"
            className="w-40 rounded-lg border border-gray-300 bg-gray-50 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={useTags}
            onChange={(e) => setUseTags(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          json tags
        </label>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={useOmit}
            onChange={(e) => setUseOmit(e.target.checked)}
            disabled={!useTags}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-40"
          />
          omitempty
        </label>

        <div className="flex gap-2">
          <button
            onClick={() => setInlineNested(false)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              !inlineNested
                ? "bg-blue-600 text-white"
                : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Separate types
          </button>
          <button
            onClick={() => setInlineNested(true)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              inlineNested
                ? "bg-blue-600 text-white"
                : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Inline structs
          </button>
        </div>
      </div>

      {/* Editor panels */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">JSON Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste JSON here..."
            className="h-80 w-full rounded-lg border border-gray-300 bg-gray-50 p-3 font-mono text-xs focus:border-blue-500 focus:outline-none"
            spellCheck={false}
          />
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => setInput(SAMPLE)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Load Example
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
            <label className="text-sm font-medium text-gray-700">Go Struct Output</label>
            {!error && output && <CopyButton text={output} />}
          </div>
          <textarea
            value={error ? error : output}
            readOnly
            placeholder="Generated Go struct will appear here..."
            className={`h-80 w-full rounded-lg border p-3 font-mono text-xs ${
              error
                ? "border-red-300 bg-red-50 text-red-700"
                : "border-gray-300 bg-gray-50 text-gray-800"
            }`}
            spellCheck={false}
          />
        </div>
      </div>

      {/* SEO Content */}
      <div className="mt-8 border-t border-gray-200 pt-6 text-sm text-gray-600">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">JSON to Go Struct Converter</h2>
        <p className="mb-3">
          This tool parses your JSON data and automatically generates Go struct definitions. It
          infers the correct Go types from JSON values: strings become{" "}
          <code className="rounded bg-gray-100 px-1 font-mono text-xs">string</code>, integers
          become <code className="rounded bg-gray-100 px-1 font-mono text-xs">int64</code>, floats
          become <code className="rounded bg-gray-100 px-1 font-mono text-xs">float64</code>,
          booleans become{" "}
          <code className="rounded bg-gray-100 px-1 font-mono text-xs">bool</code>, and null values
          become <code className="rounded bg-gray-100 px-1 font-mono text-xs">interface{"{}"}</code>.
          Nested objects and arrays of objects generate their own named types.
        </p>

        <h2 className="mb-3 text-lg font-semibold text-gray-900">Options Explained</h2>
        <p className="mb-2">
          <strong>Struct name</strong> — sets the name of the root struct. Nested types are named
          automatically based on the JSON field name in PascalCase.
        </p>
        <p className="mb-2">
          <strong>json tags</strong> — adds{" "}
          <code className="rounded bg-gray-100 px-1 font-mono text-xs">`json:"fieldName"`</code>{" "}
          struct tags to each field, which are required for proper JSON marshaling/unmarshaling in
          Go.
        </p>
        <p className="mb-2">
          <strong>omitempty</strong> — appends{" "}
          <code className="rounded bg-gray-100 px-1 font-mono text-xs">,omitempty</code> to json
          tags, causing fields with zero values to be omitted when marshaling to JSON.
        </p>
        <p className="mb-3">
          <strong>Separate types vs Inline structs</strong> — choose whether nested objects are
          defined as separate named types (recommended for reuse) or inlined directly inside the
          parent struct field.
        </p>

        <h2 className="mb-3 text-lg font-semibold text-gray-900">When to Use This Tool</h2>
        <p className="mb-3">
          Working with a REST API, parsing config files, or dealing with JSON data in Go? Paste the
          JSON response here to instantly get ready-to-use struct definitions. This eliminates
          tedious manual struct writing and helps avoid type mismatches.
        </p>

        <h2 className="mb-3 text-lg font-semibold text-gray-900">Is My Data Safe?</h2>
        <p>
          Yes. All conversion logic runs entirely in your browser using JavaScript. No data is
          sent to any server at any point.
        </p>
      </div>
    </ToolLayout>
  );
}
