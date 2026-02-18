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
      color: "text-blue-600",
      bg: "bg-blue-50 border-blue-200",
    },
    {
      label: "Speaking Time",
      value: formatTime(stats.speakingSeconds),
      color: "text-purple-600",
      bg: "bg-purple-50 border-purple-200",
    },
    {
      label: "Words",
      value: stats.wordCount.toLocaleString(),
      color: "text-green-600",
      bg: "bg-green-50 border-green-200",
    },
    {
      label: "Characters",
      value: stats.charCount.toLocaleString(),
      color: "text-yellow-600",
      bg: "bg-yellow-50 border-yellow-200",
    },
    {
      label: "Chars (no spaces)",
      value: stats.charCountNoSpaces.toLocaleString(),
      color: "text-orange-600",
      bg: "bg-orange-50 border-orange-200",
    },
    {
      label: "Sentences",
      value: stats.sentenceCount.toLocaleString(),
      color: "text-red-600",
      bg: "bg-red-50 border-red-200",
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
            <div className="mt-0.5 text-xs text-gray-500">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Speed Sliders */}
      <div className="mb-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 flex items-center justify-between text-sm font-medium text-gray-700">
            <span>Reading Speed</span>
            <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
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
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-600"
          />
          <div className="mt-1 flex justify-between text-xs text-gray-400">
            <span>100</span>
            <span>400 WPM</span>
          </div>
        </div>

        <div>
          <label className="mb-1 flex items-center justify-between text-sm font-medium text-gray-700">
            <span>Speaking Speed</span>
            <span className="rounded bg-purple-100 px-2 py-0.5 text-xs font-semibold text-purple-700">
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
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-purple-600"
          />
          <div className="mt-1 flex justify-between text-xs text-gray-400">
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
        className="h-64 w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />

      {/* Actions */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          onClick={() => setText("")}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 active:bg-gray-100"
        >
          Clear
        </button>
        {summaryText && <CopyButton text={summaryText} />}
        {summaryText && (
          <span className="text-xs text-gray-400">
            Copy copies a summary of the stats
          </span>
        )}
      </div>

      {/* SEO Content */}
      <div className="mt-8 border-t border-gray-200 pt-6 text-sm text-gray-600">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          Free Online Reading Time Calculator
        </h2>
        <p className="mb-3">
          This reading time calculator instantly estimates how long it takes to
          read or speak any piece of text. Simply paste your content into the
          text area and the tool calculates reading time and speaking time in
          real time, along with a full breakdown of word count, character count
          (with and without spaces), sentence count, paragraph count, and
          average word length.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          How is reading time calculated?
        </h2>
        <p className="mb-3">
          Reading time is calculated by dividing the total word count by your
          chosen reading speed in words per minute (WPM). The average adult
          reads at around 200–250 WPM for general text. Use the slider to
          adjust between 100 WPM (slow / careful reading) and 400 WPM (fast /
          speed reading) to match your audience or use case.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          Who is this tool for?
        </h2>
        <p>
          Bloggers and content writers use it to estimate article reading time
          before publishing. Presenters and speakers use the speaking time
          estimate to rehearse talks and match a time slot. Teachers use it to
          gauge how long reading assignments will take. Podcasters and
          voice-over artists use it to script episodes to a target length.
          Anyone writing for Medium, LinkedIn, or newsletters can use it to
          optimize content length for reader engagement.
        </p>
      </div>
    </ToolLayout>
  );
}
