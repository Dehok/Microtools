"use client";

import { useState, useRef } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function PdfSplit() {
    const [file, setFile] = useState<File | null>(null);
    const [totalPages, setTotalPages] = useState(0);
    const [rangeMode, setRangeMode] = useState<"all" | "range" | "custom">("all");
    const [rangeFrom, setRangeFrom] = useState(1);
    const [rangeTo, setRangeTo] = useState(1);
    const [customPages, setCustomPages] = useState("");
    const [splitting, setSplitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = async (f: File) => {
        if (f.type !== "application/pdf") return;
        const { PDFDocument } = await import("pdf-lib");
        const buf = await f.arrayBuffer();
        const pdf = await PDFDocument.load(buf);
        setFile(f);
        setTotalPages(pdf.getPageCount());
        setRangeTo(pdf.getPageCount());
        setRangeFrom(1);
    };

    const parsePages = (): number[] => {
        if (rangeMode === "all") return Array.from({ length: totalPages }, (_, i) => i);
        if (rangeMode === "range") {
            const from = Math.max(0, rangeFrom - 1);
            const to = Math.min(totalPages, rangeTo);
            return Array.from({ length: to - from }, (_, i) => from + i);
        }
        // custom: parse "1,3,5-8"
        const pages = new Set<number>();
        customPages.split(",").forEach((part) => {
            const trimmed = part.trim();
            if (trimmed.includes("-")) {
                const [a, b] = trimmed.split("-").map(Number);
                if (!isNaN(a) && !isNaN(b)) {
                    for (let i = Math.max(1, a); i <= Math.min(totalPages, b); i++) pages.add(i - 1);
                }
            } else {
                const n = parseInt(trimmed);
                if (!isNaN(n) && n >= 1 && n <= totalPages) pages.add(n - 1);
            }
        });
        return Array.from(pages).sort((a, b) => a - b);
    };

    const splitPdf = async () => {
        if (!file) return;
        setSplitting(true);
        try {
            const { PDFDocument } = await import("pdf-lib");
            const buf = await file.arrayBuffer();
            const src = await PDFDocument.load(buf);
            const pages = parsePages();
            if (pages.length === 0) { setSplitting(false); return; }

            const newPdf = await PDFDocument.create();
            const copied = await newPdf.copyPages(src, pages);
            copied.forEach((p) => newPdf.addPage(p));
            const bytes = await newPdf.save();
            const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
            const link = document.createElement("a");
            link.download = `split-${file.name}`;
            link.href = URL.createObjectURL(blob);
            link.click();
        } catch (e) {
            console.error(e);
        }
        setSplitting(false);
    };

    return (
        <ToolLayout
            title="Split PDF Online"
            description="Extract specific pages from a PDF file. Select page ranges or individual pages. Free, fast, private."
            relatedTools={["pdf-merge", "pdf-to-text", "image-to-pdf"]}
        >
            {!file ? (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
                    onDragOver={(e) => e.preventDefault()}
                    className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-12 hover:border-blue-400"
                >
                    <svg className="mb-2 h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Drop a PDF file or click to browse</p>
                    <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3">
                        <div>
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{file.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{totalPages} pages · {(file.size / 1024).toFixed(0)} KB</p>
                        </div>
                        <button onClick={() => { setFile(null); setTotalPages(0); }} className="text-sm text-red-500 hover:text-red-700">Remove</button>
                    </div>

                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <input type="radio" name="mode" checked={rangeMode === "all"} onChange={() => setRangeMode("all")} className="accent-blue-600" /> All pages (1–{totalPages})
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <input type="radio" name="mode" checked={rangeMode === "range"} onChange={() => setRangeMode("range")} className="accent-blue-600" /> Page range
                        </label>
                        {rangeMode === "range" && (
                            <div className="flex items-center gap-2 pl-6">
                                <input type="number" min={1} max={totalPages} value={rangeFrom} onChange={(e) => setRangeFrom(Number(e.target.value))} className="w-20 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1 text-sm" />
                                <span className="text-gray-500">to</span>
                                <input type="number" min={1} max={totalPages} value={rangeTo} onChange={(e) => setRangeTo(Number(e.target.value))} className="w-20 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1 text-sm" />
                            </div>
                        )}
                        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <input type="radio" name="mode" checked={rangeMode === "custom"} onChange={() => setRangeMode("custom")} className="accent-blue-600" /> Custom pages
                        </label>
                        {rangeMode === "custom" && (
                            <input value={customPages} onChange={(e) => setCustomPages(e.target.value)} placeholder="e.g. 1,3,5-8,12" className="ml-6 w-60 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-1.5 text-sm" />
                        )}
                    </div>

                    <button onClick={splitPdf} disabled={splitting} className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                        {splitting ? "Splitting..." : "Split & Download"}
                    </button>
                </div>
            )}

            <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
                <p>Extract specific pages from a PDF. Choose all pages, a range, or specific page numbers. The result is a new PDF containing only the selected pages. Runs entirely in your browser.</p>
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    <details className="group"><summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">How do I select specific pages?</summary><p className="mt-2 pl-4">Choose &quot;Custom pages&quot; and enter page numbers separated by commas. Use hyphens for ranges: e.g., &quot;1,3,5-8&quot; extracts pages 1, 3, 5, 6, 7, and 8.</p></details>
                    <details className="group"><summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Is the quality preserved?</summary><p className="mt-2 pl-4">Yes. The pages are copied exactly as they appear in the original PDF, with no quality loss.</p></details>
                </div>
            </div>
        </ToolLayout>
    );
}
