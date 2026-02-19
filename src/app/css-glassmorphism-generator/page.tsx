"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function GlassmorphismGenerator() {
    const [blur, setBlur] = useState(10);
    const [opacity, setOpacity] = useState(25);
    const [borderOpacity, setBorderOpacity] = useState(18);
    const [bgColor, setBgColor] = useState("#ffffff");
    const [borderRadius, setBorderRadius] = useState(16);
    const [copied, setCopied] = useState(false);

    const hexToRgb = (hex: string) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return { r, g, b };
    };

    const css = useMemo(() => {
        const { r, g, b } = hexToRgb(bgColor);
        return `background: rgba(${r}, ${g}, ${b}, ${(opacity / 100).toFixed(2)});
backdrop-filter: blur(${blur}px);
-webkit-backdrop-filter: blur(${blur}px);
border-radius: ${borderRadius}px;
border: 1px solid rgba(${r}, ${g}, ${b}, ${(borderOpacity / 100).toFixed(2)});`;
    }, [blur, opacity, borderOpacity, bgColor, borderRadius]);

    const handleCopy = () => {
        navigator.clipboard.writeText(css);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    const { r, g, b } = hexToRgb(bgColor);

    return (
        <ToolLayout
            title="CSS Glassmorphism Generator"
            description="Generate CSS glassmorphism effects with live preview. Customize blur, opacity, border, and colors. Copy ready-to-use CSS."
            relatedTools={["css-neumorphism-generator", "color-palette-generator", "border-radius-generator"]}
        >
            <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Blur: {blur}px</label>
                        <input type="range" min={0} max={30} value={blur} onChange={(e) => setBlur(Number(e.target.value))} className="w-full accent-blue-600" />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Background Opacity: {opacity}%</label>
                        <input type="range" min={0} max={100} value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full accent-blue-600" />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Border Opacity: {borderOpacity}%</label>
                        <input type="range" min={0} max={100} value={borderOpacity} onChange={(e) => setBorderOpacity(Number(e.target.value))} className="w-full accent-blue-600" />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Border Radius: {borderRadius}px</label>
                        <input type="range" min={0} max={50} value={borderRadius} onChange={(e) => setBorderRadius(Number(e.target.value))} className="w-full accent-blue-600" />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Color:</label>
                        <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-8 w-8 cursor-pointer rounded border-0" />
                    </div>
                </div>

                <div className="flex items-center justify-center rounded-lg p-8" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", minHeight: 300 }}>
                    <div
                        className="flex items-center justify-center p-8"
                        style={{
                            background: `rgba(${r}, ${g}, ${b}, ${opacity / 100})`,
                            backdropFilter: `blur(${blur}px)`,
                            WebkitBackdropFilter: `blur(${blur}px)`,
                            borderRadius: `${borderRadius}px`,
                            border: `1px solid rgba(${r}, ${g}, ${b}, ${borderOpacity / 100})`,
                            width: 250,
                            height: 180,
                        }}
                    >
                        <p className="text-white text-center font-medium text-sm">Glassmorphism<br />Preview</p>
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">CSS Output</h3>
                    <button onClick={handleCopy} className="rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700">{copied ? "Copied!" : "Copy CSS"}</button>
                </div>
                <pre className="rounded-lg bg-gray-900 p-4 text-sm text-green-400 font-mono overflow-x-auto">{css}</pre>
            </div>

            <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
                <p>Generate CSS glassmorphism (frosted glass) effects with a live preview. Adjust blur intensity, opacity, border, and border radius to create the perfect glass card effect. Copy the CSS and use it directly in your projects.</p>
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    <details className="group"><summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Is glassmorphism supported in all browsers?</summary><p className="mt-2 pl-4">The backdrop-filter property is supported in all modern browsers. The -webkit- prefix is included for Safari compatibility. IE11 does not support it.</p></details>
                </div>
            </div>
        </ToolLayout>
    );
}
