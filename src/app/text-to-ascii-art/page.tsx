"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

// ---------------------------------------------------------------------------
// FONT DEFINITIONS
// Each character is an array of strings – one string per row.
// All rows in a given font must have the same width (padded with spaces).
// ---------------------------------------------------------------------------

type CharMap = Record<string, string[]>;

// ---------------------------------------------------------------------------
// BLOCK font – 5 rows × 5 cols, uses # and space
// ---------------------------------------------------------------------------
const BLOCK: CharMap = {
  A: ["  #  ", " # # ", "#####", "#   #", "#   #"],
  B: ["#### ", "#   #", "#### ", "#   #", "#### "],
  C: [" ####", "#    ", "#    ", "#    ", " ####"],
  D: ["#### ", "#   #", "#   #", "#   #", "#### "],
  E: ["#####", "#    ", "###  ", "#    ", "#####"],
  F: ["#####", "#    ", "###  ", "#    ", "#    "],
  G: [" ####", "#    ", "# ###", "#   #", " ####"],
  H: ["#   #", "#   #", "#####", "#   #", "#   #"],
  I: ["#####", "  #  ", "  #  ", "  #  ", "#####"],
  J: ["#####", "   # ", "   # ", "#  # ", " ##  "],
  K: ["#   #", "#  # ", "###  ", "#  # ", "#   #"],
  L: ["#    ", "#    ", "#    ", "#    ", "#####"],
  M: ["#   #", "## ##", "# # #", "#   #", "#   #"],
  N: ["#   #", "##  #", "# # #", "#  ##", "#   #"],
  O: [" ### ", "#   #", "#   #", "#   #", " ### "],
  P: ["#### ", "#   #", "#### ", "#    ", "#    "],
  Q: [" ### ", "#   #", "# # #", "#  ##", " ####"],
  R: ["#### ", "#   #", "#### ", "#  # ", "#   #"],
  S: [" ####", "#    ", " ### ", "    #", "#### "],
  T: ["#####", "  #  ", "  #  ", "  #  ", "  #  "],
  U: ["#   #", "#   #", "#   #", "#   #", " ### "],
  V: ["#   #", "#   #", "#   #", " # # ", "  #  "],
  W: ["#   #", "#   #", "# # #", "## ##", "#   #"],
  X: ["#   #", " # # ", "  #  ", " # # ", "#   #"],
  Y: ["#   #", " # # ", "  #  ", "  #  ", "  #  "],
  Z: ["#####", "   # ", "  #  ", " #   ", "#####"],
  "0": [" ### ", "#  ##", "# # #", "##  #", " ### "],
  "1": ["  #  ", " ##  ", "  #  ", "  #  ", "#####"],
  "2": [" ### ", "#   #", "  ## ", " #   ", "#####"],
  "3": ["#### ", "    #", " ### ", "    #", "#### "],
  "4": ["#  # ", "#  # ", "#####", "   # ", "   # "],
  "5": ["#####", "#    ", "#### ", "    #", "#### "],
  "6": [" ### ", "#    ", "#### ", "#   #", " ### "],
  "7": ["#####", "   # ", "  #  ", " #   ", "#    "],
  "8": [" ### ", "#   #", " ### ", "#   #", " ### "],
  "9": [" ### ", "#   #", " ####", "    #", " ### "],
  " ": ["     ", "     ", "     ", "     ", "     "],
  "!": ["  #  ", "  #  ", "  #  ", "     ", "  #  "],
  "?": [" ### ", "#   #", "  ## ", "     ", "  #  "],
  ".": ["     ", "     ", "     ", "     ", "  #  "],
  ",": ["     ", "     ", "     ", "  #  ", " #   "],
  "-": ["     ", "     ", "#####", "     ", "     "],
  "+": ["     ", "  #  ", "#####", "  #  ", "     "],
  ":": ["     ", "  #  ", "     ", "  #  ", "     "],
};

