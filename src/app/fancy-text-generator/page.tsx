"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";

type StyleName = "bold" | "italic" | "boldItalic" | "script" | "boldScript" | "fraktur" | "boldFraktur" | "doubleStruck" | "monospace" | "circled" | "squared" | "squaredNeg" | "fullwidth" | "bubble" | "smallCaps" | "upsideDown" | "strikethrough" | "underline";

const charMaps: Record<StyleName, { label: string; transform: (s: string) => string }> = {
    bold: {
        label: "𝐁𝐨𝐥𝐝",
        transform: (s) => [...s].map((c) => {
            const code = c.charCodeAt(0);
            if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D400 + code - 65);
            if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D41A + code - 97);
            if (code >= 48 && code <= 57) return String.fromCodePoint(0x1D7CE + code - 48);
            return c;
        }).join(""),
    },
    italic: {
        label: "𝐼𝑡𝑎𝑙𝑖𝑐",
        transform: (s) => [...s].map((c) => {
            const code = c.charCodeAt(0);
            if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D434 + code - 65);
            if (code >= 97 && code <= 122) return String.fromCodePoint(code === 104 ? 0x210E : 0x1D44E + code - 97);
            return c;
        }).join(""),
    },
    boldItalic: {
        label: "𝑩𝒐𝒍𝒅 𝑰𝒕𝒂𝒍𝒊𝒄",
        transform: (s) => [...s].map((c) => {
            const code = c.charCodeAt(0);
            if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D468 + code - 65);
            if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D482 + code - 97);
            return c;
        }).join(""),
    },
    script: {
        label: "𝒮𝒸𝓇𝒾𝓅𝓉",
        transform: (s) => [...s].map((c) => {
            const code = c.charCodeAt(0);
            if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D49C + code - 65);
            if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D4B6 + code - 97);
            return c;
        }).join(""),
    },
    boldScript: {
        label: "𝓑𝓸𝓵𝓭 𝓢𝓬𝓻𝓲𝓹𝓽",
        transform: (s) => [...s].map((c) => {
            const code = c.charCodeAt(0);
            if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D4D0 + code - 65);
            if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D4EA + code - 97);
            return c;
        }).join(""),
    },
    fraktur: {
        label: "𝔉𝔯𝔞𝔨𝔱𝔲𝔯",
        transform: (s) => [...s].map((c) => {
            const code = c.charCodeAt(0);
            if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D504 + code - 65);
            if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D51E + code - 97);
            return c;
        }).join(""),
    },
    boldFraktur: {
        label: "𝕭𝖔𝖑𝖉 𝕱𝖗𝖆𝖐𝖙𝖚𝖗",
        transform: (s) => [...s].map((c) => {
            const code = c.charCodeAt(0);
            if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D56C + code - 65);
            if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D586 + code - 97);
            return c;
        }).join(""),
    },
    doubleStruck: {
        label: "𝔻𝕠𝕦𝕓𝕝𝕖 𝕊𝕥𝕣𝕦𝕔𝕜",
        transform: (s) => [...s].map((c) => {
            const code = c.charCodeAt(0);
            if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D538 + code - 65);
            if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D552 + code - 97);
            if (code >= 48 && code <= 57) return String.fromCodePoint(0x1D7D8 + code - 48);
            return c;
        }).join(""),
    },
    monospace: {
        label: "𝙼𝚘𝚗𝚘𝚜𝚙𝚊𝚌𝚎",
        transform: (s) => [...s].map((c) => {
            const code = c.charCodeAt(0);
            if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D670 + code - 65);
            if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D68A + code - 97);
            if (code >= 48 && code <= 57) return String.fromCodePoint(0x1D7F6 + code - 48);
            return c;
        }).join(""),
    },
    circled: {
        label: "Ⓒⓘⓡⓒⓛⓔⓓ",
        transform: (s) => [...s].map((c) => {
            const code = c.charCodeAt(0);
            if (code >= 65 && code <= 90) return String.fromCodePoint(0x24B6 + code - 65);
            if (code >= 97 && code <= 122) return String.fromCodePoint(0x24D0 + code - 97);
            if (code >= 49 && code <= 57) return String.fromCodePoint(0x2460 + code - 49);
            if (code === 48) return String.fromCodePoint(0x24EA);
            return c;
        }).join(""),
    },
    squared: {
        label: "🅂🅀🅄🄰🅁🄴🄳",
        transform: (s) => [...s].map((c) => {
            const code = c.charCodeAt(0);
            if (code >= 65 && code <= 90) return String.fromCodePoint(0x1F130 + code - 65);
            if (code >= 97 && code <= 122) return String.fromCodePoint(0x1F130 + code - 97);
            return c;
        }).join(""),
    },
    squaredNeg: {
        label: "🆂🆀🆄🅰🆁🅴🅳",
        transform: (s) => [...s].map((c) => {
            const code = c.charCodeAt(0);
            if (code >= 65 && code <= 90) return String.fromCodePoint(0x1F170 + code - 65);
            if (code >= 97 && code <= 122) return String.fromCodePoint(0x1F170 + code - 97);
            return c;
        }).join(""),
    },
    fullwidth: {
        label: "Ｆｕｌｌｗｉｄｔｈ",
        transform: (s) => [...s].map((c) => {
            const code = c.charCodeAt(0);
            if (code >= 33 && code <= 126) return String.fromCodePoint(0xFF01 + code - 33);
            return c;
        }).join(""),
    },
    bubble: {
        label: "ⓑⓤⓑⓑⓛⓔ",
        transform: (s) => [...s].map((c) => {
            const code = c.charCodeAt(0);
            if (code >= 65 && code <= 90) return String.fromCodePoint(0x24B6 + code - 65);
            if (code >= 97 && code <= 122) return String.fromCodePoint(0x24D0 + code - 97);
            return c;
        }).join(""),
    },
    smallCaps: {
        label: "Sᴍᴀʟʟ Cᴀᴘs",
        transform: (s) => {
            const map: Record<string, string> = { a: "ᴀ", b: "ʙ", c: "ᴄ", d: "ᴅ", e: "ᴇ", f: "ꜰ", g: "ɢ", h: "ʜ", i: "ɪ", j: "ᴊ", k: "ᴋ", l: "ʟ", m: "ᴍ", n: "ɴ", o: "ᴏ", p: "ᴘ", q: "ǫ", r: "ʀ", s: "ꜱ", t: "ᴛ", u: "ᴜ", v: "ᴠ", w: "ᴡ", x: "x", y: "ʏ", z: "ᴢ" };
            return [...s].map((c) => map[c] || c).join("");
        },
    },
    upsideDown: {
        label: "uʍoᗡ ǝpᴉsd∩",
        transform: (s) => {
            const map: Record<string, string> = { a: "ɐ", b: "q", c: "ɔ", d: "p", e: "ǝ", f: "ɟ", g: "ƃ", h: "ɥ", i: "ᴉ", j: "ɾ", k: "ʞ", l: "l", m: "ɯ", n: "u", o: "o", p: "d", q: "b", r: "ɹ", s: "s", t: "ʇ", u: "n", v: "ʌ", w: "ʍ", x: "x", y: "ʎ", z: "z", A: "∀", B: "q", C: "Ɔ", D: "ᗡ", E: "Ǝ", F: "Ⅎ", G: "⅁", H: "H", I: "I", J: "ſ", K: "ʞ", L: "˥", M: "W", N: "N", O: "O", P: "Ԁ", Q: "Ọ", R: "ɹ", S: "S", T: "⊥", U: "∩", V: "Λ", W: "M", X: "X", Y: "⅄", Z: "Z", "1": "Ɩ", "2": "ᄅ", "3": "Ɛ", "4": "ㄣ", "5": "ϛ", "6": "9", "7": "ㄥ", "8": "8", "9": "6", "0": "0", ".": "˙", ",": "'", "'": ",", "!": "¡", "?": "¿", "(": ")", ")": "(", "[": "]", "]": "[", "{": "}", "}": "{", "<": ">", ">": "<", "&": "⅋", "_": "‾" };
            return [...s].map((c) => map[c] || c).reverse().join("");
        },
    },
    strikethrough: {
        label: "S̶t̶r̶i̶k̶e̶t̶h̶r̶o̶u̶g̶h̶",
        transform: (s) => [...s].map((c) => c + "\u0336").join(""),
    },
    underline: {
        label: "U̲n̲d̲e̲r̲l̲i̲n̲e̲",
        transform: (s) => [...s].map((c) => c + "\u0332").join(""),
    },
};

