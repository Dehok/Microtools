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
    
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The CSS Minifier removes unnecessary whitespace, comments, and formatting from CSS code to reduce file size. Minified CSS loads faster by reducing the number of bytes transferred over the network. The beautifier mode reformats minified or poorly formatted CSS into a readable, properly indented format.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Minify CSS</strong> — Removes all comments, whitespace, and line breaks while preserving the CSS functionality.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Beautify CSS</strong> — Reformats compressed CSS with proper indentation, line breaks, and spacing for readability.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Size Comparison</strong> — Shows the original and minified file sizes so you can see the space savings.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Error Preservation</strong> — Maintains CSS validity during minification — your styles will work exactly the same.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Minifying CSS files before deploying to production for faster page loads</li>
          <li>Beautifying minified CSS from third-party libraries for debugging and modification</li>
          <li>Reducing CSS file size to improve Core Web Vitals and page performance scores</li>
          <li>Formatting CSS pasted from browser DevTools into readable code</li>
          <li>Preparing CSS for code reviews by ensuring consistent formatting</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Paste your CSS code into the input area. Click &quot;Minify&quot; to compress the CSS or &quot;Beautify&quot; to format it with proper indentation. The result appears in the output area. Copy the processed CSS with the Copy button.
        </p>
      
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              What does CSS minification do?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              CSS minification removes all unnecessary characters from CSS code — whitespace, line breaks, comments, and redundant semicolons — without changing its functionality. This reduces file size and improves page load speed.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              How much file size reduction can I expect?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Typically, CSS minification reduces file size by 20-40% depending on how your CSS is written. Files with many comments and generous formatting see the biggest reductions.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Will minification break my CSS?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. Proper minification only removes characters that have no effect on how CSS is interpreted by browsers. Your styles will look and work exactly the same.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Should I minify CSS for development or production?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Only for production. During development, keep your CSS readable and well-formatted for easier debugging. Minify only when deploying to production for optimal performance.
            </p>
          </details>
        </div>
</div>
    </ToolLayout>
  );
}
