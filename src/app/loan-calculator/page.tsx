"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function LoanCalculator() {
    const [amount, setAmount] = useState("250000");
    const [rate, setRate] = useState("5.5");
    const [years, setYears] = useState("30");

    const result = useMemo(() => {
        const p = parseFloat(amount);
        const r = parseFloat(rate) / 100 / 12;
        const n = parseFloat(years) * 12;
        if (isNaN(p) || isNaN(r) || isNaN(n) || p <= 0 || r <= 0 || n <= 0) return null;

        const monthly = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        const totalPayment = monthly * n;
        const totalInterest = totalPayment - p;

        return { monthly, totalPayment, totalInterest, principal: p };
    }, [amount, rate, years]);

    const fmt = (n: number) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <ToolLayout
            title="Loan Calculator Online"
            description="Calculate monthly payments, total interest, and total cost for any loan. Free, instant, no signup required."
            relatedTools={["percentage-calculator", "bmi-calculator", "tip-calculator"]}
        >
            <div className="grid gap-4 sm:grid-cols-3">
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Loan Amount ($)</label>
                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} min={0} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-3 text-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Interest Rate (%/year)</label>
                    <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} min={0} step={0.1} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-3 text-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Loan Term (years)</label>
                    <input type="number" value={years} onChange={(e) => setYears(e.target.value)} min={1} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-3 text-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
            </div>

            {result && (
                <div className="mt-6 space-y-4">
                    <div className="rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900 p-6 text-center">
                        <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">Monthly Payment</p>
                        <p className="text-4xl font-bold text-gray-800 dark:text-gray-200">{fmt(result.monthly)}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 text-center">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Principal</p>
                            <p className="text-lg font-bold text-gray-800 dark:text-gray-200">{fmt(result.principal)}</p>
                        </div>
                        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 text-center">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Interest</p>
                            <p className="text-lg font-bold text-red-600 dark:text-red-400">{fmt(result.totalInterest)}</p>
                        </div>
                        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 text-center">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Payment</p>
                            <p className="text-lg font-bold text-gray-800 dark:text-gray-200">{fmt(result.totalPayment)}</p>
                        </div>
                    </div>
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="flex h-4">
                            <div className="bg-blue-500" style={{ width: `${(result.principal / result.totalPayment) * 100}%` }} />
                            <div className="bg-red-400" style={{ width: `${(result.totalInterest / result.totalPayment) * 100}%` }} />
                        </div>
                        <div className="flex justify-between px-3 py-1 text-xs text-gray-500 dark:text-gray-400">
                            <span>Principal ({((result.principal / result.totalPayment) * 100).toFixed(0)}%)</span>
                            <span>Interest ({((result.totalInterest / result.totalPayment) * 100).toFixed(0)}%)</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
                <p>Calculate your monthly loan payment based on the loan amount, interest rate, and term. See the total interest paid and a visual breakdown of principal vs. interest.</p>
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    <details className="group"><summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">What formula is used?</summary><p className="mt-2 pl-4">This calculator uses the standard amortization formula: M = P × [r(1+r)^n] / [(1+r)^n – 1], where P is principal, r is monthly rate, and n is number of payments.</p></details>
                    <details className="group"><summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Does this include taxes and insurance?</summary><p className="mt-2 pl-4">No, this calculates principal and interest only. Property taxes, homeowners insurance, and PMI are not included.</p></details>
                </div>
            </div>
        </ToolLayout>
    );
}
