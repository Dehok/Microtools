"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const CHARSETS = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

function generatePassword(
  length: number,
  options: Record<string, boolean>
): string {
  let chars = "";
  if (options.lowercase) chars += CHARSETS.lowercase;
  if (options.uppercase) chars += CHARSETS.uppercase;
  if (options.numbers) chars += CHARSETS.numbers;
  if (options.symbols) chars += CHARSETS.symbols;

  if (!chars) chars = CHARSETS.lowercase + CHARSETS.numbers;

  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (v) => chars[v % chars.length]).join("");
}

function getStrength(password: string): { label: string; color: string; width: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 2) return { label: "Weak", color: "bg-red-500", width: "w-1/4" };
  if (score <= 3) return { label: "Fair", color: "bg-yellow-500", width: "w-1/2" };
  if (score <= 4) return { label: "Strong", color: "bg-blue-500", width: "w-3/4" };
  return { label: "Very Strong", color: "bg-green-500", width: "w-full" };
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: true,
  });
  const [password, setPassword] = useState(() =>
    generatePassword(16, { lowercase: true, uppercase: true, numbers: true, symbols: true })
  );
  const [count, setCount] = useState(1);

  const handleGenerate = useCallback(() => {
    if (count === 1) {
      setPassword(generatePassword(length, options));
    } else {
      const passwords = Array.from({ length: count }, () =>
        generatePassword(length, options)
      );
      setPassword(passwords.join("\n"));
    }
  }, [length, options, count]);

  const toggleOption = (key: string) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  const strength = getStrength(password.split("\n")[0]);

  return (
    <ToolLayout
      title="Password Generator Online — Strong & Random"
      description="Generate strong, random, and secure passwords. Customize length, characters, and generate in bulk."
      relatedTools={["hash-generator", "uuid-generator", "base64-encode-decode"]}
    >
      {/* Password display */}
      <div className="mb-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 p-4">
        <div className="flex items-center justify-between">
          <pre className="select-all whitespace-pre-wrap break-all font-mono text-lg">
            {password}
          </pre>
          <CopyButton text={password} />
        </div>
      </div>

      {/* Strength bar */}
      <div className="mb-6">
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="text-gray-500 dark:text-gray-400">Strength</span>
          <span className="font-medium text-gray-700 dark:text-gray-300">{strength.label}</span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className={`h-2 rounded-full transition-all ${strength.color} ${strength.width}`}
          />
        </div>
      </div>

      {/* Length slider */}
      <div className="mb-4">
        <div className="mb-1 flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Length</label>
          <span className="rounded bg-blue-50 dark:bg-blue-950 px-2 py-0.5 text-sm font-bold text-blue-600 dark:text-blue-400">
            {length}
          </span>
        </div>
        <input
          type="range"
          min={4}
          max={128}
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500">
          <span>4</span>
          <span>128</span>
        </div>
      </div>

      {/* Character options */}
      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {Object.entries(CHARSETS).map(([key, chars]) => (
          <label
            key={key}
            className={`flex cursor-pointer items-center gap-2 rounded-lg border p-2.5 text-sm transition-colors ${
              options[key as keyof typeof options]
                ? "border-blue-300 bg-blue-50 dark:bg-blue-950"
                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
            }`}
          >
            <input
              type="checkbox"
              checked={options[key as keyof typeof options]}
              onChange={() => toggleOption(key)}
              className="rounded border-gray-300 dark:border-gray-600"
            />
            <div>
              <div className="font-medium capitalize">{key}</div>
              <div className="text-xs text-gray-400 dark:text-gray-500">{chars.slice(0, 8)}...</div>
            </div>
          </label>
        ))}
      </div>

      {/* Count + generate */}
      <div className="mb-4 flex items-center gap-2">
        <button
          onClick={handleGenerate}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Generate
        </button>
        <select
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="rounded-md border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-sm"
        >
          <option value={1}>1 password</option>
          <option value={5}>5 passwords</option>
          <option value={10}>10 passwords</option>
          <option value={25}>25 passwords</option>
        </select>
      </div>

      {/* SEO */}
      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Why use a password generator?</h2>
        <p className="mb-3">
          Humans are bad at creating random passwords. We tend to use predictable patterns,
          dictionary words, and personal information. A random password generator creates truly
          unpredictable passwords that are much harder to crack.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">How long should my password be?</h2>
        <p className="mb-3">
          We recommend at least 16 characters with a mix of lowercase, uppercase, numbers, and
          symbols. A 16-character random password would take billions of years to crack with
          current technology.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Is this generator secure?</h2>
        <p>
          Yes. Passwords are generated using the Web Crypto API (crypto.getRandomValues), which
          provides cryptographically secure random numbers. No passwords are stored or sent anywhere.
        </p>
      </div>
    </ToolLayout>
  );
}
