"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function minifyCSS(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")  // remove comments
    .replace(/\s+/g, " ")              // collapse whitespace
    .replace(/\s*([{}:;,>~+])\s*/g, "$1") // remove space around punctuation
    .replace(/;}/g, "}")               // remove trailing semicolons
    .trim();
}

function beautifyCSS(css: string): string {
  let result = "";
  let indent = 0;
  const minified = minifyCSS(css);

  for (let i = 0; i < minified.length; i++) {
    const char = minified[i];
    if (char === "{") {
      result += " {\n" + "  ".repeat(indent + 1);
      indent++;
    } else if (char === "}") {
      indent = Math.max(0, indent - 1);
      result = result.trimEnd() + "\n" + "  ".repeat(indent) + "}\n\n" + "  ".repeat(indent);
    } else if (char === ";") {
      result += ";\n" + "  ".repeat(indent);
    } else if (char === ",") {
      result += ",\n" + "  ".repeat(indent);
    } else {
      result += char;
    }
  }

  return result.replace(/\n\s*\n\s*\n/g, "\n\n").trim();
}

const SAMPLE = `.header{background-color:#333;color:white;padding:10px 20px;font-size:16px}.header .nav{display:flex;gap:15px}.header .nav a{color:#fff;text-decoration:none}.header .nav a:hover{text-decoration:underline}.main{max-width:1200px;margin:0 auto;padding:20px}`;

export default function CSSMinifier() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleMinify = () => {
    if (!input.trim()) return;
    setOutput(minifyCSS(input));
  };

  const handleBeautify = () => {
    if (!input.trim()) return;
    setOutput(beautifyCSS(input));
  };

  const savedBytes = input.length > 0 && output.length > 0
    ? input.length - output.length
    : 0;
  const savedPercent = input.length > 0 && savedBytes > 0
    ? ((savedBytes / input.length) * 100).toFixed(1)
    : "0";

  return (
    <ToolLayout
      title="CSS Minifier & Beautifier Online"
      description="Minify CSS to reduce file size or beautify compressed CSS for readability. Free online CSS formatter."
      relatedTools={["json-formatter", "markdown-preview", "url-encoder-decoder"]}
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          onClick={handleMinify}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Minify
        </button>
        <button
          onClick={handleBeautify}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
        >
          Beautify
        </button>
        <button
          onClick={() => { setInput(""); setOutput(""); }}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
        >
          Clear
        </button>
        <button
          onClick={() => setInput(SAMPLE)}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
        >
          Sample
        </button>
        {savedBytes > 0 && (
          <span className="ml-auto text-sm text-green-600 dark:text-green-400 font-medium">
            Saved {savedBytes} bytes ({savedPercent}%)
          </span>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Input CSS</label>
            <span className="text-xs text-gray-400 dark:text-gray-500">{input.length} chars</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your CSS here..."
            className="h-72 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
            spellCheck={false}
          />
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Output</label>
            <CopyButton text={output} />
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="Result will appear here..."
            className="h-72 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 font-mono text-sm"
          />
        </div>
      </div>

      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">What is CSS Minification?</h2>
        <p className="mb-3">
          CSS minification removes unnecessary whitespace, comments, and formatting from CSS
          code to reduce file size. Smaller CSS files load faster, improving website performance
          and Core Web Vitals scores.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">When to beautify CSS?</h2>
        <p>
          Beautifying (formatting) CSS adds proper indentation and line breaks, making the code
          easier to read and maintain. Use it when debugging or reviewing minified stylesheets.
        </p>
      </div>
    </ToolLayout>
  );
}
