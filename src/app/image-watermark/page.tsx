"use client";

import { useState, useRef, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";

interface WatermarkedImage {
    original: File;
    preview: string;
    blob: Blob;
}

export default function ImageWatermark() {
    const [images, setImages] = useState<WatermarkedImage[]>([]);
    const [watermarkText, setWatermarkText] = useState("SAMPLE");
    const [fontSize, setFontSize] = useState(48);
    const [opacity, setOpacity] = useState(30);
    const [color, setColor] = useState("#000000");
    const [position, setPosition] = useState<"center" | "tile" | "bottom-right" | "bottom-left">("center");
    const [rotation, setRotation] = useState(-30);
    const [processing, setProcessing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const applyWatermark = useCallback(
        async (file: File): Promise<WatermarkedImage> => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext("2d");
                    if (!ctx) return reject(new Error("Canvas not supported"));
                    ctx.drawImage(img, 0, 0);

                    ctx.globalAlpha = opacity / 100;
                    ctx.fillStyle = color;
                    ctx.font = `bold ${fontSize}px Arial, sans-serif`;
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";

                    if (position === "tile") {
                        const stepX = fontSize * 6;
                        const stepY = fontSize * 4;
                        for (let x = -img.width; x < img.width * 2; x += stepX) {
                            for (let y = -img.height; y < img.height * 2; y += stepY) {
                                ctx.save();
                                ctx.translate(x, y);
                                ctx.rotate((rotation * Math.PI) / 180);
                                ctx.fillText(watermarkText, 0, 0);
                                ctx.restore();
                            }
                        }
                    } else {
                        let x = img.width / 2;
                        let y = img.height / 2;
                        if (position === "bottom-right") { x = img.width - fontSize * 2; y = img.height - fontSize; }
                        if (position === "bottom-left") { x = fontSize * 2; y = img.height - fontSize; }
                        ctx.save();
                        ctx.translate(x, y);
                        if (position === "center") ctx.rotate((rotation * Math.PI) / 180);
                        ctx.fillText(watermarkText, 0, 0);
                        ctx.restore();
                    }

                    canvas.toBlob(
                        (blob) => {
                            if (!blob) return reject(new Error("Failed"));
                            resolve({ original: file, preview: URL.createObjectURL(blob), blob });
                        },
                        "image/png"
                    );
                };
                img.onerror = () => reject(new Error("Failed to load"));
                img.src = URL.createObjectURL(file);
            });
        },
        [watermarkText, fontSize, opacity, color, position, rotation]
    );

    const handleFiles = useCallback(
        async (files: FileList | File[]) => {
            const imgs = Array.from(files).filter((f) => f.type.startsWith("image/"));
            if (!imgs.length || !watermarkText.trim()) return;
            setProcessing(true);
            try {
                const results = await Promise.all(imgs.map(applyWatermark));
                setImages(results);
            } catch (e) { console.error(e); }
            setProcessing(false);
        },
        [applyWatermark, watermarkText]
    );

    const downloadImage = (img: WatermarkedImage) => {
        const link = document.createElement("a");
        link.download = "watermarked-" + img.original.name;
        link.href = img.preview;
        link.click();
    };

    return (
        <ToolLayout
            title="Image Watermark Tool Online"
            description="Add text watermarks to images directly in your browser. Tile, center, or corner placement. Free, fast, and private."
            relatedTools={["image-compressor", "image-resizer", "image-cropper"]}
        >
            <div className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Watermark Text</label>
                    <input value={watermarkText} onChange={(e) => setWatermarkText(e.target.value)} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Position</label>
                    <select value={position} onChange={(e) => setPosition(e.target.value as typeof position)} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm">
                        <option value="center">Center</option>
                        <option value="tile">Tile (Repeat)</option>
                        <option value="bottom-right">Bottom Right</option>
                        <option value="bottom-left">Bottom Left</option>
                    </select>
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Font Size: {fontSize}px</label>
                    <input type="range" min={12} max={120} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full accent-blue-600" />
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Opacity: {opacity}%</label>
                    <input type="range" min={5} max={100} value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full accent-blue-600" />
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Rotation: {rotation}°</label>
                    <input type="range" min={-90} max={90} value={rotation} onChange={(e) => setRotation(Number(e.target.value))} className="w-full accent-blue-600" />
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Color</label>
                    <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-9 w-full cursor-pointer rounded border-0" />
                </div>
            </div>

            <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
                onDragOver={(e) => e.preventDefault()}
                className="mb-4 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-8 hover:border-blue-400"
            >
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{processing ? "Processing..." : "Drop images here or click to browse"}</p>
                <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && handleFiles(e.target.files)} />
            </div>

            {images.length > 0 && (
                <div className="space-y-3">
                    {images.map((img, i) => (
                        <div key={i} className="flex items-center gap-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3">
                            <img src={img.preview} alt="Watermarked" className="h-20 w-20 rounded object-cover" />
                            <div className="flex-1 min-w-0">
                                <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-200">{img.original.name}</p>
                            </div>
                            <button onClick={() => downloadImage(img)} className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700">Download</button>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
                <p>Add custom text watermarks to your images to protect your work. Choose from centered, tiled (repeating), or corner placement. Customize font size, opacity, rotation, and color. Everything runs in your browser — images never leave your device.</p>
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    <details className="group"><summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Can I watermark multiple images at once?</summary><p className="mt-2 pl-4">Yes! Select or drop multiple images and all will be watermarked with the same settings.</p></details>
                    <details className="group"><summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Are my images uploaded anywhere?</summary><p className="mt-2 pl-4">No. All watermarking happens locally using the HTML5 Canvas API. Your images stay on your device.</p></details>
                </div>
            </div>
        </ToolLayout>
    );
}
