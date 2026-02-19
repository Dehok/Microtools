"use client";

import { useState, useRef, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function ScreenshotToText() {
    const [text, setText] = useState("");
    const [processing, setProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [progressMsg, setProgressMsg] = useState("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [language, setLanguage] = useState("eng");
    const [dragOver, setDragOver] = useState(false);
    const [copied, setCopied] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const processImage = useCallback(
        async (file: File) => {
            setProcessing(true);
            setProgress(0);
            setText("");
            setProgressMsg("Loading OCR engine...");
            setImagePreview(URL.createObjectURL(file));

            try {
                const Tesseract = await import("tesseract.js");
                const result = await Tesseract.recognize(file, language, {
                    logger: (m: { status: string; progress: number }) => {
                        setProgressMsg(m.status);
                        setProgress(Math.round(m.progress * 100));
                    },
                });
                setText(result.data.text);
            } catch (e) {
                setText(`Error: ${e instanceof Error ? e.message : "OCR failed"}`);
            }
            setProcessing(false);
        },
        [language]
    );

    const handleFiles = useCallback(
        async (files: FileList | File[]) => {
            const file = Array.from(files).find((f) => f.type.startsWith("image/"));
            if (file) processImage(file);
        },
        [processImage]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setDragOver(false);
            handleFiles(e.dataTransfer.files);
        },
        [handleFiles]
    );

    const handlePaste = useCallback(
        (e: React.ClipboardEvent) => {
            const items = e.clipboardData?.items;
            if (!items) return;
            for (const item of Array.from(items)) {
                if (item.type.startsWith("image/")) {
                    const file = item.getAsFile();
                    if (file) processImage(file);
                    break;
                }
            }
        },
        [processImage]
    );

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
    const charCount = text.length;

    return (
        <ToolLayout
            title="Screenshot to Text (OCR) Online"
            description="Extract text from images and screenshots using OCR. Supports 100+ languages. Free, fast, and runs entirely in your browser."
            relatedTools={["image-compressor", "image-resizer", "base64-encode-decode"]}
        >
            <div onPaste={handlePaste}>
                {/* Language selector */}
                <div className="mb-4 flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Language:
                    </label>
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                        <option value="eng">English</option>
                        <option value="ces">Czech</option>
                        <option value="deu">German</option>
                        <option value="fra">French</option>
                        <option value="spa">Spanish</option>
                        <option value="ita">Italian</option>
                        <option value="pol">Polish</option>
                        <option value="por">Portuguese</option>
                        <option value="nld">Dutch</option>
                        <option value="rus">Russian</option>
                        <option value="ukr">Ukrainian</option>
                        <option value="jpn">Japanese</option>
                        <option value="kor">Korean</option>
                        <option value="chi_sim">Chinese (Simplified)</option>
                        <option value="chi_tra">Chinese (Traditional)</option>
                        <option value="ara">Arabic</option>
                        <option value="hin">Hindi</option>
                        <option value="tur">Turkish</option>
                    </select>
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Drop an image, click to browse, or paste from clipboard (Ctrl+V)
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Supports JPEG, PNG, WebP, BMP, GIF
                    </p>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files && handleFiles(e.target.files)}
                    />
                </div>

                {/* Progress */}
                {processing && (
                    <div className="mb-4 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950 p-4">
                        <div className="mb-2 flex items-center justify-between text-sm text-blue-700 dark:text-blue-300">
                            <span>{progressMsg}</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-blue-200 dark:bg-blue-800">
                            <div
                                className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Preview + Result */}
                {imagePreview && (
                    <div className="mb-4 grid gap-4 lg:grid-cols-2">
                        {/* Image preview */}
                        <div>
                            <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                Source Image
                            </h3>
                            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 p-2">
                                <img
                                    src={imagePreview}
                                    alt="Source"
                                    className="max-h-80 w-full rounded object-contain"
                                />
                            </div>
                        </div>

                        {/* Extracted text */}
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Extracted Text
                                </h3>
                                {text && (
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {wordCount} words · {charCount} chars
                                        </span>
                                        <button
                                            onClick={handleCopy}
                                            className="rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700"
                                        >
                                            {copied ? "Copied!" : "Copy"}
                                        </button>
                                    </div>
                                )}
                            </div>
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                readOnly={processing}
                                rows={12}
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder={processing ? "Processing..." : "Extracted text will appear here..."}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* SEO Content */}
            <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                    About This Tool
                </h2>
                <p>
                    The Screenshot to Text tool uses Optical Character Recognition (OCR) to extract text from images, screenshots, photos, and scanned documents. Powered by Tesseract.js, an open-source OCR engine, it supports over 100 languages and runs entirely in your browser — no images are ever uploaded to any server.
                </p>

                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                    Key Features
                </h2>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong className="text-gray-700 dark:text-gray-300">100+ Languages</strong> — Recognize text in English, Czech, German, French, Spanish, Japanese, Chinese, Arabic, and many more.</li>
                    <li><strong className="text-gray-700 dark:text-gray-300">Clipboard Paste</strong> — Paste screenshots directly from your clipboard using Ctrl+V. No need to save the image first.</li>
                    <li><strong className="text-gray-700 dark:text-gray-300">Drag &amp; Drop</strong> — Simply drag an image file onto the upload area for instant processing.</li>
                    <li><strong className="text-gray-700 dark:text-gray-300">100% Private</strong> — All OCR processing runs locally in your browser using WebAssembly. Your images never leave your device.</li>
                </ul>

                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                    Common Use Cases
                </h2>
                <ul className="list-disc list-inside space-y-2">
                    <li>Extracting text from screenshots of articles, code snippets, or error messages</li>
                    <li>Converting scanned documents and PDF images into editable text</li>
                    <li>Digitizing printed text from books, receipts, or business cards</li>
                    <li>Extracting data from images for spreadsheets or databases</li>
                    <li>Making image-based content accessible and searchable</li>
                </ul>

                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                    How to Use
                </h2>
                <p>
                    Select the language of the text in your image. Then upload an image by dragging and dropping it, clicking to browse, or pasting from your clipboard (Ctrl+V). The OCR engine will process the image and extract text, showing progress in real-time. Once complete, you can copy the extracted text or edit it directly in the text area.
                </p>

                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                    Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                    <details className="group">
                        <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                            How accurate is the OCR recognition?
                        </summary>
                        <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
                            For clean, high-resolution text images, accuracy is typically 90-99%. Handwritten text, low-resolution images, or complex layouts may reduce accuracy. Best results come from well-lit, high-contrast text with a clear font.
                        </p>
                    </details>
                    <details className="group">
                        <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                            Why does the first processing take longer?
                        </summary>
                        <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
                            On first use, the tool downloads the language model data (1-3 MB depending on language). This is cached in your browser for future use, making subsequent OCR operations faster.
                        </p>
                    </details>
                    <details className="group">
                        <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                            Can I extract text from handwritten notes?
                        </summary>
                        <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
                            The tool works best with printed text. Handwriting recognition has limited accuracy and depends heavily on legibility. Very neat, block-letter handwriting may produce usable results.
                        </p>
                    </details>
                    <details className="group">
                        <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                            Are my images stored or uploaded anywhere?
                        </summary>
                        <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
                            No. All processing happens locally using Tesseract.js WebAssembly. Your images never leave your browser and are not stored on any server.
                        </p>
                    </details>
                </div>
            </div>
        </ToolLayout>
    );
}
