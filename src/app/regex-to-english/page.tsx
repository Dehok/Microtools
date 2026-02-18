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
      tokens.push({ raw: "^", description: "Start of string", color: "text-red-600" });
      i++; continue;
    }
    if (c === "$") {
      tokens.push({ raw: "$", description: "End of string", color: "text-red-600" });
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
        tokens.push({ raw: `\\${next}`, description: escapes[next], color: "text-blue-600" });
      } else {
        tokens.push({ raw: `\\${next}`, description: `Literal '${next}'`, color: "text-gray-600" });
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
      tokens.push({ raw: cls, description: desc, color: "text-green-600" });
      i = end + 1; continue;
    }

    // Groups
    if (c === "(") {
      if (pattern.slice(i, i + 3) === "(?:") {
        tokens.push({ raw: "(?:", description: "Start non-capturing group", color: "text-purple-600" });
        i += 3; continue;
      }
      if (pattern.slice(i, i + 3) === "(?=") {
        tokens.push({ raw: "(?=", description: "Start positive lookahead (followed by...)", color: "text-purple-600" });
        i += 3; continue;
      }
      if (pattern.slice(i, i + 3) === "(?!") {
        tokens.push({ raw: "(?!", description: "Start negative lookahead (NOT followed by...)", color: "text-purple-600" });
        i += 3; continue;
      }
      if (pattern.slice(i, i + 4) === "(?<=") {
        tokens.push({ raw: "(?<=", description: "Start positive lookbehind (preceded by...)", color: "text-purple-600" });
        i += 4; continue;
      }
      if (pattern.slice(i, i + 4) === "(?<!") {
        tokens.push({ raw: "(?<!", description: "Start negative lookbehind (NOT preceded by...)", color: "text-purple-600" });
        i += 4; continue;
      }
      groupCount++;
      tokens.push({ raw: "(", description: `Start capturing group #${groupCount}`, color: "text-purple-600" });
      i++; continue;
    }
    if (c === ")") {
      tokens.push({ raw: ")", description: "End group", color: "text-purple-600" });
      i++; continue;
    }

    // Quantifiers
    if (c === "*") {
      const lazy = pattern[i + 1] === "?";
      tokens.push({ raw: lazy ? "*?" : "*", description: `Zero or more times${lazy ? " (lazy)" : ""}`, color: "text-orange-600" });
      i += lazy ? 2 : 1; continue;
    }
    if (c === "+") {
      const lazy = pattern[i + 1] === "?";
      tokens.push({ raw: lazy ? "+?" : "+", description: `One or more times${lazy ? " (lazy)" : ""}`, color: "text-orange-600" });
      i += lazy ? 2 : 1; continue;
    }
    if (c === "?" && (i === 0 || (pattern[i - 1] !== "*" && pattern[i - 1] !== "+" && pattern[i - 1] !== "}"))) {
      tokens.push({ raw: "?", description: "Zero or one time (optional)", color: "text-orange-600" });
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
        tokens.push({ raw: quant, description: desc, color: "text-orange-600" });
        i = end + 1; continue;
      }
    }

    // Alternation
    if (c === "|") {
      tokens.push({ raw: "|", description: "OR", color: "text-red-600" });
      i++; continue;
    }

    // Dot
    if (c === ".") {
      tokens.push({ raw: ".", description: "Any character (except newline)", color: "text-blue-600" });
      i++; continue;
    }

    // Literal character
    tokens.push({ raw: c, description: `Literal '${c}'`, color: "text-gray-600" });
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
        <label className="mb-1 block text-sm font-medium text-gray-700">Example Patterns</label>
        <div className="flex flex-wrap gap-2">
          {Object.entries(EXAMPLES).map(([name, pattern]) => (
            <button key={name} onClick={() => setInput(pattern)} className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-200">
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="mb-4 flex gap-2">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium text-gray-700">Regular Expression</label>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter regex pattern, e.g. ^[a-zA-Z0-9]+$"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            spellCheck={false}
          />
        </div>
        <div className="w-24">
          <label className="mb-1 block text-sm font-medium text-gray-700">Flags</label>
          <input
            value={flags}
            onChange={(e) => setFlags(e.target.value.replace(/[^gimsuy]/g, ""))}
            placeholder="gi"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Error */}
      {result.error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          Invalid regex: {result.error}
        </div>
      )}

      {/* Summary */}
      {result.summary && (
        <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
          {result.summary}
        </div>
      )}

      {/* Flags explanation */}
      {flags && (
        <div className="mb-4 rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
          <span className="font-medium">Flags:</span>{" "}
          {flags.includes("g") && <span className="mr-2 rounded bg-gray-200 px-1.5 py-0.5 text-xs">g — global (find all matches)</span>}
          {flags.includes("i") && <span className="mr-2 rounded bg-gray-200 px-1.5 py-0.5 text-xs">i — case-insensitive</span>}
          {flags.includes("m") && <span className="mr-2 rounded bg-gray-200 px-1.5 py-0.5 text-xs">m — multiline (^ and $ match line boundaries)</span>}
          {flags.includes("s") && <span className="mr-2 rounded bg-gray-200 px-1.5 py-0.5 text-xs">s — dotAll (. matches newlines)</span>}
          {flags.includes("u") && <span className="mr-2 rounded bg-gray-200 px-1.5 py-0.5 text-xs">u — unicode</span>}
          {flags.includes("y") && <span className="mr-2 rounded bg-gray-200 px-1.5 py-0.5 text-xs">y — sticky</span>}
        </div>
      )}

      {/* Color-coded regex */}
      {result.tokens.length > 0 && (
        <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4">
          <div className="mb-2 text-xs font-medium text-gray-500">Color-coded Pattern</div>
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
            <label className="text-sm font-medium text-gray-700">Breakdown ({result.tokens.length} tokens)</label>
            <CopyButton text={fullText} />
          </div>
          <div className="rounded-lg border border-gray-200">
            {result.tokens.map((t, i) => (
              <div key={i} className={`flex items-start gap-3 px-4 py-2 ${i > 0 ? "border-t border-gray-100" : ""}`}>
                <span className="mt-0.5 min-w-[24px] text-right text-xs text-gray-400">{i + 1}.</span>
                <code className={`min-w-[80px] font-mono text-sm font-bold ${t.color}`}>{t.raw}</code>
                <span className="text-sm text-gray-600">{t.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SEO Content */}
      <section className="mt-12 space-y-6 text-gray-700">
        <h2 className="text-2xl font-bold text-gray-900">What is Regex to English?</h2>
        <p>
          This tool translates regular expressions (regex) into plain English descriptions. Instead of trying to
          decipher complex patterns like <code className="rounded bg-gray-100 px-1 font-mono text-sm">^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{"{2,}"}$</code>,
          you get a step-by-step breakdown explaining what each part of the regex does.
        </p>
        <h2 className="text-2xl font-bold text-gray-900">Understanding Regex Patterns</h2>
        <p>
          Regular expressions use special characters and syntax to define search patterns. Character classes like
          [a-z] match ranges, quantifiers like + and * control repetition, anchors like ^ and $ mark boundaries,
          and groups ( ) capture or organize parts of the pattern. This tool explains all of these elements.
        </p>
        <h2 className="text-2xl font-bold text-gray-900">How to Use This Tool</h2>
        <p>
          Enter your regex pattern in the input field. The tool instantly breaks it down into individual tokens
          with color-coded explanations. Try one of the example patterns to see how common regex patterns work.
          Use the flags field to add modifiers like g (global) or i (case-insensitive).
        </p>
      </section>
    </ToolLayout>
  );
}
