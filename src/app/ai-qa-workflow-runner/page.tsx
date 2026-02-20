"use client";

import { useMemo, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

type StageState = "pass" | "review" | "fail";

interface StageResult {
  name: string;
  score: number;
  state: StageState;
  details: string;
}

function clamp(num: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, num));
}

function stateFromScore(score: number) {
  if (score >= 80) return "pass" as StageState;
  if (score >= 60) return "review" as StageState;
  return "fail" as StageState;
}

function badgeClass(state: StageState) {
  if (state === "pass") return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300";
  if (state === "review") return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300";
  return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300";
}

export default function AiQaWorkflowRunnerPage() {
  const [releaseName, setReleaseName] = useState("release-2026-02-20");
  const [promptQuality, setPromptQuality] = useState(84);
  const [policyHigh, setPolicyHigh] = useState(0);
  const [policyMedium, setPolicyMedium] = useState(1);
  const [replayPass, setReplayPass] = useState(7);
  const [replayWarning, setReplayWarning] = useState(1);
  const [replayFail, setReplayFail] = useState(0);
  const [outputContract, setOutputContract] = useState(88);
  const [evalScoreDelta, setEvalScoreDelta] = useState(3);
  const [evalPassDelta, setEvalPassDelta] = useState(4);
  const [criticalIncident, setCriticalIncident] = useState(false);

  const result = useMemo(() => {
    const lintScore = clamp(promptQuality);

    const policyPenalty = policyHigh * 30 + policyMedium * 10;
    const policyScore = clamp(100 - policyPenalty);

    const replayTotal = replayPass + replayWarning + replayFail;
    const replayPenalty =
      (replayTotal > 0 ? ((replayWarning * 10 + replayFail * 24) / replayTotal) : 0) + replayFail * 4;
    const replayScore = clamp(100 - replayPenalty);

    const outputScore = clamp(outputContract);

    let evalScore = 70;
    if (evalScoreDelta >= 5) evalScore += 20;
    else if (evalScoreDelta >= 0) evalScore += 10;
    else if (evalScoreDelta <= -8) evalScore -= 25;
    else evalScore -= 12;

    if (evalPassDelta >= 5) evalScore += 10;
    else if (evalPassDelta < 0) evalScore -= 10;
    evalScore = clamp(evalScore);

    const stages: StageResult[] = [
      {
        name: "Prompt Lint Stage",
        score: lintScore,
        state: stateFromScore(lintScore),
        details: `Prompt quality score ${lintScore}/100.`,
      },
      {
        name: "Policy Firewall Stage",
        score: policyScore,
        state: stateFromScore(policyScore),
        details: `${policyHigh} high + ${policyMedium} medium policy findings.`,
      },
      {
        name: "Jailbreak Replay Stage",
        score: replayScore,
        state: stateFromScore(replayScore),
        details: `${replayPass} pass, ${replayWarning} warning, ${replayFail} fail replay outcomes.`,
      },
      {
        name: "Output Contract Stage",
        score: outputScore,
        state: stateFromScore(outputScore),
        details: `Output contract fit ${outputScore}/100.`,
      },
      {
        name: "Eval Delta Stage",
        score: evalScore,
        state: stateFromScore(evalScore),
        details: `Score delta ${evalScoreDelta}, pass-rate delta ${evalPassDelta}pp.`,
      },
    ];

    const weighted =
      lintScore * 0.24 +
      policyScore * 0.26 +
      replayScore * 0.2 +
      outputScore * 0.2 +
      evalScore * 0.1;
    let overall = clamp(Math.round(weighted));

    if (criticalIncident) overall = Math.max(0, overall - 25);

    const failCount = stages.filter((stage) => stage.state === "fail").length + (criticalIncident ? 1 : 0);
    const reviewCount = stages.filter((stage) => stage.state === "review").length;

    let releaseDecision = "Ship";
    if (criticalIncident || failCount >= 1 || overall < 65) releaseDecision = "Block";
    else if (reviewCount >= 2 || overall < 80) releaseDecision = "Review";

    const actions: string[] = [];
    if (lintScore < 80) actions.push("Improve prompt clarity and hard constraints before release.");
    if (policyHigh > 0) actions.push("Resolve all high-severity policy findings.");
    if (policyMedium > 2) actions.push("Reduce medium policy findings to 0-2 range.");
    if (replayFail > 0) actions.push("Address jailbreak replay fail cases and retest.");
    if (outputScore < 80) actions.push("Tighten output contract schema/format enforcement.");
    if (evalScoreDelta < 0 || evalPassDelta < 0) actions.push("Investigate regression in candidate eval run.");
    if (criticalIncident) actions.push("Critical incident flag is active. Release must remain blocked.");
    if (actions.length === 0) actions.push("No blocking actions. QA pipeline looks ready.");

    return { stages, overall, releaseDecision, actions, failCount, reviewCount };
  }, [
    criticalIncident,
    evalPassDelta,
    evalScoreDelta,
    outputContract,
    policyHigh,
    policyMedium,
    promptQuality,
    replayFail,
    replayPass,
    replayWarning,
  ]);

  const summary = useMemo(
    () =>
      [
        "AI QA Workflow Runner",
        `Release: ${releaseName || "unnamed"}`,
        `Overall score: ${result.overall}/100`,
        `Decision: ${result.releaseDecision}`,
        `Fail stages: ${result.failCount}`,
        `Review stages: ${result.reviewCount}`,
      ].join("\n"),
    [releaseName, result]
  );

  const exportJson = useMemo(
    () =>
      JSON.stringify(
        {
          releaseName,
          overallScore: result.overall,
          decision: result.releaseDecision,
          failStages: result.failCount,
          reviewStages: result.reviewCount,
          criticalIncident,
          stages: result.stages,
          actions: result.actions,
        },
        null,
        2
      ),
    [criticalIncident, releaseName, result]
  );

  const loadSampleStrong = () => {
    setReleaseName("release-2026-03-strong");
    setPromptQuality(89);
    setPolicyHigh(0);
    setPolicyMedium(1);
    setReplayPass(8);
    setReplayWarning(1);
    setReplayFail(0);
    setOutputContract(92);
    setEvalScoreDelta(4);
    setEvalPassDelta(3);
    setCriticalIncident(false);
  };

  const loadSampleRisky = () => {
    setReleaseName("release-2026-03-risky");
    setPromptQuality(61);
    setPolicyHigh(2);
    setPolicyMedium(3);
    setReplayPass(3);
    setReplayWarning(2);
    setReplayFail(2);
    setOutputContract(64);
    setEvalScoreDelta(-11);
    setEvalPassDelta(-7);
    setCriticalIncident(true);
  };

  return (
    <ToolLayout
      title="AI QA Workflow Runner"
      description="Aggregate AI QA stage metrics into one deterministic release decision: Ship, Review, or Block."
      relatedTools={["ai-reliability-scorecard", "prompt-policy-firewall", "jailbreak-replay-lab", "eval-results-comparator"]}
    >
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          onClick={loadSampleStrong}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Load strong sample
        </button>
        <button
          onClick={loadSampleRisky}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Load risky sample
        </button>
        <CopyButton text={summary} />
      </div>

      <label className="mb-4 block text-sm text-gray-700 dark:text-gray-300">
        Release name
        <input
          value={releaseName}
          onChange={(event) => setReleaseName(event.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
        />
      </label>

      <div className="grid gap-3 md:grid-cols-2">
        <NumberField label="Prompt quality score (0-100)" value={promptQuality} onChange={setPromptQuality} />
        <NumberField label="Output contract score (0-100)" value={outputContract} onChange={setOutputContract} />
        <NumberField label="Policy high findings" value={policyHigh} onChange={setPolicyHigh} />
        <NumberField label="Policy medium findings" value={policyMedium} onChange={setPolicyMedium} />
        <NumberField label="Replay pass cases" value={replayPass} onChange={setReplayPass} />
        <NumberField label="Replay warning cases" value={replayWarning} onChange={setReplayWarning} />
        <NumberField label="Replay fail cases" value={replayFail} onChange={setReplayFail} />
        <NumberField label="Eval score delta (candidate - baseline)" value={evalScoreDelta} onChange={setEvalScoreDelta} />
        <NumberField label="Eval pass-rate delta in percentage points" value={evalPassDelta} onChange={setEvalPassDelta} />
      </div>

      <label className="mt-4 flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-300">
        <input
          type="checkbox"
          checked={criticalIncident}
          onChange={(event) => setCriticalIncident(event.target.checked)}
          className="accent-red-600"
        />
        Critical incident flag (forces risk downgrade)
      </label>

      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <StatCard label="Overall Score" value={`${result.overall}`} />
        <StatCard label="Decision" value={result.releaseDecision} />
        <StatCard label="Fail Stages" value={`${result.failCount}`} />
        <StatCard label="Review Stages" value={`${result.reviewCount}`} />
      </div>

      <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
        <p className="text-xs uppercase tracking-wide text-blue-700 dark:text-blue-300">Pipeline Decision</p>
        <p className="mt-1 text-2xl font-bold text-blue-800 dark:text-blue-200">{result.releaseDecision}</p>
      </div>

      <div className="mt-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300">
          Stage Results
        </div>
        <div className="max-h-[360px] overflow-auto">
          {result.stages.map((stage) => (
            <div key={stage.name} className="border-b border-gray-100 px-3 py-3 text-sm dark:border-gray-800">
              <div className="mb-1 flex items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${badgeClass(stage.state)}`}>
                  {stage.state}
                </span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{stage.name}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{stage.score}/100</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">{stage.details}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
          <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Recommended actions</p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600 dark:text-gray-400">
            {result.actions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Workflow JSON report</p>
            <CopyButton text={exportJson} />
          </div>
          <textarea
            value={exportJson}
            onChange={() => {}}
            rows={12}
            readOnly
            className="w-full rounded-lg border border-gray-300 bg-white p-3 font-mono text-xs dark:border-gray-600 dark:bg-gray-900"
          />
        </div>
      </div>

      <div className="mt-12 space-y-6 border-t border-gray-200 pt-8 text-sm leading-relaxed text-gray-600 dark:border-gray-700 dark:text-gray-400">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
        <p>
          AI QA Workflow Runner combines key QA stage metrics into one release decision so teams can standardize go/no-go
          checks before pushing prompt or model changes.
        </p>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Does this call external services?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. It is deterministic scoring based only on the metrics you provide.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              How should I gather inputs for stages?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Use Prompt Linter, Policy Firewall, Replay Lab, Output Contract checks, and Eval Comparator outputs.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is workflow data uploaded?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. All data stays in your browser session.
            </p>
          </details>
        </div>
      </div>
    </ToolLayout>
  );
}

function NumberField({
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
        value={value}
        onChange={(event) => onChange(Number(event.target.value) || 0)}
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