export default function FancyTextGenerator() {
    const [input, setInput] = useState("Hello World");
    const [copiedStyle, setCopiedStyle] = useState<string | null>(null);

    const results = useMemo(() => {
        return Object.entries(charMaps).map(([key, { label, transform }]) => ({
            key,
            label,
            text: transform(input),
        }));
    }, [input]);

    const handleCopy = (text: string, key: string) => {
        navigator.clipboard.writeText(text);
        setCopiedStyle(key);
        setTimeout(() => setCopiedStyle(null), 1500);
    };

    return (
        <ToolLayout
            title="Fancy Text Generator"
            description="Generate fancy Unicode text styles for social media, Instagram, Twitter, Discord, and more. Copy and paste cool fonts instantly."
            relatedTools={["word-counter", "text-to-speech", "lorem-ipsum-generator"]}
        >
            <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Enter your text</label>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type something..."
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-3 text-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
            </div>

            <div className="space-y-2">
                {results.map((r) => (
                    <div key={r.key} className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3">
                        <span className="shrink-0 w-28 text-xs font-medium text-gray-500 dark:text-gray-400">{r.label}</span>
                        <span className="flex-1 min-w-0 truncate text-sm text-gray-800 dark:text-gray-200">{r.text}</span>
                        <button
                            onClick={() => handleCopy(r.text, r.key)}
                            className={`shrink-0 rounded-md px-3 py-1 text-xs font-medium transition-colors ${copiedStyle === r.key ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300"}`}
                        >
                            {copiedStyle === r.key ? "Copied!" : "Copy"}
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
                <p>Generate 18+ fancy text styles using Unicode characters. These work everywhere — Instagram bios, Twitter/X posts, Discord messages, Facebook, WhatsApp, and any platform that supports Unicode. No fonts installed — just copy and paste.</p>
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    <details className="group"><summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">How does this work?</summary><p className="mt-2 pl-4">It uses Unicode Mathematical Alphanumeric Symbols and other Unicode blocks to create styled text that looks like different fonts but is actually just special characters.</p></details>
                    <details className="group"><summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Will these work on all platforms?</summary><p className="mt-2 pl-4">Yes, on any platform that supports Unicode — which includes virtually all modern apps, websites, and social media platforms.</p></details>
                    <details className="group"><summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Do special characters affect SEO?</summary><p className="mt-2 pl-4">Unicode text is harder for search engines to index, so avoid using it for content you want to be searchable. It is best for decorative purposes like social media bios and display names.</p></details>
                </div>
            </div>
        </ToolLayout>
    );
}
