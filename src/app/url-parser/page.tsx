"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function UrlParser() {
  const [input, setInput] = useState("https://user:pass@www.example.com:8080/path/to/page?query=hello&lang=en#section2");

  const parsed = useMemo(() => {
    if (!input.trim()) return null;
    try {
      const url = new URL(input);
      const params = Array.from(url.searchParams.entries());

      return {
        href: url.href,
        protocol: url.protocol,
        username: url.username,
        password: url.password,
        hostname: url.hostname,
        port: url.port,
        host: url.host,
        origin: url.origin,
        pathname: url.pathname,
        search: url.search,
        hash: url.hash,
        params,
      };
    } catch {
      return null;
    }
  }, [input]);

  return (
    <ToolLayout
      title="URL Parser — Break Down URLs Into Components"
      description="Parse URLs into their components: protocol, hostname, port, path, query parameters, and hash. Free online URL parser."
      relatedTools={["url-encoder-decoder", "slug-generator", "og-meta-generator"]}
    >
      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">URL</label>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="https://example.com/path?key=value#hash"
        className="mb-4 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-2 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
        spellCheck={false}
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {[
          "https://www.example.com/path?q=test&page=1#results",
          "http://localhost:3000/api/users?limit=10",
          "ftp://files.example.com:21/pub/docs/readme.txt",
        ].map((sample) => (
          <button
            key={sample}
            onClick={() => setInput(sample)}
            className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-1 text-[10px] font-mono text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800 truncate max-w-48"
          >
            {sample}
          </button>
        ))}
      </div>

      {!parsed && input.trim() && (
        <div className="mb-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 px-4 py-2 text-sm text-red-700 dark:text-red-300">
          Invalid URL format.
        </div>
      )}

      {parsed && (
        <>
          <div className="mb-4 space-y-2">
            {[
              { label: "Full URL", value: parsed.href },
              { label: "Protocol", value: parsed.protocol },
              { label: "Origin", value: parsed.origin },
              { label: "Hostname", value: parsed.hostname },
              { label: "Host", value: parsed.host },
              { label: "Port", value: parsed.port || "(default)" },
              { label: "Username", value: parsed.username || "(none)" },
              { label: "Password", value: parsed.password || "(none)" },
              { label: "Pathname", value: parsed.pathname },
              { label: "Search", value: parsed.search || "(none)" },
              { label: "Hash", value: parsed.hash || "(none)" },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 p-2.5">
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{row.label}</span>
                  <div className="truncate font-mono text-sm text-gray-900 dark:text-gray-100">{row.value}</div>
                </div>
                {!row.value.startsWith("(") && <CopyButton text={row.value} />}
              </div>
            ))}
          </div>

          {/* Query params */}
          {parsed.params.length > 0 && (
            <div className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950 p-4">
              <h3 className="mb-2 text-sm font-semibold text-blue-900">Query Parameters ({parsed.params.length})</h3>
              <div className="space-y-1">
                {parsed.params.map(([key, val], i) => (
                  <div key={i} className="flex items-center justify-between rounded bg-white dark:bg-gray-900 px-3 py-1.5 text-sm">
                    <div>
                      <span className="font-mono font-semibold text-blue-700 dark:text-blue-300">{key}</span>
                      <span className="text-gray-400 dark:text-gray-500"> = </span>
                      <span className="font-mono text-gray-700 dark:text-gray-300">{val}</span>
                    </div>
                    <CopyButton text={val} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">URL Anatomy</h2>
        <p className="mb-3">
          A URL consists of: <strong>protocol</strong> (https://), <strong>hostname</strong> (www.example.com),
          <strong> port</strong> (:8080), <strong>path</strong> (/page), <strong>query string</strong> (?key=value),
          and <strong>hash/fragment</strong> (#section).
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Use Cases</h2>
        <p>
          URL parsing is useful for debugging API calls, analyzing redirect chains, extracting
          query parameters, building URL manipulation tools, and understanding deep links.
        </p>
      </div>
    
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The URL Parser is a free online tool available on CodeUtilo. Parse URLs into protocol, hostname, port, path, query params, and hash. All processing happens directly in your browser — no data is ever sent to any server, ensuring your privacy and security. No signup or installation is required.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> — All url parser operations run locally in your browser using JavaScript. Your data never leaves your device.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Instant Results</strong> — Get results immediately as you type or paste your input. No waiting for server responses or page reloads.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> — Use the url parser as many times as you need without creating an account or paying anything.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Mobile Friendly</strong> — Works on desktop, tablet, and mobile browsers. Access this tool from any device with an internet connection.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Using the url parser for day-to-day development tasks</li>
          <li>Saving time on repetitive tasks by using a browser-based tool instead of writing custom code</li>
          <li>Working on projects where installing software is not an option (school, work, shared computers)</li>
          <li>Quick prototyping and debugging without switching to a terminal or IDE</li>
          <li>Sharing the tool link with colleagues who need the same functionality</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Enter your input in the text area provided and the url parser will process it instantly. Use the Copy button to copy the result to your clipboard. All operations are performed locally in your browser — no data is transmitted to any server.
        </p>
      </div>
    </ToolLayout>
  );
}