// ---------------------------------------------------------------------------
// BANNER font – 7 rows × 7 cols, uses # and space (wider)
// ---------------------------------------------------------------------------
const BANNER: CharMap = {
  A: ["  ###  ", " #   # ", "#     #", "#######", "#     #", "#     #", "#     #"],
  B: ["###### ", "#     #", "#     #", "###### ", "#     #", "#     #", "###### "],
  C: [" ######", "#      ", "#      ", "#      ", "#      ", "#      ", " ######"],
  D: ["###### ", "#     #", "#     #", "#     #", "#     #", "#     #", "###### "],
  E: ["#######", "#      ", "#      ", "#####  ", "#      ", "#      ", "#######"],
  F: ["#######", "#      ", "#      ", "#####  ", "#      ", "#      ", "#      "],
  G: [" ######", "#      ", "#      ", "#  ####", "#     #", "#     #", " ######"],
  H: ["#     #", "#     #", "#     #", "#######", "#     #", "#     #", "#     #"],
  I: ["#######", "   #   ", "   #   ", "   #   ", "   #   ", "   #   ", "#######"],
  J: ["#######", "     # ", "     # ", "     # ", "#    # ", "#    # ", " ####  "],
  K: ["#    # ", "#   #  ", "#  #   ", "###    ", "#  #   ", "#   #  ", "#    # "],
  L: ["#      ", "#      ", "#      ", "#      ", "#      ", "#      ", "#######"],
  M: ["#     #", "##   ##", "# # # #", "#  #  #", "#     #", "#     #", "#     #"],
  N: ["#     #", "##    #", "# #   #", "#  #  #", "#   # #", "#    ##", "#     #"],
  O: [" ##### ", "#     #", "#     #", "#     #", "#     #", "#     #", " ##### "],
  P: ["###### ", "#     #", "#     #", "###### ", "#      ", "#      ", "#      "],
  Q: [" ##### ", "#     #", "#     #", "#     #", "#   # #", "#    # ", " #### #"],
  R: ["###### ", "#     #", "#     #", "###### ", "#   #  ", "#    # ", "#     #"],
  S: [" ######", "#      ", "#      ", " ##### ", "      #", "      #", "###### "],
  T: ["#######", "   #   ", "   #   ", "   #   ", "   #   ", "   #   ", "   #   "],
  U: ["#     #", "#     #", "#     #", "#     #", "#     #", "#     #", " ##### "],
  V: ["#     #", "#     #", "#     #", "#     #", " #   # ", "  # #  ", "   #   "],
  W: ["#     #", "#     #", "#     #", "#  #  #", "# # # #", "##   ##", "#     #"],
  X: ["#     #", " #   # ", "  # #  ", "   #   ", "  # #  ", " #   # ", "#     #"],
  Y: ["#     #", " #   # ", "  # #  ", "   #   ", "   #   ", "   #   ", "   #   "],
  Z: ["#######", "     # ", "    #  ", "   #   ", "  #    ", " #     ", "#######"],
  "0": [" ##### ", "#     #", "#    ##", "# #  ##", "##    #", "#     #", " ##### "],
  "1": ["  ##   ", " # #   ", "   #   ", "   #   ", "   #   ", "   #   ", "#######"],
  "2": [" ##### ", "#     #", "      #", "  #### ", " #     ", "#      ", "#######"],
  "3": ["###### ", "      #", "      #", " ##### ", "      #", "      #", "###### "],
  "4": ["#     #", "#     #", "#     #", "#######", "      #", "      #", "      #"],
  "5": ["#######", "#      ", "#      ", "###### ", "      #", "      #", "###### "],
  "6": [" ##### ", "#      ", "#      ", "###### ", "#     #", "#     #", " ##### "],
  "7": ["#######", "      #", "     # ", "    #  ", "   #   ", "  #    ", " #     "],
  "8": [" ##### ", "#     #", "#     #", " ##### ", "#     #", "#     #", " ##### "],
  "9": [" ##### ", "#     #", "#     #", " ######", "      #", "      #", " ##### "],
  " ": ["       ", "       ", "       ", "       ", "       ", "       ", "       "],
  "!": ["   #   ", "   #   ", "   #   ", "   #   ", "   #   ", "       ", "   #   "],
  "?": [" ##### ", "#     #", "      #", "    ## ", "   #   ", "       ", "   #   "],
  ".": ["       ", "       ", "       ", "       ", "       ", "       ", "   #   "],
  ",": ["       ", "       ", "       ", "       ", "       ", "   ##  ", "  #    "],
  "-": ["       ", "       ", "       ", "#######", "       ", "       ", "       "],
  "+": ["       ", "   #   ", "   #   ", "#######", "   #   ", "   #   ", "       "],
  ":": ["       ", "   #   ", "       ", "       ", "       ", "   #   ", "       "],
};

