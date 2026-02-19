"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ToolLayout from "@/components/ToolLayout";

interface SourceImage {
  file: File;
  previewUrl: string;
}

type PageSize = "a4" | "letter" | "fit";
type Orientation = "portrait" | "landscape";

function isPng(file: File) {
  return file.type === "image/png" || /\.png$/i.test(file.name);
}

export default function PngToPdfPage() {
  const [images, setImages] = useState<SourceImage[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>("a4");
  const [orientation, setOrientation] = useState<Orientation>("portrait");
  const [margin, setMargin] = useState(10);
  const [flattenTransparency, setFlattenTransparency] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [dragOver, setDragOver] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const revokeImage = (item: SourceImage) => URL.revokeObjectURL(item.previewUrl);

  useEffect(() => {
    return () => images.forEach(revokeImage);
  }, [images]);

  const handleFiles = useCallback((files: FileList | File[]) => {
    const next = Array.from(files).filter(isPng);
    if (!next.length) {
      setError("Please add PNG files.");
      return;
    }
    setError("");
    setImages((prev) => [...prev, ...next.map((file) => ({ file, previewUrl: URL.createObjectURL(file) }))]);
  }, []);

  const removeImage = (index: number) => {
    setImages((prev) => {
      const target = prev[index];
      if (target) revokeImage(target);
      return prev.filter((_, itemIndex) => itemIndex !== index);
    });
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    setImages((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const createPdf = async () => {
    if (!images.length) return;
    setGenerating(true);
    setError("");

    try {
      const { jsPDF } = await import("jspdf");
      const loadImage = (src: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
          const image = new Image();
          image.onload = () => resolve(image);
          image.onerror = () => reject(new Error("Could not load one of the PNG files."));
          image.src = src;
        });

      const renderCanvas = (image: HTMLImageElement) => {
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas is not available in this browser.");
        if (flattenTransparency) {
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(image, 0, 0);
        return canvas;
      };

      let pdf: InstanceType<typeof jsPDF> | null = null;

      for (let i = 0; i < images.length; i++) {
        const image = await loadImage(images[i].previewUrl);
        const canvas = renderCanvas(image);
        const format = flattenTransparency ? "JPEG" : "PNG";

        if (pageSize === "fit") {
          const widthMm = canvas.width * 0.264583;
          const heightMm = canvas.height * 0.264583;
          const fittedOrientation: Orientation = widthMm > heightMm ? "landscape" : "portrait";
          if (i === 0) {
            pdf = new jsPDF({
              orientation: fittedOrientation,
              unit: "mm",
              format: [widthMm + margin * 2, heightMm + margin * 2],
            });
          } else {
            pdf?.addPage([widthMm + margin * 2, heightMm + margin * 2], fittedOrientation);
          }
          pdf?.addImage(canvas, format, margin, margin, widthMm, heightMm);
        } else {
          if (i === 0) {
            pdf = new jsPDF({ orientation, unit: "mm", format: pageSize });
          } else {
            pdf?.addPage(pageSize, orientation);
          }
          const pageWidth = pdf!.internal.pageSize.getWidth() - margin * 2;
          const pageHeight = pdf!.internal.pageSize.getHeight() - margin * 2;
          const scale = Math.min(pageWidth / canvas.width, pageHeight / canvas.height);
          const width = canvas.width * scale;
          const height = canvas.height * scale;
          const x = margin + (pageWidth - width) / 2;
          const y = margin + (pageHeight - height) / 2;
          pdf?.addImage(canvas, format, x, y, width, height);
        }
      }

      const outputName = images[0].file.name.replace(/\.png$/i, "") || "images";
      pdf?.save(`${outputName}.pdf`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate PDF.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <ToolLayout
      title="PNG to PDF Converter Online"
      description="Convert PNG images to PDF in your browser. Keep transparency or flatten with a custom background."
      relatedTools={["image-to-pdf", "jpg-to-pdf", "pdf-merge"]}
    >
      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Page Size</label>
          <select
            value={pageSize}
            onChange={(event) => setPageSize(event.target.value as PageSize)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
          >
            <option value="a4">A4</option>
            <option value="letter">Letter</option>
            <option value="fit">Fit to image</option>
          </select>
        </div>
        {pageSize !== "fit" && (
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Orientation</label>
            <select
              value={orientation}
              onChange={(event) => setOrientation(event.target.value as Orientation)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
            >
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </div>
        )}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Margin: {margin}mm
          </label>
          <input
            type="range"
            min={0}
            max={30}
            value={margin}
            onChange={(event) => setMargin(Number(event.target.value))}
            className="mt-2 w-full accent-blue-600"
          />
        </div>
      </div>

      <div className="mb-4 grid gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={flattenTransparency}
            onChange={(event) => setFlattenTransparency(event.target.checked)}
            className="accent-blue-600"
          />
          Flatten transparency before adding to PDF
        </label>
        {flattenTransparency && (
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-700 dark:text-gray-300">Background color</label>
            <input
              type="color"
              value={backgroundColor}
              onChange={(event) => setBackgroundColor(event.target.value)}
              className="h-8 w-12 cursor-pointer rounded border border-gray-300 dark:border-gray-600"
            />
            <span className="text-xs text-gray-500 dark:text-gray-400">{backgroundColor}</span>
          </div>
        )}
      </div>

      <div
        onDrop={(event) => {
          event.preventDefault();
          setDragOver(false);
          handleFiles(event.dataTransfer.files);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => fileInputRef.current?.click()}
        className={`mb-4 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
          dragOver
            ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
            : "border-gray-300 bg-gray-50 hover:border-blue-400 dark:border-gray-600 dark:bg-gray-950"
        }`}
      >
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Drop PNG files here or click to browse
        </p>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Multiple files supported, each image becomes one page.
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".png,image/png"
          multiple
          className="hidden"
          onChange={(event) => event.target.files && handleFiles(event.target.files)}
        />
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {error}
        </div>
      )}

      {images.length > 0 && (
        <>
          <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {images.map((item, index) => (
              <div
                key={`${item.file.name}-${index}`}
                className="group relative rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-900"
              >
                <img src={item.previewUrl} alt={`PNG page ${index + 1}`} className="h-24 w-full rounded object-cover" />
                <div className="absolute inset-0 flex items-center justify-center gap-1 rounded-lg bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      moveImage(index, -1);
                    }}
                    className="rounded bg-white/20 px-2 py-1 text-xs text-white hover:bg-white/40"
                  >
                    Prev
                  </button>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      removeImage(index);
                    }}
                    className="rounded bg-red-500/80 px-2 py-1 text-xs text-white hover:bg-red-600"
                  >
                    Remove
                  </button>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      moveImage(index, 1);
                    }}
                    className="rounded bg-white/20 px-2 py-1 text-xs text-white hover:bg-white/40"
                  >
                    Next
                  </button>
                </div>
                <p className="mt-1 text-center text-xs text-gray-500 dark:text-gray-400">Page {index + 1}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => void createPdf()}
              disabled={generating}
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {generating ? "Generating PDF..." : `Create PDF (${images.length} page${images.length > 1 ? "s" : ""})`}
            </button>
            <button
              onClick={() =>
                setImages((prev) => {
                  prev.forEach(revokeImage);
                  return [];
                })
              }
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              Clear All
            </button>
          </div>
        </>
      )}

      <div className="mt-12 space-y-6 border-t border-gray-200 pt-8 text-sm leading-relaxed text-gray-600 dark:border-gray-700 dark:text-gray-400">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
        <p>
          PNG to PDF Converter turns one or more PNG files into a PDF entirely in your browser. You can preserve
          transparency or flatten images onto a custom background color for consistent print output.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Why would I flatten transparency?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Flattening avoids unexpected dark or transparent backgrounds when printing PDFs in some viewers.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Are PNG files uploaded anywhere?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. Conversion is done locally on your device inside the browser.
            </p>
          </details>
        </div>
      </div>
    </ToolLayout>
  );
}
