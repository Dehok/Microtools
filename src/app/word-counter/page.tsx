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
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
        <p>The Word Counter tool provides real-time character, word, sentence, and paragraph counts as you type or paste text. It is designed for writers, bloggers, students, and content marketers who need to meet specific length requirements for articles, social media posts, academic papers, and SEO content.</p>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Key Features</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong className="text-gray-700 dark:text-gray-300">Real-Time Counting</strong> &mdash; Characters, words, sentences, and paragraphs update instantly as you type or paste text, with no button press required.</li>
          <li><strong className="text-gray-700 dark:text-gray-300">Reading Time Estimate</strong> &mdash; Calculates the estimated reading time based on the average adult reading speed of 200 words per minute.</li>
          <li><strong className="text-gray-700 dark:text-gray-300">Character Count With &amp; Without Spaces</strong> &mdash; Displays both character counts so you can meet platform limits that count differently, like Twitter or SMS.</li>
          <li><strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> &mdash; All text analysis runs locally in your browser. Your content never leaves your device.</li>
          <li><strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> &mdash; Use this tool as many times as you need without creating an account or paying anything.</li>
        </ul>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Common Use Cases</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Checking blog posts and articles meet the 300&ndash;1500 word minimum recommended for SEO indexing</li>
          <li>Ensuring academic essays and dissertations hit the required word count set by the institution</li>
          <li>Verifying social media captions and bio text fit within platform character limits</li>
          <li>Estimating how long a speech or presentation will take to deliver by reading time</li>
          <li>Tracking progress toward daily writing goals in journaling or NaNoWriMo challenges</li>
        </ul>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">How to Use</h2>
        <p>Paste or type your text into the input area. All counts&mdash;characters, words, sentences, and paragraphs&mdash;update in real time as you type. No button press is needed. The reading time estimate appears automatically based on your word count.</p>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">How does the tool count words?</summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">Words are counted by splitting text on whitespace and punctuation boundaries. Hyphenated words like &quot;well-known&quot; count as one word. Sequences of digits also count as words.</p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">How is reading time calculated?</summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">Reading time is based on the average adult silent reading speed of 200 words per minute. A 1000-word article takes about 5 minutes. Adjust for your audience; technical content is typically read more slowly.</p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">What is the ideal word count for an SEO article?</summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">There is no single ideal length, but articles between 1500 and 2500 words tend to rank well for competitive keywords. Google rewards depth and relevance over raw word count.</p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">How many characters does Twitter allow?</summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">Twitter allows up to 280 characters per tweet. Links count as 23 characters regardless of their actual length. Use the character count to stay within the limit.</p>
          </details>
        </div>
      </div>
    </ToolLayout>
  );
}
