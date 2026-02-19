"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";

const FIELDS = ["minute", "hour", "day (month)", "month", "day (week)"] as const;
const RANGES = [{ min: 0, max: 59 }, { min: 0, max: 23 }, { min: 1, max: 31 }, { min: 1, max: 12 }, { min: 0, max: 6 }];
const MONTH_NAMES = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const PRESETS = [
    { label: "Every minute", cron: "* * * * *" },
    { label: "Every 5 minutes", cron: "*/5 * * * *" },
    { label: "Every hour", cron: "0 * * * *" },
    { label: "Every day at midnight", cron: "0 0 * * *" },
    { label: "Every Mon at 9 AM", cron: "0 9 * * 1" },
    { label: "Every weekday at 8 AM", cron: "0 8 * * 1-5" },
    { label: "1st of every month", cron: "0 0 1 * *" },
    { label: "Every Sunday at noon", cron: "0 12 * * 0" },
];

function describeCron(parts: string[]): string {
    if (parts.length !== 5) return "Invalid cron expression";
    const [min, hr, dom, mon, dow] = parts;
    const strs: string[] = [];
    if (min === "*" && hr === "*") strs.push("Every minute");
    else if (min.startsWith("*/")) strs.push(`Every ${min.slice(2)} minutes`);
    else if (hr === "*") strs.push(`At minute ${min}`);
    else strs.push(`At ${hr.padStart(2, "0")}:${min.padStart(2, "0")}`);
    if (dom !== "*") strs.push(`on day ${dom} of the month`);
    if (mon !== "*") { const m = parseInt(mon); strs.push(`in ${MONTH_NAMES[m] || mon}`); }
    if (dow !== "*") {
        const days = dow.split(",").map((d) => { const r = d.split("-"); return r.length === 2 ? `${DAY_NAMES[+r[0]] || r[0]}-${DAY_NAMES[+r[1]] || r[1]}` : DAY_NAMES[+d] || d; }).join(", ");
        strs.push(`on ${days}`);
    }
    return strs.join(" ");
}

function nextRuns(cron: string, count: number): Date[] {
    const parts = cron.split(" ");
    if (parts.length !== 5) return [];
    const dates: Date[] = [];
    const now = new Date();
    const d = new Date(now);
    d.setSeconds(0, 0);
    d.setMinutes(d.getMinutes() + 1);
    for (let i = 0; i < 525960 && dates.length < count; i++) {
        const [min, hr, dom, mon, dow] = parts;
        const ok = (field: string, val: number) => {
            if (field === "*") return true;
            if (field.includes("/")) { const [, step] = field.split("/"); return val % parseInt(step) === 0; }
            if (field.includes("-")) { const [a, b] = field.split("-").map(Number); return val >= a && val <= b; }
            if (field.includes(",")) return field.split(",").map(Number).includes(val);
            return parseInt(field) === val;
        };
        if (ok(min, d.getMinutes()) && ok(hr, d.getHours()) && ok(dom, d.getDate()) && ok(mon, d.getMonth() + 1) && ok(dow, d.getDay())) {
            dates.push(new Date(d));
        }
        d.setMinutes(d.getMinutes() + 1);
    }
    return dates;
}

export default function CronExpressionGenerator() {
    const [parts, setParts] = useState(["0", "0", "*", "*", "*"]);
    const [copied, setCopied] = useState(false);
    const cron = parts.join(" ");

    const description = useMemo(() => describeCron(parts), [parts]);
    const runs = useMemo(() => nextRuns(cron, 5), [cron]);

    const updatePart = (i: number, val: string) => { const p = [...parts]; p[i] = val; setParts(p); };
    const handleCopy = () => { navigator.clipboard.writeText(cron); setCopied(true); setTimeout(() => setCopied(false), 1500); };

    return (
        <ToolLayout title="Cron Expression Generator" description="Build and understand cron expressions visually. See next run times and human-readable descriptions." relatedTools={["github-actions-generator", "dockerfile-generator", "json-formatter"]}>
            <div className="mb-4 flex flex-wrap gap-2">
                {PRESETS.map((p) => (<button key={p.label} onClick={() => setParts(p.cron.split(" "))} className="rounded-lg border border-gray-300 dark:border-gray-600 px-2.5 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">{p.label}</button>))}
            </div>

            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 mb-4">
                <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
                    {parts.map((p, i) => (
                        <div key={i} className="text-center">
                            <input value={p} onChange={(e) => updatePart(i, e.target.value)} className="w-16 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-2 py-2 text-center font-mono text-lg focus:border-blue-500 focus:outline-none" />
                            <p className="mt-1 text-[10px] text-gray-500 dark:text-gray-400">{FIELDS[i]}</p>
                            <p className="text-[9px] text-gray-400">{RANGES[i].min}-{RANGES[i].max}</p>
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-center gap-3">
                    <code className="rounded bg-gray-100 dark:bg-gray-800 px-4 py-2 font-mono text-lg text-gray-800 dark:text-gray-200">{cron}</code>
                    <button onClick={handleCopy} className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700">{copied ? "Copied!" : "Copy"}</button>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">📝 Description</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
                </div>
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">🕐 Next 5 Runs</h3>
                    {runs.length > 0 ? (
                        <ul className="space-y-1">{runs.map((d, i) => (<li key={i} className="text-xs text-gray-600 dark:text-gray-400 font-mono">{d.toLocaleString()}</li>))}</ul>
                    ) : <p className="text-xs text-gray-500">Could not compute next runs.</p>}
                </div>
            </div>

            <div className="mt-6 rounded-lg bg-gray-50 dark:bg-gray-900 p-4 border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Syntax Reference</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-gray-600 dark:text-gray-400 font-mono">
                    <div><code>*</code> any value</div>
                    <div><code>5</code> exact value</div>
                    <div><code>1-5</code> range</div>
                    <div><code>*/15</code> every N</div>
                    <div><code>1,3,5</code> list</div>
                </div>
            </div>

            <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
                <p>Build cron expressions visually with instant feedback. See human-readable descriptions and next 5 scheduled run times. Use presets for common schedules or customize each field. Supports standard 5-field cron format.</p>
            </div>
        </ToolLayout>
    );
}
