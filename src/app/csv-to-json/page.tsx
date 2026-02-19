"use client";

import { useState, useRef } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function CsvToJson() {
    const [input, setInput] = useState(`name,age,city
Alice,30,New York
Bob,25,London
Charlie,35,Paris`);
    const [json, setJson] = useState("");
    const [delimiter, setDelimiter] = useState(",");
    const [firstRowHeaders, setFirstRowHeaders] = useState(true);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const convert = (csvStr: string) => {
        setError("");
        try {
            const lines = csvStr.split(/\r?\n/).filter(Boolean);
            if (lines.length === 0) { setJson("[]"); return; }

            const parseLine = (line: string): string[] => {
                const result: string[] = [];
                let current = "";
                let inQuotes = false;
                for (let i = 0; i < line.length; i++) {
                    if (line[i] === '"') {
                        if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
                        else inQuotes = !inQuotes;
                    } else if (line[i] === delimiter && !inQuotes) {
                        result.push(current.trim());
                        current = "";
                    } else {
                        current += line[i];
                    }
                }
                result.push(current.trim());
                return result;
            };

            if (firstRowHeaders) {
                const headers = parseLine(lines[0]);
                const data = lines.slice(1).map((line) => {
                    const values = parseLine(line);
                    const obj: Record<string, string | number> = {};
                    headers.forEach((h, i) => {
                        const v = values[i] || "";
                        obj[h] = isNaN(Number(v)) || v === "" ? v : Number(v);
                    });
                    return obj;
                });
                setJson(JSON.stringify(data, null, 2));
            } else {
                const data = lines.map((line) => parseLine(line));
                setJson(JSON.stringify(data, null, 2));
            }
        } catch (e) {
            setError("Parsing error: " + (e as Error).message);
            setJson("");
        }
    };

    const handleFile = (f: File) => {
        const reader = new FileReader();
        reader.onload = (e) => { const text = e.target?.result as string; setInput(text); convert(text); };
        reader.readAsText(f);
    };

    const handleCopy = () => { navigator.clipboard.writeText(json); setCopied(true); setTimeout(() => setCopied(false), 1500); };
    const handleDownload = () => { const blob = new Blob([json], { type: "application/json" }); const link = document.createElement("a"); link.download = "data.json"; link.href = URL.createObjectURL(blob); link.click(); };

    return (
        <ToolLayout title="CSV to JSON Converter" description="Convert CSV files to JSON. Custom delimiters, file upload, auto-detect numbers." relatedTools={["json-to-csv", "json-formatter", "csv-viewer"]}>
            <div className="mb-3 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-600 dark:text-gray-400">Delimiter:</label>
                    <select value={delimiter} onChange={(e) => setDelimiter(e.target.value)} className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1 text-xs">
                        <option value=",">Comma (,)</option><option value=";">Semicolon (;)</option><option value="	">Tab</option><option value="|">Pipe (|)</option>
                    </select>
                </div>
                <label className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400"><input type="checkbox" checked={firstRowHeaders} onChange={(e) => setFirstRowHeaders(e.target.checked)} className="accent-blue-600" />First row as headers</label>
                <button onClick={() => fileInputRef.current?.click()} className="ml-auto rounded-md border border-gray-300 dark:border-gray-600 px-3 py-1 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">Upload CSV</button>
                <input ref={fileInputRef} type="file" accept=".csv,.tsv,.txt" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">CSV Input</label>
                    <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={12} spellCheck={false} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-3 font-mono text-sm focus:border-blue-500 focus:outline-none" />
                    <button onClick={() => convert(input)} className="mt-2 w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Convert →</button>
                </div>
                <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">JSON Output</label>
                    <textarea value={json} readOnly rows={12} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-4 py-3 font-mono text-sm" />
                    {json && <div className="mt-2 flex gap-2"><button onClick={handleCopy} className="flex-1 rounded-lg bg-gray-800 dark:bg-gray-200 px-4 py-2 text-sm font-medium text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-300">{copied ? "Copied!" : "Copy"}</button><button onClick={handleDownload} className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">Download JSON</button></div>}
                    {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
                </div>
            </div>

            <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
                <p>Convert CSV data to JSON format. Supports custom delimiters, quoted fields, automatic number detection, and file upload. Use the first row as headers to create JSON objects, or disable it for arrays.</p>
            </div>
        </ToolLayout>
    );
}
