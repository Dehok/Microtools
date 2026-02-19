"use client";

import { useState, useRef, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function GifMaker() {
    const [images, setImages] = useState<{ url: string; file: File }[]>([]);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const [fps, setFps] = useState(5);
    const [width, setWidth] = useState(480);
    const [loop, setLoop] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const addImages = (files: FileList) => {
        const newImages = Array.from(files).filter(f => f.type.startsWith("image/")).map(f => ({ url: URL.createObjectURL(f), file: f }));
        setImages(prev => [...prev, ...newImages]);
        setResultUrl(null);
    };

    const removeImage = (i: number) => { setImages(images.filter((_, idx) => idx !== i)); setResultUrl(null); };
    const moveImage = (from: number, to: number) => { const arr = [...images]; const [item] = arr.splice(from, 1); arr.splice(to, 0, item); setImages(arr); setResultUrl(null); };

    const createAnimation = useCallback(async () => {
        if (images.length < 2) return;
        setProcessing(true);
        setResultUrl(null);

        try {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d")!;

            // Load all images
            const loadedImages = await Promise.all(images.map(img => new Promise<HTMLImageElement>((resolve) => {
                const im = new Image();
                im.onload = () => resolve(im);
                im.src = img.url;
            })));

            const aspectRatio = loadedImages[0].height / loadedImages[0].width;
            const h = Math.round(width * aspectRatio);
            canvas.width = width;
            canvas.height = h;

            const stream = canvas.captureStream(fps);
            const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
            const chunks: BlobPart[] = [];
            recorder.ondataavailable = (e) => chunks.push(e.data);

            const done = new Promise<Blob>((resolve) => {
                recorder.onstop = () => resolve(new Blob(chunks, { type: "video/webm" }));
            });

            recorder.start();
            const frameDelay = 1000 / fps;

            const loopCount = loop ? 3 : 1;
            for (let l = 0; l < loopCount; l++) {
                for (const img of loadedImages) {
                    ctx.clearRect(0, 0, width, h);
                    ctx.drawImage(img, 0, 0, width, h);
                    await new Promise(r => setTimeout(r, frameDelay));
                }
            }

            recorder.stop();
            const blob = await done;
            setResultUrl(URL.createObjectURL(blob));
        } catch (e) {
            console.error(e);
        } finally {
            setProcessing(false);
        }
    }, [images, fps, width, loop]);

    const handleDrop = (e: React.DragEvent) => { e.preventDefault(); if (e.dataTransfer.files.length > 0) addImages(e.dataTransfer.files); };
    const handleDownload = () => { if (!resultUrl) return; const link = document.createElement("a"); link.download = "animation.webm"; link.href = resultUrl; link.click(); };

    return (
        <ToolLayout title="GIF Maker" description="Create animated GIFs from images. Upload frames, set speed, and download. 100% browser-based." relatedTools={["video-to-gif", "image-format-converter", "image-compressor"]}>
            <div className="mb-4">
                <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} onClick={() => fileInputRef.current?.click()} className="cursor-pointer rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 transition-colors bg-gray-50 dark:bg-gray-900 py-8 text-center">
                    <span className="text-3xl mb-2 block">🖼️</span>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Drop images or click to upload frames</p>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP — Select multiple files</p>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => { if (e.target.files) addImages(e.target.files); }} />
            </div>

            {images.length > 0 && (
                <div className="grid gap-4 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xs font-bold text-gray-600 dark:text-gray-400">Frames ({images.length})</h3>
                            <button onClick={() => { setImages([]); setResultUrl(null); }} className="text-xs text-red-400 hover:text-red-600">Clear All</button>
                        </div>
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                            {images.map((img, i) => (
                                <div key={i} className="relative group rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden aspect-square">
                                    <img src={img.url} alt={`Frame ${i + 1}`} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                                        {i > 0 && <button onClick={() => moveImage(i, i - 1)} className="text-white text-xs px-1">←</button>}
                                        <button onClick={() => removeImage(i)} className="text-red-300 text-xs px-1">✕</button>
                                        {i < images.length - 1 && <button onClick={() => moveImage(i, i + 1)} className="text-white text-xs px-1">→</button>}
                                    </div>
                                    <span className="absolute bottom-0.5 right-0.5 bg-black/60 text-white text-[9px] px-1 rounded">{i + 1}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 space-y-2">
                            <h3 className="text-xs font-bold text-gray-700 dark:text-gray-300">Settings</h3>
                            <div><label className="text-[10px] text-gray-500">FPS (speed): {fps}</label><input type="range" min={1} max={30} value={fps} onChange={(e) => setFps(+e.target.value)} className="w-full accent-blue-600" /></div>
                            <div><label className="text-[10px] text-gray-500">Width (px)</label><input type="number" min={100} max={1920} value={width} onChange={(e) => setWidth(+e.target.value)} className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1 text-xs" /></div>
                            <label className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400"><input type="checkbox" checked={loop} onChange={(e) => setLoop(e.target.checked)} className="accent-blue-600" />Loop animation</label>
                        </div>

                        <button onClick={createAnimation} disabled={processing || images.length < 2} className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">{processing ? "Creating..." : `Create Animation (${images.length} frames)`}</button>

                        {resultUrl && (
                            <div>
                                <h3 className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-2">Result</h3>
                                <video src={resultUrl} autoPlay loop muted className="w-full rounded-lg border border-gray-200 dark:border-gray-700" />
                                <button onClick={handleDownload} className="mt-2 w-full rounded-lg bg-gray-800 dark:bg-gray-200 px-4 py-2 text-sm font-medium text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-300">Download WebM</button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
                <p>Create animated WebM/GIF files from individual image frames. Upload images, arrange their order, adjust speed and resolution. Uses Canvas and MediaRecorder for smooth output. All processing happens in your browser.</p>
            </div>
        </ToolLayout>
    );
}
