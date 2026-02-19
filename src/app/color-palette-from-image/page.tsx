"use client";

import { useState, useRef, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function ColorPaletteFromImage() {
    const [colors, setColors] = useState<{ hex: string; rgb: string; count: number }[]>([]);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [paletteSize, setPaletteSize] = useState(6);
    const [copied, setCopied] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const extractColors = useCallback((imgSrc: string) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext("2d")!;
            const scale = Math.min(150 / img.width, 150 / img.height, 1);
            const w = Math.floor(img.width * scale);
            const h = Math.floor(img.height * scale);
            canvas.width = w;
            canvas.height = h;
            ctx.drawImage(img, 0, 0, w, h);
            const data = ctx.getImageData(0, 0, w, h).data;

            const buckets: Record<string, { r: number; g: number; b: number; count: number }> = {};
            for (let i = 0; i < data.length; i += 4) {
                const r = Math.round(data[i] / 16) * 16;
                const g = Math.round(data[i + 1] / 16) * 16;
                const b = Math.round(data[i + 2] / 16) * 16;
                const key = `${r},${g},${b}`;
                if (!buckets[key]) buckets[key] = { r, g, b, count: 0 };
                buckets[key].count++;
            }

            const sorted = Object.values(buckets).sort((a, b) => b.count - a.count);
            const filtered: typeof sorted = [];
            for (const c of sorted) {
                const tooClose = filtered.some((f) => Math.abs(f.r - c.r) + Math.abs(f.g - c.g) + Math.abs(f.b - c.b) < 60);
                if (!tooClose) filtered.push(c);
                if (filtered.length >= paletteSize) break;
            }

            setColors(filtered.map((c) => ({
                hex: `#${c.r.toString(16).padStart(2, "0")}${c.g.toString(16).padStart(2, "0")}${c.b.toString(16).padStart(2, "0")}`,
                rgb: `rgb(${c.r}, ${c.g}, ${c.b})`,
                count: c.count,
            })));
        };
        img.src = imgSrc;
    }, [paletteSize]);

    const handleFile = (f: File) => {
        const url = URL.createObjectURL(f);
        setImageUrl(url);
        extractColors(url);
    };

    const handleDrop = (e: React.DragEvent) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type.startsWith("image/")) handleFile(f); };
    const copyColor = (val: string) => { navigator.clipboard.writeText(val); setCopied(val); setTimeout(() => setCopied(null), 1200); };
    const copyAll = () => { const text = colors.map(c => c.hex).join(", "); navigator.clipboard.writeText(text); setCopied("all"); setTimeout(() => setCopied(null), 1200); };

    return (
        <ToolLayout title="Color Palette from Image" description="Extract dominant colors from any image. Get hex and RGB values for your design palette." relatedTools={["color-picker", "color-palette-generator", "color-gradient-maker"]}>
            <canvas ref={canvasRef} className="hidden" />

            <div className="grid gap-6 lg:grid-cols-2">
                <div>
                    <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} onClick={() => fileInputRef.current?.click()} className="relative cursor-pointer rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 transition-colors bg-gray-50 dark:bg-gray-900" style={{ minHeight: 300 }}>
                        {imageUrl ? (
                            <img src={imageUrl} alt="Upload" className="w-full h-full object-contain rounded-xl" style={{ maxHeight: 400 }} />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full py-16 text-gray-400">
                                <span className="text-4xl mb-3">🖼️</span>
                                <p className="text-sm font-medium">Drop image here or click to upload</p>
                                <p className="text-xs mt-1">JPG, PNG, WebP, GIF</p>
                            </div>
                        )}
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
                    <div className="mt-3 flex items-center gap-3">
                        <label className="text-xs text-gray-600 dark:text-gray-400">Palette size:</label>
                        <input type="range" min={3} max={12} value={paletteSize} onChange={(e) => { setPaletteSize(Number(e.target.value)); if (imageUrl) extractColors(imageUrl); }} className="flex-1 accent-blue-600" />
                        <span className="text-xs font-mono text-gray-600 dark:text-gray-400 w-4">{paletteSize}</span>
                    </div>
                </div>

                <div>
                    {colors.length > 0 ? (
                        <>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">Extracted Palette</h3>
                                <button onClick={copyAll} className="rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700">{copied === "all" ? "Copied!" : "Copy All"}</button>
                            </div>
                            <div className="flex rounded-xl overflow-hidden shadow-lg mb-4" style={{ height: 80 }}>
                                {colors.map((c, i) => (<div key={i} className="flex-1 cursor-pointer hover:opacity-80 transition-opacity" style={{ backgroundColor: c.hex }} onClick={() => copyColor(c.hex)} title={`Click to copy ${c.hex}`} />))}
                            </div>
                            <div className="space-y-2">
                                {colors.map((c, i) => (
                                    <div key={i} className="flex items-center gap-3 group">
                                        <div className="h-8 w-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex-shrink-0" style={{ backgroundColor: c.hex }} />
                                        <div className="flex-1 min-w-0">
                                            <button onClick={() => copyColor(c.hex)} className="text-sm font-mono font-medium text-gray-800 dark:text-gray-200 hover:text-blue-600">{copied === c.hex ? "Copied!" : c.hex}</button>
                                            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-mono">{c.rgb}</p>
                                        </div>
                                        <div className="text-[10px] text-gray-400 w-10 text-right">{Math.round(c.count / colors.reduce((a, b) => a + b.count, 0) * 100)}%</div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 py-16">
                            <span className="text-3xl mb-2">🎨</span>
                            <p className="text-sm">Upload an image to extract colors</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
                <p>Extract dominant colors from any uploaded image. Uses color quantization to find the most prominent colors in your photo. Get hex codes and RGB values for your design projects. Adjust palette size from 3 to 12 colors. All processing happens locally in your browser.</p>
            </div>
        </ToolLayout>
    );
}
