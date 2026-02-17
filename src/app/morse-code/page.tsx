"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const CHAR_TO_MORSE: Record<string, string> = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.",
  G: "--.", H: "....", I: "..", J: ".---", K: "-.-", L: ".-..",
  M: "--", N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.",
  S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-",
  Y: "-.--", Z: "--..",
  "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-",
  "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.",
  ".": ".-.-.-", ",": "--..--", "?": "..--..", "'": ".----.",
  "!": "-.-.--", "/": "-..-.", "(": "-.--.", ")": "-.--.-",
  "&": ".-...", ":": "---...", ";": "-.-.-.", "=": "-...-",
  "+": ".-.-.", "-": "-....-", "_": "..--.-", '"': ".-..-.",
  "$": "...-..-", "@": ".--.-.",
};

const MORSE_TO_CHAR: Record<string, string> = {};
for (const [char, morse] of Object.entries(CHAR_TO_MORSE)) {
  MORSE_TO_CHAR[morse] = char;
}

function textToMorse(text: string): string {
  return text
    .toUpperCase()
    .split("")
    .map((c) => {
      if (c === " ") return "/";
      return CHAR_TO_MORSE[c] || "";
    })
    .filter(Boolean)
    .join(" ");
}

function morseToText(morse: string): string {
  return morse
    .split(" / ")
    .map((word) =>
      word
        .split(" ")
        .map((code) => MORSE_TO_CHAR[code] || "?")
        .join("")
    )
    .join(" ");
}

export default function MorseCode() {
  const [input, setInput] = useState("HELLO WORLD");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const output = useMemo(() => {
    if (!input.trim()) return "";
    return mode === "encode" ? textToMorse(input) : morseToText(input);
  }, [input, mode]);

  return (
    <ToolLayout
      title="Morse Code Translator — Encode & Decode"
      description="Translate text to Morse code and Morse code back to text. Supports letters, numbers, and common punctuation."
      relatedTools={["text-case-converter", "base64-encode-decode", "backslash-escape"]}
    >
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => { setMode("encode"); setInput("HELLO WORLD"); }}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            mode === "encode"
              ? "bg-blue-600 text-white"
              : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          Text → Morse
        </button>
        <button
          onClick={() => { setMode("decode"); setInput(".... . .-.. .-.. --- / .-- --- .-. .-.. -.."); }}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            mode === "decode"
              ? "bg-blue-600 text-white"
              : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          Morse → Text
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            {mode === "encode" ? "Text Input" : "Morse Code Input"}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" ? "Type text here..." : "Enter Morse code (use . and -)..."}
            className="h-32 w-full rounded-lg border border-gray-300 bg-gray-50 p-3 font-mono text-sm focus:border-blue-500 focus:outline-none"
            spellCheck={false}
          />
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              {mode === "encode" ? "Morse Code" : "Decoded Text"}
            </label>
            <CopyButton text={output} />
          </div>
          <textarea
            value={output}
            readOnly
            className="h-32 w-full rounded-lg border border-gray-300 bg-gray-50 p-3 font-mono text-sm"
          />
        </div>
      </div>

      {/* Reference chart */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h3 className="mb-3 text-sm font-semibold text-gray-900">Morse Code Reference</h3>
        <div className="grid grid-cols-4 gap-1 text-xs sm:grid-cols-6 md:grid-cols-9">
          {Object.entries(CHAR_TO_MORSE)
            .slice(0, 36)
            .map(([char, morse]) => (
              <div
                key={char}
                className="flex items-center gap-1 rounded bg-white px-2 py-1 border border-gray-100"
              >
                <span className="font-bold text-gray-900">{char}</span>
                <span className="font-mono text-gray-500">{morse}</span>
              </div>
            ))}
        </div>
      </div>

      <div className="mt-8 border-t border-gray-200 pt-6 text-sm text-gray-600">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">What is Morse Code?</h2>
        <p className="mb-3">
          Morse code is a character encoding scheme that represents letters and numbers as
          sequences of dots (.) and dashes (-). Invented in the 1830s for telegraph communication,
          it is still used in aviation, amateur radio, and emergency signaling.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Morse Code Format</h2>
        <p>
          Each character is separated by a space. Words are separated by a forward slash (/).
          A dot represents a short signal and a dash represents a long signal (3x the dot duration).
          The most common signal, SOS, is <strong>... --- ...</strong>.
        </p>
      </div>
    </ToolLayout>
  );
}
