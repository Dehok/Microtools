"use client";

import { useMemo, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface ModelProfile {
  id: string;
  name: string;
  contextWindow: number;
}

const MODELS: ModelProfile[] = [
  { id: "gpt-128k", name: "128k context model", contextWindow: 128_000 },
  { id: "claude-200k", name: "200k context model", contextWindow: 200_000 },
  { id: "gemini-1m", name: "1M context model", contextWindow: 1_000_000 },
];

function estimateTokens(text: string) {
  if (!text) return 0;
  const ascii = (text.match(/[\x00-\x7F]/g) || []).length;
  const nonAscii = text.length - ascii;
  const punctuation = (text.match(/[.,!?;:()[\]{}"'`~@#$%^&*+\-_=\\/|<>]/g) || []).length;
  const tokenFloat = ascii / 4 + nonAscii / 1.5 + punctuation / 6;
  return Math.max(1, Math.ceil(tokenFloat));
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export default function TokenCounterPage() {
  const [text, setText] = useState("");
  const [expectedOutputTokens, setExpectedOutputTokens] = useState(300);
  const [selectedModelId, setSelectedModelId] = useState(MODELS[0].id);
  const [inputPricePer1M, setInputPricePer1M] = useState(2.5);
  const [outputPricePer1M, setOutputPricePer1M] = useState(10);
  const [monthlyRequests, setMonthlyRequests] = useState(5000);

  const selectedModel = MODELS.find((m) => m.id === selectedModelId) ?? MODELS[0];

  const metrics = useMemo(() => {
    const characters = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text ? text.split(/\r?\n/).length : 0;
    const promptTokens = estimateTokens(text);
    const totalTokens = promptTokens + expectedOutputTokens;
    const utilization = Math.min(100, (totalTokens / selectedModel.contextWindow) * 100);
    const costPerRequest = (promptTokens * inputPricePer1M + expectedOutputTokens * outputPricePer1M) / 1_000_000;
    const monthlyCost = costPerRequest * monthlyRequests;

    return {
      characters,
      words,
      lines,
      promptTokens,
      totalTokens,
      utilization,
      remaining: Math.max(0, selectedModel.contextWindow - totalTokens),
      exceedsLimit: totalTokens > selectedModel.contextWindow,
      costPerRequest,
      monthlyCost,
    };
  }, [expectedOutputTokens, inputPricePer1M, monthlyRequests, outputPricePer1M, selectedModel.contextWindow, text]);

  const exportSummary = [
    `Characters: ${metrics.characters}`,
    `Words: ${metrics.words}`,
    `Lines: ${metrics.lines}`,
    `Estimated prompt tokens: ${metrics.promptTokens}`,
    `Expected output tokens: ${expectedOutputTokens}`,
    `Estimated total tokens: ${metrics.totalTokens}`,
    `Context window: ${selectedModel.contextWindow}`,
    `Remaining: ${metrics.remaining}`,
    `Cost/request (est.): $${metrics.costPerRequest.toFixed(6)}`,
    `Monthly cost (est.): $${metrics.monthlyCost.toFixed(2)}`,
  ].join("\n");

  return (
      <ToolLayout
        title="AI Token Counter"
        description="Estimate token usage for prompts and text inputs. Useful for planning context limits before sending requests to AI models."
        relatedTools={["ai-cost-estimator", "ai-prompt-generator", "byte-counter"]}
      >
      <div className="mb-4 grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Target model</label>
          <select
            value={selectedModelId}
            onChange={(e) => setSelectedModelId(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
          >
            {MODELS.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name} ({formatNumber(model.contextWindow)} tokens)
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Expected output tokens
          </label>
          <input
            type="number"
            min={1}
            value={expectedOutputTokens}
            onChange={(e) => setExpectedOutputTokens(Math.max(1, Number(e.target.value) || 1))}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your prompt or text here..."
        className="h-72 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 p-3 font-mono text-sm"
      />

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
          <p className="text-xs text-gray-500 dark:text-gray-400">Characters</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">{formatNumber(metrics.characters)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
          <p className="text-xs text-gray-500 dark:text-gray-400">Words</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">{formatNumber(metrics.words)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
          <p className="text-xs text-gray-500 dark:text-gray-400">Prompt Tokens (est.)</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {formatNumber(metrics.promptTokens)}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
          <p className="text-xs text-gray-500 dark:text-gray-400">Total Tokens (est.)</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">{formatNumber(metrics.totalTokens)}</p>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-gray-700 dark:text-gray-300">
            Context usage: {metrics.utilization.toFixed(2)}%
          </span>
          <span className="text-gray-500 dark:text-gray-400">
            Remaining: {formatNumber(metrics.remaining)} tokens
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className={`h-full rounded-full transition-all ${
              metrics.exceedsLimit ? "bg-red-500" : metrics.utilization > 85 ? "bg-amber-500" : "bg-blue-600"
            }`}
            style={{ width: `${metrics.utilization}%` }}
          />
        </div>
        {metrics.exceedsLimit && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            Estimated total exceeds the selected context window.
          </p>
        )}
      </div>

      <div className="mt-4 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="mb-3 grid gap-3 md:grid-cols-3">
          <label className="text-sm text-gray-700 dark:text-gray-300">
            Input price / 1M tokens (USD)
            <input
              type="number"
              min={0}
              step={0.1}
              value={inputPricePer1M}
              onChange={(e) => setInputPricePer1M(Math.max(0, Number(e.target.value) || 0))}
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm text-gray-700 dark:text-gray-300">
            Output price / 1M tokens (USD)
            <input
              type="number"
              min={0}
              step={0.1}
              value={outputPricePer1M}
              onChange={(e) => setOutputPricePer1M(Math.max(0, Number(e.target.value) || 0))}
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm text-gray-700 dark:text-gray-300">
            Monthly requests
            <input
              type="number"
              min={1}
              step={1}
              value={monthlyRequests}
              onChange={(e) => setMonthlyRequests(Math.max(1, Number(e.target.value) || 1))}
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
            />
          </label>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">Estimated cost / request</p>
            <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">${metrics.costPerRequest.toFixed(6)}</p>
          </div>
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">Estimated monthly cost</p>
            <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">${metrics.monthlyCost.toFixed(2)}</p>
          </div>
        </div>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Cost math is approximate. For a full budget model (cache hit ratio, daily budgets), use AI Cost Estimator.
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Estimation only. Real tokenization differs by model and tokenizer.
        </p>
        <CopyButton text={exportSummary} />
      </div>

      <div className="mt-12 space-y-6 border-t border-gray-200 dark:border-gray-700 pt-8 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
        <p>
          This token counter gives a fast estimate for prompt planning, context budgeting, and troubleshooting long AI
          requests. All counting runs locally in your browser.
        </p>
      </div>
    </ToolLayout>
  );
}
