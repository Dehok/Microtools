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
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
        <p>The HTML Encoder/Decoder converts special characters like &lt;, &gt;, &amp;, and &quot; to their HTML entity equivalents for safe embedding in HTML documents, and decodes HTML entities back to their original characters for reading or processing raw content.</p>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Key Features</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong className="text-gray-700 dark:text-gray-300">Encode Special Characters</strong> &mdash; Converts &lt;, &gt;, &amp;, &quot;, and other reserved HTML characters to entities like &amp;lt;, &amp;gt;, &amp;amp;, and &amp;quot;.</li>
          <li><strong className="text-gray-700 dark:text-gray-300">Decode HTML Entities</strong> &mdash; Converts HTML entities and numeric character references (&amp;#60;, &amp;#x3C;) back to the original characters for reading or further processing.</li>
          <li><strong className="text-gray-700 dark:text-gray-300">Swap Direction</strong> &mdash; One-click Swap button reverses the operation for quick round-trip testing of encode-decode accuracy.</li>
          <li><strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> &mdash; All encoding and decoding runs locally in your browser. Your text never leaves your device.</li>
          <li><strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> &mdash; Use this tool as many times as you need without creating an account or paying anything.</li>
        </ul>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Common Use Cases</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Encoding HTML code snippets for safe display inside a blog post or documentation page without the browser rendering them</li>
          <li>Preventing XSS (Cross-Site Scripting) attacks by encoding user-submitted content before inserting it into an HTML page</li>
          <li>Decoding HTML-encoded content from scraping or API responses to read the actual text values</li>
          <li>Encoding attribute values containing quotes for use in dynamically generated HTML attributes</li>
          <li>Preparing code examples with HTML tags for use in XML-based formats like RSS or Atom feeds</li>
        </ul>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">How to Use</h2>
        <p>Select Encode or Decode mode using the toggle buttons at the top. Paste your content into the input field. Click the action button to process the text. The result appears in the output area. Use Swap to reverse the operation and Copy to copy the result.</p>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Why do I need to encode HTML characters?</summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">Characters like &lt;, &gt;, and &amp; have special meaning in HTML. If included literally in text content, browsers may interpret them as HTML tags or entities, breaking the layout or creating security vulnerabilities. Encoding converts them to safe representations.</p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">What is the difference between &amp;lt; and &amp;#60;?</summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">Both represent the less-than character &lt;. &amp;lt; is a named entity which is more readable. &amp;#60; is a decimal numeric character reference. &amp;#x3C; is the hexadecimal form. All three are equivalent and browsers display them identically.</p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Does HTML encoding prevent XSS attacks?</summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">HTML encoding alone prevents reflected XSS when inserting untrusted text into HTML content. However, different contexts (JavaScript code, URL attributes, CSS values) require different escaping strategies. Always use a context-aware escaping library for security-critical applications.</p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Do I need to encode spaces in HTML?</summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">Spaces in HTML content do not need encoding. They only need encoding in URL query parameters (as %20 or +). In HTML attributes, spaces within quoted values are safe. Only in special contexts like XML attribute normalization do spaces become significant.</p>
          </details>
        </div>
      </div>
    </ToolLayout>
  );
}
