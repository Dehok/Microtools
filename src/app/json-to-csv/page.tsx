"use client";

import { useState, useRef } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function JsonToCsv() {
    const [input, setInput] = useState(`[
  { "name": "Alice", "age": 30, "city": "New York" },
  { "name": "Bob", "age": 25, "city": "London" },
  { "name": "Charlie", "age": 35, "city": "Paris" }
]`);
    const [csv, setCsv] = useState("");
    const [delimiter, setDelimiter] = useState(",");
    const [includeHeaders, setIncludeHeaders] = useState(true);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const convert = (jsonStr: string) => {
        setError("");
        try {
            let data = JSON.parse(jsonStr);
            if (!Array.isArray(data)) {
                if (typeof data === "object" && data !== null) data = [data];
                else { setError("Input must be a JSON array or object"); return; }
            }
            if (data.length === 0) { setCsv(""); return; }

            const headers = [...new Set(data.flatMap((row: Record<string, unknown>) => Object.keys(row)))] as string[];
            const escape = (val: unknown): string => {
                const s = val === null || val === undefined ? "" : String(val);
                return s.includes(delimiter) || s.includes('"') || s.includes("\n") ? `"${s.replace(/"/g, '""')}"` : s;
            };

            const lines: string[] = [];
            if (includeHeaders) lines.push(headers.map(escape).join(delimiter));
            for (const row of data) {
                lines.push(headers.map((h) => escape((row as Record<string, unknown>)[h])).join(delimiter));
            }
            setCsv(lines.join("\n"));
        } catch (e) {
            setError("Invalid JSON: " + (e as Error).message);
            setCsv("");
        }
    };

    const handleFile = (f: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            setInput(text);
            convert(text);
        };
        reader.readAsText(f);
    };

    const handleCopy = () => { navigator.clipboard.writeText(csv); setCopied(true); setTimeout(() => setCopied(false), 1500); };
    const handleDownload = () => { const blob = new Blob([csv], { type: "text/csv" }); const link = document.createElement("a"); link.download = "data.csv"; link.href = URL.createObjectURL(blob); link.click(); };

    return (
        <ToolLayout title="JSON to CSV Converter" description="Convert JSON arrays to CSV files. Custom delimiters, file upload, instant download." relatedTools={["json-formatter", "csv-to-json", "yaml-to-json"]}>
            <div className="mb-3 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-600 dark:text-gray-400">Delimiter:</label>
                    <select value={delimiter} onChange={(e) => setDelimiter(e.target.value)} className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1 text-xs">
                        <option value=",">Comma (,)</option><option value=";">Semicolon (;)</option><option value="	">Tab</option><option value="|">Pipe (|)</option>
                    </select>
                </div>
                <label className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400"><input type="checkbox" checked={includeHeaders} onChange={(e) => setIncludeHeaders(e.target.checked)} className="accent-blue-600" />Include headers</label>
                <button onClick={() => fileInputRef.current?.click()} className="ml-auto rounded-md border border-gray-300 dark:border-gray-600 px-3 py-1 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">Upload JSON</button>
                <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">JSON Input</label>
                    <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={12} spellCheck={false} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-3 font-mono text-sm focus:border-blue-500 focus:outline-none" />
                    <button onClick={() => convert(input)} className="mt-2 w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Convert →</button>
                </div>
                <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">CSV Output</label>
                    <textarea value={csv} readOnly rows={12} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-4 py-3 font-mono text-sm" />
                    {csv && <div className="mt-2 flex gap-2"><button onClick={handleCopy} className="flex-1 rounded-lg bg-gray-800 dark:bg-gray-200 px-4 py-2 text-sm font-medium text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-300">{copied ? "Copied!" : "Copy"}</button><button onClick={handleDownload} className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">Download CSV</button></div>}
                    {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
                </div>
            </div>

            <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
                <p>Convert JSON arrays or objects to CSV format. Supports custom delimiters (comma, semicolon, tab, pipe), file upload, and instant download. Handles nested values, escaping, and empty fields.</p>
            </div>
        </ToolLayout>
    );
}
