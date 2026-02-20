"use client";

import { useMemo, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface EvalRow {
  id: string;
  score: number | null;
  passed: boolean | null;
}

interface ParseIssue {
  line: number;
  message: string;
}

const SAMPLE_RUN_A = [
  '{"custom_id":"tc_001","score":91,"pass":true}',
  '{"custom_id":"tc_002","score":76,"pass":true}',
  '{"custom_id":"tc_003","score":68,"pass":false}',
  '{"custom_id":"tc_004","score":82,"pass":true}',
].join("\n");

const SAMPLE_RUN_B = [
  '{"custom_id":"tc_001","score":95,"pass":true}',
  '{"custom_id":"tc_002","score":71,"pass":true}',
  '{"custom_id":"tc_003","score":74,"pass":true}',
  '{"custom_id":"tc_004","score":63,"pass":false}',
].join("\n");

function asNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const num = Number(value);
    if (Number.isFinite(num)) return num;
  }
  return null;
}

function asBool(value: unknown) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["pass", "passed", "true", "ok", "success"].includes(normalized)) return true;
    if (["fail", "failed", "false", "error"].includes(normalized)) return false;
  }
  return null;
}

function parseRecord(record: Record<string, unknown>, threshold: number): EvalRow | null {
  const idKeys = ["custom_id", "id", "test_id", "case_id", "name"];
  let id: string | null = null;
  for (const key of idKeys) {
    if (Object.prototype.hasOwnProperty.call(record, key)) {
      const value = record[key];
      if (typeof value === "string" && value.trim()) id = value.trim();
      else if (typeof value === "number") id = String(value);
      if (id) break;
    }
  }
  if (!id) return null;

  const scoreKeys = ["score", "finalScore", "qualityScore", "result_score"];
  let score: number | null = null;
  for (const key of scoreKeys) {
    if (Object.prototype.hasOwnProperty.call(record, key)) {
      score = asNumber(record[key]);
      if (score !== null) break;
    }
  }

  const passKeys = ["pass", "passed", "success", "ok", "verdict", "status"];
  let passed: boolean | null = null;
  for (const key of passKeys) {
    if (Object.prototype.hasOwnProperty.call(record, key)) {
      passed = asBool(record[key]);
      if (passed !== null) break;
    }
  }
  if (passed === null && score !== null) {
    passed = score >= threshold;
  }

  return { id, score, passed };
}

function parseEvalInput(input: string, threshold: number) {
  const trimmed = input.trim();
  if (!trimmed) return { rows: [] as EvalRow[], issues: [] as ParseIssue[] };

  const issues: ParseIssue[] = [];
  const rows: EvalRow[] = [];

  const pushRecord = (value: unknown, line: number) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      issues.push({ line, message: "Record is not a JSON object." });
      return;
    }
    const parsed = parseRecord(value as Record<string, unknown>, threshold);
    if (!parsed) {
      issues.push({ line, message: "Missing ID (custom_id/id/test_id/case_id/name)." });
      return;
    }
    rows.push(parsed);
  };

  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (!Array.isArray(parsed)) {
        issues.push({ line: 1, message: "JSON root must be an array when using JSON mode." });
      } else {
        parsed.forEach((item, index) => pushRecord(item, index + 1));
      }
    } catch {
      issues.push({ line: 1, message: "Invalid JSON array input." });
    }
  } else {
    const lines = input.split(/\r?\n/);
    lines.forEach((line, index) => {
      const raw = line.trim();
      if (!raw) return;
      try {
        const parsed = JSON.parse(raw);
        pushRecord(parsed, index + 1);
      } catch {
        issues.push({ line: index + 1, message: "Invalid JSON line." });
      }
    });
  }

  return { rows, issues };
}

function dedupeRows(rows: EvalRow[]) {
  const map = new Map<string, EvalRow>();
  const duplicateIds = new Set<string>();
  for (const row of rows) {
    if (map.has(row.id)) duplicateIds.add(row.id);
    map.set(row.id, row);
  }
  return { map, duplicateIds: [...duplicateIds] };
}

function percent(part: number, total: number) {
  if (total <= 0) return 0;
  return (part / total) * 100;
}

