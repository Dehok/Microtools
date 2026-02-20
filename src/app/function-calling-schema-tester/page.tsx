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
}

const SAMPLE_SCHEMA = `{
  "name": "create_ticket",
  "description": "Create a support ticket",
  "parameters": {
    "type": "object",
    "required": ["title", "priority", "customer_id"],
    "properties": {
      "title": { "type": "string" },
      "priority": { "enum": ["low", "medium", "high"] },
      "customer_id": { "type": "string" },
      "tags": {
        "type": "array",
        "items": { "type": "string" }
      }
    },
    "additionalProperties": false
  }
}`;

const SAMPLE_ARGS = `{
  "title": "Payment failed",
  "priority": "high",
  "customer_id": "cus_123",
  "tags": ["billing", "urgent"]
}`;

function normalizeType(type: SchemaNode["type"]) {
  if (!type) return [];
  return Array.isArray(type) ? type : [type];
}

function detectType(value: JsonValue) {
  if (Array.isArray(value)) return "array";
  if (value === null) return "null";
  return typeof value;
}

function validateNode(value: JsonValue, schema: SchemaNode, path: string, errors: string[]) {
  const allowed = normalizeType(schema.type);
  const actual = detectType(value);

  if (allowed.length > 0 && !allowed.includes(actual)) {
    errors.push(`${path}: expected ${allowed.join(" or ")}, got ${actual}`);
    return;
  }

  if (schema.enum && !schema.enum.some((item) => JSON.stringify(item) === JSON.stringify(value))) {
    errors.push(`${path}: value is not in enum ${JSON.stringify(schema.enum)}`);
  }

  if (actual === "array" && schema.items) {
    (value as JsonValue[]).forEach((item, idx) => validateNode(item, schema.items as SchemaNode, `${path}[${idx}]`, errors));
  }

  if (actual === "object" && schema.properties) {
    const obj = value as Record<string, JsonValue>;
    for (const key of schema.required || []) {
      if (!(key in obj)) errors.push(`${path}.${key}: missing required field`);
    }
    for (const [key, node] of Object.entries(schema.properties)) {
      if (key in obj) validateNode(obj[key], node, `${path}.${key}`, errors);
    }
    if (schema.additionalProperties === false) {
      for (const key of Object.keys(obj)) {
        if (!schema.properties[key]) errors.push(`${path}.${key}: additional property is not allowed`);
      }
    }
  }
}

function extractParametersSchema(raw: JsonValue): SchemaNode | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const obj = raw as Record<string, JsonValue>;

  if (obj.parameters && typeof obj.parameters === "object" && !Array.isArray(obj.parameters)) {
    return obj.parameters as SchemaNode;
  }

  if (obj.function && typeof obj.function === "object" && !Array.isArray(obj.function)) {
    const fnObj = obj.function as Record<string, JsonValue>;
    if (fnObj.parameters && typeof fnObj.parameters === "object" && !Array.isArray(fnObj.parameters)) {
      return fnObj.parameters as SchemaNode;
    }
  }

  if (obj.type || obj.properties || obj.required || obj.items) return obj as SchemaNode;
  return null;
}

