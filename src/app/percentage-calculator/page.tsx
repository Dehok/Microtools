"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function PercentageCalculator() {
    const [mode, setMode] = useState<"whatIs" | "isWhatPercent" | "change" | "increase" | "decrease">("whatIs");
    const [val1, setVal1] = useState("");
    const [val2, setVal2] = useState("");

    const result = useMemo(() => {
        const a = parseFloat(val1);
        const b = parseFloat(val2);
        if (isNaN(a) || isNaN(b)) return null;
        switch (mode) {
            case "whatIs": return { label: `${a}% of ${b}`, value: (a / 100) * b };
            case "isWhatPercent": return { label: `${a} is what % of ${b}`, value: b === 0 ? 0 : (a / b) * 100 };
            case "change": return { label: `% change from ${a} to ${b}`, value: a === 0 ? 0 : ((b - a) / Math.abs(a)) * 100 };
            case "increase": return { label: `${a} increased by ${b}%`, value: a + (a * b) / 100 };
            case "decrease": return { label: `${a} decreased by ${b}%`, value: a - (a * b) / 100 };
            default: return null;
        }
    }, [mode, val1, val2]);

    const modes = [
        { key: "whatIs", label: "What is X% of Y?", ph1: "Percentage (X)", ph2: "Value (Y)" },
        { key: "isWhatPercent", label: "X is what % of Y?", ph1: "Value (X)", ph2: "Total (Y)" },
        { key: "change", label: "% Change from X to Y", ph1: "From (X)", ph2: "To (Y)" },
        { key: "increase", label: "X increased by Y%", ph1: "Value (X)", ph2: "Increase (Y%)" },
        { key: "decrease", label: "X decreased by Y%", ph1: "Value (X)", ph2: "Decrease (Y%)" },
    ];

    const currentMode = modes.find((m) => m.key === mode)!;

    return (
        <ToolLayout
            title="Percentage Calculator Online"
            description="Calculate percentages instantly — find percentages of numbers, percentage changes, increases, and decreases. Free and easy to use."
            relatedTools={["age-calculator", "word-counter", "reading-time-calculator"]}
        >
            <div className="mb-4 flex flex-wrap gap-2">
                {modes.map((m) => (
                    <button
                        key={m.key}
                        onClick={() => { setMode(m.key as typeof mode); setVal1(""); setVal2(""); }}
                        className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${mode === m.key ? "bg-blue-600 text-white" : "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                    >
                        {m.label}
                    </button>
                ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">{currentMode.ph1}</label>
                    <input type="number" value={val1} onChange={(e) => setVal1(e.target.value)} placeholder={currentMode.ph1} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-3 text-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">{currentMode.ph2}</label>
                    <input type="number" value={val2} onChange={(e) => setVal2(e.target.value)} placeholder={currentMode.ph2} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-3 text-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
            </div>

            {result && (
                <div className="mt-6 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900 p-6 text-center">
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">{result.label}</p>
                    <p className="text-4xl font-bold text-gray-800 dark:text-gray-200">
                        {mode === "isWhatPercent" || mode === "change" ? result.value.toFixed(2) + "%" : result.value.toFixed(2)}
                    </p>
                </div>
            )}

            <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
                <p>A versatile percentage calculator that supports 5 common percentage operations: finding a percentage of a number, determining what percent one number is of another, calculating percentage change, and computing increases or decreases by a given percentage.</p>
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    <details className="group"><summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">How do I calculate a percentage of a number?</summary><p className="mt-2 pl-4">Select &quot;What is X% of Y?&quot;, enter the percentage and the total value. For example, 15% of 200 = 30.</p></details>
                    <details className="group"><summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">How is percentage change calculated?</summary><p className="mt-2 pl-4">Percentage change = ((New - Old) / |Old|) × 100. A positive result means an increase, negative means a decrease.</p></details>
                </div>
            </div>
        </ToolLayout>
    );
}
