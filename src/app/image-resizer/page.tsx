"use client";

import { useState, useRef, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";

interface ResizedImage {
    original: File;
    resized: Blob;
    originalWidth: number;
    originalHeight: number;
    newWidth: number;
    newHeight: number;
    originalSize: number;
    newSize: number;
    preview: string;
}

export default function ImageResizer() {
    const [targetWidth, setTargetWidth] = useState(800);
    const [targetHeight, setTargetHeight] = useState(600);
    const [keepAspectRatio, setKeepAspectRatio] = useState(true);
    const [resizeMode, setResizeMode] = useState<"pixels" | "percent">("pixels");
    const [percentage, setPercentage] = useState(50);
    const [format, setFormat] = useState<"jpeg" | "png" | "webp">("jpeg");
    const [results, setResults] = useState<ResizedImage[]>([]);
    const [processing, setProcessing] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const resizeImage = useCallback(
        async (file: File): Promise<ResizedImage> => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    let w: number, h: number;

                    if (resizeMode === "percent") {
                        w = Math.round(img.width * (percentage / 100));
                        h = Math.round(img.height * (percentage / 100));
                    } else {
                        w = targetWidth;
                        if (keepAspectRatio) {
                            h = Math.round((img.height * targetWidth) / img.width);
                        } else {
                            h = targetHeight;
                        }
                    }

                    canvas.width = w;
                    canvas.height = h;
                    const ctx = canvas.getContext("2d");
                    if (!ctx) return reject(new Error("Canvas not supported"));
                    ctx.imageSmoothingEnabled = true;
                    ctx.imageSmoothingQuality = "high";
                    ctx.drawImage(img, 0, 0, w, h);

                    const mimeType = `image/${format}`;
                    const quality = format === "png" ? undefined : 0.92;

                    canvas.toBlob(
                        (blob) => {
                            if (!blob) return reject(new Error("Resize failed"));
                            resolve({
                                original: file,
                                resized: blob,
                                originalWidth: img.width,
                                originalHeight: img.height,
                                newWidth: w,
                                newHeight: h,
                                originalSize: file.size,
                                newSize: blob.size,
                                preview: URL.createObjectURL(blob),
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
        [targetWidth, targetHeight, keepAspectRatio, resizeMode, percentage, format]
    );

    const handleFiles = useCallback(
        async (files: FileList | File[]) => {
            const imageFiles = Array.from(files).filter((f) =>
                f.type.startsWith("image/")
            );
            if (imageFiles.length === 0) return;

            setProcessing(true);
            try {
                const resized = await Promise.all(imageFiles.map(resizeImage));
                setResults((prev) => [...prev, ...resized]);
            } catch (e) {
                console.error(e);
            }
            setProcessing(false);
        },
        [resizeImage]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setDragOver(false);
            handleFiles(e.dataTransfer.files);
        },
        [handleFiles]
    );

    const handleDownload = (result: ResizedImage) => {
        const link = document.createElement("a");
        const ext = format === "jpeg" ? "jpg" : format;
        const name = result.original.name.replace(/\.[^.]+$/, "");
        link.download = `${name}_${result.newWidth}x${result.newHeight}.${ext}`;
        link.href = result.preview;
        link.click();
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    };

    return (
        <ToolLayout
            title="Image Resizer Online"
            description="Resize images to any dimensions directly in your browser. Set exact pixel size or scale by percentage. Free, fast, and private."
            relatedTools={["image-compressor", "qr-code-generator", "base64-encode-decode"]}
        >
            {/* Controls */}
            <div className="mb-4 space-y-4">
                {/* Mode Toggle */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setResizeMode("pixels")}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${resizeMode === "pixels"
                                ? "bg-blue-600 text-white"
                                : "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                            }`}
                    >
                        By Pixels
                    </button>
                    <button
                        onClick={() => setResizeMode("percent")}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${resizeMode === "percent"
                                ? "bg-blue-600 text-white"
                                : "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                            }`}
                    >
                        By Percentage
                    </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    {resizeMode === "pixels" ? (
                        <>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Width (px)
                                </label>
                                <input
                                    type="number"
                                    min={1}
                                    value={targetWidth}
                                    onChange={(e) => setTargetWidth(Number(e.target.value))}
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Height (px) {keepAspectRatio && "(auto)"}
                                </label>
                                <input
                                    type="number"
                                    min={1}
                                    value={targetHeight}
                                    onChange={(e) => setTargetHeight(Number(e.target.value))}
                                    disabled={keepAspectRatio}
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                                />
                            </div>
                            <div className="flex items-end">
                                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                    <input
                                        type="checkbox"
                                        checked={keepAspectRatio}
                                        onChange={(e) => setKeepAspectRatio(e.target.checked)}
                                        className="rounded border-gray-300 accent-blue-600"
                                    />
                                    Keep aspect ratio
                                </label>
                            </div>
                        </>
                    ) : (
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Scale: {percentage}%
                            </label>
                            <input
                                type="range"
                                min={5}
                                max={200}
                                value={percentage}
                                onChange={(e) => setPercentage(Number(e.target.value))}
                                className="w-full accent-blue-600"
                            />
                            <div className="mt-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                                <span>5%</span>
                                <span>100%</span>
                                <span>200%</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Output format */}
                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Output format:</label>
                    {(["jpeg", "png", "webp"] as const).map((f) => (
                        <label key={f} className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                            <input
                                type="radio"
                                name="format"
                                value={f}
                                checked={format === f}
                                onChange={() => setFormat(f)}
                                className="accent-blue-600"
                            />
                            {f.toUpperCase()}
                        </label>
                    ))}
                </div>
            </div>

            {/* Drop Zone */}
            <div
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onClick={() => fileInputRef.current?.click()}
                className={`mb-4 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${dragOver
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                        : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 hover:border-blue-400"
                    }`}
            >
                <svg className="mb-2 h-10 w-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {processing ? "Resizing..." : "Drop images here or click to browse"}
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
                    <div className="mb-4 flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            {results.length} image{results.length > 1 ? "s" : ""} resized
                        </span>
                        <button
                            onClick={() => setResults([])}
                            className="rounded-md border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            Clear All
                        </button>
                    </div>
                    <div className="space-y-3">
                        {results.map((r, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3"
                            >
                                <img
                                    src={r.preview}
                                    alt="Resized preview"
                                    className="h-16 w-16 rounded object-cover"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-200">
                                        {r.original.name}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {r.originalWidth}×{r.originalHeight} → {r.newWidth}×{r.newHeight}
                                        {" · "}
                                        {formatSize(r.originalSize)} → {formatSize(r.newSize)}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDownload(r)}
                                    className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                                >
                                    Download
                                </button>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* SEO Content */}
            <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                    About This Tool
                </h2>
                <p>
                    The Image Resizer is a free online tool that lets you resize images to exact pixel dimensions or scale them by percentage. It supports JPEG, PNG, and WebP output formats with high-quality downscaling. All processing happens entirely in your browser — no images are uploaded to any server, ensuring complete privacy.
                </p>

                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                    Key Features
                </h2>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong className="text-gray-700 dark:text-gray-300">Pixel-Perfect Sizing</strong> — Set exact width and height in pixels for precise image dimensions.</li>
                    <li><strong className="text-gray-700 dark:text-gray-300">Percentage Scaling</strong> — Scale images up or down by percentage (5% to 200%) for quick adjustments.</li>
                    <li><strong className="text-gray-700 dark:text-gray-300">Aspect Ratio Lock</strong> — Keep the original proportions when resizing to prevent distortion.</li>
                    <li><strong className="text-gray-700 dark:text-gray-300">Multiple Output Formats</strong> — Save resized images as JPEG, PNG, or WebP depending on your needs.</li>
                </ul>

                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                    Common Use Cases
                </h2>
                <ul className="list-disc list-inside space-y-2">
                    <li>Resizing photos for social media (Instagram, Facebook, Twitter profile/cover images)</li>
                    <li>Creating thumbnail images for websites and e-commerce product listings</li>
                    <li>Scaling images to meet specific size requirements for documents and presentations</li>
                    <li>Batch resizing product photos for online stores</li>
                    <li>Preparing images for email signatures, avatars, and favicons</li>
                </ul>

                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                    How to Use
                </h2>
                <p>
                    Choose between pixel-based or percentage-based resizing. For pixels, enter your desired width (height is calculated automatically with aspect ratio lock enabled). For percentage, use the slider to set the scale. Select your output format (JPEG, PNG, or WebP), then drag and drop images or click to browse. Download your resized images individually.
                </p>

                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                    Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                    <details className="group">
                        <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                            Will resizing reduce image quality?
                        </summary>
                        <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
                            Downscaling (making smaller) preserves quality well. Upscaling (making larger) may introduce blurriness as new pixels must be interpolated. The tool uses high-quality bicubic interpolation for the best results.
                        </p>
                    </details>
                    <details className="group">
                        <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                            What is the maximum image size I can resize?
                        </summary>
                        <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
                            Since processing happens in your browser, the limit depends on your device&#39;s memory. Most modern devices can handle images up to 50-100 megapixels without issues.
                        </p>
                    </details>
                    <details className="group">
                        <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                            What is the best format for web images?
                        </summary>
                        <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
                            WebP offers the best compression for web use, producing smaller files than JPEG with similar quality. JPEG is best for photos and wide compatibility. PNG is ideal for images requiring transparency or lossless quality.
                        </p>
                    </details>
                    <details className="group">
                        <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                            Are my images uploaded to the server?
                        </summary>
                        <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
                            No. All resizing is done locally in your browser using the HTML5 Canvas API. Your images are never transmitted to any server and remain completely private.
                        </p>
                    </details>
                </div>
            </div>
        </ToolLayout>
    );
}
