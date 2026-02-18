"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function ReadingTimeCalculator() {
  const [text, setText] = useState("");
  const [readingWpm, setReadingWpm] = useState(200);
  const [speakingWpm, setSpeakingWpm] = useState(130);

  const stats = useMemo(() => {
    const trimmed = text.trim();
    if (!trimmed) {
      return {
        wordCount: 0,
        charCount: 0,
        charCountNoSpaces: 0,
        sentenceCount: 0,
        paragraphCount: 0,
        avgWordLength: 0,
        readingSeconds: 0,
        speakingSeconds: 0,
      };
    }

    const words = trimmed.split(/\s+/);
    const wordCount = words.length;
    const charCount = text.length;
    const charCountNoSpaces = text.replace(/\s/g, "").length;
    const sentenceCount = text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
    const paragraphCount = text.split(/\n\n+/).filter((p) => p.trim().length > 0).length || 1;
    const totalWordChars = words.reduce((sum, w) => sum + w.replace(/[^a-zA-Z0-9]/g, "").length, 0);
    const avgWordLength = wordCount > 0 ? totalWordChars / wordCount : 0;
    const readingSeconds = (wordCount / readingWpm) * 60;
    const speakingSeconds = (wordCount / speakingWpm) * 60;

    return {
      wordCount,
      charCount,
      charCountNoSpaces,
      sentenceCount,
      paragraphCount,
      avgWordLength,
      readingSeconds,
      speakingSeconds,
    };
  }, [text, readingWpm, speakingWpm]);

  const summaryText = text.trim()
    ? `Words: ${stats.wordCount} | Characters: ${stats.charCount} | Reading time: ${formatTime(stats.readingSeconds)} | Speaking time: ${formatTime(stats.speakingSeconds)}`
    : "";

  const statCards = [
    {
      label: "Reading Time",
      value: formatTime(stats.readingSeconds),
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800",
    },
    {
      label: "Speaking Time",
      value: formatTime(stats.speakingSeconds),
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-950 border-purple-200",
    },
    {
      label: "Words",
      value: stats.wordCount.toLocaleString(),
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800",
    },
    {
      label: "Characters",
      value: stats.charCount.toLocaleString(),
      color: "text-yellow-600 dark:text-yellow-400",
      bg: "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800",
    },
    {
      label: "Chars (no spaces)",
      value: stats.charCountNoSpaces.toLocaleString(),
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-50 dark:bg-orange-950 border-orange-200",
    },
    {
      label: "Sentences",
      value: stats.sentenceCount.toLocaleString(),
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800",
    },
    {
      label: "Paragraphs",
      value: stats.paragraphCount.toLocaleString(),
      color: "text-indigo-600",
      bg: "bg-indigo-50 border-indigo-200",
    },
    {
      label: "Avg Word Length",
      value: stats.wordCount > 0 ? `${stats.avgWordLength.toFixed(1)} ch` : "—",
      color: "text-teal-600",
      bg: "bg-teal-50 border-teal-200",
    },
  ];

  return (
    <ToolLayout
      title="Reading Time Calculator"
      description="Calculate reading and speaking time for any text. Adjust WPM speed and get detailed stats including word count, character count, sentences, and paragraphs."
      relatedTools={["word-counter", "byte-counter", "lorem-ipsum-generator"]}
    >
      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`rounded-lg border p-3 text-center ${card.bg}`}
          >
            <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
            <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Speed Sliders */}
      <div className="mb-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
            <span>Reading Speed</span>
            <span className="rounded bg-blue-100 dark:bg-blue-900 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-300">
              {readingWpm} WPM
            </span>
          </label>
          <input
            type="range"
            min={100}
            max={400}
            step={10}
            value={readingWpm}
            onChange={(e) => setReadingWpm(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700 accent-blue-600"
          />
          <div className="mt-1 flex justify-between text-xs text-gray-400 dark:text-gray-500">
            <span>100</span>
            <span>400 WPM</span>
          </div>
        </div>

        <div>
          <label className="mb-1 flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
            <span>Speaking Speed</span>
            <span className="rounded bg-purple-100 dark:bg-purple-900 px-2 py-0.5 text-xs font-semibold text-purple-700 dark:text-purple-300">
              {speakingWpm} WPM
            </span>
          </label>
          <input
            type="range"
            min={100}
            max={200}
            step={5}
            value={speakingWpm}
            onChange={(e) => setSpeakingWpm(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700 accent-purple-600"
          />
          <div className="mt-1 flex justify-between text-xs text-gray-400 dark:text-gray-500">
            <span>100</span>
            <span>200 WPM</span>
          </div>
        </div>
      </div>

      {/* Textarea */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste or type your text here to calculate reading and speaking time..."
        className="h-64 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-4 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />

      {/* Actions */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          onClick={() => setText("")}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800 active:bg-gray-100 dark:bg-gray-800 dark:active:bg-gray-800"
        >
          Clear
        </button>
        {summaryText && <CopyButton text={summaryText} />}
        {summaryText && (
          <span className="text-xs text-gray-400 dark:text-gray-500">
            Copy copies a summary of the stats
          </span>
        )}
      </div>

      
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The Reading Time Calculator is a free online tool available on CodeUtilo. Estimate reading time and speaking time for any text. Word and character stats included. All processing happens directly in your browser — no data is ever sent to any server, ensuring your privacy and security. No signup or installation is required.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> — All reading time calculator operations run locally in your browser using JavaScript. Your data never leaves your device.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Instant Results</strong> — Get results immediately as you type or paste your input. No waiting for server responses or page reloads.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> — Use the reading time calculator as many times as you need without creating an account or paying anything.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Mobile Friendly</strong> — Works on desktop, tablet, and mobile browsers. Access this tool from any device with an internet connection.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Using the reading time calculator for day-to-day development tasks</li>
          <li>Saving time on repetitive tasks by using a browser-based tool instead of writing custom code</li>
          <li>Working on projects where installing software is not an option (school, work, shared computers)</li>
          <li>Quick prototyping and debugging without switching to a terminal or IDE</li>
          <li>Sharing the tool link with colleagues who need the same functionality</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Enter your input in the text area provided and the reading time calculator will process it instantly. Use the Copy button to copy the result to your clipboard. All operations are performed locally in your browser — no data is transmitted to any server.
        </p>
      
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Is the Reading Time Calculator free to use?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes, the Reading Time Calculator is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Is my data safe when using this tool?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Does this tool work on mobile devices?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes. The Reading Time Calculator is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Do I need to install anything?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. The Reading Time Calculator runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately.
            </p>
          </details>
        </div>
</div>
    </ToolLayout>
  );
}
