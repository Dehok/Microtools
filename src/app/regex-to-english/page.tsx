"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface Token {
  raw: string;
  description: string;
  color: string;
}

const EXAMPLES: Record<string, string> = {
  Email: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
  URL: "https?://[^\\s]+",
  Phone: "\\+?\\d{1,3}[-.\\s]?\\d{3,4}[-.\\s]?\\d{4}",
  "IP Address": "\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}",
  "Date (YYYY-MM-DD)": "\\d{4}-\\d{2}-\\d{2}",
  "HTML Tag": "<([a-z]+)[^>]*>(.*?)</\\1>",
  "Hex Color": "#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\\b",
  "Password (8+ chars)": "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$",
};

function explainRegex(pattern: string): { tokens: Token[]; summary: string } {
  const tokens: Token[] = [];
  let i = 0;
  let groupCount = 0;

  while (i < pattern.length) {
    const c = pattern[i];

    // Anchors
    if (c === "^" && (i === 0 || pattern[i - 1] !== "[")) {
      tokens.push({ raw: "^", description: "Start of string", color: "text-red-600 dark:text-red-400" });
      i++; continue;
    }
    if (c === "$") {
      tokens.push({ raw: "$", description: "End of string", color: "text-red-600 dark:text-red-400" });
      i++; continue;
    }

    // Escape sequences
    if (c === "\\") {
      const next = pattern[i + 1];
      if (!next) { i++; continue; }
      const escapes: Record<string, string> = {
        d: "Any digit (0-9)", D: "Any non-digit", w: "Any word character (a-z, A-Z, 0-9, _)",
        W: "Any non-word character", s: "Any whitespace (space, tab, newline)", S: "Any non-whitespace",
        b: "Word boundary", B: "Non-word boundary", n: "Newline", t: "Tab", r: "Carriage return",
        "1": "Back-reference to group 1", "2": "Back-reference to group 2", "3": "Back-reference to group 3",
      };
      if (escapes[next]) {
        tokens.push({ raw: `\\${next}`, description: escapes[next], color: "text-blue-600 dark:text-blue-400" });
      } else {
        tokens.push({ raw: `\\${next}`, description: `Literal '${next}'`, color: "text-gray-600 dark:text-gray-400" });
      }
      i += 2; continue;
    }

    // Character classes
    if (c === "[") {
      let end = i + 1;
      if (pattern[end] === "^") end++;
      if (pattern[end] === "]") end++;
      while (end < pattern.length && pattern[end] !== "]") {
        if (pattern[end] === "\\") end++;
        end++;
      }
      const cls = pattern.slice(i, end + 1);
      const isNegated = cls[1] === "^";
      const inner = cls.slice(isNegated ? 2 : 1, -1);

      let desc = isNegated ? "Any character NOT in: " : "Any character in: ";
      const parts: string[] = [];
      let j = 0;
      while (j < inner.length) {
        if (inner[j] === "\\" && j + 1 < inner.length) {
          const esc: Record<string, string> = { d: "digit", w: "word char", s: "whitespace", D: "non-digit", W: "non-word", S: "non-whitespace" };
          parts.push(esc[inner[j + 1]] || inner[j + 1]);
          j += 2;
        } else if (j + 2 < inner.length && inner[j + 1] === "-") {
          parts.push(`'${inner[j]}' to '${inner[j + 2]}'`);
          j += 3;
        } else {
          parts.push(`'${inner[j]}'`);
          j++;
        }
      }
      desc += parts.join(", ");
      tokens.push({ raw: cls, description: desc, color: "text-green-600 dark:text-green-400" });
      i = end + 1; continue;
    }

    // Groups
    if (c === "(") {
      if (pattern.slice(i, i + 3) === "(?:") {
        tokens.push({ raw: "(?:", description: "Start non-capturing group", color: "text-purple-600 dark:text-purple-400" });
        i += 3; continue;
      }
      if (pattern.slice(i, i + 3) === "(?=") {
        tokens.push({ raw: "(?=", description: "Start positive lookahead (followed by...)", color: "text-purple-600 dark:text-purple-400" });
        i += 3; continue;
      }
      if (pattern.slice(i, i + 3) === "(?!") {
        tokens.push({ raw: "(?!", description: "Start negative lookahead (NOT followed by...)", color: "text-purple-600 dark:text-purple-400" });
        i += 3; continue;
      }
      if (pattern.slice(i, i + 4) === "(?<=") {
        tokens.push({ raw: "(?<=", description: "Start positive lookbehind (preceded by...)", color: "text-purple-600 dark:text-purple-400" });
        i += 4; continue;
      }
      if (pattern.slice(i, i + 4) === "(?<!") {
        tokens.push({ raw: "(?<!", description: "Start negative lookbehind (NOT preceded by...)", color: "text-purple-600 dark:text-purple-400" });
        i += 4; continue;
      }
      groupCount++;
      tokens.push({ raw: "(", description: `Start capturing group #${groupCount}`, color: "text-purple-600 dark:text-purple-400" });
      i++; continue;
    }
    if (c === ")") {
      tokens.push({ raw: ")", description: "End group", color: "text-purple-600 dark:text-purple-400" });
      i++; continue;
    }

    // Quantifiers
    if (c === "*") {
      const lazy = pattern[i + 1] === "?";
      tokens.push({ raw: lazy ? "*?" : "*", description: `Zero or more times${lazy ? " (lazy)" : ""}`, color: "text-orange-600 dark:text-orange-400" });
      i += lazy ? 2 : 1; continue;
    }
    if (c === "+") {
      const lazy = pattern[i + 1] === "?";
      tokens.push({ raw: lazy ? "+?" : "+", description: `One or more times${lazy ? " (lazy)" : ""}`, color: "text-orange-600 dark:text-orange-400" });
      i += lazy ? 2 : 1; continue;
    }
    if (c === "?" && (i === 0 || (pattern[i - 1] !== "*" && pattern[i - 1] !== "+" && pattern[i - 1] !== "}"))) {
      tokens.push({ raw: "?", description: "Zero or one time (optional)", color: "text-orange-600 dark:text-orange-400" });
      i++; continue;
    }
    if (c === "{") {
      const end = pattern.indexOf("}", i);
      if (end !== -1) {
        const quant = pattern.slice(i, end + 1);
        const inner = quant.slice(1, -1);
        let desc: string;
        if (inner.includes(",")) {
          const [min, max] = inner.split(",");
          desc = max.trim() ? `Between ${min.trim()} and ${max.trim()} times` : `${min.trim()} or more times`;
        } else {
          desc = `Exactly ${inner} times`;
        }
        tokens.push({ raw: quant, description: desc, color: "text-orange-600 dark:text-orange-400" });
        i = end + 1; continue;
      }
    }

    // Alternation
    if (c === "|") {
      tokens.push({ raw: "|", description: "OR", color: "text-red-600 dark:text-red-400" });
      i++; continue;
    }

    // Dot
    if (c === ".") {
      tokens.push({ raw: ".", description: "Any character (except newline)", color: "text-blue-600 dark:text-blue-400" });
      i++; continue;
    }

    // Literal character
    tokens.push({ raw: c, description: `Literal '${c}'`, color: "text-gray-600 dark:text-gray-400" });
    i++;
  }

  // Generate summary
  let summary = "This regex matches: ";
  const hasStart = tokens.some((t) => t.raw === "^");
  const hasEnd = tokens.some((t) => t.raw === "$");
  if (hasStart && hasEnd) summary += "a complete string that ";
  else if (hasStart) summary += "text starting with ";
  else if (hasEnd) summary += "text ending with ";
  else summary += "text containing ";

  const meaningful = tokens.filter((t) => t.raw !== "^" && t.raw !== "$");
  if (meaningful.length <= 5) {
    summary += meaningful.map((t) => t.description.toLowerCase()).join(", then ");
  } else {
    summary += `a pattern of ${meaningful.length} elements (see breakdown below)`;
  }

  return { tokens, summary };
}

