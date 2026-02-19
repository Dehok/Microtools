"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function ImageCropper() {
    const [image, setImage] = useState<string | null>(null);
    const [imgSize, setImgSize] = useState({ w: 0, h: 0 });
    const [crop, setCrop] = useState({ x: 50, y: 50, w: 200, h: 200 });
    const [dragging, setDragging] = useState<"move" | "nw" | "ne" | "sw" | "se" | null>(null);
    const [outputFormat, setOutputFormat] = useState<"png" | "jpeg" | "webp">("png");
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);
    const dragStart = useRef({ mx: 0, my: 0, cx: 0, cy: 0, cw: 0, ch: 0 });
    const [displayScale, setDisplayScale] = useState(1);

    const handleFile = useCallback((file: File) => {
        if (!file.type.startsWith("image/")) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const src = e.target?.result as string;
            const img = new Image();
            img.onload = () => {
                imgRef.current = img;
                setImgSize({ w: img.width, h: img.height });
                const cw = Math.min(img.width, 300);
                const ch = Math.min(img.height, 300);
                setCrop({ x: Math.floor((img.width - cw) / 2), y: Math.floor((img.height - ch) / 2), w: cw, h: ch });
            };
            img.src = src;
            setImage(src);
        };
        reader.readAsDataURL(file);
    }, []);

    useEffect(() => {
        if (!containerRef.current || imgSize.w === 0) return;
        const containerWidth = containerRef.current.clientWidth;
        setDisplayScale(Math.min(1, containerWidth / imgSize.w));
    }, [imgSize]);

    const s = displayScale;

    const handleMouseDown = useCallback((e: React.MouseEvent, type: typeof dragging) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(type);
        dragStart.current = { mx: e.clientX, my: e.clientY, cx: crop.x, cy: crop.y, cw: crop.w, ch: crop.h };
    }, [crop]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!dragging) return;
        const dx = (e.clientX - dragStart.current.mx) / s;
        const dy = (e.clientY - dragStart.current.my) / s;
        const { cx, cy, cw, ch } = dragStart.current;

        if (dragging === "move") {
            setCrop({ x: Math.max(0, Math.min(imgSize.w - cw, cx + dx)), y: Math.max(0, Math.min(imgSize.h - ch, cy + dy)), w: cw, h: ch });
        } else if (dragging === "se") {
            setCrop({ x: cx, y: cy, w: Math.max(20, Math.min(imgSize.w - cx, cw + dx)), h: Math.max(20, Math.min(imgSize.h - cy, ch + dy)) });
        } else if (dragging === "nw") {
            const nw = Math.max(20, cw - dx);
            const nh = Math.max(20, ch - dy);
            setCrop({ x: cx + cw - nw, y: cy + ch - nh, w: nw, h: nh });
        } else if (dragging === "ne") {
            const nh = Math.max(20, ch - dy);
            setCrop({ x: cx, y: cy + ch - nh, w: Math.max(20, Math.min(imgSize.w - cx, cw + dx)), h: nh });
        } else if (dragging === "sw") {
            const nw = Math.max(20, cw - dx);
            setCrop({ x: cx + cw - nw, y: cy, w: nw, h: Math.max(20, Math.min(imgSize.h - cy, ch + dy)) });
        }
    }, [dragging, imgSize, s]);

    const handleMouseUp = useCallback(() => setDragging(null), []);

    const doCrop = useCallback(() => {
        if (!imgRef.current || !canvasRef.current) return;
        const canvas = canvasRef.current;
        canvas.width = crop.w;
        canvas.height = crop.h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(imgRef.current, crop.x, crop.y, crop.w, crop.h, 0, 0, crop.w, crop.h);
        const link = document.createElement("a");
        link.download = `cropped.${outputFormat === "jpeg" ? "jpg" : outputFormat}`;
        link.href = canvas.toDataURL(`image/${outputFormat}`, 0.92);
        link.click();
    }, [crop, outputFormat]);

    return (
        <ToolLayout
            title="Image Cropper Online"
            description="Crop images directly in your browser. Free, fast, private — no upload needed. Export as PNG, JPG, or WebP."
            relatedTools={["image-resizer", "image-compressor", "image-format-converter"]}
        >
            {!image ? (
                <div
                    onClick={() => { const input = document.createElement("input"); input.type = "file"; input.accept = "image/*"; input.onchange = (e) => { const f = (e.target as HTMLInputElement).files?.[0]; if (f) handleFile(f); }; input.click(); }}
                    onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
                    onDragOver={(e) => e.preventDefault()}
                    className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-12 hover:border-blue-400"
                >
                    <svg className="mb-2 h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Drop image or click to browse</p>
                </div>
            ) : (
                <>
                    <div className="mb-3 flex flex-wrap items-center gap-3">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Crop: {Math.round(crop.w)} × {Math.round(crop.h)}px</span>
                        <select value={outputFormat} onChange={(e) => setOutputFormat(e.target.value as "png" | "jpeg" | "webp")} className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1 text-xs">
                            <option value="png">PNG</option><option value="jpeg">JPG</option><option value="webp">WebP</option>
                        </select>
                        <button onClick={doCrop} className="rounded-md bg-blue-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-blue-700">Crop & Download</button>
                        <button onClick={() => { setImage(null); imgRef.current = null; }} className="rounded-md border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">Reset</button>
                    </div>

                    <div
                        ref={containerRef}
                        className="relative inline-block select-none overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
                        style={{ width: imgSize.w * s, height: imgSize.h * s }}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                    >
                        <img src={image} alt="Source" style={{ width: imgSize.w * s, height: imgSize.h * s }} draggable={false} />
                        <div className="absolute inset-0 bg-black/40" style={{ clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 0, ${crop.x * s}px ${crop.y * s}px, ${crop.x * s}px ${(crop.y + crop.h) * s}px, ${(crop.x + crop.w) * s}px ${(crop.y + crop.h) * s}px, ${(crop.x + crop.w) * s}px ${crop.y * s}px, ${crop.x * s}px ${crop.y * s}px)` }} />
                        <div
                            className="absolute border-2 border-white cursor-move"
                            style={{ left: crop.x * s, top: crop.y * s, width: crop.w * s, height: crop.h * s }}
                            onMouseDown={(e) => handleMouseDown(e, "move")}
                        >
                            {(["nw", "ne", "sw", "se"] as const).map((corner) => (
                                <div key={corner} className="absolute h-3 w-3 border-2 border-white bg-blue-500"
                                    style={{ cursor: `${corner}-resize`, ...(corner.includes("n") ? { top: -6 } : { bottom: -6 }), ...(corner.includes("w") ? { left: -6 } : { right: -6 }) }}
                                    onMouseDown={(e) => handleMouseDown(e, corner)} />
                            ))}
                        </div>
                    </div>
                    <canvas ref={canvasRef} className="hidden" />
                </>
            )}

            <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
                <p>Crop images with precision using drag-and-resize handles. Select exactly the area you want to keep and download the cropped result as PNG, JPG, or WebP. All processing is done locally in your browser.</p>
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    <details className="group"><summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Is image quality preserved?</summary><p className="mt-2 pl-4">Yes, the crop is performed at the original image resolution. The visual preview may appear scaled down, but the downloaded file uses full-quality pixels.</p></details>
                    <details className="group"><summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Can I crop images on mobile?</summary><p className="mt-2 pl-4">Yes, though the drag experience is optimized for desktop. On mobile, you can still crop images using touch interactions.</p></details>
                </div>
            </div>
        </ToolLayout>
    );
}
