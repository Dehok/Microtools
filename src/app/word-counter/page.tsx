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
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The Word Counter is a free online text analysis tool that counts words, characters, sentences, and paragraphs in any text. It is essential for writers, students, and content creators who need to meet word count requirements for essays, blog posts, social media captions, or SEO content.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Word Count</strong> — Accurately counts words by splitting text on whitespace while handling multiple spaces and line breaks.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Character Count</strong> — Counts total characters including spaces, and characters without spaces for precise length tracking.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Sentence Count</strong> — Detects sentence boundaries using punctuation marks (periods, question marks, exclamation points).
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Paragraph Count</strong> — Counts paragraphs separated by blank lines for document structure analysis.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Checking word count for essays, assignments, and academic papers</li>
          <li>Monitoring character limits for social media posts (Twitter, Instagram, LinkedIn)</li>
          <li>Ensuring SEO content meets recommended word count targets</li>
          <li>Tracking writing progress for blog posts, articles, and books</li>
          <li>Analyzing text statistics for readability and content optimization</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Paste or type your text into the input area. All statistics (words, characters, sentences, paragraphs) are calculated instantly in real time. The counts update automatically as you edit the text.
        </p>
      </div>
    </ToolLayout>
  );
}
