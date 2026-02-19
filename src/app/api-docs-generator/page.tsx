"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";

interface Endpoint { method: string; path: string; summary: string; description: string; tag: string; params: { name: string; in: string; type: string; required: boolean; description: string }[]; responseCode: string; responseDesc: string; }

const EMPTY_ENDPOINT: Endpoint = { method: "GET", path: "/api/resource", summary: "Get resource", description: "Returns a resource by ID", tag: "Resources", params: [], responseCode: "200", responseDesc: "Successful response" };

export default function ApiDocsGenerator() {
    const [info, setInfo] = useState({ title: "My API", version: "1.0.0", description: "REST API documentation", baseUrl: "https://api.example.com" });
    const [endpoints, setEndpoints] = useState<Endpoint[]>([{ ...EMPTY_ENDPOINT }, { method: "POST", path: "/api/resource", summary: "Create resource", description: "Creates a new resource", tag: "Resources", params: [{ name: "body", in: "body", type: "object", required: true, description: "Resource data" }], responseCode: "201", responseDesc: "Created" }]);
    const [copied, setCopied] = useState(false);

    const addEndpoint = () => setEndpoints([...endpoints, { ...EMPTY_ENDPOINT, path: `/api/resource-${endpoints.length + 1}` }]);
    const removeEndpoint = (i: number) => setEndpoints(endpoints.filter((_, idx) => idx !== i));
    const updateEndpoint = (i: number, field: string, val: string) => { const e = [...endpoints]; e[i] = { ...e[i], [field]: val }; setEndpoints(e); };
    const addParam = (i: number) => { const e = [...endpoints]; e[i] = { ...e[i], params: [...e[i].params, { name: "param", in: "query", type: "string", required: false, description: "" }] }; setEndpoints(e); };
    const updateParam = (ei: number, pi: number, field: string, val: string | boolean) => { const e = [...endpoints]; const params = [...e[ei].params]; params[pi] = { ...params[pi], [field]: val }; e[ei] = { ...e[ei], params }; setEndpoints(e); };
    const removeParam = (ei: number, pi: number) => { const e = [...endpoints]; e[ei] = { ...e[ei], params: e[ei].params.filter((_, idx) => idx !== pi) }; setEndpoints(e); };

    const yaml = useMemo(() => {
        const lines: string[] = ["openapi: '3.0.3'", "info:", `  title: ${info.title}`, `  version: '${info.version}'`, `  description: ${info.description}`, "servers:", `  - url: ${info.baseUrl}`, "", "paths:"];
        const byPath: Record<string, Endpoint[]> = {};
        for (const ep of endpoints) { (byPath[ep.path] ??= []).push(ep); }
        for (const [path, eps] of Object.entries(byPath)) {
            lines.push(`  ${path}:`);
            for (const ep of eps) {
                lines.push(`    ${ep.method.toLowerCase()}:`);
                lines.push(`      summary: ${ep.summary}`);
                lines.push(`      description: ${ep.description}`);
                if (ep.tag) lines.push(`      tags: [${ep.tag}]`);
                if (ep.params.length > 0) {
                    const queryParams = ep.params.filter(p => p.in !== "body");
                    const bodyParams = ep.params.filter(p => p.in === "body");
                    if (queryParams.length > 0) {
                        lines.push("      parameters:");
                        for (const p of queryParams) { lines.push(`        - name: ${p.name}`, `          in: ${p.in}`, `          required: ${p.required}`, `          schema:`, `            type: ${p.type}`); if (p.description) lines.push(`          description: ${p.description}`); }
                    }
                    if (bodyParams.length > 0) { lines.push("      requestBody:", "        required: true", "        content:", "          application/json:", "            schema:", "              type: object"); }
                }
                lines.push("      responses:", `        '${ep.responseCode}':`, `          description: ${ep.responseDesc}`);
            }
        }
        return lines.join("\n");
    }, [info, endpoints]);

    const handleCopy = () => { navigator.clipboard.writeText(yaml); setCopied(true); setTimeout(() => setCopied(false), 1500); };
    const handleDownload = () => { const blob = new Blob([yaml], { type: "text/yaml" }); const link = document.createElement("a"); link.download = "openapi.yaml"; link.href = URL.createObjectURL(blob); link.click(); };

    return (
        <ToolLayout title="API Docs Generator" description="Generate OpenAPI 3.0 (Swagger) documentation. Visual endpoint builder with parameters, responses, and tags." relatedTools={["json-schema-generator", "json-formatter", "github-actions-generator"]}>
            <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 space-y-2">
                        <h3 className="text-xs font-bold text-gray-700 dark:text-gray-300">API Info</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <input value={info.title} onChange={(e) => setInfo({ ...info, title: e.target.value })} placeholder="Title" className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1 text-xs" />
                            <input value={info.version} onChange={(e) => setInfo({ ...info, version: e.target.value })} placeholder="Version" className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1 text-xs" />
                        </div>
                        <input value={info.description} onChange={(e) => setInfo({ ...info, description: e.target.value })} placeholder="Description" className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1 text-xs" />
                        <input value={info.baseUrl} onChange={(e) => setInfo({ ...info, baseUrl: e.target.value })} placeholder="Base URL" className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1 text-xs font-mono" />
                    </div>
                    {endpoints.map((ep, i) => (
                        <div key={i} className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 space-y-2 relative">
                            <button onClick={() => removeEndpoint(i)} className="absolute top-2 right-2 text-xs text-red-400 hover:text-red-600">×</button>
                            <div className="flex gap-2">
                                <select value={ep.method} onChange={(e) => updateEndpoint(i, "method", e.target.value)} className={`rounded border px-1 py-1 text-xs font-bold ${ep.method === "GET" ? "text-green-600 border-green-300" : ep.method === "POST" ? "text-blue-600 border-blue-300" : ep.method === "PUT" ? "text-orange-600 border-orange-300" : ep.method === "PATCH" ? "text-yellow-600 border-yellow-300" : "text-red-600 border-red-300"} bg-white dark:bg-gray-900`}>
                                    {["GET", "POST", "PUT", "PATCH", "DELETE"].map(m => <option key={m}>{m}</option>)}
                                </select>
                                <input value={ep.path} onChange={(e) => updateEndpoint(i, "path", e.target.value)} className="flex-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1 text-xs font-mono" />
                                <input value={ep.tag} onChange={(e) => updateEndpoint(i, "tag", e.target.value)} placeholder="Tag" className="w-20 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1 text-xs" />
                            </div>
                            <input value={ep.summary} onChange={(e) => updateEndpoint(i, "summary", e.target.value)} placeholder="Summary" className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1 text-xs" />
                            {ep.params.length > 0 && ep.params.map((p, pi) => (
                                <div key={pi} className="flex gap-1 items-center">
                                    <input value={p.name} onChange={(e) => updateParam(i, pi, "name", e.target.value)} placeholder="name" className="w-16 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-1 py-0.5 text-[10px] font-mono" />
                                    <select value={p.in} onChange={(e) => updateParam(i, pi, "in", e.target.value)} className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-1 py-0.5 text-[10px]"><option>query</option><option>path</option><option>header</option><option>body</option></select>
                                    <select value={p.type} onChange={(e) => updateParam(i, pi, "type", e.target.value)} className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-1 py-0.5 text-[10px]"><option>string</option><option>integer</option><option>number</option><option>boolean</option><option>object</option><option>array</option></select>
                                    <label className="text-[10px] text-gray-500 flex items-center gap-0.5"><input type="checkbox" checked={p.required} onChange={(e) => updateParam(i, pi, "required", e.target.checked)} className="accent-blue-600" />req</label>
                                    <button onClick={() => removeParam(i, pi)} className="text-[10px] text-red-400">×</button>
                                </div>
                            ))}
                            <button onClick={() => addParam(i)} className="text-[10px] text-blue-500 hover:text-blue-700">+ param</button>
                        </div>
                    ))}
                    <button onClick={addEndpoint} className="w-full rounded-lg border border-dashed border-gray-300 dark:border-gray-600 py-2 text-xs text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800">+ Add Endpoint</button>
                </div>
                <div>
                    <div className="flex items-center justify-between mb-2"><h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">OpenAPI 3.0 YAML</h3><div className="flex gap-2"><button onClick={handleCopy} className="rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700">{copied ? "Copied!" : "Copy"}</button><button onClick={handleDownload} className="rounded-md border border-gray-300 dark:border-gray-600 px-3 py-1 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">Download</button></div></div>
                    <pre className="rounded-lg bg-gray-900 p-4 text-xs text-green-400 font-mono overflow-x-auto whitespace-pre-wrap" style={{ minHeight: 400 }}>{yaml}</pre>
                </div>
            </div>

            <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
                <p>Generate OpenAPI 3.0 (Swagger) documentation with a visual endpoint builder. Define API info, endpoints, methods, parameters, request bodies, and responses. Export as YAML for use with Swagger UI, Redoc, or any OpenAPI-compatible tool.</p>
            </div>
        </ToolLayout>
    );
}
