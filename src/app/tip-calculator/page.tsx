"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function TipCalculator() {
    const [bill, setBill] = useState("");
    const [tipPercent, setTipPercent] = useState(18);
    const [people, setPeople] = useState(1);

    const result = useMemo(() => {
        const b = parseFloat(bill);
        if (isNaN(b) || b <= 0) return null;
        const tip = b * (tipPercent / 100);
        const total = b + tip;
        const perPerson = total / Math.max(1, people);
        const tipPerPerson = tip / Math.max(1, people);
        return { tip, total, perPerson, tipPerPerson };
    }, [bill, tipPercent, people]);

    const fmt = (n: number) => "$" + n.toFixed(2);
    const presets = [10, 15, 18, 20, 25, 30];

    return (
        <ToolLayout
            title="Tip Calculator Online"
            description="Calculate tips and split bills easily. Choose a tip percentage and number of people. Instant and free."
            relatedTools={["percentage-calculator", "loan-calculator", "age-calculator"]}
        >
            <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Bill Amount ($)</label>
                <input type="number" value={bill} onChange={(e) => setBill(e.target.value)} placeholder="0.00" min={0} step={0.01} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-3 text-2xl focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>

            <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Tip: {tipPercent}%</label>
                <div className="flex flex-wrap gap-2 mb-2">
                    {presets.map((p) => (
                        <button key={p} onClick={() => setTipPercent(p)} className={`rounded-lg px-3 py-1.5 text-sm font-medium ${tipPercent === p ? "bg-blue-600 text-white" : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}>
                            {p}%
                        </button>
                    ))}
                </div>
                <input type="range" min={0} max={50} value={tipPercent} onChange={(e) => setTipPercent(Number(e.target.value))} className="w-full accent-blue-600" />
            </div>

            <div className="mb-6">
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Split Between</label>
                <div className="flex items-center gap-3">
                    <button onClick={() => setPeople(Math.max(1, people - 1))} className="h-10 w-10 rounded-lg border border-gray-300 dark:border-gray-600 text-lg font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">−</button>
                    <span className="text-xl font-bold text-gray-800 dark:text-gray-200 w-8 text-center">{people}</span>
                    <button onClick={() => setPeople(people + 1)} className="h-10 w-10 rounded-lg border border-gray-300 dark:border-gray-600 text-lg font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">+</button>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{people === 1 ? "person" : "people"}</span>
                </div>
            </div>

            {result && (
                <div className="grid gap-3 grid-cols-2">
                    <div className="rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Tip Amount</p>
                        <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{fmt(result.tip)}</p>
                    </div>
                    <div className="rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900 p-4 text-center">
                        <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Total</p>
                        <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{fmt(result.total)}</p>
                    </div>
                    {people > 1 && (
                        <>
                            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 text-center">
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Tip / Person</p>
                                <p className="text-lg font-bold text-gray-800 dark:text-gray-200">{fmt(result.tipPerPerson)}</p>
                            </div>
                            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 text-center">
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total / Person</p>
                                <p className="text-lg font-bold text-gray-800 dark:text-gray-200">{fmt(result.perPerson)}</p>
                            </div>
                        </>
                    )}
                </div>
            )}

            <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
                <p>Quickly calculate the tip for your bill. Choose from preset tip percentages or use the slider for a custom amount. Split the bill between multiple people with ease.</p>
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    <details className="group"><summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">What is a good tip percentage?</summary><p className="mt-2 pl-4">In the US, 15-20% is standard for restaurants. 18% is a common default. For exceptional service, 25% or more is appropriate.</p></details>
                </div>
            </div>
        </ToolLayout>
    );
}