export default function RegexToEnglishPage() {
  const [input, setInput] = useState("");
  const [flags, setFlags] = useState("");

  const result = useMemo(() => {
    if (!input.trim()) return { tokens: [], summary: "", error: "" };
    try {
      new RegExp(input, flags);
      return { ...explainRegex(input), error: "" };
    } catch (e) {
      return { tokens: [], summary: "", error: e instanceof Error ? e.message : "Invalid regex" };
    }
  }, [input, flags]);

  const fullText = useMemo(() => {
    if (!result.tokens.length) return "";
    return result.tokens.map((t, i) => `${i + 1}. ${t.raw} — ${t.description}`).join("\n");
  }, [result.tokens]);

  return (
    <ToolLayout
      title="Regex to English"
      description="Translate regular expressions to plain English explanations. Understand any regex pattern."
      relatedTools={["regex-tester", "regex-cheat-sheet", "email-validator"]}
    >
      {/* Examples */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Example Patterns</label>
        <div className="flex flex-wrap gap-2">
          {Object.entries(EXAMPLES).map(([name, pattern]) => (
            <button key={name} onClick={() => setInput(pattern)} className="rounded-lg bg-gray-100 dark:bg-gray-800 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:bg-gray-700">
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="mb-4 flex gap-2">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Regular Expression</label>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter regex pattern, e.g. ^[a-zA-Z0-9]+$"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            spellCheck={false}
          />
        </div>
        <div className="w-24">
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Flags</label>
          <input
            value={flags}
            onChange={(e) => setFlags(e.target.value.replace(/[^gimsuy]/g, ""))}
            placeholder="gi"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Error */}
      {result.error && (
        <div className="mb-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 p-3 text-sm text-red-600 dark:text-red-400">
          Invalid regex: {result.error}
        </div>
      )}

      {/* Summary */}
      {result.summary && (
        <div className="mb-4 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950 p-3 text-sm text-blue-800 dark:text-blue-200">
          {result.summary}
        </div>
      )}

      {/* Flags explanation */}
      {flags && (
        <div className="mb-4 rounded-lg bg-gray-50 dark:bg-gray-950 p-3 text-sm text-gray-700 dark:text-gray-300">
          <span className="font-medium">Flags:</span>{" "}
          {flags.includes("g") && <span className="mr-2 rounded bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 text-xs">g — global (find all matches)</span>}
          {flags.includes("i") && <span className="mr-2 rounded bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 text-xs">i — case-insensitive</span>}
          {flags.includes("m") && <span className="mr-2 rounded bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 text-xs">m — multiline (^ and $ match line boundaries)</span>}
          {flags.includes("s") && <span className="mr-2 rounded bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 text-xs">s — dotAll (. matches newlines)</span>}
          {flags.includes("u") && <span className="mr-2 rounded bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 text-xs">u — unicode</span>}
          {flags.includes("y") && <span className="mr-2 rounded bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 text-xs">y — sticky</span>}
        </div>
      )}

      {/* Color-coded regex */}
      {result.tokens.length > 0 && (
        <div className="mb-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
          <div className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">Color-coded Pattern</div>
          <div className="font-mono text-lg">
            {result.tokens.map((t, i) => (
              <span key={i} className={`${t.color} font-medium`} title={t.description}>{t.raw}</span>
            ))}
          </div>
        </div>
      )}

      {/* Token breakdown */}
      {result.tokens.length > 0 && (
        <div className="mb-4">
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Breakdown ({result.tokens.length} tokens)</label>
            <CopyButton text={fullText} />
          </div>
          <div className="rounded-lg border border-gray-200 dark:border-gray-700">
            {result.tokens.map((t, i) => (
              <div key={i} className={`flex items-start gap-3 px-4 py-2 ${i > 0 ? "border-t border-gray-100 dark:border-gray-800" : ""}`}>
                <span className="mt-0.5 min-w-[24px] text-right text-xs text-gray-400 dark:text-gray-500">{i + 1}.</span>
                <code className={`min-w-[80px] font-mono text-sm font-bold ${t.color}`}>{t.raw}</code>
                <span className="text-sm text-gray-600 dark:text-gray-400">{t.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The Regex to English is a free online tool available on CodeUtilo. Translate regular expressions to plain English explanations. Understand any regex pattern. All processing happens directly in your browser — no data is ever sent to any server, ensuring your privacy and security. No signup or installation is required.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> — All regex to english operations run locally in your browser using JavaScript. Your data never leaves your device.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Instant Results</strong> — Get results immediately as you type or paste your input. No waiting for server responses or page reloads.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> — Use the regex to english as many times as you need without creating an account or paying anything.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Mobile Friendly</strong> — Works on desktop, tablet, and mobile browsers. Access this tool from any device with an internet connection.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Using the regex to english for day-to-day development tasks</li>
          <li>Saving time on repetitive tasks by using a browser-based tool instead of writing custom code</li>
          <li>Working on projects where installing software is not an option (school, work, shared computers)</li>
          <li>Quick prototyping and debugging without switching to a terminal or IDE</li>
          <li>Sharing the tool link with colleagues who need the same functionality</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Enter your input in the text area provided and the regex to english will process it instantly. Use the Copy button to copy the result to your clipboard. All operations are performed locally in your browser — no data is transmitted to any server.
        </p>
      </div>
    </ToolLayout>
  );
}
