"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function AgeCalculator() {
    const [birthDate, setBirthDate] = useState("");
    const [targetDate, setTargetDate] = useState(new Date().toISOString().split("T")[0]);

    const result = useMemo(() => {
        if (!birthDate || !targetDate) return null;
        const birth = new Date(birthDate);
        const target = new Date(targetDate);
        if (isNaN(birth.getTime()) || isNaN(target.getTime())) return null;
        if (birth > target) return null;

        let years = target.getFullYear() - birth.getFullYear();
        let months = target.getMonth() - birth.getMonth();
        let days = target.getDate() - birth.getDate();

        if (days < 0) {
            months--;
            const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
            days += prevMonth.getDate();
        }
        if (months < 0) { years--; months += 12; }

        const totalDays = Math.floor((target.getTime() - birth.getTime()) / 86400000);
        const totalWeeks = Math.floor(totalDays / 7);
        const totalMonths = years * 12 + months;
        const totalHours = totalDays * 24;

        const nextBirthday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
        if (nextBirthday <= target) nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
        const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - target.getTime()) / 86400000);

        const zodiac = getZodiac(birth.getMonth() + 1, birth.getDate());
        const dayOfWeek = birth.toLocaleDateString("en-US", { weekday: "long" });

        return { years, months, days, totalDays, totalWeeks, totalMonths, totalHours, daysUntilBirthday, zodiac, dayOfWeek };
    }, [birthDate, targetDate]);

    return (
        <ToolLayout
            title="Age Calculator Online"
            description="Calculate your exact age in years, months, days, hours, and more. Find your zodiac sign and days until next birthday. Free and instant."
            relatedTools={["percentage-calculator", "word-counter", "reading-time-calculator"]}
        >
            <div className="mb-6 grid gap-4 sm:grid-cols-2">
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Date of Birth</label>
                    <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Calculate Age On</label>
                    <input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
            </div>

            {result && (
                <div className="space-y-4">
                    <div className="rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900 p-6 text-center">
                        <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">Your Age</p>
                        <p className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                            {result.years} <span className="text-lg font-normal text-gray-500 dark:text-gray-400">years</span>{" "}
                            {result.months} <span className="text-lg font-normal text-gray-500 dark:text-gray-400">months</span>{" "}
                            {result.days} <span className="text-lg font-normal text-gray-500 dark:text-gray-400">days</span>
                        </p>
                    </div>

                    <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
                        <Stat label="Total Days" value={result.totalDays.toLocaleString()} />
                        <Stat label="Total Weeks" value={result.totalWeeks.toLocaleString()} />
                        <Stat label="Total Months" value={result.totalMonths.toLocaleString()} />
                        <Stat label="Total Hours" value={result.totalHours.toLocaleString()} />
                    </div>

                    <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
                        <Stat label="Born On" value={result.dayOfWeek} />
                        <Stat label="Zodiac Sign" value={result.zodiac} />
                        <Stat label="Next Birthday In" value={`${result.daysUntilBirthday} days`} />
                    </div>
                </div>
            )}

            {!result && birthDate && (
                <p className="text-sm text-red-500 text-center mt-4">Please enter a valid birth date before the target date.</p>
            )}

            <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
                <p>Calculate your exact age down to the day. See your age in years, months, days, weeks, hours, and more. Find your zodiac sign, what day of the week you were born, and how many days until your next birthday.</p>
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    <details className="group"><summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">How is the age calculated?</summary><p className="mt-2 pl-4">We calculate the exact difference between your birth date and the target date, properly accounting for varying month lengths and leap years.</p></details>
                    <details className="group"><summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Can I calculate age for a future date?</summary><p className="mt-2 pl-4">Yes! Change the &quot;Calculate Age On&quot; field to any future date to see how old you&#39;ll be then.</p></details>
                </div>
            </div>
        </ToolLayout>
    );
}

function Stat({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
            <p className="text-lg font-bold text-gray-800 dark:text-gray-200">{value}</p>
        </div>
    );
}

function getZodiac(month: number, day: number): string {
    const signs = [
        { name: "♑ Capricorn", end: [1, 19] }, { name: "♒ Aquarius", end: [2, 18] },
        { name: "♓ Pisces", end: [3, 20] }, { name: "♈ Aries", end: [4, 19] },
        { name: "♉ Taurus", end: [5, 20] }, { name: "♊ Gemini", end: [6, 20] },
        { name: "♋ Cancer", end: [7, 22] }, { name: "♌ Leo", end: [8, 22] },
        { name: "♍ Virgo", end: [9, 22] }, { name: "♎ Libra", end: [10, 22] },
        { name: "♏ Scorpio", end: [11, 21] }, { name: "♐ Sagittarius", end: [12, 21] },
        { name: "♑ Capricorn", end: [12, 31] },
    ];
    for (const sign of signs) {
        if (month < sign.end[0] || (month === sign.end[0] && day <= sign.end[1])) return sign.name;
    }
    return "♑ Capricorn";
}
