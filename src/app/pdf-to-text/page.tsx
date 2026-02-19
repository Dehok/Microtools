"use client";

import { useState, useRef, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function PdfToText() {
    const [text, setText] = useState("");
    const [processing, setProcessing] = useState(false);
    const [fileName, setFileName] = useState("");
    const [pageCount, setPageCount] = useState(0);
    const [dragOver, setDragOver] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const extractText = useCallback(async (file: File) => {
        setProcessing(true);
        setText("");
        setError("");
        setFileName(file.name);
        setPageCount(0);

        try {
            const pdfjsLib = await import("pdfjs-dist");

            // Set worker
            if (typeof window !== "undefined") {
                pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
            }

            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            setPageCount(pdf.numPages);

            let fullText = "";

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                const strings = content.items
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    .map((item: any) => item.str || "")
                    .join(" ");
                fullText += `--- Page ${i} ---\n${strings}\n\n`;
            }

            setText(fullText.trim());
        } catch (e) {
            setError(
                `Failed to extract text: ${e instanceof Error ? e.message : "Unknown error"}`
            );
        }
        setProcessing(false);
    }, []);

    const handleFiles = useCallback(
        async (files: FileList | File[]) => {
            const file = Array.from(files).find(
                (f) => f.type === "application/pdf" || f.name.endsWith(".pdf")
            );
            if (file) extractText(file);
        },
        [extractText]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setDragOver(false);
            handleFiles(e.dataTransfer.files);
        },
        [handleFiles]
    );

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([text], { type: "text/plain" });
        const link = document.createElement("a");
        const name = fileName.replace(/\.pdf$/i, "");
        link.download = `${name}.txt`;
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
    };

    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

    return (
        <ToolLayout
            title="PDF to Text Converter Online"
            description="Extract text from PDF files directly in your browser. No upload required. Free, fast, and private PDF text extraction."
            relatedTools={["screenshot-to-text", "word-counter", "diff-checker"]}
        >
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17h6m-6-4h6m-3-4v-2" />
                </svg>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {processing ? "Extracting text..." : "Drop a PDF here or click to browse"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Only PDF files supported
                </p>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    className="hidden"
                    onChange={(e) => e.target.files && handleFiles(e.target.files)}
                />
            </div>

            {/* Processing indicator */}
            {processing && (
                <div className="mb-4 flex items-center gap-3 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950 p-4">
                    <svg className="h-5 w-5 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="text-sm text-blue-700 dark:text-blue-300">
                        Processing {fileName}...
                    </span>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="mb-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 p-4 text-sm text-red-700 dark:text-red-300">
                    {error}
                </div>
            )}

            {/* Result */}
            {text && (
                <>
                    {/* Stats bar */}
                    <div className="mb-2 flex items-center justify-between">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            <strong>{fileName}</strong> · {pageCount} page{pageCount > 1 ? "s" : ""} · {wordCount} words
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleCopy}
                                className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                            >
                                {copied ? "Copied!" : "Copy Text"}
                            </button>
                            <button
                                onClick={handleDownload}
                                className="rounded-md border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                Download .txt
                            </button>
                        </div>
                    </div>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={20}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </>
            )}

            {/* SEO Content */}
            <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                    About This Tool
                </h2>
                <p>
                    The PDF to Text Converter extracts all text content from PDF files directly in your browser. Powered by Mozilla&#39;s open-source pdf.js library, it reads PDF files locally on your device without uploading anything to a server. The extracted text is organized by page and can be copied, edited, or downloaded as a plain text file.
                </p>

                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                    Key Features
                </h2>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong className="text-gray-700 dark:text-gray-300">Page-by-Page Extraction</strong> — Text is organized by page number, making it easy to find content from specific pages.</li>
                    <li><strong className="text-gray-700 dark:text-gray-300">Copy or Download</strong> — Copy extracted text to clipboard or download it as a .txt file with one click.</li>
                    <li><strong className="text-gray-700 dark:text-gray-300">Editable Output</strong> — Edit the extracted text directly in the browser before copying or downloading.</li>
                    <li><strong className="text-gray-700 dark:text-gray-300">100% Private</strong> — All PDF processing happens locally in your browser. Your files are never uploaded to any server.</li>
                </ul>

                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                    Common Use Cases
                </h2>
                <ul className="list-disc list-inside space-y-2">
                    <li>Extracting text from PDF reports, ebooks, and academic papers for editing or analysis</li>
                    <li>Converting PDF invoices and receipts into plain text for record keeping</li>
                    <li>Making PDF content searchable and accessible</li>
                    <li>Copying code snippets or data from PDF documentation</li>
                    <li>Processing PDF content for text analysis, summarization, or translation</li>
                </ul>

                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                    How to Use
                </h2>
                <p>
                    Drag and drop a PDF file onto the upload area or click to browse for a file. The tool processes the PDF locally and extracts all text content, organized by page. You can then copy the text to your clipboard, edit it in the text area, or download it as a .txt file.
                </p>

                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                    Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                    <details className="group">
                        <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                            Can this tool extract text from scanned PDFs?
                        </summary>
                        <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
                            This tool extracts embedded text from PDFs. Scanned PDFs (which contain images of text rather than actual text) require OCR. Use our Screenshot to Text tool for OCR-based text extraction from images.
                        </p>
                    </details>
                    <details className="group">
                        <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                            Is there a file size limit?
                        </summary>
                        <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
                            Since processing happens in your browser, the limit depends on your device&#39;s memory. Most devices can handle PDFs up to 50-100 MB without issues. Very large files may take longer to process.
                        </p>
                    </details>
                    <details className="group">
                        <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                            Does it preserve formatting?
                        </summary>
                        <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
                            The tool extracts plain text content. PDF formatting (fonts, colors, tables, images) is not preserved in the text output. For maintaining formatting, a full PDF to Word conversion would be needed.
                        </p>
                    </details>
                    <details className="group">
                        <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                            Is my PDF uploaded to a server?
                        </summary>
                        <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
                            No. The PDF is processed entirely in your browser using Mozilla&#39;s pdf.js library. Your file never leaves your device and is not stored anywhere.
                        </p>
                    </details>
                </div>
            </div>
        </ToolLayout>
    );
}
