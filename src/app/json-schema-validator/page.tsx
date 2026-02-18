"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

type SchemaType = "string" | "number" | "integer" | "boolean" | "object" | "array" | "null";

interface ValidationError {
  path: string;
  message: string;
}

function validateValue(
  value: unknown,
  schema: Record<string, unknown>,
  path: string
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (schema.type) {
    const types = Array.isArray(schema.type)
      ? (schema.type as SchemaType[])
      : [schema.type as SchemaType];
    const actualType = getType(value);
    if (!types.includes(actualType as SchemaType)) {
      errors.push({
        path: path || "(root)",
        message: `Expected type "${types.join(" | ")}" but got "${actualType}"`,
      });
      return errors;
    }
  }

  if (typeof value === "string") {
    if (typeof schema.minLength === "number" && value.length < schema.minLength) {
      errors.push({ path, message: `String length ${value.length} is less than minLength ${schema.minLength}` });
    }
    if (typeof schema.maxLength === "number" && value.length > schema.maxLength) {
      errors.push({ path, message: `String length ${value.length} exceeds maxLength ${schema.maxLength}` });
    }
    if (typeof schema.pattern === "string") {
      const re = new RegExp(schema.pattern);
      if (!re.test(value)) {
        errors.push({ path, message: `String does not match pattern "${schema.pattern}"` });
      }
    }
  }

  if (typeof value === "number") {
    if (typeof schema.minimum === "number" && value < schema.minimum) {
      errors.push({ path, message: `Value ${value} is less than minimum ${schema.minimum}` });
    }
    if (typeof schema.maximum === "number" && value > schema.maximum) {
      errors.push({ path, message: `Value ${value} exceeds maximum ${schema.maximum}` });
    }
  }

  if (Array.isArray(value)) {
    if (typeof schema.minItems === "number" && value.length < schema.minItems) {
      errors.push({ path, message: `Array has ${value.length} items, minimum is ${schema.minItems}` });
    }
    if (typeof schema.maxItems === "number" && value.length > schema.maxItems) {
      errors.push({ path, message: `Array has ${value.length} items, maximum is ${schema.maxItems}` });
    }
    if (schema.items && typeof schema.items === "object") {
      value.forEach((item, i) => {
        errors.push(...validateValue(item, schema.items as Record<string, unknown>, `${path}[${i}]`));
      });
    }
  }

  if (value && typeof value === "object" && !Array.isArray(value)) {
    const obj = value as Record<string, unknown>;
    const properties = (schema.properties || {}) as Record<string, Record<string, unknown>>;
    const required = (schema.required || []) as string[];

    for (const req of required) {
      if (!(req in obj)) {
        errors.push({ path: `${path}.${req}`, message: `Required property "${req}" is missing` });
      }
    }

    for (const [key, val] of Object.entries(obj)) {
      if (properties[key]) {
        errors.push(...validateValue(val, properties[key], `${path}.${key}`));
      }
    }
  }

  if (schema.enum && Array.isArray(schema.enum)) {
    if (!schema.enum.includes(value)) {
      errors.push({ path, message: `Value must be one of: ${JSON.stringify(schema.enum)}` });
    }
  }

  return errors;
}

function getType(value: unknown): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  if (typeof value === "number" && Number.isInteger(value)) return "integer";
  return typeof value;
}

const sampleJSON = `{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "tags": ["developer", "designer"]
}`;

const sampleSchema = `{
  "type": "object",
  "required": ["name", "age", "email"],
  "properties": {
    "name": { "type": "string", "minLength": 1 },
    "age": { "type": "integer", "minimum": 0, "maximum": 150 },
    "email": { "type": "string", "pattern": "^[^@]+@[^@]+\\\\.[^@]+$" },
    "tags": {
      "type": "array",
      "items": { "type": "string" }
    }
  }
}`;

export default function JsonSchemaValidator() {
  const [json, setJson] = useState(sampleJSON);
  const [schema, setSchema] = useState(sampleSchema);

  const result = useMemo(() => {
    let parsedJson: unknown;
    let parsedSchema: Record<string, unknown>;

    try {
      parsedJson = JSON.parse(json);
    } catch (e) {
      return { error: `Invalid JSON: ${(e as Error).message}`, errors: [] };
    }

    try {
      parsedSchema = JSON.parse(schema);
    } catch (e) {
      return { error: `Invalid Schema: ${(e as Error).message}`, errors: [] };
    }

    const errors = validateValue(parsedJson, parsedSchema, "");
    return { error: null, errors };
  }, [json, schema]);

  const resultText = result.error
    ? result.error
    : result.errors.length === 0
      ? "Valid! JSON matches the schema."
      : result.errors.map((e) => `${e.path}: ${e.message}`).join("\n");

  return (
    <ToolLayout
      title="JSON Schema Validator"
      description="Validate JSON data against a JSON Schema. Check types, required fields, patterns, and constraints."
      relatedTools={["json-formatter", "json-path-finder", "json-to-typescript"]}
    >
      <div className="grid gap-4 md:grid-cols-2">
        {/* JSON Input */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            JSON Data
          </label>
          <textarea
            value={json}
            onChange={(e) => setJson(e.target.value)}
            rows={14}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            spellCheck={false}
          />
        </div>

        {/* Schema Input */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            JSON Schema
          </label>
          <textarea
            value={schema}
            onChange={(e) => setSchema(e.target.value)}
            rows={14}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Result */}
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Validation Result
          </label>
          <CopyButton text={resultText} />
        </div>
        <div
          className={`rounded-lg border p-3 text-sm font-mono ${
            result.error
              ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300"
              : result.errors.length === 0
                ? "border-green-300 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300"
                : "border-yellow-300 bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300"
          }`}
        >
          {result.error ? (
            <p>{result.error}</p>
          ) : result.errors.length === 0 ? (
            <p>Valid! JSON matches the schema.</p>
          ) : (
            <ul className="list-inside space-y-1">
              {result.errors.map((err, i) => (
                <li key={i}>
                  <span className="font-semibold">{err.path}</span>: {err.message}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The JSON Schema Validator is a free online tool available on CodeUtilo. Validate JSON data against a JSON Schema. Check types, required fields, and constraints. All processing happens directly in your browser — no data is ever sent to any server, ensuring your privacy and security. No signup or installation is required.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> — All json schema validator operations run locally in your browser using JavaScript. Your data never leaves your device.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Instant Results</strong> — Get results immediately as you type or paste your input. No waiting for server responses or page reloads.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> — Use the json schema validator as many times as you need without creating an account or paying anything.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Mobile Friendly</strong> — Works on desktop, tablet, and mobile browsers. Access this tool from any device with an internet connection.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Using the json schema validator for day-to-day development tasks</li>
          <li>Saving time on repetitive tasks by using a browser-based tool instead of writing custom code</li>
          <li>Working on projects where installing software is not an option (school, work, shared computers)</li>
          <li>Quick prototyping and debugging without switching to a terminal or IDE</li>
          <li>Sharing the tool link with colleagues who need the same functionality</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Enter your input in the text area provided and the json schema validator will process it instantly. Use the Copy button to copy the result to your clipboard. All operations are performed locally in your browser — no data is transmitted to any server.
        </p>
      </div>
    </ToolLayout>
  );
}
