"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const TIME_ZONES = [
  { label: "UTC (UTC+0)", value: "UTC" },
  { label: "New York — EST/EDT (UTC-5/-4)", value: "America/New_York" },
  { label: "Chicago — CST/CDT (UTC-6/-5)", value: "America/Chicago" },
  { label: "Denver — MST/MDT (UTC-7/-6)", value: "America/Denver" },
  { label: "Los Angeles — PST/PDT (UTC-8/-7)", value: "America/Los_Angeles" },
  { label: "London — GMT/BST (UTC+0/+1)", value: "Europe/London" },
  { label: "Paris — CET/CEST (UTC+1/+2)", value: "Europe/Paris" },
  { label: "Prague — CET/CEST (UTC+1/+2)", value: "Europe/Prague" },
  { label: "Moscow — MSK (UTC+3)", value: "Europe/Moscow" },
  { label: "Tokyo — JST (UTC+9)", value: "Asia/Tokyo" },
  { label: "Shanghai — CST (UTC+8)", value: "Asia/Shanghai" },
  { label: "Kolkata — IST (UTC+5:30)", value: "Asia/Kolkata" },
  { label: "Dubai — GST (UTC+4)", value: "Asia/Dubai" },
  { label: "Sydney — AEST/AEDT (UTC+10/+11)", value: "Australia/Sydney" },
  { label: "Auckland — NZST/NZDT (UTC+12/+13)", value: "Pacific/Auckland" },
];

function formatForTimezone(date: Date, tz: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    }).format(date);
  } catch {
    return "Invalid timezone";
  }
}