export default function EvalResultsComparatorPage() {
  const [runA, setRunA] = useState("");
  const [runB, setRunB] = useState("");
  const [threshold, setThreshold] = useState(70);

  const result = useMemo(() => {
    const parsedA = parseEvalInput(runA, threshold);
    const parsedB = parseEvalInput(runB, threshold);
    const dedupedA = dedupeRows(parsedA.rows);
    const dedupedB = dedupeRows(parsedB.rows);

    const idsA = new Set(dedupedA.map.keys());
    const idsB = new Set(dedupedB.map.keys());
    const matchedIds = [...idsA].filter((id) => idsB.has(id));
    const onlyA = [...idsA].filter((id) => !idsB.has(id));
    const onlyB = [...idsB].filter((id) => !idsA.has(id));

    const rowPairs = matchedIds.map((id) => {
      const a = dedupedA.map.get(id)!;
      const b = dedupedB.map.get(id)!;
      const delta = a.score !== null && b.score !== null ? b.score - a.score : null;
      const statusFlip =
        a.passed !== null && b.passed !== null && a.passed !== b.passed
          ? a.passed
            ? "pass_to_fail"
            : "fail_to_pass"
          : null;
      return { id, a, b, delta, statusFlip };
    });

    const scoredPairs = rowPairs.filter((item) => item.delta !== null);
    const avgA = scoredPairs.length
      ? scoredPairs.reduce((sum, item) => sum + (item.a.score as number), 0) / scoredPairs.length
      : 0;
    const avgB = scoredPairs.length
      ? scoredPairs.reduce((sum, item) => sum + (item.b.score as number), 0) / scoredPairs.length
      : 0;

    const withPassA = [...dedupedA.map.values()].filter((item) => item.passed !== null);
    const withPassB = [...dedupedB.map.values()].filter((item) => item.passed !== null);
    const passRateA = percent(withPassA.filter((item) => item.passed).length, withPassA.length);
    const passRateB = percent(withPassB.filter((item) => item.passed).length, withPassB.length);

    const improved = scoredPairs.filter((item) => (item.delta as number) >= 5).length;
    const regressed = scoredPairs.filter((item) => (item.delta as number) <= -5).length;
    const unchanged = scoredPairs.length - improved - regressed;
    const failToPass = rowPairs.filter((item) => item.statusFlip === "fail_to_pass").length;
    const passToFail = rowPairs.filter((item) => item.statusFlip === "pass_to_fail").length;

    const topChanges = [...scoredPairs]
      .sort((left, right) => Math.abs(right.delta as number) - Math.abs(left.delta as number))
      .slice(0, 25);

    return {
      parsedA,
      parsedB,
      dedupedA,
      dedupedB,
      matchedIds,
      onlyA,
      onlyB,
      avgA,
      avgB,
      passRateA,
      passRateB,
      improved,
      regressed,
      unchanged,
      failToPass,
      passToFail,
      topChanges,
    };
  }, [runA, runB, threshold]);

  const summary = useMemo(
    () =>
      [
        "Eval Results Comparator",
        `Matched cases: ${result.matchedIds.length}`,
        `Avg score A: ${result.avgA.toFixed(1)}`,
        `Avg score B: ${result.avgB.toFixed(1)}`,
        `Score delta (B-A): ${(result.avgB - result.avgA).toFixed(1)}`,
        `Pass rate delta (B-A): ${(result.passRateB - result.passRateA).toFixed(1)}pp`,
        `Improved: ${result.improved}, Regressed: ${result.regressed}, Unchanged: ${result.unchanged}`,
      ].join("\n"),
    [result]
  );

  const reportJson = useMemo(
    () =>
      JSON.stringify(
        {
          threshold,
          counts: {
            runA: result.dedupedA.map.size,
            runB: result.dedupedB.map.size,
            matched: result.matchedIds.length,
            onlyA: result.onlyA.length,
            onlyB: result.onlyB.length,
          },
          metrics: {
            avgScoreA: Number(result.avgA.toFixed(2)),
            avgScoreB: Number(result.avgB.toFixed(2)),
            scoreDelta: Number((result.avgB - result.avgA).toFixed(2)),
            passRateA: Number(result.passRateA.toFixed(2)),
            passRateB: Number(result.passRateB.toFixed(2)),
            passRateDelta: Number((result.passRateB - result.passRateA).toFixed(2)),
            improved: result.improved,
            regressed: result.regressed,
            failToPass: result.failToPass,
            passToFail: result.passToFail,
          },
          topChanges: result.topChanges.map((item) => ({
            id: item.id,
            scoreA: item.a.score,
            scoreB: item.b.score,
            delta: item.delta,
            statusFlip: item.statusFlip,
          })),
        },
        null,
        2
      ),
    [result, threshold]
  );

  const loadSample = () => {
    setRunA(SAMPLE_RUN_A);
    setRunB(SAMPLE_RUN_B);
    setThreshold(70);
  };

  return (
    <ToolLayout
      title="Eval Results Comparator"
      description="Compare two eval runs from JSON or JSONL and quantify score/pass-rate deltas plus case-level regression."
      relatedTools={["prompt-regression-suite-builder", "llm-response-grader", "openai-batch-jsonl-validator"]}
    >
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          onClick={loadSample}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Load sample
        </button>
        <button
          onClick={() => {
            setRunA("");
            setRunB("");
          }}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Clear
        </button>
        <CopyButton text={summary} />
      </div>

      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
        Derived pass threshold (if pass flag is missing)
      </label>
      <input
        type="number"
        min={0}
        max={100}
        value={threshold}
        onChange={(event) => setThreshold(clamp(Number(event.target.value) || 0, 0, 100))}
        className="mb-4 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
      />

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Run A (baseline)</label>
          <textarea
            value={runA}
            onChange={(event) => setRunA(event.target.value)}
            rows={12}
            className="w-full rounded-lg border border-gray-300 bg-white p-3 font-mono text-sm dark:border-gray-600 dark:bg-gray-900"
            placeholder='JSON array or JSONL, e.g. {"custom_id":"tc_001","score":91,"pass":true}'
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Run B (candidate)</label>
          <textarea
            value={runB}
            onChange={(event) => setRunB(event.target.value)}
            rows={12}
            className="w-full rounded-lg border border-gray-300 bg-white p-3 font-mono text-sm dark:border-gray-600 dark:bg-gray-900"
            placeholder='JSON array or JSONL, e.g. {"custom_id":"tc_001","score":95,"pass":true}'
          />
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-5">
        <StatCard label="Matched Cases" value={String(result.matchedIds.length)} />
        <StatCard label="Score Delta" value={(result.avgB - result.avgA).toFixed(1)} />
        <StatCard label="Pass Delta (pp)" value={(result.passRateB - result.passRateA).toFixed(1)} />
        <StatCard label="Improved" value={String(result.improved)} />
        <StatCard label="Regressed" value={String(result.regressed)} />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
          <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Run metrics</p>
          <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <li>Run A records: {result.dedupedA.map.size}</li>
            <li>Run B records: {result.dedupedB.map.size}</li>
            <li>Run A pass rate: {result.passRateA.toFixed(1)}%</li>
            <li>Run B pass rate: {result.passRateB.toFixed(1)}%</li>
            <li>Fail to pass: {result.failToPass}</li>
            <li>Pass to fail: {result.passToFail}</li>
            <li>Only in Run A: {result.onlyA.length}</li>
            <li>Only in Run B: {result.onlyB.length}</li>
          </ul>
        </div>
        <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Comparison JSON</p>
            <CopyButton text={reportJson} />
          </div>
          <textarea
            value={reportJson}
            onChange={() => {}}
            rows={11}
            readOnly
            className="w-full rounded-lg border border-gray-300 bg-white p-3 font-mono text-xs dark:border-gray-600 dark:bg-gray-900"
          />
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300">
          Top case changes
        </div>
        <div className="max-h-[360px] overflow-auto">
          {result.topChanges.length === 0 ? (
            <p className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">No comparable scored cases yet.</p>
          ) : (
            result.topChanges.map((item) => (
              <div key={item.id} className="border-b border-gray-100 px-3 py-3 text-sm dark:border-gray-800">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-gray-500 dark:text-gray-400">{item.id}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      (item.delta as number) >= 5
                        ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                        : (item.delta as number) <= -5
                          ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    }`}
                  >
                    delta {(item.delta as number).toFixed(1)}
                  </span>
                  {item.statusFlip && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                      {item.statusFlip}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  A: {item.a.score ?? "n/a"} | B: {item.b.score ?? "n/a"}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {(result.parsedA.issues.length > 0 || result.parsedB.issues.length > 0 || result.dedupedA.duplicateIds.length > 0 || result.dedupedB.duplicateIds.length > 0) && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
          {result.parsedA.issues.length > 0 && <p>Run A parse issues: {result.parsedA.issues.length}</p>}
          {result.parsedB.issues.length > 0 && <p>Run B parse issues: {result.parsedB.issues.length}</p>}
          {result.dedupedA.duplicateIds.length > 0 && <p>Run A duplicate IDs (last wins): {result.dedupedA.duplicateIds.join(", ")}</p>}
          {result.dedupedB.duplicateIds.length > 0 && <p>Run B duplicate IDs (last wins): {result.dedupedB.duplicateIds.join(", ")}</p>}
        </div>
      )}

      <div className="mt-12 space-y-6 border-t border-gray-200 pt-8 text-sm leading-relaxed text-gray-600 dark:border-gray-700 dark:text-gray-400">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
        <p>
          Eval Results Comparator helps you compare baseline and candidate eval runs quickly by quantifying score deltas,
          pass-rate changes, and case-level regressions.
        </p>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              What formats are supported?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              JSON array and JSONL are supported. IDs can be provided as custom_id, id, test_id, case_id, or name.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              What if pass flags are missing?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              The tool derives pass/fail from score using your selected threshold.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is eval data uploaded?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. Parsing and comparison run entirely in your browser.
            </p>
          </details>
        </div>
      </div>
    </ToolLayout>
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

function clamp(num: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, num));
}
