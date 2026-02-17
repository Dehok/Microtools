"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const PERMS = ["Read", "Write", "Execute"] as const;
const GROUPS = ["Owner", "Group", "Others"] as const;
const BITS = [4, 2, 1] as const;

function toSymbolic(octal: string): string {
  const map: Record<string, string> = {
    "0": "---",
    "1": "--x",
    "2": "-w-",
    "3": "-wx",
    "4": "r--",
    "5": "r-x",
    "6": "rw-",
    "7": "rwx",
  };
  return octal
    .split("")
    .map((d) => map[d] || "---")
    .join("");
}

function toCommand(octal: string): string {
  return `chmod ${octal} filename`;
}

const COMMON = [
  { octal: "755", label: "rwxr-xr-x — Typical directory/executable" },
  { octal: "644", label: "rw-r--r-- — Typical file" },
  { octal: "777", label: "rwxrwxrwx — Full access (not recommended)" },
  { octal: "600", label: "rw------- — Owner-only read/write" },
  { octal: "700", label: "rwx------ — Owner-only full access" },
  { octal: "444", label: "r--r--r-- — Read-only for all" },
];

export default function ChmodCalculator() {
  const [perms, setPerms] = useState([
    [true, true, true],   // owner: rwx
    [true, false, true],  // group: r-x
    [true, false, true],  // others: r-x
  ]);

  const octal = perms
    .map((group) =>
      group.reduce((sum, on, i) => sum + (on ? BITS[i] : 0), 0)
    )
    .join("");

  const symbolic = toSymbolic(octal);
  const command = toCommand(octal);

  const togglePerm = (g: number, p: number) => {
    const next = perms.map((group, gi) =>
      group.map((val, pi) => (gi === g && pi === p ? !val : val))
    );
    setPerms(next);
  };

  const applyOctal = (val: string) => {
    if (!/^[0-7]{3}$/.test(val)) return;
    const next = val.split("").map((d) => {
      const n = parseInt(d);
      return [!!(n & 4), !!(n & 2), !!(n & 1)];
    });
    setPerms(next);
  };

  return (
    <ToolLayout
      title="Chmod Calculator — Unix File Permissions"
      description="Calculate Unix file permissions in octal and symbolic notation. Visual chmod calculator for Linux and macOS."
      relatedTools={["cron-generator", "hash-generator", "password-generator"]}
    >
      {/* Octal display */}
      <div className="mb-6 rounded-lg border border-blue-100 bg-blue-50 p-4 text-center">
        <div className="mb-1 text-sm font-medium text-blue-600">Octal Notation</div>
        <div className="flex items-center justify-center gap-2">
          <code className="text-3xl font-bold font-mono text-blue-800">{octal}</code>
          <CopyButton text={octal} />
        </div>
        <div className="mt-1 font-mono text-sm text-blue-600">{symbolic}</div>
        <div className="mt-2 flex items-center justify-center gap-2 text-xs text-blue-500">
          <code>{command}</code>
          <CopyButton text={command} />
        </div>
      </div>

      {/* Permission grid */}
      <div className="mb-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-2 text-left font-medium text-gray-700" />
              {PERMS.map((p) => (
                <th key={p} className="py-2 text-center font-medium text-gray-700">
                  {p}
                </th>
              ))}
              <th className="py-2 text-center font-medium text-gray-700">Octal</th>
            </tr>
          </thead>
          <tbody>
            {GROUPS.map((group, gi) => (
              <tr key={group} className="border-b border-gray-100">
                <td className="py-3 font-medium text-gray-700">{group}</td>
                {PERMS.map((_, pi) => (
                  <td key={pi} className="py-3 text-center">
                    <input
                      type="checkbox"
                      checked={perms[gi][pi]}
                      onChange={() => togglePerm(gi, pi)}
                      className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                ))}
                <td className="py-3 text-center font-mono font-bold text-gray-900">
                  {perms[gi].reduce((sum, on, i) => sum + (on ? BITS[i] : 0), 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Manual octal input */}
      <div className="mb-6">
        <label className="mb-1 block text-sm font-medium text-gray-700">Enter Octal Value</label>
        <input
          type="text"
          value={octal}
          onChange={(e) => applyOctal(e.target.value)}
          maxLength={3}
          className="w-24 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-center font-mono text-lg focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Common permissions */}
      <h3 className="mb-2 text-sm font-semibold text-gray-900">Common Permissions</h3>
      <div className="mb-4 flex flex-wrap gap-2">
        {COMMON.map((c) => (
          <button
            key={c.octal}
            onClick={() => applyOctal(c.octal)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              octal === c.octal
                ? "border-blue-300 bg-blue-50 text-blue-700"
                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            {c.octal} — {c.label.split(" — ")[0]}
          </button>
        ))}
      </div>

      <div className="mt-8 border-t border-gray-200 pt-6 text-sm text-gray-600">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">What is chmod?</h2>
        <p className="mb-3">
          <strong>chmod</strong> (change mode) is a Unix/Linux command that sets file permissions.
          Permissions control who can read, write, or execute a file. They are divided into three
          groups: owner, group, and others.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">How Octal Notation Works</h2>
        <p>
          Each digit (0-7) represents a combination of read (4), write (2), and execute (1) permissions.
          For example, 7 = rwx (4+2+1), 5 = r-x (4+1), 0 = --- (no permissions). A common setting
          is 755, giving the owner full access and everyone else read + execute.
        </p>
      </div>
    </ToolLayout>
  );
}