// ---------------------------------------------------------------------------
// SMALL font – 5 rows × 4 cols, compact style
// ---------------------------------------------------------------------------
const SMALL: CharMap = {
  A: [" ## ", "#  #", "####", "#  #", "#  #"],
  B: ["### ", "#  #", "### ", "#  #", "### "],
  C: [" ###", "#   ", "#   ", "#   ", " ###"],
  D: ["## ", "# #", "# #", "# #", "## "],
  E: ["####", "#   ", "### ", "#   ", "####"],
  F: ["####", "#   ", "### ", "#   ", "#   "],
  G: [" ###", "#   ", "# ##", "#  #", " ###"],
  H: ["#  #", "#  #", "####", "#  #", "#  #"],
  I: ["###", " # ", " # ", " # ", "###"],
  J: ["####", "  # ", "  # ", "#  #", " ## "],
  K: ["#  #", "# # ", "##  ", "# # ", "#  #"],
  L: ["#   ", "#   ", "#   ", "#   ", "####"],
  M: ["#  #", "####", "# ##", "#  #", "#  #"],
  N: ["#  #", "## #", "# ##", "#  #", "#  #"],
  O: [" ## ", "#  #", "#  #", "#  #", " ## "],
  P: ["### ", "#  #", "### ", "#   ", "#   "],
  Q: [" ## ", "#  #", "# ##", "#  #", " ###"],
  R: ["### ", "#  #", "### ", "# # ", "#  #"],
  S: [" ###", "#   ", " ## ", "   #", "### "],
  T: ["####", " ## ", " ## ", " ## ", " ## "],
  U: ["#  #", "#  #", "#  #", "#  #", " ## "],
  V: ["#  #", "#  #", "#  #", " ## ", " ## "],
  W: ["#  #", "#  #", "####", "####", "#  #"],
  X: ["#  #", " ## ", "  # ", " ## ", "#  #"],
  Y: ["#  #", " ## ", "  # ", "  # ", "  # "],
  Z: ["####", "  # ", " ## ", "#   ", "####"],
  "0": [" ## ", "#  #", "#  #", "#  #", " ## "],
  "1": [" # ", "## ", " # ", " # ", "###"],
  "2": ["### ", "   #", " ## ", "#   ", "####"],
  "3": ["### ", "   #", " ## ", "   #", "### "],
  "4": ["#  #", "#  #", "####", "   #", "   #"],
  "5": ["####", "#   ", "### ", "   #", "### "],
  "6": [" ###", "#   ", "### ", "#  #", " ## "],
  "7": ["####", "   #", "  # ", " #  ", "#   "],
  "8": [" ## ", "#  #", " ## ", "#  #", " ## "],
  "9": [" ## ", "#  #", " ###", "   #", " ## "],
  " ": ["    ", "    ", "    ", "    ", "    "],
  "!": ["#", "#", "#", " ", "#"],
  "?": ["## ", "  #", " ##", "   ", " # "],
  ".": [" ", " ", " ", " ", "#"],
  ",": [" ", " ", " ", " #", "# "],
  "-": ["   ", "   ", "###", "   ", "   "],
  "+": ["   ", " # ", "###", " # ", "   "],
  ":": [" ", "#", " ", "#", " "],
};

