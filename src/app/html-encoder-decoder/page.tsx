"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function htmlEncode(text: string): string {
  const el = document.createElement("div");
  el.innerText = text;
  return el.innerHTML;
}

function htmlDecode(text: string): string {
  const el = document.createElement("div");
  el.innerHTML = text;
  return el.innerText;
}

export default function HtmlEncoderDecoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const handleConvert = () => {
    if (!input.trim()) return;
    if (mode === "encode") {
      setOutput(htmlEncode(input));
    } else {
      setOutput(htmlDecode(input));
    }
  };

  return (
    <ToolLayout
      title="HTML Encoder & Decoder Online"
      description="Encode special characters to HTML entities or decode HTML entities back to plain text. Free online tool."
      relatedTools={["url-encoder-decoder", "base64-encode-decode", "json-formatter"]}
    >
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setMode("encode")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            mode === "encode" ? "bg-blue-600 text-white" : "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
          }`}
        >
          Encode
        </button>
        <button
          onClick={() => setMode("decode")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            mode === "decode" ? "bg-blue-600 text-white" : "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
          }`}
        >
          Decode
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {mode === "encode" ? "HTML / Text to encode" : "HTML entities to decode"}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" ? '<div class="test">&copy;</div>' : "&lt;div class=&quot;test&quot;&gt;&amp;copy;&lt;/div&gt;"}
            className="h-48 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
            spellCheck={false}
          />
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Result</label>
            <CopyButton text={output} />
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="Result will appear here..."
            className="h-48 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 font-mono text-sm"
          />
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={handleConvert}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          {mode === "encode" ? "Encode" : "Decode"}
        </button>
        <button
          onClick={() => { setInput(output); setOutput(""); setMode(mode === "encode" ? "decode" : "encode"); }}
          disabled={!output}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800 disabled:opacity-40"
        >
          Swap
        </button>
        <button
          onClick={() => { setInput(""); setOutput(""); }}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
        >
          Clear
        </button>
      </div>

      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">What are HTML Entities?</h2>
        <p className="mb-3">
          HTML entities are special codes used to represent characters that have special meaning
          in HTML. For example, &lt; represents &lt;, &amp; represents &, and &quot; represents &quot;.
          Encoding prevents browsers from interpreting these characters as HTML tags.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">When to use HTML encoding?</h2>
        <p>
          Use HTML encoding when displaying user-generated content on a web page to prevent
          XSS attacks, or when you need to show HTML code as text rather than rendered markup.
        </p>
      </div>
    
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The HTML Encoder/Decoder converts special characters to their HTML entity equivalents and back. HTML encoding prevents browser rendering issues and cross-site scripting (XSS) vulnerabilities by escaping characters like &lt;, &gt;, &amp;, and quotes that have special meaning in HTML.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Encode HTML</strong> — Converts special characters (&lt;, &gt;, &amp;, &quot;, ') to their corresponding HTML entities.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Decode HTML</strong> — Converts HTML entities back to their original characters for readability.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Named &amp; Numeric Entities</strong> — Supports both named entities (&amp;amp;) and numeric entities (&amp;#38;).
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">XSS Prevention</strong> — Helps sanitize user input by encoding characters that could execute malicious scripts.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Encoding user-generated content before displaying it in web pages to prevent XSS</li>
          <li>Displaying HTML code snippets in tutorials and documentation without browser rendering</li>
          <li>Preparing text for safe inclusion in HTML attributes and meta tags</li>
          <li>Decoding HTML entities from parsed web content or API responses</li>
          <li>Converting special characters for use in email templates and newsletters</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Select Encode or Decode mode. Paste your text or HTML into the input area. The encoded or decoded result appears instantly. Copy the result to use in your HTML documents.
        </p>
      </div>
    </ToolLayout>
  );
}
