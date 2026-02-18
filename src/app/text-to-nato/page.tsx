"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const NATO_ALPHABET: Record<string, string> = {
  A: "Alpha",
  B: "Bravo",
  C: "Charlie",
  D: "Delta",
  E: "Echo",
  F: "Foxtrot",
  G: "Golf",
  H: "Hotel",
  I: "India",
  J: "Juliet",
  K: "Kilo",
  L: "Lima",
  M: "Mike",
  N: "November",
  O: "Oscar",
  P: "Papa",
  Q: "Quebec",
  R: "Romeo",
  S: "Sierra",
  T: "Tango",
  U: "Uniform",
  V: "Victor",
  W: "Whiskey",
  X: "X-ray",
  Y: "Yankee",
  Z: "Zulu",
  "0": "Zero",
  "1": "One",
  "2": "Two",
  "3": "Three",
  "4": "Four",
  "5": "Five",
  "6": "Six",
  "7": "Seven",
  "8": "Eight",
  "9": "Niner",
};

const NATO_TO_CHAR: Record<string, string> = {};
for (const [char, word] of Object.entries(NATO_ALPHABET)) {
  NATO_TO_CHAR[word.toLowerCase()] = char;
}

type OutputFormat = "newline" | "dash" | "space";

function textToNato(text: string, format: OutputFormat): string {
  const words: string[] = [];
  for (const char of text.toUpperCase()) {
    if (char === " ") {
      words.push("SPACE");
    } else if (NATO_ALPHABET[char]) {
      words.push(NATO_ALPHABET[char].toUpperCase());
    }
  }
  if (words.length === 0) return "";
  if (format === "newline") return words.join("\n");
  if (format === "dash") return words.join(" - ");
  return words.join(" ");
}

function natoToText(input: string): string {
  const tokens = input
    .split(/[\n\-,]+/)
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);

  return tokens
    .map((token) => {
      if (token === "space") return " ";
      return NATO_TO_CHAR[token] || "?";
    })
    .join("");
}

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const DIGITS = "0123456789".split("");