function getLocalDatetimeString(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

export default function TimeZoneConverter() {
  const [datetimeInput, setDatetimeInput] = useState<string>(() => getLocalDatetimeString());
  const [fromTz, setFromTz] = useState("UTC");
  const [toTz, setToTz] = useState("America/New_York");
  const [extraZones, setExtraZones] = useState<string[]>([]);

  const handleNow = () => {
    setDatetimeInput(getLocalDatetimeString());
  };

  const handleSwap = () => {
    setFromTz(toTz);
    setToTz(fromTz);
  };

  const handleAddZone = () => {
    // Pick a timezone not already shown
    const shown = new Set([fromTz, toTz, ...extraZones]);
    const next = TIME_ZONES.find((tz) => !shown.has(tz.value));
    if (next) {
      setExtraZones((prev) => [...prev, next.value]);
    } else {
      setExtraZones((prev) => [...prev, "UTC"]);
    }
  };

  const handleRemoveZone = (index: number) => {
    setExtraZones((prev) => prev.filter((_, i) => i !== index));
  };

  const handleExtraZoneChange = (index: number, value: string) => {
    setExtraZones((prev) => prev.map((z, i) => (i === index ? value : z)));
  };

  const conversion = useMemo(() => {
    if (!datetimeInput) return null;
    try {
      // Parse the datetime-local value as if it's in the "from" timezone
      // We create the date by appending "Z" trick won't work for arbitrary TZs,
      // so we use the Intl API to find the UTC equivalent.
      // Strategy: treat the entered datetime as local time in fromTz.
      // Parse as UTC first, then adjust by the offset difference.
      const rawDate = new Date(datetimeInput);
      if (isNaN(rawDate.getTime())) return { error: "Invalid date/time." };

      // Get the UTC offset for fromTz at the rawDate moment
      // by comparing what Intl renders vs UTC
      const utcParts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "UTC",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).formatToParts(rawDate);

      const fromParts = new Intl.DateTimeFormat("en-CA", {
        timeZone: fromTz,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).formatToParts(rawDate);

      const getVal = (parts: Intl.DateTimeFormatPart[], type: string) =>
        parseInt(parts.find((p) => p.type === type)?.value ?? "0", 10);

      const utcMs =
        Date.UTC(
          getVal(utcParts, "year"),
          getVal(utcParts, "month") - 1,
          getVal(utcParts, "day"),
          getVal(utcParts, "hour"),
          getVal(utcParts, "minute"),
          getVal(utcParts, "second")
        );
      const fromMs =
        Date.UTC(
          getVal(fromParts, "year"),
          getVal(fromParts, "month") - 1,
          getVal(fromParts, "day"),
          getVal(fromParts, "hour"),
          getVal(fromParts, "minute"),
          getVal(fromParts, "second")
        );

      // offsetMs: how many ms fromTz is ahead of UTC at rawDate
      const offsetMs = fromMs - utcMs;

      // The actual UTC moment the user intends:
      // user typed a time "as if in fromTz", so actual UTC = rawDate - offsetMs
      const actualUtc = new Date(rawDate.getTime() - offsetMs);

      const toResult = formatForTimezone(actualUtc, toTz);
      const fromResult = formatForTimezone(actualUtc, fromTz);

      const extras = extraZones.map((tz) => ({
        tz,
        label: TIME_ZONES.find((t) => t.value === tz)?.label ?? tz,
        result: formatForTimezone(actualUtc, tz),
      }));

      return { fromResult, toResult, extras, utcIso: actualUtc.toISOString(), error: null };
    } catch {
      return { error: "Conversion failed. Please check your inputs." };
    }
  }, [datetimeInput, fromTz, toTz, extraZones]);

  const resultText =
    conversion && !conversion.error
      ? `From: ${conversion.fromResult}\nTo: ${conversion.toResult}${
          conversion.extras && conversion.extras.length > 0
            ? "\n" + conversion.extras.map((e) => `${e.label}: ${e.result}`).join("\n")
            : ""
        }`
      : "";

  return (
    <ToolLayout
      title="Time Zone Converter Online — Convert Time Between Time Zones"
      description="Convert date and time between any time zones instantly. Compare multiple zones side by side. No signup, fully client-side."
      relatedTools={["epoch-converter", "timestamp-converter", "reading-time-calculator"]}
    >
      {/* Controls */}
      <div className="space-y-4">
        {/* Date/Time Input Row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Date &amp; Time
            </label>
            <input
              type="datetime-local"
              value={datetimeInput}
              onChange={(e) => setDatetimeInput(e.target.value)}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
            />
          </div>
          <button
            onClick={handleNow}
            className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800 transition-colors"
          >
            Now
          </button>
        </div>

        {/* From / Swap / To Row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">From Timezone</label>
            <select
              value={fromTz}
              onChange={(e) => setFromTz(e.target.value)}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none bg-white dark:bg-gray-900"
            >
              {TIME_ZONES.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSwap}
            title="Swap timezones"
            className="flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800 transition-colors sm:mb-0"
          >
            &#8644; Swap
          </button>

          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">To Timezone</label>
            <select
              value={toTz}
              onChange={(e) => setToTz(e.target.value)}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none bg-white dark:bg-gray-900"
            >
              {TIME_ZONES.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Result */}
      {conversion && (
        <div className="mt-6 space-y-3">
          {conversion.error ? (
            <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 px-4 py-3 text-sm text-red-700 dark:text-red-300">
              {conversion.error}
            </div>
          ) : (
            <>
              {/* Primary result card */}
              <div className="rounded-lg border border-blue-100 bg-blue-50 dark:bg-blue-950 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200">Conversion Result</h3>
                  <CopyButton text={resultText} />
                </div>

                <div className="space-y-3">
                  {/* From */}
                  <div className="rounded-md border border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-900 px-4 py-3">
                    <div className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      From &mdash; {TIME_ZONES.find((t) => t.value === fromTz)?.label ?? fromTz}
                    </div>
                    <div className="font-mono text-base font-semibold text-gray-900 dark:text-gray-100">
                      {conversion.fromResult}
                    </div>
                  </div>

                  {/* To */}
                  <div className="rounded-md border border-blue-400 bg-white dark:bg-gray-900 px-4 py-3">
                    <div className="mb-1 text-xs font-medium uppercase tracking-wide text-blue-600 dark:text-blue-400">
                      To &mdash; {TIME_ZONES.find((t) => t.value === toTz)?.label ?? toTz}
                    </div>
                    <div className="font-mono text-base font-semibold text-blue-900">
                      {conversion.toResult}
                    </div>
                  </div>

                  {/* Extra zones */}
                  {conversion.extras && conversion.extras.length > 0 &&
                    conversion.extras.map((extra, i) => (
                      <div key={i} className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3">
                        <div className="mb-1 flex items-center justify-between">
                          <div className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                            Also &mdash;{" "}
                            <select
                              value={extra.tz}
                              onChange={(e) => handleExtraZoneChange(i, e.target.value)}
                              className="ml-1 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 px-1 py-0.5 text-xs text-gray-700 dark:text-gray-300 focus:outline-none"
                            >
                              {TIME_ZONES.map((tz) => (
                                <option key={tz.value} value={tz.value}>
                                  {tz.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <button
                            onClick={() => handleRemoveZone(i)}
                            className="ml-2 text-xs text-red-400 hover:text-red-600 dark:text-red-400"
                            title="Remove this zone"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="font-mono text-sm font-semibold text-gray-800 dark:text-gray-200">
                          {extra.result}
                        </div>
                      </div>
                    ))}
                </div>

                {/* UTC ISO */}
                <div className="mt-3 text-xs text-blue-600 dark:text-blue-400">
                  UTC equivalent: <span className="font-mono">{conversion.utcIso}</span>
                </div>
              </div>

              {/* Add timezone button */}
              <button
                onClick={handleAddZone}
                className="rounded-lg border border-dashed border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-400 transition-colors w-full"
              >
                + Add timezone to compare
              </button>
            </>
          )}
        </div>
      )}

      {/* SEO Content */}
      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">What Is a Time Zone Converter?</h2>
        <p>
          A time zone converter lets you instantly translate a date and time from one location to
          another. Whether you are scheduling an international meeting, tracking a flight arrival, or
          coordinating with a remote team, knowing the correct local time in each region is
          essential. This tool uses your browser&apos;s built-in{" "}
          <code className="rounded bg-gray-100 dark:bg-gray-800 px-1 font-mono">Intl.DateTimeFormat</code> API, so
          no data ever leaves your device.
        </p>

        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">How to Use This Tool</h2>
        <p>
          Pick a date and time using the date/time picker (or click <strong>Now</strong> to use the
          current moment). Select the source timezone in the <strong>From</strong> dropdown, then
          pick your target in the <strong>To</strong> dropdown. The result updates instantly. Use the{" "}
          <strong>Swap</strong> button to reverse the direction, or click{" "}
          <strong>+ Add timezone to compare</strong> to see the equivalent time in multiple zones
          side by side.
        </p>

        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Common Time Zone Abbreviations</h2>
        <ul className="list-inside list-disc space-y-1">
          <li><strong>UTC</strong> — Coordinated Universal Time (UTC+0), the global baseline.</li>
          <li><strong>EST / EDT</strong> — Eastern Standard / Daylight Time (UTC-5 / UTC-4), used in New York.</li>
          <li><strong>CST / CDT</strong> — Central Standard / Daylight Time (UTC-6 / UTC-5), used in Chicago.</li>
          <li><strong>PST / PDT</strong> — Pacific Standard / Daylight Time (UTC-8 / UTC-7), used in Los Angeles.</li>
          <li><strong>GMT / BST</strong> — Greenwich Mean Time / British Summer Time (UTC+0 / UTC+1), used in London.</li>
          <li><strong>CET / CEST</strong> — Central European Time / Summer Time (UTC+1 / UTC+2), used in Paris and Prague.</li>
          <li><strong>IST</strong> — India Standard Time (UTC+5:30), used across India.</li>
          <li><strong>JST</strong> — Japan Standard Time (UTC+9), used in Tokyo.</li>
          <li><strong>AEST / AEDT</strong> — Australian Eastern Standard / Daylight Time (UTC+10 / UTC+11), used in Sydney.</li>
        </ul>

        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Daylight Saving Time (DST)</h2>
        <p>
          Many countries observe Daylight Saving Time, shifting clocks forward in spring and back in
          autumn. The converter automatically accounts for DST because it relies on the IANA timezone
          database built into modern browsers — so the result is always accurate for the specific
          date you enter, not just a fixed offset.
        </p>

        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Why UTC Is the Universal Reference</h2>
        <p>
          Internally, computers store time as an offset from UTC (or as a Unix timestamp). When you
          convert between zones, the tool first resolves your input to a UTC moment, then renders it
          in each target timezone. This is why the UTC equivalent is always shown below your result —
          it is the single unambiguous representation of the same instant in time.
        </p>
      
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Is the Time Zone Converter free to use?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes, the Time Zone Converter is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Is my data safe when using this tool?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Does this tool work on mobile devices?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes. The Time Zone Converter is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Do I need to install anything?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. The Time Zone Converter runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately.
            </p>
          </details>
        </div>
</div>
    </ToolLayout>
  );
}
