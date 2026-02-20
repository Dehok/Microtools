"use client";

import { useMemo, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };

interface SchemaNode {
  type?: string | string[];
  properties?: Record<string, SchemaNode>;
  required?: string[];
  items?: SchemaNode;
  enum?: JsonValue[];
  additionalProperties?: boolean;
  minItems?: number;
  maxItems?: number;
}

const SAMPLE_SCHEMA = `{
  "type": "object",
  "required": ["title", "priority", "tasks"],
  "properties": {
    "title": { "type": "string" },
    "priority": { "enum": ["low", "medium", "high"] },
    "tasks": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "required": ["id", "text", "done"],
        "properties": {
          "id": { "type": "string" },
          "text": { "type": "string" },
          "done": { "type": "boolean" }
        },
        "additionalProperties": false
      }
    }
  },
  "additionalProperties": false
}`;

const SAMPLE_OUTPUT = `Here is the JSON:
\`\`\`json
{
  "title": "Sprint plan",
  "priority": "high",
  "tasks": [
    { "id": "t1", "text": "Design API", "done": false },
    { "id": "t2", "text": "Write tests", "done": true }
  ]
}
\`\`\``;

function detectType(value: JsonValue) {
  if (Array.isArray(value)) return "array";
  if (value === null) return "null";
  return typeof value;
}

function normalizeType(type: SchemaNode["type"]) {
  if (!type) return [];
  return Array.isArray(type) ? type : [type];
}

function extractJsonFromText(text: string) {
  const trimmed = text.trim();
  if (!trimmed) return "";

  try {
    JSON.parse(trimmed);
    return trimmed;
  } catch {
    const block = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (block?.[1]) return block[1].trim();
    const firstBrace = trimmed.indexOf("{");
    const lastBrace = trimmed.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace > firstBrace) return trimmed.slice(firstBrace, lastBrace + 1);
  }
  return trimmed;
}

function validateNode(
  value: JsonValue,
  schema: SchemaNode,
  path: string,
  errors: string[],
  strictAdditional: boolean
) {
  const allowedTypes = normalizeType(schema.type);
  const actualType = detectType(value);

  if (allowedTypes.length > 0 && !allowedTypes.includes(actualType)) {
    errors.push(`${path}: expected ${allowedTypes.join(" or ")}, got ${actualType}`);
    return;
  }

  if (schema.enum && !schema.enum.some((item) => JSON.stringify(item) === JSON.stringify(value))) {
    errors.push(`${path}: value is not in enum ${JSON.stringify(schema.enum)}`);
  }

  if (actualType === "array" && schema.items) {
    const arr = value as JsonValue[];
    if (typeof schema.minItems === "number" && arr.length < schema.minItems) {
      errors.push(`${path}: expected at least ${schema.minItems} item(s), got ${arr.length}`);
    }
    if (typeof schema.maxItems === "number" && arr.length > schema.maxItems) {
      errors.push(`${path}: expected at most ${schema.maxItems} item(s), got ${arr.length}`);
    }
    arr.forEach((item, idx) => validateNode(item, schema.items as SchemaNode, `${path}[${idx}]`, errors, strictAdditional));
  }

  if (actualType === "object" && schema.properties) {
    const obj = value as Record<string, JsonValue>;
    const required = schema.required || [];
    for (const key of required) {
      if (!(key in obj)) errors.push(`${path}.${key}: missing required field`);
    }

    for (const [key, child] of Object.entries(schema.properties)) {
      if (key in obj) validateNode(obj[key], child, `${path}.${key}`, errors, strictAdditional);
    }

    const additional = schema.additionalProperties;
    const blockAdditional = strictAdditional || additional === false;
    if (blockAdditional) {
      for (const key of Object.keys(obj)) {
        if (!schema.properties[key]) errors.push(`${path}.${key}: additional property is not allowed`);
      }
    }
  }
}

