"use client";

import { useCallback, useRef, useState } from "react";
import ToolLayout from "@/components/ToolLayout";

type ExifPrimitive = string | number | number[];

const TIFF_TYPE_SIZES: Record<number, number> = {
  1: 1, // BYTE
  2: 1, // ASCII
  3: 2, // SHORT
  4: 4, // LONG
  5: 8, // RATIONAL
  7: 1, // UNDEFINED
  9: 4, // SLONG
  10: 8, // SRATIONAL
};

const IFD0_TAGS: Record<number, string> = {
  0x010f: "Make",
  0x0110: "Model",
  0x0112: "Orientation",
  0x011a: "X Resolution",
  0x011b: "Y Resolution",
  0x0128: "Resolution Unit",
  0x0131: "Software",
  0x0132: "Date Time",
  0x013b: "Artist",
  0x8298: "Copyright",
};

const EXIF_TAGS: Record<number, string> = {
  0x829a: "Exposure Time",
  0x829d: "F Number",
  0x8827: "ISO Speed",
  0x9003: "Date Time Original",
  0x9004: "Date Time Digitized",
  0x9201: "Shutter Speed",
  0x9202: "Aperture",
  0x9204: "Exposure Bias",
  0x9209: "Flash",
  0x920a: "Focal Length",
  0xa002: "Pixel X Dimension",
  0xa003: "Pixel Y Dimension",
  0xa405: "Focal Length In 35mm Film",
  0xa434: "Lens Model",
};

const GPS_TAGS: Record<number, string> = {
  0x0001: "GPS Latitude Ref",
  0x0002: "GPS Latitude",
  0x0003: "GPS Longitude Ref",
  0x0004: "GPS Longitude",
  0x0005: "GPS Altitude Ref",
  0x0006: "GPS Altitude",
};

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function readAscii(view: DataView, start: number, length: number) {
  const chars: string[] = [];
  const end = Math.min(view.byteLength, start + length);
  for (let i = start; i < end; i += 1) {
    const code = view.getUint8(i);
    if (code === 0) break;
    chars.push(String.fromCharCode(code));
  }
  return chars.join("");
}

function normalizeValue(value: ExifPrimitive) {
  if (Array.isArray(value)) {
    return value
      .map((entry) => (typeof entry === "number" && Number.isFinite(entry) ? Number(entry.toFixed(5)) : entry))
      .join(", ");
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return Number(value.toFixed(5)).toString();
  }
  return String(value);
}

function readExifValue(
  view: DataView,
  tiffStart: number,
  entryOffset: number,
  type: number,
  count: number,
  littleEndian: boolean
): ExifPrimitive | null {
  const unitSize = TIFF_TYPE_SIZES[type];
  if (!unitSize) return null;

  const byteLength = unitSize * count;
  const valueOffset = byteLength <= 4 ? entryOffset + 8 : tiffStart + view.getUint32(entryOffset + 8, littleEndian);
  if (valueOffset < 0 || valueOffset + byteLength > view.byteLength) return null;

  if (type === 2) return readAscii(view, valueOffset, count);

  const numericValues: number[] = [];
  for (let i = 0; i < count; i += 1) {
    const itemOffset = valueOffset + i * unitSize;
    if (type === 1 || type === 7) {
      numericValues.push(view.getUint8(itemOffset));
    } else if (type === 3) {
      numericValues.push(view.getUint16(itemOffset, littleEndian));
    } else if (type === 4) {
      numericValues.push(view.getUint32(itemOffset, littleEndian));
    } else if (type === 5) {
      const numerator = view.getUint32(itemOffset, littleEndian);
      const denominator = view.getUint32(itemOffset + 4, littleEndian);
      numericValues.push(denominator === 0 ? 0 : numerator / denominator);
    } else if (type === 9) {
      numericValues.push(view.getInt32(itemOffset, littleEndian));
    } else if (type === 10) {
      const numerator = view.getInt32(itemOffset, littleEndian);
      const denominator = view.getInt32(itemOffset + 4, littleEndian);
      numericValues.push(denominator === 0 ? 0 : numerator / denominator);
    }
  }

  return numericValues.length === 1 ? numericValues[0] : numericValues;
}

function parseIfd(
  view: DataView,
  tiffStart: number,
  ifdOffset: number,
  littleEndian: boolean,
  labelMap: Record<number, string>,
  output: Record<string, string>,
  visited: Set<number>
) {
  if (visited.has(ifdOffset) || ifdOffset <= 0 || ifdOffset + 2 > view.byteLength) return;
  visited.add(ifdOffset);

  const entryCount = view.getUint16(ifdOffset, littleEndian);
  for (let i = 0; i < entryCount; i += 1) {
    const entryOffset = ifdOffset + 2 + i * 12;
    if (entryOffset + 12 > view.byteLength) break;

    const tag = view.getUint16(entryOffset, littleEndian);
    const type = view.getUint16(entryOffset + 2, littleEndian);
    const count = view.getUint32(entryOffset + 4, littleEndian);
    const value = readExifValue(view, tiffStart, entryOffset, type, count, littleEndian);

    if (value !== null && value !== "") {
      const tagLabel = labelMap[tag] ?? `Tag 0x${tag.toString(16).toUpperCase()}`;
      output[tagLabel] = normalizeValue(value);
    }

    // Exif IFD pointer
    if (tag === 0x8769 && typeof value === "number") {
      parseIfd(view, tiffStart, tiffStart + value, littleEndian, EXIF_TAGS, output, visited);
    }
    // GPS IFD pointer
    if (tag === 0x8825 && typeof value === "number") {
      parseIfd(view, tiffStart, tiffStart + value, littleEndian, GPS_TAGS, output, visited);
    }
  }
}

