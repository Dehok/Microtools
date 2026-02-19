"use client";

import { useState, useRef } from "react";
import ToolLayout from "@/components/ToolLayout";

interface PdfFile {
    id: string;
    file: File;
    name: string;
    pages: number;
}

export default function PdfMerge() {
    const [files, setFiles] = useState<PdfFile[]>([]);
    const [merging, setMerging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFiles = async (fileList: FileList) => {
        const { PDFDocument } = await import("pdf-lib");
        const newFiles: PdfFile[] = [];
        for (const file of Array.from(fileList)) {
            if (file.type !== "application/pdf") continue;
            try {
                const buf = await file.arrayBuffer();
                const pdf = await PDFDocument.load(buf);
                newFiles.push({ id: Date.now() + "-" + Math.random(), file, name: file.name, pages: pdf.getPageCount() });
            } catch {
                /* skip invalid PDFs */
            }
        }
        setFiles((prev) => [...prev, ...newFiles]);
    };

    const removeFile = (id: string) => setFiles((f) => f.filter((p) => p.id !== id));

    const moveFile = (idx: number, dir: -1 | 1) => {
        const next = [...files];
        const target = idx + dir;
        if (target < 0 || target >= next.length) return;
        [next[idx], next[target]] = [next[target], next[idx]];
        setFiles(next);
    };

    const mergePdfs = async () => {
        if (files.length < 2) return;
        setMerging(true);
        try {
            const { PDFDocument } = await import("pdf-lib");
            const merged = await PDFDocument.create();
            for (const f of files) {
                const buf = await f.file.arrayBuffer();
                const src = await PDFDocument.load(buf);
                const pages = await merged.copyPages(src, src.getPageIndices());
                pages.forEach((p) => merged.addPage(p));
            }
            const bytes = await merged.save();
            const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
            const link = document.createElement("a");
            link.download = "merged.pdf";
            link.href = URL.createObjectURL(blob);
            link.click();
        } catch (e) {
            console.error(e);
        }
        setMerging(false);
    };

    const totalPages = files.reduce((s, f) => s + f.pages, 0);

    return (
        <ToolLayout
            title="Merge PDF Online"
            description="Combine multiple PDF files into one document. Free, fast, private — files never leave your browser."
            relatedTools={["pdf-split", "pdf-to-text", "image-to-pdf"]}
        >
            <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
                onDragOver={(e) => e.preventDefault()}
                className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-10 hover:border-blue-400"
            >
                <svg className="mb-2 h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Drop PDF files here or click to browse</p>
                <input ref={fileInputRef} type="file" accept=".pdf" multiple className="hidden" onChange={(e) => e.target.files && handleFiles(e.target.files)} />
            </div>

            {files.length > 0 && (
                <div className="mt-4 space-y-2">
                    {files.map((f, i) => (
                        <div key={f.id} className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3">
                            <span className="text-sm font-mono text-gray-500 dark:text-gray-400 w-6 text-center">{i + 1}</span>
                            <span className="flex-1 truncate text-sm font-medium text-gray-800 dark:text-gray-200">{f.name}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{f.pages} pages</span>
                            <button onClick={() => moveFile(i, -1)} disabled={i === 0} className="text-gray-400 hover:text-gray-600 disabled:opacity-30">↑</button>
                            <button onClick={() => moveFile(i, 1)} disabled={i === files.length - 1} className="text-gray-400 hover:text-gray-600 disabled:opacity-30">↓</button>
                            <button onClick={() => removeFile(f.id)} className="text-red-400 hover:text-red-600">×</button>
                        </div>
                    ))}
                    <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">{files.length} files · {totalPages} total pages</span>
                        <button onClick={mergePdfs} disabled={files.length < 2 || merging} className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                            {merging ? "Merging..." : "Merge & Download"}
                        </button>
                    </div>
                </div>
            )}

            <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
                <p>Merge multiple PDF files into a single document. Reorder files by dragging. Everything runs locally in your browser using pdf-lib — your files are never uploaded to any server.</p>
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    <details className="group"><summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Is there a file size limit?</summary><p className="mt-2 pl-4">There is no hard limit. However, very large PDFs (100MB+) may take longer to process depending on your device.</p></details>
                    <details className="group"><summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Are my files secure?</summary><p className="mt-2 pl-4">Yes. All merging happens in your browser. No files are uploaded to any server. When you close the tab, the data is gone.</p></details>
                </div>
            </div>
        </ToolLayout>
    );
}
