"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface Header {
  key: string;
  value: string;
}

const PRESETS: Record<string, { method: string; endpoint: string; status: number; headers: Header[]; body: string }> = {
  userList: {
    method: "GET", endpoint: "/api/users", status: 200,
    headers: [{ key: "Content-Type", value: "application/json" }],
    body: JSON.stringify([
      { id: 1, name: "John Doe", email: "john@example.com", role: "admin" },
      { id: 2, name: "Jane Smith", email: "jane@example.com", role: "user" },
      { id: 3, name: "Bob Wilson", email: "bob@example.com", role: "user" },
    ], null, 2),
  },
  singleUser: {
    method: "GET", endpoint: "/api/users/1", status: 200,
    headers: [{ key: "Content-Type", value: "application/json" }],
    body: JSON.stringify({ id: 1, name: "John Doe", email: "john@example.com", role: "admin", createdAt: "2024-01-15T10:30:00Z" }, null, 2),
  },
  createUser: {
    method: "POST", endpoint: "/api/users", status: 201,
    headers: [{ key: "Content-Type", value: "application/json" }, { key: "Location", value: "/api/users/4" }],
    body: JSON.stringify({ id: 4, name: "Alice Brown", email: "alice@example.com", role: "user", createdAt: new Date().toISOString() }, null, 2),
  },
  notFound: {
    method: "GET", endpoint: "/api/users/999", status: 404,
    headers: [{ key: "Content-Type", value: "application/json" }],
    body: JSON.stringify({ error: "Not Found", message: "User with id 999 not found", statusCode: 404 }, null, 2),
  },
  unauthorized: {
    method: "GET", endpoint: "/api/admin/dashboard", status: 401,
    headers: [{ key: "Content-Type", value: "application/json" }, { key: "WWW-Authenticate", value: "Bearer" }],
    body: JSON.stringify({ error: "Unauthorized", message: "Invalid or missing authentication token", statusCode: 401 }, null, 2),
  },
  serverError: {
    method: "GET", endpoint: "/api/data", status: 500,
    headers: [{ key: "Content-Type", value: "application/json" }],
    body: JSON.stringify({ error: "Internal Server Error", message: "An unexpected error occurred", statusCode: 500 }, null, 2),
  },
  paginated: {
    method: "GET", endpoint: "/api/users?page=1&limit=10", status: 200,
    headers: [{ key: "Content-Type", value: "application/json" }],
    body: JSON.stringify({
      data: [
        { id: 1, name: "John Doe", email: "john@example.com" },
        { id: 2, name: "Jane Smith", email: "jane@example.com" },
      ],
      meta: { page: 1, limit: 10, total: 42, totalPages: 5 },
      links: { self: "/api/users?page=1", next: "/api/users?page=2", last: "/api/users?page=5" },
    }, null, 2),
  },
};

const STATUS_CODES: Record<number, string> = {
  200: "OK", 201: "Created", 204: "No Content", 301: "Moved Permanently",
  400: "Bad Request", 401: "Unauthorized", 403: "Forbidden", 404: "Not Found",
  409: "Conflict", 422: "Unprocessable Entity", 429: "Too Many Requests",
  500: "Internal Server Error", 502: "Bad Gateway", 503: "Service Unavailable",
};

const NAMES = ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank", "Grace", "Henry", "Iris", "Jack"];
const DOMAINS = ["example.com", "test.org", "demo.io", "sample.dev"];

