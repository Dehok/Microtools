"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function CssNeumorphismGenerator() {
    const [bgColor, setBgColor] = useState("#e0e5ec");
    const [size, setSize] = useState(200);
    const [radius, setRadius] = useState(30);
    const [distance, setDistance] = useState(10);
    const [intensity, setIntensity] = useState(15);
    const [blur, setBlur] = useState(20);
    const [shape, setShape] = useState<"flat" | "concave" | "convex" | "pressed">("flat");
    const [copied, setCopied] = useState(false);

    const adjustColor = (hex: string, amount: number) => {
        const num = parseInt(hex.slice(1), 16);
        const r = Math.min(255, Math.max(0, ((num >> 16) & 0xff) + amount));
        const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
        const b = Math.min(255, Math.max(0, (num & 0xff) + amount));
        return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
    };

    const light = adjustColor(bgColor, intensity);
    const dark = adjustColor(bgColor, -intensity);

    const css = useMemo(() => {
        const shadowType = shape === "pressed" ? "inset " : "";
        let bg = `background: ${bgColor};`;
        if (shape === "concave") bg = `background: linear-gradient(145deg, ${dark}, ${light});`;
        else if (shape === "convex") bg = `background: linear-gradient(145deg, ${light}, ${dark});`;

        return `border-radius: ${radius}px;
${bg}
box-shadow: ${shadowType}${distance}px ${distance}px ${blur}px ${dark},
            ${shadowType}-${distance}px -${distance}px ${blur}px ${light};`;
    }, [bgColor, radius, distance, blur, shape, light, dark]);

    const handleCopy = () => {
        navigator.clipboard.writeText(css);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    const shadowType = shape === "pressed" ? "inset " : "";
    const bgStyle = shape === "concave"
        ? `linear-gradient(145deg, ${dark}, ${light})`
        : shape === "convex"
            ? `linear-gradient(145deg, ${light}, ${dark})`
            : bgColor;

    return (
        <ToolLayout
            title="CSS Neumorphism Generator"
            description="Generate soft UI / neumorphism CSS with live preview. Customize shadows, colors, and shape. Copy ready CSS."
            relatedTools={["css-glassmorphism-generator", "color-palette-generator", "box-shadow-generator"]}
        >
            <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Background:</label>
                        <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-8 w-8 cursor-pointer rounded border-0" />
                        <span className="text-xs text-gray-500 font-mono">{bgColor}</span>
                    </div>
                    <div><label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Size: {size}px</label><input type="range" min={50} max={300} value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full accent-blue-600" /></div>
                    <div><label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Radius: {radius}px</label><input type="range" min={0} max={150} value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="w-full accent-blue-600" /></div>
                    <div><label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Distance: {distance}px</label><input type="range" min={1} max={30} value={distance} onChange={(e) => setDistance(Number(e.target.value))} className="w-full accent-blue-600" /></div>
                    <div><label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Intensity: {intensity}</label><input type="range" min={5} max={50} value={intensity} onChange={(e) => setIntensity(Number(e.target.value))} className="w-full accent-blue-600" /></div>
                    <div><label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Blur: {blur}px</label><input type="range" min={0} max={60} value={blur} onChange={(e) => setBlur(Number(e.target.value))} className="w-full accent-blue-600" /></div>

                    <div className="flex gap-2">
                        {(["flat", "concave", "convex", "pressed"] as const).map((s) => (
                            <button key={s} onClick={() => setShape(s)} className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize ${shape === s ? "bg-blue-600 text-white" : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"}`}>{s}</button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-center rounded-lg p-8" style={{ background: bgColor, minHeight: 300 }}>
                    <div style={{
                        width: size,
                        height: size,
                        borderRadius: radius,
                        background: bgStyle,
                        boxShadow: `${shadowType}${distance}px ${distance}px ${blur}px ${dark}, ${shadowType}-${distance}px -${distance}px ${blur}px ${light}`,
                    }} />
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
                <p>Create neumorphism (soft UI) effects with a visual editor. Adjust distance, blur, intensity, shape, and colors to achieve the perfect soft 3D look. Supports flat, concave, convex, and pressed shapes.</p>
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    <details className="group"><summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">What is neumorphism?</summary><p className="mt-2 pl-4">Neumorphism is a design trend that uses soft shadows and highlights to create elements that appear extruded from or pressed into the background, creating a soft 3D effect.</p></details>
                </div>
            </div>
        </ToolLayout>
    );
}
