"use client";

import { useState, useRef, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";

interface ImageFile {
    file: File;
    preview: string;
}

export default function ImageToPdf() {
    const [images, setImages] = useState<ImageFile[]>([]);
    const [pageSize, setPageSize] = useState<"a4" | "letter" | "fit">("a4");
    const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
    const [margin, setMargin] = useState(10);
    const [dragOver, setDragOver] = useState(false);
    const [generating, setGenerating] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFiles = useCallback((files: FileList | File[]) => {
        const imgs = Array.from(files).filter((f) => f.type.startsWith("image/"));
        const newImages = imgs.map((file) => ({ file, preview: URL.createObjectURL(file) }));
        setImages((prev) => [...prev, ...newImages]);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); },
        [handleFiles]
    );

    const removeImage = (idx: number) => {
        setImages((prev) => prev.filter((_, i) => i !== idx));
    };

    const moveImage = (idx: number, dir: -1 | 1) => {
        setImages((prev) => {
            const arr = [...prev];
            const target = idx + dir;
            if (target < 0 || target >= arr.length) return arr;
            [arr[idx], arr[target]] = [arr[target], arr[idx]];
            return arr;
        });
    };

    const generatePdf = async () => {
        if (images.length === 0) return;
        setGenerating(true);
        try {
            const { jsPDF } = await import("jspdf");
            const loadImage = (src: string): Promise<HTMLImageElement> =>
                new Promise((res, rej) => {
                    const img = new Image();
                    img.onload = () => res(img);
                    img.onerror = rej;
                    img.src = src;
                });

            let pdf: InstanceType<typeof jsPDF> | null = null;

            for (let i = 0; i < images.length; i++) {
                const img = await loadImage(images[i].preview);

                if (pageSize === "fit") {
                    const w = img.width * 0.264583;
                    const h = img.height * 0.264583;
                    if (i === 0) {
                        pdf = new jsPDF({ orientation: w > h ? "landscape" : "portrait", unit: "mm", format: [w + margin * 2, h + margin * 2] });
                    } else {
                        pdf!.addPage([w + margin * 2, h + margin * 2], w > h ? "landscape" : "portrait");
                    }
                    pdf!.addImage(img, "JPEG", margin, margin, w, h);
                } else {
                    if (i === 0) {
                        pdf = new jsPDF({ orientation, unit: "mm", format: pageSize });
                    } else {
                        pdf!.addPage(pageSize, orientation);
                    }
                    const pw = pdf!.internal.pageSize.getWidth() - margin * 2;
                    const ph = pdf!.internal.pageSize.getHeight() - margin * 2;
                    const ratio = Math.min(pw / img.width, ph / img.height);
                    const w = img.width * ratio;
                    const h = img.height * ratio;
                    const x = margin + (pw - w) / 2;
                    const y = margin + (ph - h) / 2;
                    pdf!.addImage(img, "JPEG", x, y, w, h);
                }
            }

            pdf!.save("images.pdf");
        } catch (e) {
            console.error(e);
        }
        setGenerating(false);
    };

    return (
        <ToolLayout
            title="Image to PDF Converter Online"
            description="Convert images to PDF directly in your browser. Combine multiple images into one PDF. Free, fast, and private."
            relatedTools={["image-compressor", "image-resizer", "image-format-converter"]}
        >
            <div className="mb-4 grid gap-4 sm:grid-cols-3">
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Page Size</label>
                    <select value={pageSize} onChange={(e) => setPageSize(e.target.value as "a4" | "letter" | "fit")} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                        <option value="a4">A4</option>
                        <option value="letter">Letter</option>
                        <option value="fit">Fit to Image</option>
                    </select>
                </div>
                {pageSize !== "fit" && (
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Orientation</label>
                        <select value={orientation} onChange={(e) => setOrientation(e.target.value as "portrait" | "landscape")} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                            <option value="portrait">Portrait</option>
                            <option value="landscape">Landscape</option>
                        </select>
                    </div>
                )}
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Margin: {margin}mm</label>
                    <input type="range" min={0} max={30} value={margin} onChange={(e) => setMargin(Number(e.target.value))} className="w-full accent-blue-600 mt-2" />
                </div>
            </div>

            <div
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onClick={() => fileInputRef.current?.click()}
                className={`mb-4 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${dragOver ? "border-blue-500 bg-blue-50 dark:bg-blue-950" : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 hover:border-blue-400"}`}
            >
                <svg className="mb-2 h-10 w-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Drop images here or click to browse</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Add multiple images — each becomes one PDF page</p>
                <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && handleFiles(e.target.files)} />
            </div>

            {images.length > 0 && (
                <>
                    <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
                        {images.map((img, i) => (
                            <div key={i} className="group relative rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-1">
                                <img src={img.preview} alt={`Page ${i + 1}`} className="h-24 w-full rounded object-cover" />
                                <div className="absolute inset-0 flex items-center justify-center gap-1 rounded-lg bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                                    <button onClick={(e) => { e.stopPropagation(); moveImage(i, -1); }} className="rounded bg-white/20 p-1 text-white hover:bg-white/40 text-xs">◀</button>
                                    <button onClick={(e) => { e.stopPropagation(); removeImage(i); }} className="rounded bg-red-500/80 p-1 text-white hover:bg-red-600 text-xs">✕</button>
                                    <button onClick={(e) => { e.stopPropagation(); moveImage(i, 1); }} className="rounded bg-white/20 p-1 text-white hover:bg-white/40 text-xs">▶</button>
                                </div>
                                <p className="mt-1 text-center text-xs text-gray-500 dark:text-gray-400">Page {i + 1}</p>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-3">
                        <button onClick={generatePdf} disabled={generating} className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                            {generating ? "Generating..." : `Create PDF (${images.length} page${images.length > 1 ? "s" : ""})`}
                        </button>
                        <button onClick={() => setImages([])} className="rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">Clear All</button>
                    </div>
                </>
            )}

            <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
                <p>Convert one or more images to a PDF document directly in your browser. Arrange pages by dragging, choose page size (A4, Letter, or fit-to-image), set orientation and margins. All processing happens locally — your images are never uploaded.</p>
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    <details className="group"><summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Can I combine multiple images into one PDF?</summary><p className="mt-2 pl-4">Yes! Add multiple images and each will become a separate page. Reorder them by hovering and using the arrow buttons.</p></details>
                    <details className="group"><summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Are my images uploaded to a server?</summary><p className="mt-2 pl-4">No. The PDF is generated entirely in your browser using jsPDF. Your images never leave your device.</p></details>
                    <details className="group"><summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">What image formats are supported?</summary><p className="mt-2 pl-4">Any image format your browser supports — PNG, JPG, WebP, BMP, GIF, SVG, and more.</p></details>
                </div>
            </div>
        </ToolLayout>
    );
}
