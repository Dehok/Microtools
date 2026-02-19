"use client";

import { useState, useRef, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";

interface CompressedImage {
    original: File;
    compressed: Blob;
    originalSize: number;
    compressedSize: number;
    preview: string;
}

export default function ImageCompressor() {
    const [quality, setQuality] = useState(80);
    const [maxWidth, setMaxWidth] = useState(0);
    const [results, setResults] = useState<CompressedImage[]>([]);
    const [processing, setProcessing] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const compressImage = useCallback(
        async (file: File): Promise<CompressedImage> => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    let w = img.width;
                    let h = img.height;

                    if (maxWidth > 0 && w > maxWidth) {
                        h = Math.round((h * maxWidth) / w);
                        w = maxWidth;
                    }

                    canvas.width = w;
                    canvas.height = h;
                    const ctx = canvas.getContext("2d");
                    if (!ctx) return reject(new Error("Canvas not supported"));
                    ctx.drawImage(img, 0, 0, w, h);

                    canvas.toBlob(
                        (blob) => {
                            if (!blob) return reject(new Error("Compression failed"));
                            resolve({
                                original: file,
                                compressed: blob,
                                originalSize: file.size,
                                compressedSize: blob.size,
                                preview: URL.createObjectURL(blob),
                            });
                        },
                        "image/jpeg",
                        quality / 100
                    );
                };
                img.onerror = () => reject(new Error("Failed to load image"));
                img.src = URL.createObjectURL(file);
            });
        },
        [quality, maxWidth]
    );

    const handleFiles = useCallback(
        async (files: FileList | File[]) => {
            const imageFiles = Array.from(files).filter((f) =>
                f.type.startsWith("image/")
            );
            if (imageFiles.length === 0) return;

            setProcessing(true);
            try {
                const compressed = await Promise.all(imageFiles.map(compressImage));
                setResults((prev) => [...prev, ...compressed]);
            } catch (e) {
                console.error(e);
            }
            setProcessing(false);
        },
        [compressImage]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setDragOver(false);
            handleFiles(e.dataTransfer.files);
        },
        [handleFiles]
    );

    const handleDownload = (result: CompressedImage) => {
        const link = document.createElement("a");
        const name = result.original.name.replace(/\.[^.]+$/, "");
        link.download = `${name}_compressed.jpg`;
        link.href = result.preview;
        link.click();
    };

    const handleDownloadAll = () => {
        results.forEach((r) => handleDownload(r));
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    };

    const totalSaved = results.reduce(
        (sum, r) => sum + (r.originalSize - r.compressedSize),
        0
    );

    return (
        <ToolLayout
            title="Image Compressor Online"
            description="Compress JPEG, PNG, and WebP images directly in your browser. Reduce file size without losing quality. Free, fast, and private."
            relatedTools={["image-resizer", "qr-code-generator", "base64-encode-decode"]}
        >
            {/* Controls */}
            <div className="mb-4 grid gap-4 sm:grid-cols-2">
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Quality: {quality}%
                    </label>
                    <input
                        type="range"
                        min={10}
                        max={100}
                        value={quality}
                        onChange={(e) => setQuality(Number(e.target.value))}
                        className="w-full accent-blue-600"
                    />
                    <div className="mt-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>Smaller file</span>
                        <span>Higher quality</span>
                    </div>
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Max Width (px, 0 = no limit)
                    </label>
                    <input
                        type="number"
                        min={0}
                        step={100}
                        value={maxWidth}
                        onChange={(e) => setMaxWidth(Number(e.target.value))}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="0 (no limit)"
                    />
                </div>
            </div>

            {/* Drop Zone */}
            <div
                onDrop={handleDrop}
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onClick={() => fileInputRef.current?.click()}
                className={`mb-4 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${dragOver
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                        : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 hover:border-blue-400"
                    }`}
            >
                <svg className="mb-2 h-10 w-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {processing ? "Compressing..." : "Drop images here or click to browse"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Supports JPEG, PNG, WebP — multiple files allowed
                </p>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => e.target.files && handleFiles(e.target.files)}
                />
            </div>

            {/* Results */}
            {results.length > 0 && (
                <>
                    {/* Summary */}
                    <div className="mb-4 flex items-center justify-between rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 px-4 py-3">
                        <div className="text-sm text-green-700 dark:text-green-300">
                            <strong>{results.length}</strong> image{results.length > 1 ? "s" : ""} compressed — saved{" "}
                            <strong>{formatSize(totalSaved)}</strong> total
                        </div>
                        <div className="flex gap-2">
                            {results.length > 1 && (
                                <button
                                    onClick={handleDownloadAll}
                                    className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700"
                                >
                                    Download All
                                </button>
                            )}
                            <button
                                onClick={() => setResults([])}
                                className="rounded-md border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                Clear
                            </button>
                        </div>
                    </div>

                    {/* Image Cards */}
                    <div className="space-y-3">
                        {results.map((r, i) => {
                            const saved = r.originalSize - r.compressedSize;
                            const pct = ((saved / r.originalSize) * 100).toFixed(1);
                            return (
                                <div
                                    key={i}
                                    className="flex items-center gap-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3"
                                >
                                    <img
                                        src={r.preview}
                                        alt="Compressed preview"
                                        className="h-16 w-16 rounded object-cover"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-200">
                                            {r.original.name}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {formatSize(r.originalSize)} → {formatSize(r.compressedSize)}{" "}
                                            <span className="text-green-600 dark:text-green-400 font-medium">
                                                (-{pct}%)
                                            </span>
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleDownload(r)}
                                        className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                                    >
                                        Download
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}

            {/* SEO Content */}
            <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                    About This Tool
                </h2>
                <p>
                    The Image Compressor is a free online tool that reduces the file size of your images without significant quality loss. It supports JPEG, PNG, and WebP formats. All compression happens directly in your browser using the HTML5 Canvas API — no images are ever uploaded to any server, ensuring complete privacy and instant results.
                </p>

                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                    Key Features
                </h2>
                <ul className="list-disc list-inside space-y-2">
                    <li>
                        <strong className="text-gray-700 dark:text-gray-300">Adjustable Quality</strong> — Use the quality slider to find the perfect balance between file size and image quality, from 10% to 100%.
                    </li>
                    <li>
                        <strong className="text-gray-700 dark:text-gray-300">Batch Compression</strong> — Compress multiple images at once by selecting or dropping several files. Download them individually or all at once.
                    </li>
                    <li>
                        <strong className="text-gray-700 dark:text-gray-300">Max Width Limit</strong> — Optionally set a maximum width to resize images during compression, further reducing file size.
                    </li>
                    <li>
                        <strong className="text-gray-700 dark:text-gray-300">100% Private</strong> — All processing runs locally in your browser. Your images never leave your device.
                    </li>
                </ul>

                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                    Common Use Cases
                </h2>
                <ul className="list-disc list-inside space-y-2">
                    <li>Reducing image file sizes for faster website loading and better Core Web Vitals scores</li>
                    <li>Compressing photos before uploading to social media, email, or cloud storage</li>
                    <li>Batch processing product images for e-commerce websites</li>
                    <li>Optimizing images for blog posts, newsletters, and presentations</li>
                    <li>Meeting file size limits for form uploads, applications, and online submissions</li>
                </ul>

                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                    How to Use
                </h2>
                <p>
                    Set your desired quality level using the slider (lower = smaller file, higher = better quality). Optionally set a maximum width to resize images. Then drag and drop your images onto the upload area or click to browse files. The tool compresses each image instantly and shows you the original size, compressed size, and savings percentage. Click Download to save individual images or Download All for batch downloads.
                </p>

                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                    Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                    <details className="group">
                        <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                            How much can I reduce the file size?
                        </summary>
                        <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
                            Typical JPEG compression at 80% quality reduces file size by 40-70% with minimal visible quality loss. Lower quality settings can achieve 80-90% reduction, but artifacts may become noticeable.
                        </p>
                    </details>
                    <details className="group">
                        <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                            Are my images uploaded to a server?
                        </summary>
                        <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
                            No. All compression happens locally in your browser using the HTML5 Canvas API. Your images never leave your device and are not stored or transmitted anywhere.
                        </p>
                    </details>
                    <details className="group">
                        <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                            What image formats are supported?
                        </summary>
                        <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
                            The tool accepts JPEG, PNG, WebP, GIF, BMP, and most browser-supported image formats as input. Output is JPEG format for optimal compression.
                        </p>
                    </details>
                    <details className="group">
                        <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                            Can I compress images without losing quality?
                        </summary>
                        <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
                            At 90-100% quality, the compression is nearly lossless — the file size reduction is smaller but quality is virtually identical to the original. For most web use, 75-85% quality provides an excellent balance.
                        </p>
                    </details>
                </div>
            </div>
        </ToolLayout>
    );
}
