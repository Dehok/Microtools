"use client";

import { useState, useRef, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";

const FONTS = [
    { name: "Caveat", label: "Caveat (casual)" },
    { name: "Dancing Script", label: "Dancing Script (elegant)" },
    { name: "Indie Flower", label: "Indie Flower (handwritten)" },
    { name: "Shadows Into Light", label: "Shadows Into Light (light)" },
    { name: "Patrick Hand", label: "Patrick Hand (print)" },
    { name: "Kalam", label: "Kalam (pen)" },
    { name: "Architects Daughter", label: "Architects Daughter" },
    { name: "Sacramento", label: "Sacramento (cursive)" },
];

export default function TextToHandwriting() {
    const [text, setText] = useState("The quick brown fox jumps over the lazy dog.");
    const [font, setFont] = useState("Caveat");
    const [fontSize, setFontSize] = useState(28);
    const [color, setColor] = useState("#1a237e");
    const [bgColor, setBgColor] = useState("#fef9ef");
    const [lineHeight, setLineHeight] = useState(2);
    const [showLines, setShowLines] = useState(true);
    const [lineColor, setLineColor] = useState("#c8d6e5");
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const loadFont = useCallback(async (fontName: string) => {
        try {
            const link = document.createElement("link");
            link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, "+")}&display=swap`;
            link.rel = "stylesheet";
            document.head.appendChild(link);
            await document.fonts.load(`${fontSize}px "${fontName}"`);
            setFontsLoaded(true);
        } catch { /* try anyway */ }
    }, [fontSize]);

    const generateImage = useCallback(async () => {
        await loadFont(font);
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const padding = 40;
        const lineH = fontSize * lineHeight;
        const maxWidth = 700;
        canvas.width = maxWidth + padding * 2;

        ctx.font = `${fontSize}px "${font}", cursive`;
        const words = text.split(" ");
        const lines: string[] = [];
        let currentLine = "";

        for (const word of words) {
            const testLine = currentLine ? currentLine + " " + word : word;
            if (ctx.measureText(testLine).width > maxWidth) {
                if (currentLine) lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        }
        if (currentLine) lines.push(currentLine);

        // also split on newlines
        const allLines: string[] = [];
        for (const line of lines) {
            line.split("\n").forEach((l) => allLines.push(l));
        }

        canvas.height = Math.max(200, allLines.length * lineH + padding * 2);

        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (showLines) {
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 1;
            for (let y = padding + lineH; y < canvas.height - padding / 2; y += lineH) {
                ctx.beginPath();
                ctx.moveTo(padding, y);
                ctx.lineTo(canvas.width - padding, y);
                ctx.stroke();
            }
        }

        ctx.fillStyle = color;
        ctx.font = `${fontSize}px "${font}", cursive`;
        ctx.textBaseline = "bottom";

        allLines.forEach((line, i) => {
            const y = padding + (i + 1) * lineH;
            ctx.fillText(line, padding, y);
        });
    }, [text, font, fontSize, color, bgColor, lineHeight, showLines, lineColor, loadFont]);

    const handleGenerate = async () => {
        await generateImage();
    };

    const download = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement("a");
        link.download = "handwriting.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    };

    return (
        <ToolLayout
            title="Text to Handwriting Converter"
            description="Convert typed text to handwriting-style images. Multiple fonts, custom colors, notebook lines. Free and instant."
            relatedTools={["fancy-text-generator", "text-to-speech", "word-counter"]}
        >
            {/* Google Fonts preload */}
            <link rel="stylesheet" href={`https://fonts.googleapis.com/css2?family=${FONTS.map((f) => f.name.replace(/ /g, "+")).join("&family=")}&display=swap`} />

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-3">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Your Text</label>
                        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={5} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Font</label>
                        <select value={font} onChange={(e) => setFont(e.target.value)} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm">
                            {FONTS.map((f) => <option key={f.name} value={f.name} style={{ fontFamily: f.name }}>{f.label}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div><label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Size: {fontSize}px</label><input type="range" min={16} max={48} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full accent-blue-600" /></div>
                        <div><label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Line Height: {lineHeight}x</label><input type="range" min={1.2} max={3} step={0.1} value={lineHeight} onChange={(e) => setLineHeight(Number(e.target.value))} className="w-full accent-blue-600" /></div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <div><label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Ink Color</label><input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-8 w-full cursor-pointer rounded border-0" /></div>
                        <div><label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Paper</label><input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-8 w-full cursor-pointer rounded border-0" /></div>
                        <div><label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Lines</label><input type="color" value={lineColor} onChange={(e) => setLineColor(e.target.value)} className="h-8 w-full cursor-pointer rounded border-0" /></div>
                    </div>
                    <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"><input type="checkbox" checked={showLines} onChange={(e) => setShowLines(e.target.checked)} className="accent-blue-600" /> Show notebook lines</label>
                    <div className="flex gap-2">
                        <button onClick={handleGenerate} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Generate</button>
                        <button onClick={download} disabled={!fontsLoaded} className="rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50">Download PNG</button>
                    </div>
                </div>

                <div className="flex items-start justify-center">
                    <canvas ref={canvasRef} className="max-w-full rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm" />
                </div>
            </div>

            <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
                <p>Convert typed text to realistic handwriting images. Choose from 8 Google Fonts that mimic handwriting styles, customize ink color, paper color, and font size. Add notebook lines for a realistic look. Download as PNG.</p>
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    <details className="group"><summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Does this use AI?</summary><p className="mt-2 pl-4">No. This tool uses Google Fonts with handwriting styles rendered on an HTML5 Canvas. The output looks like handwriting because of the carefully selected fonts.</p></details>
                    <details className="group"><summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Can I use this for school?</summary><p className="mt-2 pl-4">This is a creative tool for generating handwriting-style text for design purposes. We do not endorse or encourage its use for academic dishonesty.</p></details>
                </div>
            </div>
        </ToolLayout>
    );
}