export default function TextToNato() {
  const [input, setInput] = useState("HELLO WORLD");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [format, setFormat] = useState<OutputFormat>("newline");

  const output = useMemo(() => {
    if (!input.trim()) return "";
    if (mode === "encode") return textToNato(input, format);
    return natoToText(input);
  }, [input, mode, format]);

  function switchToEncode() {
    setMode("encode");
    setInput("HELLO WORLD");
  }

  function switchToDecode() {
    setMode("decode");
    setInput("HOTEL - ECHO - LIMA - LIMA - OSCAR - SPACE - WHISKEY - OSCAR - ROMEO - LIMA - DELTA");
  }

  return (
    <ToolLayout
      title="NATO Phonetic Alphabet Converter"
      description="Convert text to the NATO phonetic alphabet (Alpha, Bravo, Charlie...) and decode NATO words back to plain text. Supports letters, numbers, and spaces."
      relatedTools={["morse-code", "text-to-binary", "rot13"]}
    >
      {/* Mode selector */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={switchToEncode}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            mode === "encode"
              ? "bg-blue-600 text-white"
              : "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
          }`}
        >
          Text &#8594; NATO
        </button>
        <button
          onClick={switchToDecode}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            mode === "decode"
              ? "bg-blue-600 text-white"
              : "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
          }`}
        >
          NATO &#8594; Text
        </button>
      </div>

      {/* Output format selector (encode mode only) */}
      {mode === "encode" && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Output format:</span>
          {(
            [
              { value: "newline", label: "One per line" },
              { value: "dash", label: "Dash-separated" },
              { value: "space", label: "Space-separated" },
            ] as { value: OutputFormat; label: string }[]
          ).map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFormat(value)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                format === value
                  ? "bg-indigo-100 text-indigo-700 border border-indigo-300"
                  : "border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Input / Output */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {mode === "encode" ? "Text Input" : "NATO Words Input"}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === "encode"
                ? "Type text here..."
                : "Paste NATO words separated by newlines, dashes, or commas..."
            }
            className="h-40 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
            spellCheck={false}
          />
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {mode === "encode" ? "NATO Phonetic Output" : "Decoded Text"}
            </label>
            <CopyButton text={output} />
          </div>
          <textarea
            value={output}
            readOnly
            className="h-40 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 font-mono text-sm"
          />
        </div>
      </div>

      {/* NATO Alphabet Reference Table */}
      <div className="mt-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 p-4">
        <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
          NATO Phonetic Alphabet Reference
        </h3>

        <div className="mb-4 grid grid-cols-3 gap-1.5 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7">
          {LETTERS.map((letter) => (
            <div
              key={letter}
              className="flex items-center gap-1.5 rounded bg-white dark:bg-gray-900 px-2 py-1.5 border border-gray-100 dark:border-gray-800 shadow-sm"
            >
              <span className="w-5 shrink-0 text-center font-bold text-blue-700 dark:text-blue-300">{letter}</span>
              <span className="text-xs text-gray-600 dark:text-gray-400">{NATO_ALPHABET[letter]}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-5 gap-1.5 sm:grid-cols-10">
          {DIGITS.map((digit) => (
            <div
              key={digit}
              className="flex items-center gap-1.5 rounded bg-white dark:bg-gray-900 px-2 py-1.5 border border-gray-100 dark:border-gray-800 shadow-sm"
            >
              <span className="w-4 shrink-0 text-center font-bold text-indigo-700">{digit}</span>
              <span className="text-xs text-gray-600 dark:text-gray-400">{NATO_ALPHABET[digit]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SEO content */}
      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
          What is the NATO Phonetic Alphabet?
        </h2>
        <p className="mb-3">
          The NATO phonetic alphabet — officially called the International Radiotelephony Spelling
          Alphabet — assigns a distinct, easily recognizable word to each letter of the Latin
          alphabet. It was standardized by NATO in 1956 to avoid confusion between similar-sounding
          letters (such as B and D, or M and N) during voice communications over radio, telephone,
          and other noisy channels.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
          Common Uses of the NATO Alphabet
        </h2>
        <p className="mb-3">
          The NATO alphabet is used worldwide by military forces, aviation (pilots and air traffic
          controllers), maritime communications, police and emergency services, and customer support
          teams reading out account numbers or addresses over the phone. It dramatically reduces the
          chance of mishearing a letter in critical situations.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
          How to Use This Converter
        </h2>
        <p className="mb-3">
          In <strong>Text to NATO</strong> mode, type or paste any text and the tool will convert
          every letter and digit to its NATO word equivalent. Spaces in your text are shown as
          &quot;SPACE&quot;. You can choose between three output formats: one word per line
          (easiest to read aloud), dash-separated (compact), or space-separated (inline).
        </p>
        <p>
          In <strong>NATO to Text</strong> mode, paste NATO words separated by newlines, dashes, or
          commas. The tool will decode them back to plain letters and digits. The word
          &quot;SPACE&quot; is translated to a space character between words.
        </p>
      </div>
    
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The NATO Phonetic Alphabet is a free online tool available on CodeUtilo. Convert text to NATO phonetic alphabet. Alpha, Bravo, Charlie and back. All processing happens directly in your browser — no data is ever sent to any server, ensuring your privacy and security. No signup or installation is required.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> — All nato phonetic alphabet operations run locally in your browser using JavaScript. Your data never leaves your device.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Instant Results</strong> — Get results immediately as you type or paste your input. No waiting for server responses or page reloads.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> — Use the nato phonetic alphabet as many times as you need without creating an account or paying anything.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Mobile Friendly</strong> — Works on desktop, tablet, and mobile browsers. Access this tool from any device with an internet connection.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Using the nato phonetic alphabet for day-to-day development tasks</li>
          <li>Saving time on repetitive tasks by using a browser-based tool instead of writing custom code</li>
          <li>Working on projects where installing software is not an option (school, work, shared computers)</li>
          <li>Quick prototyping and debugging without switching to a terminal or IDE</li>
          <li>Sharing the tool link with colleagues who need the same functionality</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Enter your input in the text area provided and the nato phonetic alphabet will process it instantly. Use the Copy button to copy the result to your clipboard. All operations are performed locally in your browser — no data is transmitted to any server.
        </p>
      
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Is the NATO Phonetic Alphabet free to use?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes, the NATO Phonetic Alphabet is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need.
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
              Yes. The NATO Phonetic Alphabet is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Do I need to install anything?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. The NATO Phonetic Alphabet runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately.
            </p>
          </details>
        </div>
</div>
    </ToolLayout>
  );
}
