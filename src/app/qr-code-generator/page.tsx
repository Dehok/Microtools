"use client";

import { useState, useRef, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import QRCode from "qrcode";

export default function QrCodeGenerator() {
  const [text, setText] = useState("https://codeutilo.com");
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [generated, setGenerated] = useState(false);

  const generateQR = useCallback(() => {
    if (!canvasRef.current || !text.trim()) return;
    QRCode.toCanvas(canvasRef.current, text, {
      width: size,
      margin: 2,
      color: { dark: fgColor, light: bgColor },
    }).then(() => setGenerated(true));
  }, [text, size, fgColor, bgColor]);

  const handleGenerate = () => {
    generateQR();
  };

  const handleDownloadPNG = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = "qrcode.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  const handleDownloadSVG = async () => {
    if (!text.trim()) return;
    const svgString = await QRCode.toString(text, {
      type: "svg",
      width: size,
      margin: 2,
      color: { dark: fgColor, light: bgColor },
    });
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const link = document.createElement("a");
    link.download = "qrcode.svg";
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <ToolLayout
      title="QR Code Generator Online"
      description="Generate QR codes from text, URLs, or any data. Customize size and colors. Download as PNG or SVG."
      relatedTools={["uuid-generator", "password-generator", "base64-encode-decode"]}
    >
      {/* Input */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Text or URL
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Enter text or URL..."
        />
      </div>

      {/* Options */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">Size:</label>
          <select
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="rounded-md border border-gray-300 dark:border-gray-600 px-2 py-1 text-sm"
          >
            {[128, 256, 512, 1024].map((s) => (
              <option key={s} value={s}>
                {s}×{s}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">Foreground:</label>
          <input
            type="color"
            value={fgColor}
            onChange={(e) => setFgColor(e.target.value)}
            className="h-8 w-8 cursor-pointer rounded border border-gray-300 dark:border-gray-600"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">Background:</label>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="h-8 w-8 cursor-pointer rounded border border-gray-300 dark:border-gray-600"
          />
        </div>
      </div>

      {/* Generate button */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={handleGenerate}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Generate QR Code
        </button>
        {generated && (
          <>
            <button
              onClick={handleDownloadPNG}
              className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
            >
              Download PNG
            </button>
            <button
              onClick={handleDownloadSVG}
              className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
            >
              Download SVG
            </button>
          </>
        )}
      </div>

      {/* Canvas */}
      <div className="flex justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 p-6">
        <canvas ref={canvasRef} />
      </div>

      
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The QR Code Generator creates QR codes from text, URLs, or any data you enter. QR codes are two-dimensional barcodes that can be scanned by smartphone cameras to quickly access links, share contact information, or transmit data. This tool lets you customize colors and download the QR code as PNG or SVG.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Custom Content</strong> — Generate QR codes from URLs, plain text, email addresses, phone numbers, or Wi-Fi credentials.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Color Customization</strong> — Choose custom foreground and background colors to match your brand or design.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Multiple Formats</strong> — Download QR codes as PNG for web use or SVG for print and scalable graphics.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Instant Preview</strong> — See the QR code update in real time as you type or modify the content.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Creating QR codes for business cards, flyers, and marketing materials</li>
          <li>Generating scannable links for websites, apps, or social media profiles</li>
          <li>Sharing Wi-Fi network credentials with guests via QR codes</li>
          <li>Adding QR codes to product packaging for quick access to manuals or support</li>
          <li>Creating QR codes for event tickets, menus, and promotional campaigns</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Enter your text or URL in the input field. The QR code is generated instantly. Customize the foreground and background colors if desired. Download the QR code as PNG or SVG using the download buttons.
        </p>
      
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              What can I put in a QR code?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              QR codes can encode URLs, plain text, email addresses, phone numbers, Wi-Fi network credentials, vCards (contact info), calendar events, and more. The most common use is encoding website URLs.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              What is the maximum data capacity of a QR code?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              A QR code can hold up to 4,296 alphanumeric characters or 7,089 numeric characters. However, more data means a denser QR code that&apos;s harder to scan. Keep content short for best scanning reliability.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Can I customize the colors of a QR code?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes. This tool lets you customize the foreground and background colors. However, ensure high contrast between foreground and background for reliable scanning. Dark foreground on light background works best.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Do QR codes expire?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Static QR codes (like those generated by this tool) never expire — they encode data directly. Dynamic QR codes (offered by paid services) point to a redirect URL that can be changed or disabled.
            </p>
          </details>
        </div>
</div>
    </ToolLayout>
  );
}
