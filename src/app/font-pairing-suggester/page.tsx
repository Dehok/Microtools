"use client";

import { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";

const FONT_PAIRINGS = [
    { heading: "Playfair Display", body: "Source Sans 3", style: "Elegant serif + clean sans", category: "editorial" },
    { heading: "Montserrat", body: "Merriweather", style: "Modern sans + readable serif", category: "blog" },
    { heading: "Oswald", body: "Open Sans", style: "Bold condensed + neutral sans", category: "marketing" },
    { heading: "Poppins", body: "Lora", style: "Geometric sans + calligraphy serif", category: "creative" },
    { heading: "Raleway", body: "Roboto", style: "Thin elegant + versatile sans", category: "minimal" },
    { heading: "Lato", body: "Merriweather", style: "Professional sans + classic serif", category: "business" },
    { heading: "Bebas Neue", body: "Montserrat", style: "Impact headline + friendly body", category: "marketing" },
    { heading: "DM Serif Display", body: "DM Sans", style: "Matched serif/sans family", category: "editorial" },
    { heading: "Inter", body: "Crimson Text", style: "UI sans + literary serif", category: "blog" },
    { heading: "Space Grotesk", body: "IBM Plex Sans", style: "Tech grotesque + IBM elegance", category: "tech" },
    { heading: "Abril Fatface", body: "Nunito", style: "Display fatface + rounded body", category: "creative" },
    { heading: "Archivo Black", body: "Work Sans", style: "Heavy display + geometric body", category: "marketing" },
    { heading: "Cormorant Garamond", body: "Fira Sans", style: "French serif + Mozilla sans", category: "editorial" },
    { heading: "Sora", body: "Noto Serif", style: "Variable sans + universal serif", category: "tech" },
    { heading: "Outfit", body: "Literata", style: "Modern variable + ebook serif", category: "blog" },
];

const CATEGORIES = ["all", "editorial", "blog", "marketing", "creative", "minimal", "business", "tech"];

export default function FontPairingSuggester() {
    const [filter, setFilter] = useState("all");
    const [preview, setPreview] = useState("The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.");
    const [fontsLoaded, setFontsLoaded] = useState(false);

    useEffect(() => {
        const families = [...new Set(FONT_PAIRINGS.flatMap((p) => [p.heading, p.body]))];
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = `https://fonts.googleapis.com/css2?${families.map((f) => `family=${f.replace(/ /g, "+").replace("3", "3")}:wght@400;600;700`).join("&")}&display=swap`;
        document.head.appendChild(link);
        link.onload = () => setFontsLoaded(true);
    }, []);

    const filtered = filter === "all" ? FONT_PAIRINGS : FONT_PAIRINGS.filter((p) => p.category === filter);

    return (
        <ToolLayout title="Font Pairing Suggester" description="Find beautiful Google Font pairings. Live preview with 15 curated heading + body combinations." relatedTools={["fancy-text-generator", "css-glassmorphism-generator", "css-neumorphism-generator"]}>
            <div className="mb-3"><input value={preview} onChange={(e) => setPreview(e.target.value)} placeholder="Preview text..." className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-sm" /></div>
            <div className="mb-4 flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (<button key={c} onClick={() => setFilter(c)} className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize ${filter === c ? "bg-blue-600 text-white" : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}>{c}</button>))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((pair, i) => (
                    <div key={i} className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 hover:shadow-md transition-shadow" style={{ opacity: fontsLoaded ? 1 : 0.5 }}>
                        <h3 style={{ fontFamily: `'${pair.heading}', serif` }} className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2 leading-tight">{pair.heading}</h3>
                        <p style={{ fontFamily: `'${pair.body}', sans-serif` }} className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">{preview}</p>
                        <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-2">
                            <div>
                                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{pair.heading} <span className="text-gray-400">+</span> {pair.body}</p>
                                <p className="text-[10px] text-gray-500 dark:text-gray-500">{pair.style}</p>
                            </div>
                            <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-[10px] text-gray-600 dark:text-gray-400 capitalize">{pair.category}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
                <p>Find the perfect Google Font pairing for your project. Browse 15 curated heading + body font combinations across 7 categories. All fonts load live from Google Fonts for accurate previews.</p>
            </div>
        </ToolLayout>
    );
}
