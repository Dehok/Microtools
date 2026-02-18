"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function RandomNumberGenerator() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(1);
  const [allowDuplicates, setAllowDuplicates] = useState(true);
  const [sortResults, setSortResults] = useState(false);
  const [results, setResults] = useState<number[]>([]);

  const generate = useCallback(() => {
    const lo = Math.min(min, max);
    const hi = Math.max(min, max);
    const range = hi - lo + 1;
    const n = Math.min(count, 1000);

    if (!allowDuplicates && n > range) {
      setResults([]);
      return;
    }

    let nums: number[];
    if (allowDuplicates) {
      nums = Array.from({ length: n }, () => Math.floor(Math.random() * range) + lo);
    } else {
      const pool = Array.from({ length: range }, (_, i) => i + lo);
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      nums = pool.slice(0, n);
    }

    if (sortResults) nums.sort((a, b) => a - b);
    setResults(nums);
  }, [min, max, count, allowDuplicates, sortResults]);

  const resultText = results.join(", ");

  return (
    <ToolLayout
      title="Random Number Generator Online"
      description="Generate random numbers within a range. Support for multiple numbers, no duplicates, and sorting. Free online tool."
      relatedTools={["uuid-generator", "password-generator", "number-base-converter"]}
    >
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Min</label>
          <input
            type="number"
            value={min}
            onChange={(e) => setMin(parseInt(e.target.value) || 0)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-2 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Max</label>
          <input
            type="number"
            value={max}
            onChange={(e) => setMax(parseInt(e.target.value) || 0)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-2 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Count</label>
          <input
            type="number"
            min="1"
            max="1000"
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(1000, parseInt(e.target.value) || 1)))}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-2 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
          />
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
        <label className="flex items-center gap-1.5">
          <input
            type="checkbox"
            checked={allowDuplicates}
            onChange={(e) => setAllowDuplicates(e.target.checked)}
            className="rounded border-gray-300 dark:border-gray-600"
          />
          Allow duplicates
        </label>
        <label className="flex items-center gap-1.5">
          <input
            type="checkbox"
            checked={sortResults}
            onChange={(e) => setSortResults(e.target.checked)}
            className="rounded border-gray-300 dark:border-gray-600"
          />
          Sort results
        </label>
      </div>

      <button
        onClick={generate}
        className="mb-6 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        Generate
      </button>

      {/* Single number display */}
      {results.length === 1 && (
        <div className="mb-4 flex items-center justify-center rounded-lg border border-blue-100 bg-blue-50 dark:bg-blue-950 p-8">
          <span className="text-6xl font-bold text-blue-800 dark:text-blue-200">{results[0]}</span>
        </div>
      )}

      {/* Multiple numbers */}
      {results.length > 1 && (
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Results ({results.length} numbers)
            </label>
            <CopyButton text={resultText} />
          </div>
          <div className="mt-1 flex flex-wrap gap-2">
            {results.slice(0, 200).map((n, i) => (
              <span
                key={i}
                className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 px-3 py-1.5 font-mono text-sm font-medium"
              >
                {n}
              </span>
            ))}
          </div>
          {results.length > 200 && (
            <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">Showing first 200 of {results.length}</div>
          )}
        </div>
      )}

      {!allowDuplicates && count > (Math.max(min, max) - Math.min(min, max) + 1) && (
        <div className="mb-4 rounded-lg border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950 px-4 py-2 text-sm text-yellow-700 dark:text-yellow-300">
          Cannot generate {count} unique numbers from a range of {Math.max(min, max) - Math.min(min, max) + 1}.
        </div>
      )}

      {/* Quick presets */}
      <div className="mb-4">
        <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">Quick Presets</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Coin flip (0-1)", min: 0, max: 1, count: 1 },
            { label: "Dice (1-6)", min: 1, max: 6, count: 1 },
            { label: "1-10", min: 1, max: 10, count: 1 },
            { label: "1-100", min: 1, max: 100, count: 1 },
            { label: "Lottery (1-49, 6x)", min: 1, max: 49, count: 6 },
            { label: "PIN (0-9, 4x)", min: 0, max: 9, count: 4 },
          ].map((p) => (
            <button
              key={p.label}
              onClick={() => { setMin(p.min); setMax(p.max); setCount(p.count); setAllowDuplicates(p.label !== "Lottery (1-49, 6x)"); }}
              className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">How Random Numbers Are Generated</h2>
        <p className="mb-3">
          This tool uses JavaScript&apos;s Math.random() to generate pseudo-random numbers within
          your specified range. Each number has an equal probability of being selected. For
          cryptographic purposes, use a dedicated CSPRNG.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Use Cases</h2>
        <p>
          Random number generators are used in games, simulations, lottery draws, sampling,
          A/B testing, password generation, and any scenario requiring unpredictable values.
        </p>
      </div>
    </ToolLayout>
  );
}
