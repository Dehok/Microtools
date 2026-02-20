"use client";

import { useMemo, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface CostProfile {
  id: string;
  name: string;
  inputPer1M: number;
  cachedInputPer1M: number;
  outputPer1M: number;
}

const PROFILES: CostProfile[] = [
  { id: "balanced", name: "Balanced model (example)", inputPer1M: 2.5, cachedInputPer1M: 0.3, outputPer1M: 10 },
  { id: "premium", name: "Premium model (example)", inputPer1M: 5, cachedInputPer1M: 0.6, outputPer1M: 18 },
  { id: "budget", name: "Budget model (example)", inputPer1M: 0.8, cachedInputPer1M: 0.1, outputPer1M: 3.2 },
];

function estimateTokens(text: string) {
  if (!text) return 0;
  const ascii = (text.match(/[\x00-\x7F]/g) || []).length;
  const nonAscii = text.length - ascii;
  const punctuation = (text.match(/[.,!?;:()[\]{}"'`~@#$%^&*+\-_=\\/|<>]/g) || []).length;
  const tokenFloat = ascii / 4 + nonAscii / 1.5 + punctuation / 6;
  return Math.max(1, Math.ceil(tokenFloat));
}

function usd(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 4 }).format(value);
}

function usdShort(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(value);
}

export default function AICostEstimatorPage() {
  const [text, setText] = useState("");
  const [expectedOutputTokens, setExpectedOutputTokens] = useState(500);
  const [requestsPerDay, setRequestsPerDay] = useState(300);
  const [daysPerMonth, setDaysPerMonth] = useState(30);
  const [cacheHitRatio, setCacheHitRatio] = useState(30);
  const [monthlyBudget, setMonthlyBudget] = useState(200);
  const [selectedProfileId, setSelectedProfileId] = useState(PROFILES[0].id);
  const [inputPer1M, setInputPer1M] = useState(PROFILES[0].inputPer1M);
  const [cachedInputPer1M, setCachedInputPer1M] = useState(PROFILES[0].cachedInputPer1M);
  const [outputPer1M, setOutputPer1M] = useState(PROFILES[0].outputPer1M);

  const selectedProfile = PROFILES.find((profile) => profile.id === selectedProfileId) ?? PROFILES[0];

  const metrics = useMemo(() => {
    const promptTokens = estimateTokens(text);
    const uncachedShare = Math.max(0, Math.min(100, 100 - cacheHitRatio)) / 100;
    const cachedShare = Math.max(0, Math.min(100, cacheHitRatio)) / 100;

    const inputCostPerRequest =
      (promptTokens * uncachedShare * inputPer1M) / 1_000_000 +
      (promptTokens * cachedShare * cachedInputPer1M) / 1_000_000;
    const outputCostPerRequest = (expectedOutputTokens * outputPer1M) / 1_000_000;
    const totalCostPerRequest = inputCostPerRequest + outputCostPerRequest;
    const dailyCost = totalCostPerRequest * requestsPerDay;
    const monthlyCost = dailyCost * daysPerMonth;

    const requestsInBudget = totalCostPerRequest > 0 ? Math.floor(monthlyBudget / totalCostPerRequest) : 0;

    return {
      promptTokens,
      totalTokens: promptTokens + expectedOutputTokens,
      inputCostPerRequest,
      outputCostPerRequest,
      totalCostPerRequest,
      dailyCost,
      monthlyCost,
      requestsInBudget,
    };
  }, [
    cacheHitRatio,
    cachedInputPer1M,
    daysPerMonth,
    expectedOutputTokens,
    inputPer1M,
    monthlyBudget,
    outputPer1M,
    requestsPerDay,
    text,
  ]);

  const summary = useMemo(
    () =>
      [
        "AI Cost Estimator Summary",
        `Prompt tokens (est.): ${metrics.promptTokens}`,
        `Expected output tokens: ${expectedOutputTokens}`,
        `Total tokens/request (est.): ${metrics.totalTokens}`,
        "",
        `Input price/1M: ${usdShort(inputPer1M)}`,
        `Cached input price/1M: ${usdShort(cachedInputPer1M)}`,
        `Output price/1M: ${usdShort(outputPer1M)}`,
        `Cache hit ratio: ${cacheHitRatio}%`,
        "",
        `Cost/request: ${usd(metrics.totalCostPerRequest)}`,
        `Cost/day: ${usdShort(metrics.dailyCost)}`,
        `Cost/month: ${usdShort(metrics.monthlyCost)}`,
        `Requests in budget (${usdShort(monthlyBudget)}): ${metrics.requestsInBudget.toLocaleString()}`,
      ].join("\n"),
    [
      cacheHitRatio,
      cachedInputPer1M,
      expectedOutputTokens,
      inputPer1M,
      metrics.dailyCost,
      metrics.monthlyCost,
      metrics.promptTokens,
      metrics.requestsInBudget,
      metrics.totalCostPerRequest,
      metrics.totalTokens,
      monthlyBudget,
      outputPer1M,
    ]
  );

  return (
    <ToolLayout
      title="AI Cost Estimator"
      description="Estimate per-request, daily, and monthly AI model costs with input/output pricing and cache hit ratio."
      relatedTools={["token-counter", "prompt-security-scanner", "openai-batch-jsonl-validator"]}
    >
      <div className="mb-4 grid gap-4 lg:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Pricing profile</label>
          <select
            value={selectedProfileId}
            onChange={(event) => {
              const profile = PROFILES.find((item) => item.id === event.target.value);
              if (!profile) return;
              setSelectedProfileId(profile.id);
              setInputPer1M(profile.inputPer1M);
              setCachedInputPer1M(profile.cachedInputPer1M);
              setOutputPer1M(profile.outputPer1M);
            }}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
          >
            {PROFILES.map((profile) => (
              <option key={profile.id} value={profile.id}>
                {profile.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Example presets only. Replace with your provider&apos;s current pricing.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <PriceField label="Input / 1M" value={inputPer1M} onChange={setInputPer1M} />
          <PriceField label="Cached / 1M" value={cachedInputPer1M} onChange={setCachedInputPer1M} />
          <PriceField label="Output / 1M" value={outputPer1M} onChange={setOutputPer1M} />
        </div>
      </div>

      <div className="mb-4 grid gap-3 md:grid-cols-4">
        <NumberField label="Expected output tokens" value={expectedOutputTokens} setValue={setExpectedOutputTokens} min={1} />
        <NumberField label="Requests per day" value={requestsPerDay} setValue={setRequestsPerDay} min={1} />
        <NumberField label="Days per month" value={daysPerMonth} setValue={setDaysPerMonth} min={1} />
        <NumberField label="Monthly budget (USD)" value={monthlyBudget} setValue={setMonthlyBudget} min={1} step={1} />
      </div>

      <div className="mb-4 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
        <div className="mb-1 flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Cache hit ratio: {cacheHitRatio}%
          </label>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Profile: {selectedProfile.name}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={cacheHitRatio}
          onChange={(event) => setCacheHitRatio(Number(event.target.value))}
          className="w-full accent-blue-600"
        />
      </div>

      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={10}
        placeholder="Paste your typical prompt here to estimate prompt token cost..."
        className="mb-4 w-full rounded-lg border border-gray-300 bg-white p-3 font-mono text-sm dark:border-gray-600 dark:bg-gray-900"
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Prompt Tokens (est.)" value={metrics.promptTokens.toLocaleString()} />
        <StatCard label="Total Tokens / Request" value={metrics.totalTokens.toLocaleString()} />
        <StatCard label="Cost / Request" value={usd(metrics.totalCostPerRequest)} />
        <StatCard label="Requests in Budget" value={metrics.requestsInBudget.toLocaleString()} />
      </div>

      <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-blue-700 dark:text-blue-300">Input cost / request</p>
            <p className="text-lg font-bold text-blue-800 dark:text-blue-200">{usd(metrics.inputCostPerRequest)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-blue-700 dark:text-blue-300">Output cost / request</p>
            <p className="text-lg font-bold text-blue-800 dark:text-blue-200">{usd(metrics.outputCostPerRequest)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-blue-700 dark:text-blue-300">Monthly estimate</p>
            <p className="text-lg font-bold text-blue-800 dark:text-blue-200">{usdShort(metrics.monthlyCost)}</p>
          </div>
        </div>
      </div>

      <div className="mb-2 flex items-center justify-end">
        <CopyButton text={summary} />
      </div>

      <div className="mt-12 space-y-6 border-t border-gray-200 pt-8 text-sm leading-relaxed text-gray-600 dark:border-gray-700 dark:text-gray-400">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
        <p>
          AI Cost Estimator helps you budget model usage by combining prompt token estimates, expected output size,
          request volume, and per-token pricing. It also models cache hit ratio impact for repeated prompts.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Are these prices official provider prices?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Presets are examples. Enter your provider&apos;s live prices for accurate budgeting.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Why include cache hit ratio?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Repeated prompt prefixes can cost less on some platforms. Cache ratio models that discount effect.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is my prompt uploaded anywhere?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. Token and cost calculations run entirely in your browser.
            </p>
          </details>
        </div>
      </div>
    </ToolLayout>
  );
}

function PriceField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="text-sm text-gray-700 dark:text-gray-300">
      {label}
      <input
        type="number"
        min={0}
        step={0.1}
        value={value}
        onChange={(event) => onChange(Math.max(0, Number(event.target.value) || 0))}
        className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
      />
    </label>
  );
}

function NumberField({
  label,
  value,
  setValue,
  min,
  step = 1,
}: {
  label: string;
  value: number;
  setValue: (value: number) => void;
  min: number;
  step?: number;
}) {
  return (
    <label className="text-sm text-gray-700 dark:text-gray-300">
      {label}
      <input
        type="number"
        min={min}
        step={step}
        value={value}
        onChange={(event) => setValue(Math.max(min, Number(event.target.value) || min))}
        className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
      />
    </label>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-200 p-3 text-center dark:border-gray-700">
      <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  );
}
