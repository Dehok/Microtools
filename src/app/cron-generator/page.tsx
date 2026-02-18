"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const PRESETS = [
  { label: "Every minute", cron: "* * * * *" },
  { label: "Every 5 minutes", cron: "*/5 * * * *" },
  { label: "Every 15 minutes", cron: "*/15 * * * *" },
  { label: "Every hour", cron: "0 * * * *" },
  { label: "Every day at midnight", cron: "0 0 * * *" },
  { label: "Every day at 9 AM", cron: "0 9 * * *" },
  { label: "Every Monday at 9 AM", cron: "0 9 * * 1" },
  { label: "Every weekday at 9 AM", cron: "0 9 * * 1-5" },
  { label: "1st of every month", cron: "0 0 1 * *" },
  { label: "Every Sunday at 2 AM", cron: "0 2 * * 0" },
];

function describeCron(cron: string): string {
  const parts = cron.trim().split(/\s+/);
  if (parts.length !== 5) return "Invalid cron expression (need exactly 5 fields)";

  const [min, hour, dom, month, dow] = parts;

  const segments: string[] = [];

  // Minutes
  if (min === "*") segments.push("every minute");
  else if (min.startsWith("*/")) segments.push(`every ${min.slice(2)} minutes`);
  else segments.push(`at minute ${min}`);

  // Hours
  if (hour === "*") { /* every hour already implied */ }
  else if (hour.startsWith("*/")) segments.push(`every ${hour.slice(2)} hours`);
  else segments.push(`at ${hour.padStart(2, "0")}:${min === "*" ? "00" : min.padStart(2, "0")}`);

  // Day of month
  if (dom !== "*") segments.push(`on day ${dom} of the month`);

  // Month
  if (month !== "*") {
    const months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const m = parseInt(month);
    segments.push(`in ${months[m] || month}`);
  }

  // Day of week
  if (dow !== "*") {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    if (dow.includes("-")) {
      const [start, end] = dow.split("-").map(Number);
      segments.push(`${days[start]} through ${days[end]}`);
    } else {
      const d = parseInt(dow);
      segments.push(`on ${days[d] || dow}`);
    }
  }

  return segments.join(", ");
}

