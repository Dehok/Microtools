"use client";

import { useRef, useState } from "react";
import ToolLayout from "@/components/ToolLayout";

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function VideoCompressorPage() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [sourceName, setSourceName] = useState("");
  const [sourceSize, setSourceSize] = useState(0);
  const [sourceResolution, setSourceResolution] = useState("");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState(0);

  const [targetWidth, setTargetWidth] = useState(1280);
  const [targetBitrate, setTargetBitrate] = useState(1200);
  const [targetFps, setTargetFps] = useState(24);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const onFile = (file: File | null | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      setError("Please upload a video file.");
      return;
    }
    setError("");
    setResultUrl(null);
    setResultSize(0);
    setSourceName(file.name);
    setSourceSize(file.size);
    setVideoUrl(URL.createObjectURL(file));
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    setSourceResolution(`${video.videoWidth} x ${video.videoHeight}`);
    if (targetWidth > video.videoWidth) {
      setTargetWidth(video.videoWidth);
    }
  };

  const compress = async () => {
    const video = videoRef.current;
    if (!video || !videoUrl) return;

    setProcessing(true);
    setProgress(0);
    setError("");
    setResultUrl(null);
    setResultSize(0);

    try {
      if (!window.MediaRecorder) {
        throw new Error("MediaRecorder is not supported in this browser.");
      }

      const sourceWidth = video.videoWidth;
      const sourceHeight = video.videoHeight;
      if (!sourceWidth || !sourceHeight) {
        throw new Error("Video metadata is not loaded yet.");
      }

      const width = Math.max(160, Math.min(targetWidth, sourceWidth));
      const height = Math.max(90, Math.round((sourceHeight * width) / sourceWidth));

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Canvas is not supported in this browser.");
      }

      const stream = canvas.captureStream(targetFps);
      const mimeCandidates = ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"];
      const mimeType = mimeCandidates.find((item) => MediaRecorder.isTypeSupported(item)) ?? "";
      const recorder = new MediaRecorder(stream, {
        ...(mimeType ? { mimeType } : {}),
        videoBitsPerSecond: targetBitrate * 1000,
      });

      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };

      const done = new Promise<Blob>((resolve) => {
        recorder.onstop = () => resolve(new Blob(chunks, { type: "video/webm" }));
      });

      let rafId = 0;
      const draw = () => {
        if (!video.paused && !video.ended) {
          ctx.drawImage(video, 0, 0, width, height);
          if (video.duration > 0) {
            setProgress(Math.min(99, Math.round((video.currentTime / video.duration) * 100)));
          }
          rafId = requestAnimationFrame(draw);
        }
      };

      video.currentTime = 0;
      video.muted = true;
      await video.play();
      recorder.start(250);
      draw();

      await new Promise<void>((resolve, reject) => {
        video.onended = () => resolve();
        video.onerror = () => reject(new Error("Video playback failed during compression."));
      });

      if (rafId) cancelAnimationFrame(rafId);
      recorder.stop();
      const compressedBlob = await done;
      setResultSize(compressedBlob.size);
      setResultUrl(URL.createObjectURL(compressedBlob));
      setProgress(100);
      video.pause();
      video.currentTime = 0;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Video compression failed.");
    } finally {
      setProcessing(false);
    }
  };

  const download = () => {
    if (!resultUrl) return;
    const link = document.createElement("a");
    link.download = sourceName.replace(/\.[^.]+$/, "") + "-compressed.webm";
    link.href = resultUrl;
    link.click();
  };

  return (
    <ToolLayout
      title="Video Compressor"
      description="Compress videos in your browser by reducing resolution and bitrate. No upload to server."
      relatedTools={["mp4-to-mp3", "video-to-gif", "gif-maker"]}
    >
      <div className="mb-4 rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
        Current browser implementation exports compressed WebM output.
      </div>

      {!videoUrl && (
        <div
          onDrop={(e) => {
            e.preventDefault();
            onFile(e.dataTransfer.files?.[0]);
          }}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className="mb-4 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-8 hover:border-blue-400"
        >
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Drop video file here or click to upload</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">MP4, MOV, WebM and other browser-supported formats</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
        </div>
      )}

      {videoUrl && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <video
              ref={videoRef}
              src={videoUrl}
              controls
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700"
              onLoadedMetadata={handleLoadedMetadata}
            />
            <div className="mt-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 text-sm text-gray-600 dark:text-gray-400">
              <p>
                <span className="font-medium text-gray-800 dark:text-gray-200">Source:</span> {sourceName}
              </p>
              <p>
                <span className="font-medium text-gray-800 dark:text-gray-200">Size:</span> {formatSize(sourceSize)}
              </p>
              {sourceResolution && (
                <p>
                  <span className="font-medium text-gray-800 dark:text-gray-200">Resolution:</span> {sourceResolution}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Target width (px)</label>
              <input
                type="number"
                min={160}
                value={targetWidth}
                onChange={(e) => setTargetWidth(Math.max(160, Number(e.target.value) || 160))}
                className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                Target bitrate (kbps)
              </label>
              <input
                type="number"
                min={200}
                value={targetBitrate}
                onChange={(e) => setTargetBitrate(Math.max(200, Number(e.target.value) || 200))}
                className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Target FPS</label>
              <input
                type="number"
                min={10}
                max={60}
                value={targetFps}
                onChange={(e) => setTargetFps(Math.max(10, Math.min(60, Number(e.target.value) || 24)))}
                className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1 text-sm"
              />
            </div>

            <button
              onClick={() => void compress()}
              disabled={processing}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {processing ? `Compressing... ${progress}%` : "Compress Video"}
            </button>
            <button
              onClick={() => {
                setVideoUrl(null);
                setResultUrl(null);
                setSourceName("");
                setSourceSize(0);
                setSourceResolution("");
                setProgress(0);
                setError("");
              }}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Choose Another File
            </button>

            {processing && (
              <div className="rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950 px-3 py-2 text-xs text-blue-700 dark:text-blue-300">
                Compression in progress: {progress}%
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950 px-4 py-2 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {resultUrl && (
        <div className="mt-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
          <video src={resultUrl} controls className="mb-3 w-full rounded-lg border border-gray-200 dark:border-gray-700" />
          <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
            Compressed size: <span className="font-medium">{formatSize(resultSize)}</span>
          </p>
          <button
            onClick={download}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Download Compressed Video
          </button>
        </div>
      )}

      <div className="mt-12 space-y-6 border-t border-gray-200 dark:border-gray-700 pt-8 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
        <p>
          Compress videos locally by lowering resolution, frame rate, and bitrate. This helps reduce file size for
          sharing, uploads, and storage while keeping your original media private on your device.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Why is the output format WebM?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              WebM is the most reliable browser-side encoding path without server processing or heavy native binaries.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              What settings reduce size the most?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Lower bitrate has the biggest impact, then lower resolution, then lower FPS.
            </p>
          </details>
        </div>
      </div>
    </ToolLayout>
  );
}
