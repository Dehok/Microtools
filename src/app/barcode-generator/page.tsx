"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";

type BarcodeFormat = "CODE128" | "EAN13" | "EAN8" | "UPC" | "CODE39" | "ITF14" | "pharmacode";

export default function BarcodeGenerator() {
    const [text, setText] = useState("123456789012");
    const [format, setFormat] = useState<BarcodeFormat>("CODE128");
    const [width, setWidth] = useState(2);
    const [height, setHeight] = useState(100);
    const [showText, setShowText] = useState(true);
    const [bgColor, setBgColor] = useState("#ffffff");
    const [lineColor, setLineColor] = useState("#000000");
    const [error, setError] = useState("");
    const svgRef = useRef<HTMLDivElement>(null);

    const generateBarcode = useCallback(async () => {
        if (!text.trim() || !svgRef.current) return;
        setError("");
        try {
            const JsBarcode = (await import("jsbarcode")).default;
            svgRef.current.innerHTML = '<svg id="barcode-svg"></svg>';
            const svg = svgRef.current.querySelector("#barcode-svg");
            JsBarcode(svg, text, {
                format,
                width,
                height,
                displayValue: showText,
                background: bgColor,
                lineColor,
                margin: 10,
                fontSize: 16,
            });
        } catch {
            setError("Invalid input for the selected barcode format. Check your data.");
        }
    }, [text, format, width, height, showText, bgColor, lineColor]);

    useEffect(() => {
        generateBarcode();
    }, [generateBarcode]);

    const downloadSVG = () => {
        const svg = svgRef.current?.querySelector("svg");
        if (!svg) return;
        const data = new XMLSerializer().serializeToString(svg);
        const blob = new Blob([data], { type: "image/svg+xml" });
        const link = document.createElement("a");
        link.download = `barcode-${text}.svg`;
        link.href = URL.createObjectURL(blob);
        link.click();
    };

    const downloadPNG = () => {
        const svg = svgRef.current?.querySelector("svg");
        if (!svg) return;
        const data = new XMLSerializer().serializeToString(svg);
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width * 2;
            canvas.height = img.height * 2;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;
            ctx.scale(2, 2);
            ctx.drawImage(img, 0, 0);
            const link = document.createElement("a");
            link.download = `barcode-${text}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        };
        img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(data)));
    };

    return (
        <ToolLayout
            title="Barcode Generator Online"
            description="Generate barcodes in CODE128, EAN-13, UPC, CODE39, and more. Download as SVG or PNG. Free, instant, private."
            relatedTools={["qr-code-generator", "uuid-generator", "hash-generator"]}
        >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Data / Text</label>
                    <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter barcode data..." className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Format</label>
                    <select value={format} onChange={(e) => setFormat(e.target.value as BarcodeFormat)} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                        <option value="CODE128">CODE128 (any text)</option>
                        <option value="EAN13">EAN-13 (13 digits)</option>
                        <option value="EAN8">EAN-8 (8 digits)</option>
                        <option value="UPC">UPC (12 digits)</option>
                        <option value="CODE39">CODE39 (alphanumeric)</option>
                        <option value="ITF14">ITF-14 (14 digits)</option>
                        <option value="pharmacode">Pharmacode</option>
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Bar Width: {width}</label>
                        <input type="range" min={1} max={5} step={0.5} value={width} onChange={(e) => setWidth(Number(e.target.value))} className="w-full accent-blue-600" />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Height: {height}px</label>
                        <input type="range" min={30} max={200} value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full accent-blue-600" />
                    </div>
                </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"><input type="checkbox" checked={showText} onChange={(e) => setShowText(e.target.checked)} className="accent-blue-600" /> Show text</label>
                <div className="flex items-center gap-2"><label className="text-sm text-gray-700 dark:text-gray-300">Background:</label><input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-7 w-7 cursor-pointer rounded border-0" /></div>
                <div className="flex items-center gap-2"><label className="text-sm text-gray-700 dark:text-gray-300">Color:</label><input type="color" value={lineColor} onChange={(e) => setLineColor(e.target.value)} className="h-7 w-7 cursor-pointer rounded border-0" /></div>
            </div>

            <div className="mt-6 flex justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
                {error ? (
                    <p className="text-sm text-red-500">{error}</p>
                ) : (
                    <div ref={svgRef} className="max-w-full overflow-auto" />
                )}
            </div>

            <div className="mt-4 flex gap-3">
                <button onClick={downloadSVG} disabled={!!error || !text} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">Download SVG</button>
                <button onClick={downloadPNG} disabled={!!error || !text} className="rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50">Download PNG</button>
            </div>

            <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
                <p>Generate barcodes instantly in your browser. Supports CODE128, EAN-13, EAN-8, UPC, CODE39, ITF-14, and Pharmacode formats. Customize bar width, height, colors, and download as SVG or high-resolution PNG.</p>
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    <details className="group"><summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Which format should I use?</summary><p className="mt-2 pl-4">CODE128 is the most versatile and can encode any text. EAN-13 is used for retail products in Europe. UPC is used in North America. CODE39 is common in logistics.</p></details>
                    <details className="group"><summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Are the barcodes scannable?</summary><p className="mt-2 pl-4">Yes! All generated barcodes follow industry standards and are scannable by any barcode reader or smartphone app.</p></details>
                    <details className="group"><summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Can I use these commercially?</summary><p className="mt-2 pl-4">Yes, the barcodes are generated client-side and you own the output. No attribution or license required.</p></details>
                </div>
            </div>
        </ToolLayout>
    );
}