export default function CronGenerator() {
  const [minute, setMinute] = useState("*");
  const [hour, setHour] = useState("*");
  const [dom, setDom] = useState("*");
  const [month, setMonth] = useState("*");
  const [dow, setDow] = useState("*");

  const cron = `${minute} ${hour} ${dom} ${month} ${dow}`;
  const description = describeCron(cron);

  const applyPreset = (preset: string) => {
    const parts = preset.split(" ");
    setMinute(parts[0]);
    setHour(parts[1]);
    setDom(parts[2]);
    setMonth(parts[3]);
    setDow(parts[4]);
  };

  return (
    <ToolLayout
      title="Cron Expression Generator & Explainer"
      description="Build and understand cron expressions with a visual editor. Presets for common schedules included."
      relatedTools={["epoch-converter", "json-formatter", "uuid-generator"]}
    >
      {/* Cron display */}
      <div className="mb-4 rounded-lg border border-blue-100 bg-blue-50 dark:bg-blue-950 p-4 text-center">
        <div className="mb-1 text-sm text-blue-600 dark:text-blue-400 font-medium">Cron Expression</div>
        <div className="flex items-center justify-center gap-2">
          <code className="text-2xl font-bold font-mono text-blue-800 dark:text-blue-200">{cron}</code>
          <CopyButton text={cron} />
        </div>
        <div className="mt-2 text-sm text-blue-600 dark:text-blue-400">{description}</div>
      </div>

      {/* Fields */}
      <div className="mb-6 grid grid-cols-5 gap-2">
        {[
          { label: "Minute", value: minute, set: setMinute, hint: "0-59" },
          { label: "Hour", value: hour, set: setHour, hint: "0-23" },
          { label: "Day (month)", value: dom, set: setDom, hint: "1-31" },
          { label: "Month", value: month, set: setMonth, hint: "1-12" },
          { label: "Day (week)", value: dow, set: setDow, hint: "0-6 (Sun=0)" },
        ].map((field) => (
          <div key={field.label}>
            <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">{field.label}</label>
            <input
              type="text"
              value={field.value}
              onChange={(e) => field.set(e.target.value)}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-center font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
            />
            <div className="mt-0.5 text-center text-xs text-gray-400 dark:text-gray-500">{field.hint}</div>
          </div>
        ))}
      </div>

      {/* Presets */}
      <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">Quick Presets</h3>
      <div className="mb-4 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.cron}
            onClick={() => applyPreset(p.cron)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              cron === p.cron
                ? "border-blue-300 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Syntax reference */}
      <div className="mt-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 p-4 text-sm">
        <h3 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">Syntax Reference</h3>
        <div className="grid grid-cols-2 gap-1 font-mono text-xs text-gray-600 dark:text-gray-400 sm:grid-cols-3">
          <span><strong>*</strong> — any value</span>
          <span><strong>5</strong> — exact value</span>
          <span><strong>1-5</strong> — range</span>
          <span><strong>*/15</strong> — every 15</span>
          <span><strong>1,15</strong> — list</span>
          <span><strong>1-5/2</strong> — range + step</span>
        </div>
      </div>

      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">What is a Cron Expression?</h2>
        <p className="mb-3">
          A cron expression is a string of five fields that defines a schedule for running
          commands or scripts automatically. It is used in Unix/Linux cron jobs, CI/CD pipelines,
          cloud schedulers (AWS CloudWatch, Google Cloud Scheduler), and task automation.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Cron Format</h2>
        <p>
          The five fields are: minute (0-59), hour (0-23), day of month (1-31), month (1-12),
          and day of week (0-6, where 0 is Sunday).
        </p>
      </div>
    
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The Cron Expression Generator helps you build and understand cron expressions using a visual, interactive editor. Cron expressions define schedules for automated tasks in Linux, macOS, and many server environments. Instead of memorizing the cryptic five-field syntax, this tool lets you select time intervals visually.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Visual Editor</strong> — Select minutes, hours, days, months, and weekdays from dropdown menus instead of writing raw cron syntax.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Expression Preview</strong> — See the generated cron expression update in real time as you adjust the schedule.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Human-Readable Description</strong> — Displays a natural-language description of what the cron expression means.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Common Presets</strong> — Quick-select buttons for common schedules like every minute, hourly, daily, weekly, and monthly.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Setting up scheduled tasks (cron jobs) on Linux and Unix servers</li>
          <li>Configuring CI/CD pipeline schedules in GitHub Actions, GitLab CI, or Jenkins</li>
          <li>Scheduling database backups, log rotation, and cleanup tasks</li>
          <li>Defining schedule expressions for cloud services (AWS CloudWatch, Azure Scheduler)</li>
          <li>Learning cron syntax with immediate visual feedback</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Use the visual editor to select your desired schedule by choosing values for minutes, hours, days of month, months, and days of week. The cron expression is generated automatically. Use preset buttons for common schedules. Copy the expression and use it in your crontab or scheduling service.
        </p>
      
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              What is a cron expression?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              A cron expression is a string of five fields (minute, hour, day of month, month, day of week) that defines a schedule for automated tasks. For example, &apos;0 9 * * 1&apos; means &apos;every Monday at 9:00 AM&apos;.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              What does the asterisk (*) mean in cron?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              The asterisk (*) means &apos;every possible value&apos; for that field. For example, * in the minute field means &apos;every minute&apos;, and * in the day-of-week field means &apos;every day of the week&apos;.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              What is the difference between cron and crontab?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Cron is the daemon (background service) that runs scheduled tasks. Crontab (cron table) is the file where you define your scheduled tasks and their cron expressions. You edit it with &apos;crontab -e&apos;.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Can I use cron expressions in cloud services?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes. AWS CloudWatch Events, Azure Functions, Google Cloud Scheduler, GitHub Actions, and many CI/CD platforms use cron expressions (sometimes with slight syntax variations) for scheduling.
            </p>
          </details>
        </div>
</div>
    </ToolLayout>
  );
}