export default function JsonOutputGuardPage() {
  const [schemaText, setSchemaText] = useState(SAMPLE_SCHEMA);
  const [outputText, setOutputText] = useState(SAMPLE_OUTPUT);
  const [strictAdditional, setStrictAdditional] = useState(false);

  const result = useMemo(() => {
    const errors: string[] = [];
    let schema: SchemaNode | null = null;
    let parsed: JsonValue | null = null;
    let extracted = "";

    try {
      schema = JSON.parse(schemaText) as SchemaNode;
    } catch (error) {
      return {
        schemaError: `Schema parse error: ${(error as Error).message}`,
        outputError: "",
        extractedJson: "",
        parsedJson: "",
        errors: [],
      };
    }

    extracted = extractJsonFromText(outputText);
    try {
      parsed = JSON.parse(extracted) as JsonValue;
    } catch (error) {
      return {
        schemaError: "",
        outputError: `Output JSON parse error: ${(error as Error).message}`,
        extractedJson: extracted,
        parsedJson: "",
        errors: [],
      };
    }

    validateNode(parsed, schema, "$", errors, strictAdditional);
    return {
      schemaError: "",
      outputError: "",
      extractedJson: extracted,
      parsedJson: JSON.stringify(parsed, null, 2),
      errors,
    };
  }, [outputText, schemaText, strictAdditional]);

  const summary = useMemo(
    () =>
      [
        "JSON Output Guard Report",
        result.schemaError || "Schema: OK",
        result.outputError || "Output JSON: OK",
        `Validation errors: ${result.errors.length}`,
      ].join("\n"),
    [result.errors.length, result.outputError, result.schemaError]
  );

  const isValid = !result.schemaError && !result.outputError && result.errors.length === 0;

  return (
    <ToolLayout
      title="JSON Output Guard"
      description="Guardrail for AI JSON outputs: extract JSON, parse, and validate against schema before downstream use."
      relatedTools={["function-calling-schema-tester", "json-schema-validator", "prompt-linter"]}
    >
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          onClick={() => {
            setSchemaText(SAMPLE_SCHEMA);
            setOutputText(SAMPLE_OUTPUT);
          }}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Load sample
        </button>
        <CopyButton text={summary} />
      </div>

      <label className="mb-4 flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-300">
        <input
          type="checkbox"
          checked={strictAdditional}
          onChange={(event) => setStrictAdditional(event.target.checked)}
          className="accent-blue-600"
        />
        Treat additional properties as invalid globally
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Expected schema</label>
          <textarea
            value={schemaText}
            onChange={(event) => setSchemaText(event.target.value)}
            rows={13}
            className="w-full rounded-lg border border-gray-300 bg-white p-3 font-mono text-sm dark:border-gray-600 dark:bg-gray-900"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Model output</label>
          <textarea
            value={outputText}
            onChange={(event) => setOutputText(event.target.value)}
            rows={13}
            className="w-full rounded-lg border border-gray-300 bg-white p-3 font-mono text-sm dark:border-gray-600 dark:bg-gray-900"
          />
        </div>
      </div>

      <div className={`mt-4 rounded-lg border p-3 text-sm ${isValid ? "border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-300" : "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-300"}`}>
        {isValid ? "Validation passed. Output is schema-compatible." : "Validation failed. See details below."}
      </div>

      {result.schemaError && (
        <p className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {result.schemaError}
        </p>
      )}
      {result.outputError && (
        <p className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {result.outputError}
        </p>
      )}

      {result.errors.length > 0 && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950">
          <p className="mb-1 text-sm font-medium text-red-800 dark:text-red-200">Validation errors</p>
          <ul className="list-disc space-y-1 pl-5 text-xs text-red-700 dark:text-red-300">
            {result.errors.map((err) => (
              <li key={err} className="font-mono">
                {err}
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.parsedJson && (
        <div className="mt-4 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Parsed JSON payload</p>
            <CopyButton text={result.parsedJson} />
          </div>
          <pre className="max-h-[360px] overflow-auto whitespace-pre-wrap rounded bg-gray-50 p-3 text-xs text-gray-800 dark:bg-gray-950 dark:text-gray-200">
            {result.parsedJson}
          </pre>
        </div>
      )}

      <div className="mt-12 space-y-6 border-t border-gray-200 pt-8 text-sm leading-relaxed text-gray-600 dark:border-gray-700 dark:text-gray-400">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
        <p>
          JSON Output Guard is a reliability layer for AI workflows that expect structured outputs. It extracts JSON
          from model responses and validates shape before passing data to production code.
        </p>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Does it support full JSON Schema spec?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. It supports a practical subset used by most AI output contracts.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Can it parse fenced JSON blocks?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes. It tries full text first, then JSON code blocks, then brace extraction.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is output text uploaded?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. Validation runs locally in your browser.
            </p>
          </details>
        </div>
      </div>
    </ToolLayout>
  );
}
