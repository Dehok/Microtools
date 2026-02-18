"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function WordCounter() {
  const [text, setText] = useState("");

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;
  const sentences = text.trim()
    ? text.split(/[.!?]+/).filter((s) => s.trim()).length
    : 0;
  const paragraphs = text.trim()
    ? text.split(/\n\n+/).filter((p) => p.trim()).length
    : 0;
  const readingTime = Math.ceil(words / 200);
  const speakingTime = Math.ceil(words / 130);

  return (
    <ToolLayout
      title="Word Counter & Character Counter Online"
      description="Count words, characters, sentences, and paragraphs in any text. Includes reading and speaking time estimates."
      relatedTools={["lorem-ipsum-generator", "base64-encode-decode", "json-formatter"]}
    >
      {/* Stats */}
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {[
          { label: "Words", value: words },
          { label: "Characters", value: characters },
          { label: "No Spaces", value: charactersNoSpaces },
          { label: "Sentences", value: sentences },
          { label: "Paragraphs", value: paragraphs },
          { label: "Reading", value: `${readingTime} min` },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 p-3 text-center"
          >
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stat.value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Textarea */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Start typing or paste your text here..."
        className="h-64 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-4 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
      />

      {/* Extra info */}
      <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
        <span>Speaking time: ~{speakingTime} min</span>
        <span>Avg word length: {words > 0 ? (charactersNoSpaces / words).toFixed(1) : 0} chars</span>
      </div>

      {/* Clear */}
      <div className="mt-4">
        <button
          onClick={() => setText("")}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
        >
          Clear
        </button>
      </div>

      {/* SEO Content */}
      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
          Free Online Word Counter
        </h2>
        <p className="mb-3">
          This word counter tool instantly counts words, characters (with and
          without spaces), sentences, and paragraphs in any text you type or
          paste. It also estimates reading time (based on 200 words per minute)
          and speaking time (based on 130 words per minute).
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
          Who uses a word counter?
        </h2>
        <p>
          Students checking essay length, writers tracking word count goals,
          social media managers verifying character limits, SEO professionals
          optimizing meta descriptions, and content creators ensuring their
          articles meet publishing requirements.
        </p>
      </div>
    </ToolLayout>
  );
}
