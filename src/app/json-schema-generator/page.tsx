"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function JsonSchemaGenerator() {
    const [input, setInput] = useState(`{
  "id": 1,
  "name": "Alice",
  "email": "alice@example.com",
  "active": true,
  "age": 30,
  "tags": ["admin", "user"],
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zip": "10001"
  }
}`);
    const [title, setTitle] = useState("MySchema");
    const [requiredAll, setRequiredAll] = useState(true);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState("");

    const schema = useMemo(() => {
        setError("");
        try {
            const data = JSON.parse(input);
            return JSON.stringify(generateSchema(data, title, requiredAll), null, 2);
        } catch (e) {
            setError("Invalid JSON: " + (e as Error).message);
            return "";
        }
    }, [input, title, requiredAll]);

    function generateSchema(value: unknown, name: string, reqAll: boolean): Record<string, unknown> {
        const s: Record<string, unknown> = { $schema: "https://json-schema.org/draft/2020-12/schema", $id: `https://example.com/${name.toLowerCase()}.schema.json` };
        return { ...s, ...inferType(value, reqAll) };
    }

    function inferType(value: unknown, reqAll: boolean): Record<string, unknown> {
        if (value === null) return { type: "null" };
        if (typeof value === "string") {
            if (/^\d{4}-\d{2}-\d{2}T/.test(value)) return { type: "string", format: "date-time" };
            if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return { type: "string", format: "date" };
            if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return { type: "string", format: "email" };
            if (/^https?:\/\//.test(value)) return { type: "string", format: "uri" };
            if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) return { type: "string", format: "uuid" };
            return { type: "string" };
        }
        if (typeof value === "number") return Number.isInteger(value) ? { type: "integer" } : { type: "number" };
        if (typeof value === "boolean") return { type: "boolean" };
        if (Array.isArray(value)) {
            if (value.length === 0) return { type: "array", items: {} };
            return { type: "array", items: inferType(value[0], reqAll) };
        }
        if (typeof value === "object" && value !== null) {
            const props: Record<string, unknown> = {};
            const keys = Object.keys(value as Record<string, unknown>);
            for (const k of keys) props[k] = inferType((value as Record<string, unknown>)[k], reqAll);
            const result: Record<string, unknown> = { type: "object", properties: props };
            if (reqAll && keys.length > 0) result.required = keys;
            result.additionalProperties = false;
            return result;
        }
        return {};
    }

    const handleCopy = () => { navigator.clipboard.writeText(schema); setCopied(true); setTimeout(() => setCopied(false), 1500); };
    const handleDownload = () => { const blob = new Blob([schema], { type: "application/json" }); const link = document.createElement("a"); link.download = `${title.toLowerCase()}.schema.json`; link.href = URL.createObjectURL(blob); link.click(); };

    return (
        <ToolLayout title="JSON Schema Generator" description="Generate JSON Schema from any JSON data. Auto-detect formats (email, URI, date), nested objects, arrays." relatedTools={["json-formatter", "json-to-csv", "yaml-to-json"]}>
            <div className="mb-3 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2"><label className="text-xs text-gray-600 dark:text-gray-400">Schema Title:</label><input value={title} onChange={(e) => setTitle(e.target.value)} className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1 text-xs w-32" /></div>
                <label className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400"><input type="checkbox" checked={requiredAll} onChange={(e) => setRequiredAll(e.target.checked)} className="accent-blue-600" />All fields required</label>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">JSON Input</label>
                    <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={18} spellCheck={false} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-3 font-mono text-sm focus:border-blue-500 focus:outline-none" />
                    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
                </div>
                <div>
                    <div className="flex items-center justify-between mb-1"><label className="text-xs font-medium text-gray-600 dark:text-gray-400">JSON Schema</label><div className="flex gap-2"><button onClick={handleCopy} className="rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700">{copied ? "Copied!" : "Copy"}</button><button onClick={handleDownload} className="rounded-md border border-gray-300 dark:border-gray-600 px-3 py-1 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">Download</button></div></div>
                    <pre className="rounded-lg bg-gray-900 p-4 text-xs text-green-400 font-mono overflow-x-auto whitespace-pre-wrap" style={{ minHeight: 420 }}>{schema}</pre>
                </div>
            </div>

            <div className="mt-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 p-3">
                <h4 className="text-xs font-bold text-blue-800 dark:text-blue-300 mb-1">Auto-detected formats</h4>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-[10px] text-blue-700 dark:text-blue-400">
                    <span>📧 email</span><span>🔗 uri</span><span>📅 date</span><span>🕐 date-time</span><span>🆔 uuid</span><span>🔢 integer vs number</span>
                </div>
            </div>

            <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
                <p>Generate JSON Schema (2020-12 draft) from any JSON data automatically. Detects string formats (email, URI, date, UUID), distinguishes integers from numbers, handles nested objects and arrays. Download or copy the schema for use in validation libraries.</p>
            </div>
        </ToolLayout>
    );
}
