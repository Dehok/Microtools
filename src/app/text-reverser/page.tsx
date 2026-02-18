"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

type ReversalMode = "characters" | "words" | "lines" | "eachWord" | "mirror";

const MIRROR_MAP: Record<string, string> = {
  a: "ɐ", b: "q", c: "ɔ", d: "p", e: "ǝ", f: "ɟ", g: "ƃ", h: "ɥ",
  i: "ᴉ", j: "ɾ", k: "ʞ", l: "l", m: "ɯ", n: "u", o: "o", p: "d",
  q: "b", r: "ɹ", s: "s", t: "ʇ", u: "n", v: "ʌ", w: "ʍ", x: "x",
  y: "ʎ", z: "z",
  A: "∀", B: "ᗺ", C: "Ɔ", D: "ᗡ", E: "Ǝ", F: "Ⅎ", G: "פ", H: "H",
  I: "I", J: "ſ", K: "ʞ", L: "˥", M: "W", N: "N", O: "O", P: "Ԁ",
  Q: "Q", R: "ᴚ", S: "S", T: "┴", U: "∩", V: "Λ", W: "M", X: "X",
  Y: "⅄", Z: "Z",
  "0": "0", "1": "Ɩ", "2": "ᄅ", "3": "Ɛ", "4": "ㄣ", "5": "ϛ",
  "6": "9", "7": "ㄥ", "8": "8", "9": "6",
  ".": "˙", ",": "'", "?": "¿", "!": "¡", "'": ",", "(": ")", ")": "(",
  "[": "]", "]": "[", "{": "}", "}": "{", "<": ">", ">": "<",
  "&": "⅋", "_": "‾",
};

function mirrorChar(ch: string): string {
  return MIRROR_MAP[ch] ?? ch;
}

function reverseCharacters(text: string): string {
  return text.split("").reverse().join("");
}

function reverseWords(text: string): string {
  return text
    .split("\n")
    .map((line) => line.split(/\s+/).reverse().join(" "))
    .join("\n");
}

function reverseLines(text: string): string {
  return text.split("\n").reverse().join("\n");
}

function reverseEachWord(text: string): string {
  return text
    .split("\n")
    .map((line) =>
      line
        .split(/(\s+)/)
        .map((token) => (/\s+/.test(token) ? token : token.split("").reverse().join("")))
        .join("")
    )
    .join("\n");
}

function mirrorText(text: string): string {
  return text
    .split("")
    .map(mirrorChar)
    .reverse()
    .join("");
}

function applyMode(text: string, mode: ReversalMode): string {
  switch (mode) {
    case "characters":
      return reverseCharacters(text);
    case "words":
      return reverseWords(text);
    case "lines":
      return reverseLines(text);
    case "eachWord":
      return reverseEachWord(text);
    case "mirror":
      return mirrorText(text);
  }
}

function checkPalindrome(text: string): boolean {
  const cleaned = text.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (cleaned.length === 0) return false;
  return cleaned === cleaned.split("").reverse().join("");
}

const MODES: { value: ReversalMode; label: string; description: string }[] = [
  { value: "characters", label: "Reverse Characters", description: 'Reverses all characters ("hello" → "olleh")' },
  { value: "words", label: "Reverse Words", description: 'Reverses word order ("hello world" → "world hello")' },
  { value: "lines", label: "Reverse Lines", description: "Reverses the order of lines" },
  { value: "eachWord", label: "Reverse Each Word", description: 'Reverses characters inside each word ("hello world" → "olleh dlrow")' },
  { value: "mirror", label: "Mirror Text", description: "Flips text upside-down using Unicode equivalents" },
];