function parseExifFromJpeg(buffer: ArrayBuffer): Record<string, string> {
  const view = new DataView(buffer);
  if (view.byteLength < 4 || view.getUint16(0, false) !== 0xffd8) {
    throw new Error("Only JPEG files with EXIF are currently supported.");
  }

  let offset = 2;
  while (offset + 4 <= view.byteLength) {
    if (view.getUint8(offset) !== 0xff) {
      offset += 1;
      continue;
    }

    const marker = view.getUint8(offset + 1);
    if (marker === 0xd9 || marker === 0xda) break;
    if (offset + 4 > view.byteLength) break;

    const segmentLength = view.getUint16(offset + 2, false);
    if (segmentLength < 2) break;

    if (marker === 0xe1) {
      const exifHeader = readAscii(view, offset + 4, 6);
      if (exifHeader === "Exif") {
        const tiffStart = offset + 10;
        const endianMark = view.getUint16(tiffStart, false);
        const littleEndian = endianMark === 0x4949;
        if (!littleEndian && endianMark !== 0x4d4d) {
          throw new Error("Invalid TIFF endian marker.");
        }
        const signature = view.getUint16(tiffStart + 2, littleEndian);
        if (signature !== 0x002a) throw new Error("Invalid TIFF signature.");

        const firstIfdOffset = view.getUint32(tiffStart + 4, littleEndian);
        const output: Record<string, string> = {};
        parseIfd(view, tiffStart, tiffStart + firstIfdOffset, littleEndian, IFD0_TAGS, output, new Set());
        return output;
      }
    }

    offset += 2 + segmentLength;
  }

  throw new Error("No EXIF block found in this image.");
}

function getDimensions(file: File): Promise<string> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      resolve(`${image.width} x ${image.height}`);
      URL.revokeObjectURL(url);
    };
    image.onerror = () => {
      resolve("Unknown");
      URL.revokeObjectURL(url);
    };
    image.src = url;
  });
}

export default function ExifViewerPage() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [basicMeta, setBasicMeta] = useState<Record<string, string>>({});
  const [exifMeta, setExifMeta] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    setProcessing(true);
    setError("");
    setExifMeta({});
    setBasicMeta({});
    setPreviewUrl(URL.createObjectURL(file));

    const dimensions = await getDimensions(file);
    setBasicMeta({
      Name: file.name,
      Type: file.type || "Unknown",
      Size: formatSize(file.size),
      Dimensions: dimensions,
      "Last Modified": new Date(file.lastModified).toLocaleString(),
    });

    try {
      const buffer = await file.arrayBuffer();
      const parsed = parseExifFromJpeg(buffer);
      setExifMeta(parsed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not parse EXIF metadata.");
    } finally {
      setProcessing(false);
    }
  }, []);

  return (
    <ToolLayout
      title="EXIF Metadata Viewer"
      description="Inspect camera and EXIF metadata from JPEG photos directly in your browser."
      relatedTools={["exif-metadata-remover", "image-format-converter", "image-compressor"]}
    >
      <div
        onClick={() => fileInputRef.current?.click()}
        className="mb-4 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-8 hover:border-blue-400"
      >
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {processing ? "Reading metadata..." : "Drop JPEG photo here or click to upload"}
        </p>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Best support: JPG/JPEG files with EXIF data
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,.jpg,.jpeg"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
          }}
        />
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950 px-4 py-2 text-sm text-amber-700 dark:text-amber-300">
          {error}
        </div>
      )}

      {previewUrl && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
            <h2 className="mb-2 text-sm font-semibold text-gray-800 dark:text-gray-200">Image</h2>
            <img src={previewUrl} alt="Uploaded preview" className="max-h-96 w-full rounded object-contain" />
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
              <h2 className="mb-2 text-sm font-semibold text-gray-800 dark:text-gray-200">Basic Metadata</h2>
              <div className="space-y-1 text-sm">
                {Object.entries(basicMeta).map(([key, value]) => (
                  <p key={key} className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium text-gray-800 dark:text-gray-200">{key}:</span> {value}
                  </p>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
              <h2 className="mb-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                EXIF Tags ({Object.keys(exifMeta).length})
              </h2>
              {Object.keys(exifMeta).length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">No EXIF tags detected.</p>
              ) : (
                <div className="max-h-80 space-y-1 overflow-auto text-sm">
                  {Object.entries(exifMeta).map(([key, value]) => (
                    <p key={key} className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium text-gray-800 dark:text-gray-200">{key}:</span> {value}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-12 space-y-6 border-t border-gray-200 dark:border-gray-700 pt-8 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
        <p>
          EXIF data can include camera model, lens, shutter speed, timestamp, and sometimes GPS coordinates. This tool
          reads metadata locally in the browser without sending files to a server.
        </p>
      </div>
    </ToolLayout>
  );
}

