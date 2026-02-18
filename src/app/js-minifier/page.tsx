"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function minifyJS(code: string): string {
  let result = code;

  // Remove single-line comments (but not URLs with //)
  result = result.replace(/(?<![:"'])\/\/.*$/gm, "");

  // Remove multi-line comments
  result = result.replace(/\/\*[\s\S]*?\*\//g, "");

  // Remove leading/trailing whitespace from each line
  result = result
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join("\n");

  // Collapse multiple newlines
  result = result.replace(/\n{2,}/g, "\n");

  // Remove newlines where safe (before/after certain characters)
  result = result.replace(/\n(?=[{}\[\](,;:?+\-*/%&|^!~<>=.])/g, "");
  result = result.replace(/([{}\[\](,;:?+\-*/%&|^!~<>=.])\n/g, "$1");

  // Collapse spaces around operators
  result = result.replace(/\s*([=+\-*/<>!&|^%,;:?{}()\[\]])\s*/g, "$1");

  // Ensure space after keywords
  result = result.replace(
    /\b(var|let|const|function|return|if|else|for|while|do|switch|case|break|continue|new|delete|typeof|instanceof|in|of|throw|try|catch|finally|class|extends|import|export|from|default|async|await|yield)\b(?=[^\s({])/g,
    "$1 "
  );

  // Ensure space between closing paren/brace and keyword
  result = result.replace(
    /([})])(?=\b(else|catch|finally|while)\b)/g,
    "$1 "
  );

  return result.trim();
}

const SAMPLE = `// Helper function to calculate the sum
function calculateSum(numbers) {
  /* Initialize the accumulator */
  let sum = 0;

  for (let i = 0; i < numbers.length; i++) {
    // Add each number
    sum += numbers[i];
  }

  return sum;
}

// Export the function
const result = calculateSum([1, 2, 3, 4, 5]);
console.log("The sum is:", result);`;

export default function JsMinifier() {
  const [input, setInput] = useState("");

  const minified = useMemo(() => {
    if (!input.trim()) return "";
    return minifyJS(input);
  }, [input]);

  const savedBytes = input.length - minified.length;
  const savedPercent = input.length > 0 ? ((savedBytes / input.length) * 100).toFixed(1) : "0";

  return (
    <ToolLayout
      title="JavaScript Minifier Online — Minify JS Code"
      description="Minify JavaScript code by removing comments, whitespace, and unnecessary characters. Free online JS minifier."
      relatedTools={["css-minifier", "json-formatter", "html-encoder-decoder"]}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            JavaScript Input ({input.length} bytes)
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your JavaScript code here..."
            className="h-72 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 font-mono text-xs focus:border-blue-500 dark:border-blue-400 focus:outline-none"
            spellCheck={false}
          />
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => setInput(SAMPLE)}
              className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
            >
              Sample
            </button>
            <button
              onClick={() => setInput("")}
              className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
            >
              Clear
            </button>
          </div>
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Minified ({minified.length} bytes)
            </label>
            <CopyButton text={minified} />
          </div>
          <textarea
            value={minified}
            readOnly
            placeholder="Minified output will appear here..."
            className="h-72 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 font-mono text-xs"
          />
        </div>
      </div>

      {/* Stats */}
      {input.trim() && (
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span>
            Saved: <strong className="text-green-600 dark:text-green-400">{savedBytes} bytes ({savedPercent}%)</strong>
          </span>
          <span>Original: <strong>{input.length}</strong> bytes</span>
          <span>Minified: <strong>{minified.length}</strong> bytes</span>
        </div>
      )}

      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Why Minify JavaScript?</h2>
        <p className="mb-3">
          Minification reduces file size by removing comments, whitespace, and unnecessary characters.
          This leads to faster page loads, reduced bandwidth usage, and better user experience.
          Minified files are harder to read but functionally identical.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">What This Tool Does</h2>
        <p>
          This tool removes single-line and multi-line comments, collapses whitespace, and removes
          unnecessary newlines. For production use, consider build tools like Terser, esbuild, or
          webpack which also perform variable renaming and dead code elimination.
        </p>
      </div>
    
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The JavaScript Minifier is a free online tool available on CodeUtilo. Minify JavaScript code by removing comments and whitespace. All processing happens directly in your browser — no data is ever sent to any server, ensuring your privacy and security. No signup or installation is required.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> — All javascript minifier operations run locally in your browser using JavaScript. Your data never leaves your device.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Instant Results</strong> — Get results immediately as you type or paste your input. No waiting for server responses or page reloads.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> — Use the javascript minifier as many times as you need without creating an account or paying anything.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Mobile Friendly</strong> — Works on desktop, tablet, and mobile browsers. Access this tool from any device with an internet connection.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Using the javascript minifier for day-to-day development tasks</li>
          <li>Saving time on repetitive tasks by using a browser-based tool instead of writing custom code</li>
          <li>Working on projects where installing software is not an option (school, work, shared computers)</li>
          <li>Quick prototyping and debugging without switching to a terminal or IDE</li>
          <li>Sharing the tool link with colleagues who need the same functionality</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Enter your input in the text area provided and the javascript minifier will process it instantly. Use the Copy button to copy the result to your clipboard. All operations are performed locally in your browser — no data is transmitted to any server.
        </p>
      
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Is the JavaScript Minifier free to use?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes, the JavaScript Minifier is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need.
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
              Yes. The JavaScript Minifier is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Do I need to install anything?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. The JavaScript Minifier runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately.
            </p>
          </details>
        </div>
</div>
    </ToolLayout>
  );
}
