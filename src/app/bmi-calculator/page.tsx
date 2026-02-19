"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function BmiCalculator() {
    const [unit, setUnit] = useState<"metric" | "imperial">("metric");
    const [weight, setWeight] = useState("");
    const [height, setHeight] = useState("");
    const [heightFt, setHeightFt] = useState("");
    const [heightIn, setHeightIn] = useState("");

    const result = useMemo(() => {
        const w = parseFloat(weight);
        let h: number;
        if (unit === "metric") {
            h = parseFloat(height) / 100; // cm to m
        } else {
            const ft = parseFloat(heightFt) || 0;
            const inches = parseFloat(heightIn) || 0;
            h = (ft * 12 + inches) * 0.0254; // inches to m
        }
        const wKg = unit === "imperial" ? w * 0.453592 : w;
        if (isNaN(wKg) || isNaN(h) || h <= 0 || wKg <= 0) return null;

        const bmi = wKg / (h * h);
        let category = "";
        let color = "";
        if (bmi < 18.5) { category = "Underweight"; color = "text-blue-600 dark:text-blue-400"; }
        else if (bmi < 25) { category = "Normal weight"; color = "text-green-600 dark:text-green-400"; }
        else if (bmi < 30) { category = "Overweight"; color = "text-yellow-600 dark:text-yellow-400"; }
        else { category = "Obese"; color = "text-red-600 dark:text-red-400"; }

        const normalMin = 18.5 * h * h;
        const normalMax = 24.9 * h * h;

        return { bmi: bmi.toFixed(1), category, color, normalMin: normalMin.toFixed(1), normalMax: normalMax.toFixed(1) };
    }, [weight, height, heightFt, heightIn, unit]);

    return (
        <ToolLayout
            title="BMI Calculator Online"
            description="Calculate your Body Mass Index (BMI). Supports metric and imperial units. Free, instant, private."
            relatedTools={["age-calculator", "percentage-calculator", "tip-calculator"]}
        >
            <div className="mb-4 flex gap-2">
                <button onClick={() => setUnit("metric")} className={`rounded-lg px-4 py-2 text-sm font-medium ${unit === "metric" ? "bg-blue-600 text-white" : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"}`}>Metric (kg/cm)</button>
                <button onClick={() => setUnit("imperial")} className={`rounded-lg px-4 py-2 text-sm font-medium ${unit === "imperial" ? "bg-blue-600 text-white" : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"}`}>Imperial (lbs/ft)</button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Weight ({unit === "metric" ? "kg" : "lbs"})</label>
                    <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder={unit === "metric" ? "70" : "154"} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-3 text-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                {unit === "metric" ? (
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Height (cm)</label>
                        <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="175" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-3 text-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Feet</label>
                            <input type="number" value={heightFt} onChange={(e) => setHeightFt(e.target.value)} placeholder="5" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-3 text-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Inches</label>
                            <input type="number" value={heightIn} onChange={(e) => setHeightIn(e.target.value)} placeholder="9" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-3 text-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                        </div>
                    </div>
                )}
            </div>

            {result && (
                <div className="mt-6 space-y-4">
                    <div className="rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Your BMI</p>
                        <p className="text-5xl font-bold text-gray-800 dark:text-gray-200">{result.bmi}</p>
                        <p className={`mt-2 text-lg font-semibold ${result.color}`}>{result.category}</p>
                    </div>
                    <div className="grid grid-cols-4 gap-1 rounded-lg overflow-hidden text-center text-xs font-medium">
                        <div className="bg-blue-100 dark:bg-blue-900 py-2 text-blue-700 dark:text-blue-300">Under 18.5<br />Underweight</div>
                        <div className="bg-green-100 dark:bg-green-900 py-2 text-green-700 dark:text-green-300">18.5–24.9<br />Normal</div>
                        <div className="bg-yellow-100 dark:bg-yellow-900 py-2 text-yellow-700 dark:text-yellow-300">25–29.9<br />Overweight</div>
                        <div className="bg-red-100 dark:bg-red-900 py-2 text-red-700 dark:text-red-300">30+<br />Obese</div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">Healthy weight range for your height: {result.normalMin}–{result.normalMax} kg</p>
                </div>
            )}

            <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
                <p>Calculate your Body Mass Index to determine if your weight is in a healthy range for your height. Supports both metric (kg/cm) and imperial (lbs/ft) units. BMI is a screening tool and is not a diagnostic of health.</p>
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    <details className="group"><summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">What is a healthy BMI?</summary><p className="mt-2 pl-4">A BMI between 18.5 and 24.9 is considered normal weight. Below 18.5 is underweight, 25-29.9 is overweight, and 30+ is classified as obese.</p></details>
                    <details className="group"><summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Is BMI accurate for everyone?</summary><p className="mt-2 pl-4">BMI does not account for muscle mass, bone density, or body composition. Athletes may have a high BMI without being overweight. Consult a healthcare professional for a comprehensive assessment.</p></details>
                </div>
            </div>
        </ToolLayout>
    );
}
