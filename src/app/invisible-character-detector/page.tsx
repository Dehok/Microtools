"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";

const INVISIBLE_CHARS: Record<number, string> = {
    0x200B: "Zero Width Space",
    0x200C: "Zero Width Non-Joiner",
    0x200D: "Zero Width Joiner",
    0x200E: "Left-to-Right Mark",
    0x200F: "Right-to-Left Mark",
    0xFEFF: "BOM / Zero Width No-Break Space",
    0x00AD: "Soft Hyphen",
    0x2060: "Word Joiner",
    0x2061: "Function Application",
    0x2062: "Invisible Times",
    0x2063: "Invisible Separator",
    0x2064: "Invisible Plus",
    0x180E: "Mongolian Vowel Separator",
    0x00A0: "Non-Breaking Space",
    0x2000: "En Quad",
    0x2001: "Em Quad",
    0x2002: "En Space",
    0x2003: "Em Space",
    0x2004: "Three-Per-Em Space",
    0x2005: "Four-Per-Em Space",
    0x2006: "Six-Per-Em Space",
    0x2007: "Figure Space",
    0x2008: "Punctuation Space",
    0x2009: "Thin Space",
    0x200A: "Hair Space",
    0x202F: "Narrow No-Break Space",
    0x205F: "Medium Mathematical Space",
    0x3000: "Ideographic Space",
    0x0009: "Tab",
    0x000A: "Line Feed",
    0x000D: "Carriage Return",
};

interface FoundChar {
    char: string;
    name: string;
    codePoint: string;
    positions: number[];
}

export default function InvisibleCharacterDetector() {
    const [input, setInput] = useState("");
    const [cleaned, setCleaned] = useState("");
    const [showCleaned, setShowCleaned] = useState(false);

    const results = useMemo(() => {
        const found: Map<number, number[]> = new Map();
        for (let i = 0; i < input.length; i++) {
            const code = input.codePointAt(i)!;
            if (INVISIBLE_CHARS[code]) {
                if (!found.has(code)) found.set(code, []);
                found.get(code)!.push(i);
            }
        }
        const chars: FoundChar[] = [];
        found.forEach((positions, code) => {
            chars.push({
                char: String.fromCodePoint(code),
                name: INVISIBLE_CHARS[code],
                codePoint: `U+${code.toString(16).toUpperCase().padStart(4, "0")}`,
                positions,
            });
        });
        return chars;
    }, [input]);

    const totalInvisible = results.reduce((s, r) => s + r.positions.length, 0);

    const handleClean = () => {
        const codes = new Set(Object.keys(INVISIBLE_CHARS).map(Number));
        let clean = "";
        for (let i = 0; i < input.length; i++) {
            const code = input.codePointAt(i)!;
            if (!codes.has(code)) clean += input[i];
        }
        setCleaned(clean);
        setShowCleaned(true);
    };

    const handleCopyClean = () => {
        navigator.clipboard.writeText(cleaned);
    };

    return (
        <ToolLayout
            title="Invisible Character Detector"
            description="Find and remove hidden, invisible, and zero-width characters from text. Detect BOM, ZWSP, soft hyphens, and more."
            relatedTools={["word-counter", "text-diff-checker", "unicode-lookup"]}
        >
            <textarea
                value={input}
                onChange={(e) => { setInput(e.target.value); setShowCleaned(false); }}
                rows={6}
                placeholder="Paste text here to detect invisible characters..."
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />

            <div className="mt-3 flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {input.length} characters · <span className={totalInvisible > 0 ? "text-red-600 dark:text-red-400 font-medium" : "text-green-600 dark:text-green-400"}>{totalInvisible} invisible</span>
                </span>
                {totalInvisible > 0 && (
                    <button onClick={handleClean} className="rounded-md bg-blue-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-blue-700">Remove All Invisible</button>
                )}
            </div>

            {results.length > 0 && (
                <div className="mt-4 space-y-2">
                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Detected Characters</h3>
                    {results.map((r) => (
                        <div key={r.codePoint} className="flex items-center gap-3 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 px-4 py-2">
                            <code className="rounded bg-red-200 dark:bg-red-800 px-2 py-0.5 text-xs font-mono text-red-800 dark:text-red-200">{r.codePoint}</code>
                            <span className="flex-1 text-sm font-medium text-gray-800 dark:text-gray-200">{r.name}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{r.positions.length} found at pos: {r.positions.slice(0, 5).join(", ")}{r.positions.length > 5 ? "..." : ""}</span>
                        </div>
                    ))}
                </div>
            )}

            {input.length > 0 && results.length === 0 && (
                <div className="mt-4 rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950 px-4 py-3 text-sm text-green-700 dark:text-green-300">
                    ✓ No invisible characters found in your text.
                </div>
            )}

            {showCleaned && (
                <div className="mt-4">
                    <div className="mb-2 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Cleaned Text</h3>
                        <button onClick={handleCopyClean} className="rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700">Copy</button>
                    </div>
                    <textarea value={cleaned} readOnly rows={4} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-4 py-3 text-sm font-mono text-gray-700 dark:text-gray-300" />
                </div>
            )}

            <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
                <p>Detect and remove invisible, hidden, and zero-width characters from text. These characters are often copied from websites, PDFs, or word processors and can cause bugs in code, break formatting, or affect text comparison. Detects 30+ types including Zero Width Space, BOM, soft hyphens, and various Unicode spaces.</p>
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    <details className="group"><summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">What are invisible characters?</summary><p className="mt-2 pl-4">Invisible characters are Unicode code points that have no visible glyph but can affect text behavior. Common examples include Zero Width Space (U+200B), BOM (U+FEFF), and Soft Hyphen (U+00AD).</p></details>
                    <details className="group"><summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Why should I remove them?</summary><p className="mt-2 pl-4">Invisible characters can cause bugs in code, break string comparisons, affect database searches, and create formatting issues. They are particularly problematic when copying text from web pages or documents.</p></details>
                </div>
            </div>
        </ToolLayout>
    );
}
