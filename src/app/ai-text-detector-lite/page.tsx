"use client";

import { useMemo, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface AnalysisMetrics {
  wordCount: number;
  sentenceCount: number;
  avgSentenceLength: number;
  burstiness: number;
  lexicalDiversity: number;
  repetitionRatio: number;
  transitionHits: number;
  contractionRatio: number;
  punctuationVariety: number;
}

const SAMPLE_TEXT = `Artificial intelligence is rapidly changing how people write and revise content.
In many cases, the text is clean and grammatically correct, but the sentence rhythm can feel very even.
This tool estimates AI-likeness by checking writing patterns such as burstiness, repetition, and transition phrases.
It does not provide proof of authorship, but it can flag stylistic signals that deserve a closer review.`;

const TRANSITION_PHRASES = [
  "moreover",
  "furthermore",
  "in conclusion",
  "overall",
  "in summary",
  "additionally",
  "it is important to note",
  "on the other hand",
  "in today's",
  "as an ai",
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function stdDev(values: number[]) {
  if (values.length < 2) return 0;
  const avg = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance = values.reduce((sum, value) => sum + (value - avg) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

function analyzeText(input: string) {
  const normalized = input.replace(/\s+/g, " ").trim();
  if (!normalized) {
    return {
      score: 0,
      label: "No input",
      metrics: {
        wordCount: 0,
        sentenceCount: 0,
        avgSentenceLength: 0,
        burstiness: 0,
        lexicalDiversity: 0,
        repetitionRatio: 0,
        transitionHits: 0,
        contractionRatio: 0,
        punctuationVariety: 0,
      } as AnalysisMetrics,
      notes: ["Paste at least a short paragraph to run analysis."],
    };
  }

  const words = normalized.match(/[A-Za-z0-9']+/g) ?? [];
  const sentences = normalized.split(/(?<=[.!?])\s+/).filter((value) => value.trim().length > 0);
  const safeSentenceCount = Math.max(1, sentences.length);

  const sentenceWordLengths = sentences.map((sentence) => {
    const sentenceWords = sentence.match(/[A-Za-z0-9']+/g) ?? [];
    return sentenceWords.length;
  });

  const wordCount = words.length;
  const lowerWords = words.map((word) => word.toLowerCase());
  const uniqueWords = new Set(lowerWords);
  const lexicalDiversity = wordCount ? uniqueWords.size / wordCount : 0;
  const avgSentenceLength = wordCount ? wordCount / safeSentenceCount : 0;
  const burstiness = stdDev(sentenceWordLengths);

  const frequency = new Map<string, number>();
  for (const word of lowerWords) {
    frequency.set(word, (frequency.get(word) ?? 0) + 1);
  }
  const topFrequency = Math.max(0, ...frequency.values());
  const repetitionRatio = wordCount ? topFrequency / wordCount : 0;

  const lowerText = normalized.toLowerCase();
  const transitionHits = TRANSITION_PHRASES.reduce((sum, phrase) => {
    return sum + (lowerText.includes(phrase) ? 1 : 0);
  }, 0);

  const contractions = (normalized.match(/\b\w+'\w+\b/g) ?? []).length;
  const contractionRatio = wordCount ? contractions / wordCount : 0;

  const punctuationMarks = normalized.match(/[,:;!?-]/g) ?? [];
  const punctuationVariety = new Set(punctuationMarks).size;

  let score = 50;
  if (wordCount < 80) score -= 8;
  if (burstiness < 5) score += 16;
  else if (burstiness > 12) score -= 12;
  if (lexicalDiversity < 0.35) score += 14;
  else if (lexicalDiversity > 0.55) score -= 10;
  if (repetitionRatio > 0.06) score += 12;
  if (transitionHits >= 2) score += 12;
  else if (transitionHits === 0) score -= 3;
  if (avgSentenceLength > 24 && burstiness < 8) score += 7;
  if (contractionRatio > 0.03) score -= 8;
  if (punctuationVariety <= 1) score += 6;

  score = clamp(Math.round(score), 1, 99);

  const notes: string[] = [];
  if (burstiness < 5) notes.push("Very even sentence lengths can indicate machine-generated rhythm.");
  if (transitionHits >= 2) notes.push("Multiple template transition phrases were detected.");
  if (repetitionRatio > 0.06) notes.push("High token repetition was detected.");
  if (contractionRatio > 0.03) notes.push("Natural contractions lower AI-likeness score.");
  if (notes.length === 0) notes.push("No strong single signal; score is based on combined weak indicators.");

  const label = score < 35 ? "Likely human-style" : score < 65 ? "Mixed signals" : "Likely AI-style";

  return {
    score,
    label,
    metrics: {
      wordCount,
      sentenceCount: safeSentenceCount,
      avgSentenceLength,
      burstiness,
      lexicalDiversity,
      repetitionRatio,
      transitionHits,
      contractionRatio,
      punctuationVariety,
    } as AnalysisMetrics,
    notes,
  };
}

export default function AiTextDetectorLitePage() {
  const [input, setInput] = useState("");
  const analysis = useMemo(() => analyzeText(input), [input]);

  const reportText = useMemo(
    () =>
      [
        `AI Text Detector (Lite)`,
        `Score: ${analysis.score}/99 (${analysis.label})`,
        `Words: ${analysis.metrics.wordCount}`,
        `Sentences: ${analysis.metrics.sentenceCount}`,
        `Avg sentence length: ${analysis.metrics.avgSentenceLength.toFixed(2)}`,
        `Burstiness (std dev): ${analysis.metrics.burstiness.toFixed(2)}`,
        `Lexical diversity: ${analysis.metrics.lexicalDiversity.toFixed(3)}`,
        `Repetition ratio: ${analysis.metrics.repetitionRatio.toFixed(3)}`,
        `Transition phrase hits: ${analysis.metrics.transitionHits}`,
        `Contraction ratio: ${analysis.metrics.contractionRatio.toFixed(3)}`,
        `Punctuation variety: ${analysis.metrics.punctuationVariety}`,
        "",
        "Notes:",
        ...analysis.notes.map((note) => `- ${note}`),
      ].join("\n"),
    [analysis]
  );

  return (
    <ToolLayout
      title="AI Text Detector (Lite)"
      description="Estimate AI-likeness with local stylometric heuristics. No server calls and no stored text."
      relatedTools={["token-counter", "ai-prompt-generator", "prompt-security-scanner"]}
    >
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          onClick={() => setInput(SAMPLE_TEXT)}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Load sample
        </button>
        <button
          onClick={() => setInput("")}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Clear
        </button>
        <CopyButton text={reportText} />
      </div>

      <textarea
        value={input}
        onChange={(event) => setInput(event.target.value)}
        rows={10}
        placeholder="Paste text to estimate AI-likeness..."
        className="mb-4 w-full rounded-lg border border-gray-300 bg-white p-3 text-sm dark:border-gray-600 dark:bg-gray-900"
      />

      <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
        <p className="text-xs uppercase tracking-wide text-blue-700 dark:text-blue-300">Heuristic score</p>
        <p className="mt-1 text-2xl font-bold text-blue-800 dark:text-blue-200">
          {analysis.score}/99 <span className="text-base font-medium">({analysis.label})</span>
        </p>
        <p className="mt-1 text-xs text-blue-700 dark:text-blue-300">
          This is a style estimate, not proof of authorship.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard label="Word Count" value={analysis.metrics.wordCount} />
        <MetricCard label="Sentence Count" value={analysis.metrics.sentenceCount} />
        <MetricCard label="Avg Sentence Length" value={analysis.metrics.avgSentenceLength.toFixed(2)} />
        <MetricCard label="Burstiness (Std Dev)" value={analysis.metrics.burstiness.toFixed(2)} />
        <MetricCard label="Lexical Diversity" value={analysis.metrics.lexicalDiversity.toFixed(3)} />
        <MetricCard label="Repetition Ratio" value={analysis.metrics.repetitionRatio.toFixed(3)} />
        <MetricCard label="Transition Hits" value={analysis.metrics.transitionHits} />
        <MetricCard label="Contraction Ratio" value={analysis.metrics.contractionRatio.toFixed(3)} />
        <MetricCard label="Punctuation Variety" value={analysis.metrics.punctuationVariety} />
      </div>

      <div className="mt-4 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
        <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Signal notes</p>
        <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600 dark:text-gray-400">
          {analysis.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </div>

      <div className="mt-12 space-y-6 border-t border-gray-200 pt-8 text-sm leading-relaxed text-gray-600 dark:border-gray-700 dark:text-gray-400">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
        <p>
          AI Text Detector (Lite) analyzes writing style patterns such as burstiness, repetition, and phrase usage.
          It runs fully in-browser and is intended for quick screening, not final judgment.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is this detector accurate enough for high-stakes decisions?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. Use it as a triage signal only. Combine with human review, context, and provenance evidence.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Does the tool call AI models?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. It uses local heuristics and does not send text to any external service.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Can humans be flagged as AI-style?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes. Structured or edited human writing can look machine-like, and AI text can be edited to look human.
            </p>
          </details>
        </div>
      </div>
    </ToolLayout>
  );
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{value}</p>
    </div>
  );
}