export default function ApiResponseMockerPage() {
  const [method, setMethod] = useState("GET");
  const [endpoint, setEndpoint] = useState("/api/users");
  const [status, setStatus] = useState(200);
  const [headers, setHeaders] = useState<Header[]>([{ key: "Content-Type", value: "application/json" }]);
  const [body, setBody] = useState("{\n  \n}");

  const loadPreset = (key: string) => {
    const p = PRESETS[key];
    setMethod(p.method);
    setEndpoint(p.endpoint);
    setStatus(p.status);
    setHeaders([...p.headers]);
    setBody(p.body);
  };

  const generateMockData = () => {
    const count = 5;
    const users = Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: NAMES[i % NAMES.length] + " " + NAMES[(i + 3) % NAMES.length],
      email: NAMES[i % NAMES.length].toLowerCase() + "@" + DOMAINS[i % DOMAINS.length],
      age: 20 + Math.floor(Math.random() * 40),
      active: Math.random() > 0.3,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString(),
    }));
    setBody(JSON.stringify(users, null, 2));
  };

  const addHeader = () => setHeaders([...headers, { key: "", value: "" }]);
  const removeHeader = (i: number) => setHeaders(headers.filter((_, idx) => idx !== i));
  const updateHeader = (i: number, field: "key" | "value", val: string) => {
    const h = [...headers];
    h[i] = { ...h[i], [field]: val };
    setHeaders(h);
  };

  const bodyError = useMemo(() => {
    if (!body.trim()) return "";
    try { JSON.parse(body); return ""; } catch (e) { return e instanceof Error ? e.message : "Invalid JSON"; }
  }, [body]);

  const httpResponse = useMemo(() => {
    const statusText = STATUS_CODES[status] || "Unknown";
    let out = `HTTP/1.1 ${status} ${statusText}\n`;
    for (const h of headers) {
      if (h.key) out += `${h.key}: ${h.value}\n`;
    }
    out += "\n" + body;
    return out;
  }, [status, headers, body]);

  const fetchSnippet = useMemo(() => {
    const hasBody = method !== "GET" && method !== "DELETE" && body.trim();
    return `const response = await fetch("${endpoint}", {
  method: "${method}",${hasBody ? `\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify(${body}),` : ""}
});
const data = await response.json();
console.log(data);`;
  }, [method, endpoint, body]);

  const expressSnippet = useMemo(() => {
    return `app.${method.toLowerCase()}("${endpoint}", (req, res) => {
  res.status(${status}).json(${body || "{}"});
});`;
  }, [method, endpoint, status, body]);

  return (
    <ToolLayout
      title="API Response Mocker"
      description="Create mock API responses with custom status codes, headers, and JSON body."
      relatedTools={["json-formatter", "fake-data-generator", "http-status-codes"]}
    >
      {/* Presets */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Presets</label>
        <div className="flex flex-wrap gap-2">
          {Object.entries(PRESETS).map(([key, p]) => (
            <button key={key} onClick={() => loadPreset(key)} className="rounded-lg bg-gray-100 dark:bg-gray-800 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:bg-gray-700">
              {p.status} {p.method} {p.endpoint.split("?")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Method, Endpoint, Status */}
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Method</label>
          <select value={method} onChange={(e) => setMethod(e.target.value)} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none">
            {["GET", "POST", "PUT", "PATCH", "DELETE"].map((m) => <option key={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Endpoint</label>
          <input value={endpoint} onChange={(e) => setEndpoint(e.target.value)} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Status Code</label>
          <select value={status} onChange={(e) => setStatus(Number(e.target.value))} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none">
            {Object.entries(STATUS_CODES).map(([code, text]) => <option key={code} value={code}>{code} {text}</option>)}
          </select>
        </div>
      </div>

      {/* Headers */}
      <div className="mb-4">
        <div className="mb-1 flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Response Headers</label>
          <button onClick={addHeader} className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:text-blue-300">+ Add Header</button>
        </div>
        <div className="space-y-2">
          {headers.map((h, i) => (
            <div key={i} className="flex gap-2">
              <input value={h.key} onChange={(e) => updateHeader(i, "key", e.target.value)} placeholder="Header name" className="w-1/3 rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-1.5 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none" />
              <input value={h.value} onChange={(e) => updateHeader(i, "value", e.target.value)} placeholder="Value" className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-1.5 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none" />
              <button onClick={() => removeHeader(i)} className="px-2 text-red-400 hover:text-red-600 dark:text-red-400">&times;</button>
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="mb-4">
        <div className="mb-1 flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Response Body (JSON)</label>
          <button onClick={generateMockData} className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:text-blue-300">Generate Mock Data</button>
        </div>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} className={`h-48 w-full rounded-lg border p-3 font-mono text-sm focus:outline-none ${bodyError ? "border-red-300 dark:border-red-700 focus:border-red-500" : "border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:border-blue-400"}`} spellCheck={false} />
        {bodyError && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{bodyError}</p>}
      </div>

      {/* HTTP Response */}
      <div className="mb-4">
        <div className="mb-1 flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full HTTP Response</label>
          <CopyButton text={httpResponse} />
        </div>
        <pre className="max-h-64 overflow-auto rounded-lg bg-gray-900 p-4 font-mono text-sm text-green-400">{httpResponse}</pre>
      </div>

      {/* Code Snippets */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">JavaScript fetch()</label>
            <CopyButton text={fetchSnippet} />
          </div>
          <pre className="max-h-48 overflow-auto rounded-lg bg-gray-900 p-4 font-mono text-xs text-blue-300">{fetchSnippet}</pre>
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Express.js Route</label>
            <CopyButton text={expressSnippet} />
          </div>
          <pre className="max-h-48 overflow-auto rounded-lg bg-gray-900 p-4 font-mono text-xs text-blue-300">{expressSnippet}</pre>
        </div>
      </div>

      {/* SEO Content */}
      <section className="mt-12 space-y-6 text-gray-700 dark:text-gray-300">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">What is API Mocking?</h2>
        <p>
          API mocking creates simulated API responses for development and testing. Instead of relying on a real backend,
          frontend developers can use mock responses to build and test their applications. This speeds up development
          and enables parallel work between frontend and backend teams.
        </p>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">How to Use This Tool</h2>
        <p>
          Select a preset template or build your mock response from scratch. Choose the HTTP method, endpoint URL,
          status code, and response headers. Edit the JSON body directly or generate random mock data.
          Copy the full HTTP response or use the generated code snippets for JavaScript fetch() or Express.js.
        </p>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Common Use Cases</h2>
        <p>
          Use mock API responses for frontend prototyping, unit testing, integration testing, API documentation examples,
          and demo applications. Mock different scenarios including success responses, error responses, pagination,
          and authentication errors to ensure your application handles all cases correctly.
        </p>
      </section>
    </ToolLayout>
  );
}