// ---------------------------------------------------------------------------
// SHADOW font – 6 rows × 6 cols, block letters with shadow using ░▒▓█
// ---------------------------------------------------------------------------
const SHADOW: CharMap = {
  A: ["  ██  ", " █░█  ", "██████", "█░  █░", "█░  █░", "      "],
  B: ["█████ ", "█░  █░", "█████ ", "█░  █░", "█████ ", "      "],
  C: [" ████ ", "█░    ", "█░    ", "█░    ", " ████ ", "      "],
  D: ["████  ", "█░  █░", "█░  █░", "█░  █░", "████  ", "      "],
  E: ["██████", "█░    ", "████  ", "█░    ", "██████", "      "],
  F: ["██████", "█░    ", "████  ", "█░    ", "█░    ", "      "],
  G: [" ████ ", "█░    ", "█░ ███", "█░  █░", " ████ ", "      "],
  H: ["█░  █░", "█░  █░", "██████", "█░  █░", "█░  █░", "      "],
  I: ["██████", "  █░  ", "  █░  ", "  █░  ", "██████", "      "],
  J: ["██████", "   █░ ", "   █░ ", "█░ █░ ", " ███  ", "      "],
  K: ["█░  █░", "█░ █░ ", "████  ", "█░ █░ ", "█░  █░", "      "],
  L: ["█░    ", "█░    ", "█░    ", "█░    ", "██████", "      "],
  M: ["█░   █░", "██░ ░██", "█░█░█░█", "█░   █░", "█░   █░", "       "],
  N: ["█░  █░", "██░ █░", "█░█░█░", "█░ ░██", "█░  █░", "      "],
  O: [" ████ ", "█░  █░", "█░  █░", "█░  █░", " ████ ", "      "],
  P: ["█████ ", "█░  █░", "█████ ", "█░    ", "█░    ", "      "],
  Q: [" ████ ", "█░  █░", "█░  █░", "█░ ░█░", " ████░", "      "],
  R: ["█████ ", "█░  █░", "█████ ", "█░ █░ ", "█░  █░", "      "],
  S: [" ████ ", "█░    ", " ███  ", "    █░", " ████ ", "      "],
  T: ["██████", "  █░  ", "  █░  ", "  █░  ", "  █░  ", "      "],
  U: ["█░  █░", "█░  █░", "█░  █░", "█░  █░", " ████ ", "      "],
  V: ["█░  █░", "█░  █░", "█░  █░", " █░█░ ", "  █░  ", "      "],
  W: ["█░  █░", "█░  █░", "█░█░█░", "███░███", "█░  █░", "      "],
  X: ["█░  █░", " █░█░ ", "  █░  ", " █░█░ ", "█░  █░", "      "],
  Y: ["█░  █░", " █░█░ ", "  █░  ", "  █░  ", "  █░  ", "      "],
  Z: ["██████", "   █░ ", "  █░  ", " █░   ", "██████", "      "],
  "0": [" ████ ", "█░  ██", "█░█░█░", "██  █░", " ████ ", "      "],
  "1": ["  █░  ", " ██░  ", "  █░  ", "  █░  ", "██████", "      "],
  "2": [" ████ ", "█░  █░", "  ███ ", " █░   ", "██████", "      "],
  "3": ["█████ ", "    █░", " ████ ", "    █░", "█████ ", "      "],
  "4": ["█░  █░", "█░  █░", "██████", "    █░", "    █░", "      "],
  "5": ["██████", "█░    ", "█████ ", "    █░", "█████ ", "      "],
  "6": [" ████ ", "█░    ", "█████ ", "█░  █░", " ████ ", "      "],
  "7": ["██████", "    █░", "   █░ ", "  █░  ", " █░   ", "      "],
  "8": [" ████ ", "█░  █░", " ████ ", "█░  █░", " ████ ", "      "],
  "9": [" ████ ", "█░  █░", " █████", "    █░", " ████ ", "      "],
  " ": ["      ", "      ", "      ", "      ", "      ", "      "],
  "!": ["  █░  ", "  █░  ", "  █░  ", "      ", "  █░  ", "      "],
  "?": [" ████ ", "█░  █░", "   █░ ", "      ", "  █░  ", "      "],
  ".": ["      ", "      ", "      ", "      ", " ░█░  ", "      "],
  ",": ["      ", "      ", "      ", " ░█░  ", " █░   ", "      "],
  "-": ["      ", "      ", "██████", "      ", "      ", "      "],
  "+": ["      ", "  █░  ", "██████", "  █░  ", "      ", "      "],
  ":": ["      ", " ░█░  ", "      ", " ░█░  ", "      ", "      "],
};

