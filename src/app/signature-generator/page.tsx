"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function SignatureGenerator() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [drawing, setDrawing] = useState(false);
    const [color, setColor] = useState("#000000");
    const [lineWidth, setLineWidth] = useState(3);
    const [bgColor, setBgColor] = useState("transparent");
    const [hasDrawn, setHasDrawn] = useState(false);
    const lastPoint = useRef<{ x: number; y: number } | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = canvas.offsetWidth * 2;
        canvas.height = canvas.offsetHeight * 2;
        const ctx = canvas.getContext("2d");
        if (ctx) { ctx.scale(2, 2); ctx.lineCap = "round"; ctx.lineJoin = "round"; }
    }, []);

    const getPos = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
        const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
        return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const startDraw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        setDrawing(true);
        setHasDrawn(true);
        lastPoint.current = getPos(e);
    }, []);

    const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if (!drawing || !canvasRef.current || !lastPoint.current) return;
        e.preventDefault();
        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;
        const pos = getPos(e);
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        lastPoint.current = pos;
    }, [drawing, color, lineWidth]);

    const stopDraw = useCallback(() => {
        setDrawing(false);
        lastPoint.current = null;
    }, []);

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasDrawn(false);
    };

    const download = (format: "png" | "svg") => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        if (format === "png") {
            const exportCanvas = document.createElement("canvas");
            exportCanvas.width = canvas.width;
            exportCanvas.height = canvas.height;
            const ctx = exportCanvas.getContext("2d");
            if (!ctx) return;
            if (bgColor !== "transparent") { ctx.fillStyle = bgColor; ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height); }
            ctx.drawImage(canvas, 0, 0);
            const link = document.createElement("a");
            link.download = "signature.png";
            link.href = exportCanvas.toDataURL("image/png");
            link.click();
        } else {
            const dataUrl = canvas.toDataURL("image/png");
            const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width / 2}" height="${canvas.height / 2}"><image href="${dataUrl}" width="${canvas.width / 2}" height="${canvas.height / 2}"/></svg>`;
            const blob = new Blob([svg], { type: "image/svg+xml" });
            const link = document.createElement("a");
            link.download = "signature.svg";
            link.href = URL.createObjectURL(blob);
            link.click();
        }
    };

    return (
        <ToolLayout
            title="Signature Generator Online"
            description="Draw your signature digitally and download as PNG or SVG. Free, instant, private — nothing is stored."
            relatedTools={["invoice-generator", "image-watermark", "image-cropper"]}
        >
            <div className="mb-3 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2"><label className="text-sm text-gray-700 dark:text-gray-300">Pen color:</label><input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-7 w-7 cursor-pointer rounded border-0" /></div>
                <div className="flex items-center gap-2"><label className="text-sm text-gray-700 dark:text-gray-300">Width: {lineWidth}px</label><input type="range" min={1} max={10} value={lineWidth} onChange={(e) => setLineWidth(Number(e.target.value))} className="w-24 accent-blue-600" /></div>
                <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 dark:text-gray-300">Background:</label>
                    <select value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1 text-xs">
                        <option value="transparent">Transparent</option>
                        <option value="#ffffff">White</option>
                        <option value="#f3f4f6">Light Gray</option>
                    </select>
                </div>
            </div>

            <div className="relative rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 overflow-hidden" style={{ touchAction: "none" }}>
                <canvas
                    ref={canvasRef}
                    className="w-full cursor-crosshair"
                    style={{ height: 250 }}
                    onMouseDown={startDraw}
                    onMouseMove={draw}
                    onMouseUp={stopDraw}
                    onMouseLeave={stopDraw}
                    onTouchStart={startDraw}
                    onTouchMove={draw}
                    onTouchEnd={stopDraw}
                />
                {!hasDrawn && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <p className="text-sm text-gray-400">Draw your signature here</p>
                    </div>
                )}
            </div>

            <div className="mt-3 flex gap-3">
                <button onClick={clearCanvas} className="rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">Clear</button>
                <button onClick={() => download("png")} disabled={!hasDrawn} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">Download PNG</button>
                <button onClick={() => download("svg")} disabled={!hasDrawn} className="rounded-md border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 disabled:opacity-50">Download SVG</button>
            </div>

            <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
                <p>Create a digital signature by drawing with your mouse or touchscreen. Customize pen color and width, then download as PNG (with transparent or white background) or SVG. Perfect for documents, contracts, or digital forms.</p>
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    <details className="group"><summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Is my signature stored?</summary><p className="mt-2 pl-4">No. Everything happens in your browser. Your signature is never uploaded or saved on any server.</p></details>
                    <details className="group"><summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Can I use this on mobile?</summary><p className="mt-2 pl-4">Yes! The canvas supports touch input, making it easy to draw your signature with your finger on phones and tablets.</p></details>
                </div>
            </div>
        </ToolLayout>
    );
}
