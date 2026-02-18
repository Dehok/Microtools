"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function JsonStringify() {
  const [input, setInput] = useState('{"name":"John","age":30,"active":true}');
  const [mode, setMode] = useState<"parse" | "stringify">("parse");

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: "", error: "" };
    try {
      if (mode === "parse") {
        // Parse stringified JSON (handles escaped strings)
        let toParse = input.trim();
        // If wrapped in quotes, it's a stringified JSON string
        if (toParse.startsWith('"') && toParse.endsWith('"')) {
          toParse = JSON.parse(toParse);
        }
        const parsed = JSON.parse(toParse);
        return { output: JSON.stringify(parsed, null, 2), error: "" };
      } else {
        // Stringify: turn formatted JSON into an escaped string
        const parsed = JSON.parse(input);
        const stringified = JSON.stringify(JSON.stringify(parsed));
        return { output: stringified, error: "" };
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Invalid input";
      return { output: "", error: msg };
    }
  }, [input, mode]);

  return (
    <ToolLayout
      title="JSON Stringify / Parse Online"
      description="Convert between formatted JSON and stringified (escaped) JSON. Useful for embedding JSON in code or API payloads."
      relatedTools={["json-formatter", "json-to-typescript", "json-path-finder"]}
    >
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setMode("parse")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            mode === "parse" ? "bg-blue-600 text-white" : "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
          }`}
        >
          Parse (unescape)
        </button>
        <button
          onClick={() => setMode("stringify")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            mode === "stringify" ? "bg-blue-600 text-white" : "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
          }`}
        >
          Stringify (escape)
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {mode === "parse" ? "Stringified JSON" : "Formatted JSON"}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "parse" ? 'Paste stringified JSON...' : "Paste formatted JSON..."}
            className="h-56 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 font-mono text-xs focus:border-blue-500 dark:border-blue-400 focus:outline-none"
            spellCheck={false}
          />
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {mode === "parse" ? "Formatted JSON" : "Stringified JSON"}
            </label>
            <CopyButton text={output} />
          </div>
          <textarea
            value={error || output}
            readOnly
            className={`h-56 w-full rounded-lg border p-3 font-mono text-xs ${
              error ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300" : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950"
            }`}
          />
        </div>
      </div>

      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">What is JSON.stringify?</h2>
        <p className="mb-3">
          <code>JSON.stringify()</code> converts a JavaScript object to a JSON string. When you
          stringify a string, quotes and special characters are escaped. This is common when
          embedding JSON inside other JSON, storing in databases, or passing through APIs.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Common Use Cases</h2>
        <p>
          Debugging API payloads that contain escaped JSON, converting between readable and
          compact formats, preparing data for storage in string-type database fields, and
          working with webhook payloads.
        </p>
      </div>
    
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The JSON Stringify / Parse is a free online tool available on CodeUtilo. Convert between formatted and stringified (escaped) JSON. All processing happens directly in your browser — no data is ever sent to any server, ensuring your privacy and security. No signup or installation is required.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> — All json stringify / parse operations run locally in your browser using JavaScript. Your data never leaves your device.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Instant Results</strong> — Get results immediately as you type or paste your input. No waiting for server responses or page reloads.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> — Use the json stringify / parse as many times as you need without creating an account or paying anything.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Mobile Friendly</strong> — Works on desktop, tablet, and mobile browsers. Access this tool from any device with an internet connection.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Using the json stringify / parse for day-to-day development tasks</li>
          <li>Saving time on repetitive tasks by using a browser-based tool instead of writing custom code</li>
          <li>Working on projects where installing software is not an option (school, work, shared computers)</li>
          <li>Quick prototyping and debugging without switching to a terminal or IDE</li>
          <li>Sharing the tool link with colleagues who need the same functionality</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Enter your input in the text area provided and the json stringify / parse will process it instantly. Use the Copy button to copy the result to your clipboard. All operations are performed locally in your browser — no data is transmitted to any server.
        </p>
      
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Is the JSON Stringify / Parse free to use?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes, the JSON Stringify / Parse is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Is my data safe when using this tool?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Does this tool work on mobile devices?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes. The JSON Stringify / Parse is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Do I need to install anything?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. The JSON Stringify / Parse runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately.
            </p>
          </details>
        </div>
</div>
    </ToolLayout>
  );
}