// ---------------------------------------------------------------------------
// SLANT font – 6 rows × 6 cols, uses / \ | _ characters
// ---------------------------------------------------------------------------
const SLANT: CharMap = {
  A: ["  /\\  ", " /  \\ ", "/____\\", "/    \\", "/    \\"],
  B: ["|\\    ", "| \\   ", "|__|  ", "| /   ", "|/    "],
  C: [" /----", "/     ", "|     ", "\\     ", " \\----"],
  D: ["|\\    ", "| \\   ", "|  |  ", "| /   ", "|/    "],
  E: ["/-----", "/     ", "/---  ", "/     ", "/-----"],
  F: ["/-----", "/     ", "/---  ", "/     ", "/     "],
  G: [" /----", "/     ", "/ /---", "\\ \\  |", " \\---/"],
  H: ["|   | ", "|   | ", "|---| ", "|   | ", "|   | "],
  I: ["------", "  /   ", "  |   ", "  \\   ", "------"],
  J: ["------", "   /  ", "   |  ", "/  |  ", "\\___/ "],
  K: ["|  /  ", "| /   ", "|<    ", "| \\   ", "|  \\  "],
  L: ["|     ", "|     ", "|     ", "|     ", "|-----"],
  M: ["|\\  /|", "| \\/ |", "|    |", "|    |", "|    |"],
  N: ["|\\   |", "| \\  |", "|  \\ |", "|   \\|", "|    |"],
  O: [" /---\\", "/     \\", "|     |", "\\     /", " \\---/ "],
  P: ["|----\\", "|    /", "|---/ ", "|     ", "|     "],
  Q: [" /---\\", "/     \\", "|  /  |", "\\   \\ /", " \\---\\/"],
  R: ["|----\\", "|    /", "|---\\ ", "|    \\", "|     \\"],
  S: [" /----", "/     ", " \\--- ", "     \\", "\\----/"],
  T: ["------", "  /   ", "  |   ", "  |   ", "  |   "],
  U: ["|    |", "|    |", "|    |", "|    |", " \\__/ "],
  V: ["|    |", "|    |", " \\  / ", "  \\/  ", "   /  "],
  W: ["|    |", "|    |", "| /\\ |", "|/  \\|", "/    \\"],
  X: ["\\   /", " \\ / ", "  X  ", " / \\ ", "/   \\"],
  Y: ["|   |", " \\ / ", "  |  ", "  |  ", "  |  "],
  Z: ["-----/", "    / ", "   /  ", "  /   ", " /-----"],
  "0": [" /--\\ ", "/    \\", "| /  |", "|  \\ |", " \\--/ "],
  "1": [" /|  ", "/ |  ", "  |  ", "  |  ", "  |  "],
  "2": [" /--\\", "/    ", " /-- ", "/    ", "/-----"],
  "3": ["/----", "    /", " ---/", "    \\", "/----\\"],
  "4": ["/   /", "/   /", "/---/", "    /", "    /"],
  "5": ["/----", "/    ", "\\--- ", "    \\", "\\---/"],
  "6": [" /---", "/    ", "/----", "/   /", "\\---/"],
  "7": ["/----", "    /", "   / ", "  /  ", " /   "],
  "8": [" /--\\", "/    \\", " \\--/ ", "\\    /", " \\--/ "],
  "9": [" /--\\", "/    \\", " \\---/", "     /", " \\---/"],
  " ": ["      ", "      ", "      ", "      ", "      "],
  "!": ["  /   ", "  |   ", "  |   ", "      ", "  .   "],
  "?": [" /--\\ ", "/    \\", "  --/ ", "      ", "  .   "],
  ".": ["      ", "      ", "      ", "      ", "  .   "],
  ",": ["      ", "      ", "      ", "  .   ", " /    "],
  "-": ["      ", "      ", "/-----", "      ", "      "],
  "+": ["      ", "  /   ", "/---/ ", "  /   ", "      "],
  ":": ["      ", "  .   ", "      ", "  .   ", "      "],
};

