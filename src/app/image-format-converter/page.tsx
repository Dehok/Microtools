"use client";

import { useState, useRef, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";

interface ConvertedImage {
    original: File;
    converted: Blob;
    preview: string;
    originalSize: number;
    newSize: number;
    format: string;
}

export default function ImageFormatConverter() {
    const [format, setFormat] = useState<"jpeg" | "png" | "webp" | "bmp">("png");
    const [results, setResults] = useState<ConvertedImage[]>([]);
    const [processing, setProcessing] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const convertImage = useCallback(
        async (file: File): Promise<ConvertedImage> => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext("2d");
                    if (!ctx) return reject(new Error("Canvas not supported"));
                    if (format === "jpeg" || format === "bmp") {
                        ctx.fillStyle = "#FFFFFF";
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                    }
                    ctx.drawImage(img, 0, 0);
                    const mimeType = format === "bmp" ? "image/bmp" : `image/${format}`;
                    const quality = format === "png" || format === "bmp" ? undefined : 0.92;
                    canvas.toBlob(
                        (blob) => {
                            if (!blob) return reject(new Error("Conversion failed"));
                            resolve({
                                original: file,
                                converted: blob,
                                preview: URL.createObjectURL(blob),
                                originalSize: file.size,
                                newSize: blob.size,
                                format,
                            });
                        },
                        mimeType,
                        quality
                    );
                };
                img.onerror = () => reject(new Error("Failed to load image"));
                img.src = URL.createObjectURL(file);
            });
        },
        [format]
    );

    const handleFiles = useCallback(
        async (files: FileList | File[]) => {
            const imgs = Array.from(files).filter((f) => f.type.startsWith("image/"));
            if (!imgs.length) return;
            setProcessing(true);
            try {
                const converted = await Promise.all(imgs.map(convertImage));
                setResults((prev) => [...prev, ...converted]);
            } catch (e) {
                console.error(e);
            }
            setProcessing(false);
        },
        [convertImage]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); },
        [handleFiles]
    );

    const handleDownload = (r: ConvertedImage) => {
        const link = document.createElement("a");
        const ext = format === "jpeg" ? "jpg" : format;
        link.download = r.original.name.replace(/\.[^.]+$/, "") + "." + ext;
        link.href = r.preview;
        link.click();
    };

    const downloadAll = () => results.forEach(handleDownload);

    const fmtSize = (b: number) => b < 1024 ? b + " B" : b < 1048576 ? (b / 1024).toFixed(1) + " KB" : (b / 1048576).toFixed(2) + " MB";

    return (
        <ToolLayout
            title="Image Format Converter Online"
            description="Convert images between PNG, JPG, WebP, and BMP formats instantly in your browser. Free, fast, and private — no upload needed."
            relatedTools={["image-compressor", "image-resizer", "base64-image-encoder"]}
        >
            <div className="mb-4 flex flex-wrap items-center gap-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Convert to:</label>
                {(["png", "jpeg", "webp", "bmp"] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFormat(f)}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${format === f ? "bg-blue-600 text-white" : "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                    >
                        {f === "jpeg" ? "JPG" : f.toUpperCase()}
                    </button>
                ))}
            </div>

            <div
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onClick={() => fileInputRef.current?.click()}
                className={`mb-4 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${dragOver ? "border-blue-500 bg-blue-50 dark:bg-blue-950" : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 hover:border-blue-400"}`}
            >
                <svg className="mb-2 h-10 w-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{processing ? "Converting..." : "Drop images here or click to browse"}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Supports PNG, JPG, WebP, BMP, GIF — multiple files allowed</p>
                <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && handleFiles(e.target.files)} />
            </div>

            {results.length > 0 && (
                <>
                    <div className="mb-4 flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{results.length} image{results.length > 1 ? "s" : ""} converted</span>
                        <div className="flex gap-2">
                            {results.length > 1 && (
                                <button onClick={downloadAll} className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700">Download All</button>
                            )}
                            <button onClick={() => setResults([])} className="rounded-md border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">Clear</button>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {results.map((r, i) => (
                            <div key={i} className="flex items-center gap-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3">
                                <img src={r.preview} alt="Preview" className="h-14 w-14 rounded object-cover" />
                                <div className="flex-1 min-w-0">
                                    <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-200">{r.original.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{fmtSize(r.originalSize)} → {fmtSize(r.newSize)} · {r.format.toUpperCase()}</p>
                                </div>
                                <button onClick={() => handleDownload(r)} className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700">Download</button>
                            </div>
                        ))}
                    </div>
                </>
            )}

            <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
                <p>Convert images between PNG, JPG (JPEG), WebP, and BMP formats instantly. All conversion happens in your browser using the HTML5 Canvas API — no images are uploaded to any server. Support batch conversion of multiple files at once.</p>
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    <details className="group"><summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Which formats are supported?</summary><p className="mt-2 pl-4">Input: any image format your browser supports (PNG, JPG, WebP, BMP, GIF, SVG, etc.). Output: PNG, JPG, WebP, or BMP.</p></details>
                    <details className="group"><summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Does converting reduce quality?</summary><p className="mt-2 pl-4">PNG and BMP are lossless formats. JPG and WebP use high-quality compression (92%). Converting to a lossless format preserves full quality.</p></details>
                    <details className="group"><summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Are my images uploaded anywhere?</summary><p className="mt-2 pl-4">No. Everything runs locally in your browser. Your images never leave your device.</p></details>
                </div>
            </div>
        </ToolLayout>
    );
}
