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
            mode === "encode" ? "bg-blue-600 text-white" : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          Encode
        </button>
        <button
          onClick={() => setMode("decode")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            mode === "decode" ? "bg-blue-600 text-white" : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          Decode
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            {mode === "encode" ? "HTML / Text to encode" : "HTML entities to decode"}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" ? '<div class="test">&copy;</div>' : "&lt;div class=&quot;test&quot;&gt;&amp;copy;&lt;/div&gt;"}
            className="h-48 w-full rounded-lg border border-gray-300 bg-gray-50 p-3 font-mono text-sm focus:border-blue-500 focus:outline-none"
            spellCheck={false}
          />
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Result</label>
            <CopyButton text={output} />
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="Result will appear here..."
            className="h-48 w-full rounded-lg border border-gray-300 bg-gray-50 p-3 font-mono text-sm"
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
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40"
        >
          Swap
        </button>
        <button
          onClick={() => { setInput(""); setOutput(""); }}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Clear
        </button>
      </div>

      <div className="mt-8 border-t border-gray-200 pt-6 text-sm text-gray-600">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">What are HTML Entities?</h2>
        <p className="mb-3">
          HTML entities are special codes used to represent characters that have special meaning
          in HTML. For example, &lt; represents &lt;, &amp; represents &, and &quot; represents &quot;.
          Encoding prevents browsers from interpreting these characters as HTML tags.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">When to use HTML encoding?</h2>
        <p>
          Use HTML encoding when displaying user-generated content on a web page to prevent
          XSS attacks, or when you need to show HTML code as text rather than rendered markup.
        </p>
      </div>
    </ToolLayout>
  );
}
