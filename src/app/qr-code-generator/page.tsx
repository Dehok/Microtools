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
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Text or URL
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Enter text or URL..."
        />
      </div>

      {/* Options */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Size:</label>
          <select
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="rounded-md border border-gray-300 px-2 py-1 text-sm"
          >
            {[128, 256, 512, 1024].map((s) => (
              <option key={s} value={s}>
                {s}×{s}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Foreground:</label>
          <input
            type="color"
            value={fgColor}
            onChange={(e) => setFgColor(e.target.value)}
            className="h-8 w-8 cursor-pointer rounded border border-gray-300"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Background:</label>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="h-8 w-8 cursor-pointer rounded border border-gray-300"
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
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Download PNG
            </button>
            <button
              onClick={handleDownloadSVG}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Download SVG
            </button>
          </>
        )}
      </div>

      {/* Canvas */}
      <div className="flex justify-center rounded-lg border border-gray-200 bg-gray-50 p-6">
        <canvas ref={canvasRef} />
      </div>

      {/* SEO Content */}
      <div className="mt-8 border-t border-gray-200 pt-6 text-sm text-gray-600">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          What is a QR Code?
        </h2>
        <p className="mb-3">
          A QR (Quick Response) code is a two-dimensional barcode that stores
          information such as URLs, text, email addresses, or phone numbers. QR
          codes can be scanned by any smartphone camera to quickly access the
          encoded information.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          How to use this QR Code Generator
        </h2>
        <p className="mb-3">
          Enter any text or URL in the input field, customize the size and
          colors, then click &quot;Generate QR Code&quot;. You can download the
          result as a PNG image or scalable SVG file. All generation happens
          in your browser — no data is sent to any server.
        </p>
      </div>
    </ToolLayout>
  );
}
