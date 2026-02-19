"use client";

import { useState, useRef, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function BackgroundRemover() {
    const [originalUrl, setOriginalUrl] = useState<string | null>(null);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState("");
    const [fileName, setFileName] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const processImage = useCallback(async (file: File) => {
        setError("");
        setProcessing(true);
        setProgress(0);
        setFileName(file.name);
        const url = URL.createObjectURL(file);
        setOriginalUrl(url);
        setResultUrl(null);

        try {
            setProgress(10);
            const { removeBackground } = await import("@imgly/background-removal");
            setProgress(30);
            const blob = await removeBackground(file, {
                progress: (key: string, current: number, total: number) => {
                    if (total > 0) setProgress(30 + Math.round((current / total) * 60));
                },
            });
            setProgress(95);
            const resultBlob = new Blob([blob], { type: "image/png" });
            setResultUrl(URL.createObjectURL(resultBlob));
            setProgress(100);
        } catch (e) {
            setError("Processing failed: " + (e as Error).message);
        } finally {
            setProcessing(false);
        }
    }, []);

    const handleDrop = (e: React.DragEvent) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type.startsWith("image/")) processImage(f); };
    const handleDownload = () => { if (!resultUrl) return; const link = document.createElement("a"); link.download = fileName.replace(/\.[^.]+$/, "") + "-no-bg.png"; link.href = resultUrl; link.click(); };

    return (
        <ToolLayout title="Background Remover" description="Remove image backgrounds instantly in your browser using AI. No upload to servers. 100% private." relatedTools={["image-compressor", "image-cropper", "image-resizer"]}>
            <div className="mb-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 p-3 flex items-center gap-2">
                <span className="text-green-600">🔒</span>
                <p className="text-xs text-green-700 dark:text-green-400">Your images never leave your browser. AI model runs entirely on your device.</p>
            </div>

            {!originalUrl && (
                <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} onClick={() => fileInputRef.current?.click()} className="cursor-pointer rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 transition-colors bg-gray-50 dark:bg-gray-900 py-20 text-center">
                    <span className="text-5xl mb-4 block">✂️</span>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Drop image here or click to upload</p>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP — Up to 10 MB</p>
                    <p className="text-[10px] text-gray-400 mt-3">First use downloads AI model (~5 MB). Processing takes 5-15 seconds.</p>
                </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) processImage(f); }} />

            {processing && (
                <div className="my-6 text-center">
                    <div className="w-full max-w-md mx-auto bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div className="bg-blue-600 h-full rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {progress < 30 ? "Loading AI model..." : progress < 90 ? "Removing background..." : "Finishing up..."}
                        {" "}{progress}%
                    </p>
                </div>
            )}

            {originalUrl && !processing && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <button onClick={() => { setOriginalUrl(null); setResultUrl(null); setProgress(0); }} className="rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">← New Image</button>
                        {resultUrl && <button onClick={handleDownload} className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-blue-700">Download PNG</button>}
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <h3 className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-2">Original</h3>
                            <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900"><img src={originalUrl} alt="Original" className="w-full object-contain" style={{ maxHeight: 400 }} /></div>
                        </div>
                        <div>
                            <h3 className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-2">Background Removed</h3>
                            <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden" style={{ background: "repeating-conic-gradient(#e5e7eb 0% 25%, transparent 0% 50%) 0 0 / 20px 20px" }}>
                                {resultUrl ? <img src={resultUrl} alt="Result" className="w-full object-contain" style={{ maxHeight: 400 }} /> : <div className="py-20 text-center text-gray-400 text-xs">Processing...</div>}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {error && <p className="mt-4 text-xs text-red-500 text-center">{error}</p>}

            <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
                <p>Remove image backgrounds instantly using AI — powered by an ONNX neural network running 100% in your browser. No server uploads, no data collection. Works with photos of people, products, animals, and more. Download the result as a transparent PNG.</p>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">How It Works</h3>
                <p>On first use, a ~5 MB AI model is downloaded and cached in your browser. The model then processes your image locally using WebAssembly and WebGL, producing a precise foreground mask. The entire pipeline runs on your device.</p>
            </div>
        </ToolLayout>
    );
}
