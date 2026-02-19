"use client";

import { useCallback, useRef, useState } from "react";
import ToolLayout from "@/components/ToolLayout";

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function floatToInt16Chunk(channel: Float32Array, start: number, end: number) {
  const out = new Int16Array(end - start);
  for (let i = start; i < end; i += 1) {
    const sample = Math.max(-1, Math.min(1, channel[i]));
    out[i - start] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
  }
  return out;
}

export default function Mp4ToMp3Page() {
  const [bitrate, setBitrate] = useState(128);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [sourceName, setSourceName] = useState("");
  const [sourceSize, setSourceSize] = useState(0);
  const [duration, setDuration] = useState(0);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const convertToMp3 = useCallback(
    async (file: File) => {
      setProcessing(true);
      setProgress(0);
      setError("");
      setResultUrl(null);
      setResultSize(0);
      setSourceName(file.name);
      setSourceSize(file.size);

      try {
        const buffer = await file.arrayBuffer();
        setProgress(10);

        const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) {
          throw new Error("Web Audio API is not supported in this browser.");
        }
        const audioContext = new AudioCtx();

        const decoded = await audioContext.decodeAudioData(buffer.slice(0));
        setDuration(decoded.duration);
        setProgress(25);

        const lameModule = await import("lamejs");
        const Mp3Encoder =
          (lameModule as unknown as { Mp3Encoder?: new (...args: number[]) => { encodeBuffer: (...args: Int16Array[]) => Int8Array; flush: () => Int8Array } }).Mp3Encoder ??
          (lameModule as unknown as { default?: { Mp3Encoder?: new (...args: number[]) => { encodeBuffer: (...args: Int16Array[]) => Int8Array; flush: () => Int8Array } } }).default?.Mp3Encoder;

        if (!Mp3Encoder) {
          throw new Error("MP3 encoder could not be loaded.");
        }

        const channels = Math.min(2, decoded.numberOfChannels);
        const leftChannel = decoded.getChannelData(0);
        const rightChannel = channels > 1 ? decoded.getChannelData(1) : null;
        const encoder = new Mp3Encoder(channels, decoded.sampleRate, bitrate);
        const blockSize = 1152;
        const chunks: Int8Array[] = [];

        for (let i = 0; i < leftChannel.length; i += blockSize) {
          const end = Math.min(i + blockSize, leftChannel.length);
          const left = floatToInt16Chunk(leftChannel, i, end);
          let encoded: Int8Array;

          if (channels === 2 && rightChannel) {
            const right = floatToInt16Chunk(rightChannel, i, end);
            encoded = encoder.encodeBuffer(left, right);
          } else {
            encoded = encoder.encodeBuffer(left);
          }

          if (encoded.length > 0) chunks.push(new Int8Array(encoded));
          setProgress(25 + Math.round(((i + blockSize) / leftChannel.length) * 70));
        }

        const flushChunk = encoder.flush();
        if (flushChunk.length > 0) chunks.push(new Int8Array(flushChunk));

        await audioContext.close();

        const mp3Blob = new Blob(chunks, { type: "audio/mpeg" });
        setResultSize(mp3Blob.size);
        setResultUrl(URL.createObjectURL(mp3Blob));
        setProgress(100);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "MP4 to MP3 conversion failed. The video codec may not be supported in this browser."
        );
      } finally {
        setProcessing(false);
      }
    },
    [bitrate]
  );

  const onFile = (file: File | null | undefined) => {
    if (!file) return;
    const isMp4 = file.type === "video/mp4" || /\.mp4$/i.test(file.name);
    if (!isMp4) {
      setError("Please select an MP4 file.");
      return;
    }
    void convertToMp3(file);
  };

  const download = () => {
    if (!resultUrl) return;
    const link = document.createElement("a");
    link.download = sourceName.replace(/\.mp4$/i, "") + ".mp3";
    link.href = resultUrl;
    link.click();
  };

  return (
    <ToolLayout
      title="MP4 to MP3 Converter"
      description="Extract audio from MP4 files and export MP3 directly in your browser. No uploads and no tracking."
      relatedTools={["video-compressor", "video-to-gif", "gif-maker"]}
    >
      <div className="mb-4 rounded-lg border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950 px-4 py-3 text-sm text-green-700 dark:text-green-300">
        Privacy mode: conversion runs locally in your browser.
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">MP3 Bitrate</label>
        <select
          value={bitrate}
          onChange={(e) => setBitrate(Number(e.target.value))}
          className="w-full max-w-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
        >
          <option value={96}>96 kbps</option>
          <option value={128}>128 kbps</option>
          <option value={160}>160 kbps</option>
          <option value={192}>192 kbps</option>
          <option value={256}>256 kbps</option>
          <option value={320}>320 kbps</option>
        </select>
      </div>

      <div
        onDrop={(e) => {
          e.preventDefault();
          onFile(e.dataTransfer.files?.[0]);
        }}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileInputRef.current?.click()}
        className="mb-4 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-8 hover:border-blue-400"
      >
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {processing ? "Converting to MP3..." : "Drop MP4 file here or click to upload"}
        </p>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Single file conversion</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,.mp4"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
      </div>

      {processing && (
        <div className="mb-4 rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950 px-4 py-3">
          <div className="mb-2 flex items-center justify-between text-sm text-blue-700 dark:text-blue-300">
            <span>Encoding audio</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-blue-200 dark:bg-blue-800">
            <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950 px-4 py-2 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {sourceName && (
        <div className="mb-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 text-sm text-gray-600 dark:text-gray-400">
          <p>
            <span className="font-medium text-gray-800 dark:text-gray-200">Source:</span> {sourceName}
          </p>
          <p>
            <span className="font-medium text-gray-800 dark:text-gray-200">Size:</span> {formatSize(sourceSize)}
          </p>
          {duration > 0 && (
            <p>
              <span className="font-medium text-gray-800 dark:text-gray-200">Duration:</span> {duration.toFixed(2)}s
            </p>
          )}
        </div>
      )}

      {resultUrl && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
          <audio controls src={resultUrl} className="mb-3 w-full" />
          <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
            Output MP3 size: <span className="font-medium">{formatSize(resultSize)}</span>
          </p>
          <button
            onClick={download}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Download MP3
          </button>
        </div>
      )}
    </ToolLayout>
  );
}