export default function FunctionCallingSchemaTesterPage() {
  const [schemaText, setSchemaText] = useState(SAMPLE_SCHEMA);
  const [argsText, setArgsText] = useState(SAMPLE_ARGS);

  const result = useMemo(() => {
    let schemaJson: JsonValue;
    let argsJson: JsonValue;
    const errors: string[] = [];

    try {
      schemaJson = JSON.parse(schemaText) as JsonValue;
    } catch (error) {
      return {
        parseError: `Schema parse error: ${(error as Error).message}`,
        validationErrors: [] as string[],
        normalizedSchema: "",
        normalizedArgs: "",
      };
    }

    try {
      argsJson = JSON.parse(argsText) as JsonValue;
    } catch (error) {
      return {
        parseError: `Arguments parse error: ${(error as Error).message}`,
        validationErrors: [] as string[],
        normalizedSchema: "",
        normalizedArgs: "",
      };
    }

    const parametersSchema = extractParametersSchema(schemaJson);
    if (!parametersSchema) {
      return {
        parseError: "Could not locate schema parameters. Provide JSON Schema or function schema with parameters.",
        validationErrors: [] as string[],
        normalizedSchema: "",
        normalizedArgs: "",
      };
    }

    validateNode(argsJson, parametersSchema, "$", errors);

    return {
      parseError: "",
      validationErrors: errors,
      normalizedSchema: JSON.stringify(parametersSchema, null, 2),
      normalizedArgs: JSON.stringify(argsJson, null, 2),
    };
  }, [argsText, schemaText]);

  const report = useMemo(
    () =>
      [
        "Function Calling Schema Tester",
        result.parseError || "Parse: OK",
        `Validation errors: ${result.validationErrors.length}`,
        ...result.validationErrors.map((err) => `- ${err}`),
      ].join("\n"),
    [result.parseError, result.validationErrors]
  );

  const valid = !result.parseError && result.validationErrors.length === 0;

  return (
    <ToolLayout
      title="Function Calling Schema Tester"
      description="Test function/tool-call argument JSON against schema before running agentic workflows."
      relatedTools={["json-output-guard", "prompt-linter", "openai-batch-jsonl-validator"]}
    >
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          onClick={() => {
            setSchemaText(SAMPLE_SCHEMA);
            setArgsText(SAMPLE_ARGS);
          }}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Load sample
        </button>
        <CopyButton text={report} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Function schema</label>
          <textarea
            value={schemaText}
            onChange={(event) => setSchemaText(event.target.value)}
            rows={13}
            className="w-full rounded-lg border border-gray-300 bg-white p-3 font-mono text-sm dark:border-gray-600 dark:bg-gray-900"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Arguments JSON</label>
          <textarea
            value={argsText}
            onChange={(event) => setArgsText(event.target.value)}
            rows={13}
            className="w-full rounded-lg border border-gray-300 bg-white p-3 font-mono text-sm dark:border-gray-600 dark:bg-gray-900"
          />
        </div>
      </div>

      <div
        className={`mt-4 rounded-lg border p-3 text-sm ${
          valid
            ? "border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-300"
            : "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
        }`}
      >
        {valid ? "Schema test passed." : "Schema test failed. Review parse/validation details below."}
      </div>

      {result.parseError && (
        <p className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {result.parseError}
        </p>
      )}

      {result.validationErrors.length > 0 && (
        <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950">
          <p className="mb-1 text-sm font-medium text-red-800 dark:text-red-200">Validation errors</p>
          <ul className="list-disc space-y-1 pl-5 text-xs text-red-700 dark:text-red-300">
            {result.validationErrors.map((err) => (
              <li key={err} className="font-mono">
                {err}
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.normalizedSchema && (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Resolved parameters schema</p>
              <CopyButton text={result.normalizedSchema} />
            </div>
            <pre className="max-h-[300px] overflow-auto whitespace-pre-wrap rounded bg-gray-50 p-3 text-xs text-gray-800 dark:bg-gray-950 dark:text-gray-200">
              {result.normalizedSchema}
            </pre>
          </div>
          <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Parsed arguments</p>
              <CopyButton text={result.normalizedArgs} />
            </div>
            <pre className="max-h-[300px] overflow-auto whitespace-pre-wrap rounded bg-gray-50 p-3 text-xs text-gray-800 dark:bg-gray-950 dark:text-gray-200">
              {result.normalizedArgs}
            </pre>
          </div>
        </div>
      )}

      <div className="mt-12 space-y-6 border-t border-gray-200 pt-8 text-sm leading-relaxed text-gray-600 dark:border-gray-700 dark:text-gray-400">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
        <p>
          Function Calling Schema Tester validates tool-call argument payloads against function parameter schema to
          prevent runtime failures in agent loops.
        </p>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Do I need full tool schema format?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. You can provide either full function schema or only the parameters JSON Schema.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is this full JSON Schema compatibility?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              It supports core schema fields used most often in function-calling workflows.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is any schema data uploaded?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. Everything runs locally in your browser.
            </p>
          </details>
        </div>
      </div>
    </ToolLayout>
  );
}