// ---------------------------------------------------------------------------
// Font registry
// ---------------------------------------------------------------------------
type FontName = "Block" | "Banner" | "Small" | "Shadow" | "Slant";

const FONTS: Record<FontName, CharMap> = {
  Block: BLOCK,
  Banner: BANNER,
  Small: SMALL,
  Shadow: SHADOW,
  Slant: SLANT,
};

const FONT_NAMES: FontName[] = ["Block", "Banner", "Small", "Shadow", "Slant"];

// ---------------------------------------------------------------------------
// Core rendering function
// ---------------------------------------------------------------------------
function renderAsciiArt(text: string, fontMap: CharMap): string {
  if (!text) return "";

  // Determine row count from first available char
  const sampleChar = fontMap["A"] || fontMap[" "];
  if (!sampleChar) return "";
  const rowCount = sampleChar.length;

  // Process line by line (support multi-line input)
  const lines = text.toUpperCase().split("\n");

  return lines
    .map((line) => {
      // Build rows for this line
      const rows: string[] = Array.from({ length: rowCount }, () => "");

      for (const ch of line) {
        const charData = fontMap[ch] || fontMap[" "];
        if (!charData) continue;
        for (let r = 0; r < rowCount; r++) {
          rows[r] += (charData[r] ?? " ".repeat((charData[0] ?? "").length)) + " ";
        }
      }

      return rows.join("\n");
    })
    .join("\n\n");
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function TextToAsciiArt() {
  const [inputText, setInputText] = useState("HELLO");
  const [selectedFont, setSelectedFont] = useState<FontName>("Block");

  const asciiOutput = useMemo(() => {
    if (!inputText.trim()) return "";
    return renderAsciiArt(inputText, FONTS[selectedFont]);
  }, [inputText, selectedFont]);

  return (
    <ToolLayout
      title="Text to ASCII Art Generator"
      description="Convert any text into ASCII art online – choose from Block, Banner, Small, Shadow, or Slant fonts. Free, instant, client-side."
      relatedTools={["text-case-converter", "unicode-lookup", "text-repeater"]}
    >
      {/* Input */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Input Text
        </label>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type text here…"
          className="h-24 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
          spellCheck={false}
        />
      </div>

      {/* Font selector */}
      <div className="mb-5">
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Font Style
        </label>
        <div className="flex flex-wrap gap-2">
          {FONT_NAMES.map((font) => (
            <button
              key={font}
              onClick={() => setSelectedFont(font)}
              className={`rounded-lg border px-4 py-1.5 text-sm font-medium transition-colors ${
                selectedFont === font
                  ? "border-blue-500 dark:border-blue-400 bg-blue-500 text-white"
                  : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:bg-blue-950 dark:hover:bg-blue-950"
              }`}
            >
              {font}
            </button>
          ))}
        </div>
      </div>

      {/* Output */}
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">ASCII Art Output</label>
        {asciiOutput && <CopyButton text={asciiOutput} />}
      </div>
      <div className="relative">
        <pre
          className="min-h-[8rem] w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-950 p-4 font-mono text-sm leading-tight text-green-400"
          aria-label="ASCII art output"
        >
          {asciiOutput || (
            <span className="text-gray-500 dark:text-gray-400">
              Your ASCII art will appear here…
            </span>
          )}
        </pre>
      </div>

      {/* SEO content */}
      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
          What is ASCII Art?
        </h2>
        <p className="mb-4">
          ASCII art is a graphic design technique that uses printable characters from the
          ASCII standard to create pictures and text effects. It originated in the era of
          typewriters and early terminals where graphical rendering was impossible.
          Today ASCII art is widely used in emails, chat, READMEs, terminal banners, and
          code comments to add visual flair without relying on images.
        </p>

        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
          Available Font Styles
        </h2>
        <ul className="mb-4 list-disc pl-5 space-y-1">
          <li>
            <strong>Block</strong> – Classic 5-row block letters built from{" "}
            <code>#</code> characters. Clean and easy to read.
          </li>
          <li>
            <strong>Banner</strong> – Tall 7-row banner-style letters, great for
            headlines and announcements.
          </li>
          <li>
            <strong>Small</strong> – Compact 5-row letters for tight spaces or
            inline use.
          </li>
          <li>
            <strong>Shadow</strong> – Block letters rendered with Unicode block
            characters (░▒▓█) to create a 3-D shadow effect.
          </li>
          <li>
            <strong>Slant</strong> – Forward-leaning letters using <code>/</code>,{" "}
            <code>\</code>, and <code>|</code> to mimic italics.
          </li>
        </ul>

        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
          Common Uses for ASCII Art
        </h2>
        <p className="mb-4">
          ASCII art text generators are popular among developers for creating eye-catching
          terminal banners, README headers on GitHub, logging prefixes, Discord or Slack
          messages, email signatures, and fun social media posts. Text-based art also
          serves as a lightweight alternative to images in plain-text environments.
        </p>

        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
          How to Use This Tool
        </h2>
        <p>
          Type or paste your text in the input box above – the ASCII art preview updates
          in real time. Select a font style using the buttons, then click{" "}
          <strong>Copy</strong> to copy the result to your clipboard. The tool works
          entirely in your browser; no data is sent to any server.
        </p>
      </div>
    
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The Text to ASCII Art is a free online tool available on CodeUtilo. Convert text to ASCII art with multiple font styles. Copy and share text banners. All processing happens directly in your browser — no data is ever sent to any server, ensuring your privacy and security. No signup or installation is required.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> — All text to ascii art operations run locally in your browser using JavaScript. Your data never leaves your device.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Instant Results</strong> — Get results immediately as you type or paste your input. No waiting for server responses or page reloads.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> — Use the text to ascii art as many times as you need without creating an account or paying anything.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Mobile Friendly</strong> — Works on desktop, tablet, and mobile browsers. Access this tool from any device with an internet connection.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Using the text to ascii art for day-to-day development tasks</li>
          <li>Saving time on repetitive tasks by using a browser-based tool instead of writing custom code</li>
          <li>Working on projects where installing software is not an option (school, work, shared computers)</li>
          <li>Quick prototyping and debugging without switching to a terminal or IDE</li>
          <li>Sharing the tool link with colleagues who need the same functionality</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Enter your input in the text area provided and the text to ascii art will process it instantly. Use the Copy button to copy the result to your clipboard. All operations are performed locally in your browser — no data is transmitted to any server.
        </p>
      </div>
    </ToolLayout>
  );
}