export default function TextReverserPage() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<ReversalMode>("characters");

  const result = useMemo(() => {
    if (!input) return { output: "", isPalindrome: false };
    return {
      output: applyMode(input, mode),
      isPalindrome: checkPalindrome(input),
    };
  }, [input, mode]);

  function handleSwap() {
    setInput(result.output);
  }

  return (
    <ToolLayout
      title="Text Reverser"
      description="Reverse text in multiple ways: flip characters, reverse word order, reverse lines, mirror each word, or create upside-down mirror text using Unicode characters."
      relatedTools={["text-case-converter", "text-repeater", "morse-code"]}
    >
      <div className="space-y-6">
        {/* Mode selector */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Reversal Mode
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {MODES.map((m) => (
              <button
                key={m.value}
                onClick={() => setMode(m.value)}
                className={`text-left px-4 py-3 rounded-lg border-2 transition-all duration-150 ${
                  mode === m.value
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950 dark:bg-blue-900/30 dark:border-blue-400"
                    : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 dark:hover:border-blue-600 bg-white dark:bg-gray-900 dark:bg-gray-800"
                }`}
              >
                <div className={`text-sm font-semibold ${mode === m.value ? "text-blue-700 dark:text-blue-300" : "text-gray-800 dark:text-gray-200"}`}>
                  {m.label}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">
                  {m.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Input and Output */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Input Text
              </label>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {input.length} characters
              </span>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type or paste your text here..."
              className="w-full h-52 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm font-mono resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
            />
            {/* Palindrome badge */}
            {input.trim().length > 0 && (
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold w-fit ${
                  result.isPalindrome
                    ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    result.isPalindrome ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
                {result.isPalindrome ? "Palindrome detected!" : "Not a palindrome"}
              </div>
            )}
          </div>

          {/* Output */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Reversed Text
              </label>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {result.output.length} characters
              </span>
            </div>
            <textarea
              value={result.output}
              readOnly
              placeholder="Reversed output will appear here..."
              className="w-full h-52 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm font-mono resize-y focus:outline-none cursor-default placeholder-gray-400 dark:placeholder-gray-500"
            />
            <div className="flex gap-2">
              <CopyButton text={result.output} />
              <button
                onClick={handleSwap}
                disabled={!result.output}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 16V4m0 0L3 8m4-4l4 4" />
                  <path d="M17 8v12m0 0l4-4m-4 4l-4-4" />
                </svg>
                Swap
              </button>
              <button
                onClick={() => setInput("")}
                disabled={!input}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:bg-red-950 dark:hover:bg-red-950 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Quick examples */}
        <div>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
            Quick Examples
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Hello, World!", value: "Hello, World!" },
              { label: "racecar (palindrome)", value: "racecar" },
              { label: "A man a plan a canal Panama", value: "A man a plan a canal Panama" },
              { label: "Multi-line", value: "First line\nSecond line\nThird line" },
            ].map((ex) => (
              <button
                key={ex.label}
                onClick={() => setInput(ex.value)}
                className="px-3 py-1.5 rounded-full text-xs border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-400 transition-colors"
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About the Text Reverser Tool
        </h2>
        <p>
          The Text Reverser is a free online tool that lets you reverse text in five different ways instantly.
          Whether you need to flip a string for a coding challenge, create a mirror effect, check if a word
          is a palindrome, or simply have fun with text, this tool handles it all without any installation required.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Reversal Modes Explained
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Reverse Characters</strong> - Flips the entire
            string character by character. "hello world" becomes "dlrow olleh". The most common type of text reversal.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Reverse Words</strong> - Keeps each word intact
            but reverses their order within each line. Useful for rearranging sentences or testing parsers.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Reverse Lines</strong> - Flips the order of
            lines in multi-line text. Great for reversing a numbered list or log output.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Reverse Each Word</strong> - Reverses the
            characters inside every word while keeping the words in their original positions.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Mirror Text</strong> - Transforms each letter
            into its upside-down Unicode equivalent and reverses the whole string to create a mirrored,
            flipped effect often seen in social media posts and creative typography.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          What Is a Palindrome?
        </h2>
        <p>
          A palindrome is a word, phrase, or sequence that reads the same forwards and backwards when ignoring
          spaces and punctuation. Classic examples include "racecar", "level", and "A man a plan a canal Panama".
          This tool automatically detects palindromes in your input text as you type.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Uses for Text Reversal
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Reversing strings for coding interviews, algorithm practice, and programming exercises</li>
          <li>Creating mirrored or upside-down text for social media bios and creative posts</li>
          <li>Checking if a word or phrase is a palindrome</li>
          <li>Reversing the order of log lines for easier debugging</li>
          <li>Generating reversed output for simple text obfuscation or puzzles</li>
          <li>Educational use for teaching string manipulation concepts</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use This Tool
        </h2>
        <p>
          Paste or type your text into the input box on the left and choose your desired reversal mode from
          the options above. The reversed result appears instantly in the output box on the right. Use the
          Copy button to copy the result to your clipboard, or click Swap to move the output back to the
          input for chaining multiple reversals together.
        </p>
      
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Is the Text Reverser free to use?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes, the Text Reverser is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need.
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
              Yes. The Text Reverser is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Do I need to install anything?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. The Text Reverser runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately.
            </p>
          </details>
        </div>
</div>
    </ToolLayout>
  );
}
