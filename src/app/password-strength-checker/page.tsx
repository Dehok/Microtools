"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const COMMON_PATTERNS = [
  "123", "1234", "12345", "123456", "1234567", "12345678",
  "abc", "abcd", "qwerty", "qwertz", "azerty",
  "password", "pass", "letmein", "welcome", "admin",
  "iloveyou", "sunshine", "monkey", "dragon", "master",
];

function hasRepeatedChars(password: string): boolean {
  for (let i = 0; i <= password.length - 3; i++) {
    if (
      password[i] === password[i + 1] &&
      password[i + 1] === password[i + 2]
    ) {
      return true;
    }
  }
  return false;
}

function hasCommonPattern(password: string): boolean {
  const lower = password.toLowerCase();
  return COMMON_PATTERNS.some((p) => lower.includes(p));
}

function calcCharSpace(password: string): number {
  let space = 0;
  if (/[a-z]/.test(password)) space += 26;
  if (/[A-Z]/.test(password)) space += 26;
  if (/[0-9]/.test(password)) space += 10;
  if (/[^a-zA-Z0-9]/.test(password)) space += 32;
  return space || 1;
}

function formatCrackTime(seconds: number): string {
  if (seconds < 1) return "Less than a second";
  if (seconds < 60) return `${Math.round(seconds)} second${Math.round(seconds) !== 1 ? "s" : ""}`;
  const minutes = seconds / 60;
  if (minutes < 60) return `${Math.round(minutes)} minute${Math.round(minutes) !== 1 ? "s" : ""}`;
  const hours = minutes / 60;
  if (hours < 24) return `${Math.round(hours)} hour${Math.round(hours) !== 1 ? "s" : ""}`;
  const days = hours / 24;
  if (days < 365) return `${Math.round(days)} day${Math.round(days) !== 1 ? "s" : ""}`;
  const years = days / 365;
  if (years < 1_000) return `${Math.round(years)} year${Math.round(years) !== 1 ? "s" : ""}`;
  if (years < 1_000_000) return `${(years / 1_000).toFixed(1)} thousand years`;
  if (years < 1_000_000_000) return `${(years / 1_000_000).toFixed(1)} million years`;
  if (years < 1_000_000_000_000) return `${(years / 1_000_000_000).toFixed(1)} billion years`;
  return "Practically uncrackable";
}

interface Analysis {
  score: number;
  label: string;
  barColor: string;
  barWidth: string;
  crackTime: string;
  entropy: number;
  criteria: { label: string; passed: boolean }[];
  tips: string[];
  composition: {
    uppercase: number;
    lowercase: number;
    digits: number;
    symbols: number;
  };
}

function analyzePassword(password: string): Analysis {
  const len = password.length;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSymbol = /[^a-zA-Z0-9]/.test(password);
  const longEnough8 = len >= 8;
  const longEnough12 = len >= 12;
  const noCommon = !hasCommonPattern(password);
  const noRepeat = !hasRepeatedChars(password);

  const criteria = [
    { label: "At least 8 characters", passed: longEnough8 },
    { label: "At least 12 characters", passed: longEnough12 },
    { label: "Contains uppercase letters (A-Z)", passed: hasUpper },
    { label: "Contains lowercase letters (a-z)", passed: hasLower },
    { label: "Contains numbers (0-9)", passed: hasDigit },
    { label: "Contains special characters (!@#$...)", passed: hasSymbol },
    { label: "No common patterns (123, abc, qwerty...)", passed: noCommon },
    { label: "No repeated characters (aaa, 111...)", passed: noRepeat },
  ];

  const passedCount = criteria.filter((c) => c.passed).length;

  // Score: weighted 0-100
  let rawScore = 0;
  if (longEnough8) rawScore += 10;
  if (longEnough12) rawScore += 15;
  if (len >= 16) rawScore += 10;
  if (hasUpper) rawScore += 10;
  if (hasLower) rawScore += 10;
  if (hasDigit) rawScore += 10;
  if (hasSymbol) rawScore += 15;
  if (noCommon) rawScore += 10;
  if (noRepeat) rawScore += 10;
  const score = Math.min(100, rawScore);

  let label: string;
  let barColor: string;
  let barWidth: string;

  if (len === 0) {
    label = "";
    barColor = "bg-gray-200 dark:bg-gray-700";
    barWidth = "w-0";
  } else if (score < 20) {
    label = "Very Weak";
    barColor = "bg-red-500";
    barWidth = "w-1/5";
  } else if (score < 40) {
    label = "Weak";
    barColor = "bg-orange-500";
    barWidth = "w-2/5";
  } else if (score < 60) {
    label = "Fair";
    barColor = "bg-yellow-500";
    barWidth = "w-3/5";
  } else if (score < 80) {
    label = "Strong";
    barColor = "bg-blue-500";
    barWidth = "w-4/5";
  } else {
    label = "Very Strong";
    barColor = "bg-green-500";
    barWidth = "w-full";
  }

  // Entropy
  const charSpace = calcCharSpace(password);
  const entropy = len > 0 ? Math.log2(Math.pow(charSpace, len)) : 0;

  // Crack time: assume 10 billion guesses/second (GPU attack)
  const guessesPerSecond = 10_000_000_000;
  const totalCombinations = Math.pow(charSpace, len);
  const avgGuesses = totalCombinations / 2;
  const secondsToCrack = len > 0 ? avgGuesses / guessesPerSecond : 0;
  const crackTime = len > 0 ? formatCrackTime(secondsToCrack) : "—";

  // Tips
  const tips: string[] = [];
  if (!longEnough8) tips.push("Use at least 8 characters.");
  if (!longEnough12) tips.push("Increase length to 12+ characters for better security.");
  if (len > 0 && len < 16) tips.push("Aim for 16+ characters for strong security.");
  if (!hasUpper) tips.push("Add uppercase letters (A-Z).");
  if (!hasLower) tips.push("Add lowercase letters (a-z).");
  if (!hasDigit) tips.push("Include numbers (0-9).");
  if (!hasSymbol) tips.push("Add special characters like !@#$%^&*.");
  if (!noCommon) tips.push("Avoid common patterns like '123', 'abc', or 'password'.");
  if (!noRepeat) tips.push("Avoid repeating the same character three or more times in a row.");
  if (passedCount >= criteria.length && len >= 16)
    tips.push("Excellent password! Consider using a password manager to store it safely.");

  // Composition
  const uppercase = (password.match(/[A-Z]/g) || []).length;
  const lowercase = (password.match(/[a-z]/g) || []).length;
  const digits = (password.match(/[0-9]/g) || []).length;
  const symbols = (password.match(/[^a-zA-Z0-9]/g) || []).length;

  return {
    score,
    label,
    barColor,
    barWidth,
    crackTime,
    entropy,
    criteria,
    tips,
    composition: { uppercase, lowercase, digits, symbols },
  };
}

export default function PasswordStrengthChecker() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const analysis = useMemo(() => analyzePassword(password), [password]);

  const scoreColor =
    analysis.score === 0
      ? "text-gray-400 dark:text-gray-500"
      : analysis.score < 20
      ? "text-red-600 dark:text-red-400"
      : analysis.score < 40
      ? "text-orange-600 dark:text-orange-400"
      : analysis.score < 60
      ? "text-yellow-600 dark:text-yellow-400"
      : analysis.score < 80
      ? "text-blue-600 dark:text-blue-400"
      : "text-green-600 dark:text-green-400";

  return (
    <ToolLayout
      title="Password Strength Checker — Test Your Password Security"
      description="Check how strong your password is. Get an instant score, crack time estimate, entropy calculation, and tips to improve security. Everything runs locally — nothing is sent anywhere."
      relatedTools={["password-generator", "hash-generator", "hmac-generator"]}
    >
      {/* Privacy notice */}
      <div className="mb-5 flex items-start gap-2 rounded-lg border border-blue-100 bg-blue-50 dark:bg-blue-950 px-4 py-3 text-sm text-blue-800 dark:text-blue-200">
        <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 1a9 9 0 100 18A9 9 0 0010 1zm.75 4.75a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0v-4.5zm-.75 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
        <span>
          <strong>100% private:</strong> Your password is analyzed entirely in your browser. No data is ever sent to any server.
        </span>
      </div>

      {/* Password input */}
      <div className="mb-6">
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Enter your password
        </label>
        <div className="relative flex items-center">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Type or paste your password here..."
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 py-3 pl-4 pr-24 font-mono text-base shadow-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
            autoComplete="off"
            spellCheck={false}
          />
          <div className="absolute right-2 flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
            {password && <CopyButton text={password} />}
          </div>
        </div>
      </div>

      {/* Strength meter */}
      {password && (
        <>
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Strength</span>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-semibold ${scoreColor}`}>
                  {analysis.label}
                </span>
                <span className={`text-sm font-bold ${scoreColor}`}>
                  {analysis.score}/100
                </span>
              </div>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${analysis.barColor} ${analysis.barWidth}`}
              />
            </div>
          </div>

          {/* Stats row */}
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 p-3 text-center">
              <div className="text-xs text-gray-500 dark:text-gray-400">Length</div>
              <div className="mt-0.5 text-xl font-bold text-gray-800 dark:text-gray-200">{password.length}</div>
              <div className="text-xs text-gray-400 dark:text-gray-500">characters</div>
            </div>
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 p-3 text-center">
              <div className="text-xs text-gray-500 dark:text-gray-400">Entropy</div>
              <div className="mt-0.5 text-xl font-bold text-gray-800 dark:text-gray-200">
                {analysis.entropy < 1000
                  ? analysis.entropy.toFixed(1)
                  : ">1000"}
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500">bits</div>
            </div>
            <div className="col-span-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 p-3 text-center sm:col-span-1">
              <div className="text-xs text-gray-500 dark:text-gray-400">Est. crack time</div>
              <div className="mt-0.5 text-sm font-bold text-gray-800 dark:text-gray-200">{analysis.crackTime}</div>
              <div className="text-xs text-gray-400 dark:text-gray-500">at 10B guesses/sec</div>
            </div>
          </div>

          {/* Character composition */}
          <div className="mb-6">
            <h3 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Character Composition</h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                { label: "Uppercase", value: analysis.composition.uppercase, color: "text-purple-600 dark:text-purple-400" },
                { label: "Lowercase", value: analysis.composition.lowercase, color: "text-blue-600 dark:text-blue-400" },
                { label: "Digits", value: analysis.composition.digits, color: "text-green-600 dark:text-green-400" },
                { label: "Symbols", value: analysis.composition.symbols, color: "text-orange-600 dark:text-orange-400" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-center"
                >
                  <div className={`text-2xl font-bold ${item.color}`}>{item.value}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Criteria checklist */}
          <div className="mb-6">
            <h3 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Security Criteria</h3>
            <ul className="space-y-1.5">
              {analysis.criteria.map((c) => (
                <li key={c.label} className="flex items-center gap-2 text-sm">
                  {c.passed ? (
                    <svg className="h-4 w-4 flex-shrink-0 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4 flex-shrink-0 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  <span className={c.passed ? "text-gray-700 dark:text-gray-300" : "text-gray-500 dark:text-gray-400"}>{c.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tips */}
          {analysis.tips.length > 0 && (
            <div className="mb-2 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <h3 className="mb-2 text-sm font-semibold text-amber-800">Tips to improve</h3>
              <ul className="space-y-1">
                {analysis.tips.map((tip) => (
                  <li key={tip} className="flex items-start gap-2 text-sm text-amber-900">
                    <span className="mt-0.5 text-amber-500">&#8594;</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {/* Empty state */}
      {!password && (
        <div className="flex flex-col items-center py-10 text-center text-gray-400 dark:text-gray-500">
          <svg className="mb-3 h-10 w-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <p className="text-sm">Type a password above to analyze its strength</p>
        </div>
      )}

      {/* SEO section */}
      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
          What makes a password strong?
        </h2>
        <p className="mb-3">
          A strong password is long (16+ characters), uses a mix of uppercase and lowercase letters,
          digits, and special symbols, and avoids common words or patterns. Password length is the
          single most important factor — each additional character multiplies the number of possible
          combinations exponentially.
        </p>

        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
          How is password entropy calculated?
        </h2>
        <p className="mb-3">
          Entropy measures how unpredictable a password is, expressed in bits. It is calculated as
          log2(C^L), where C is the size of the character set used (e.g., 26 for lowercase only,
          95 for all printable ASCII) and L is the password length. A higher entropy means a more
          secure password — aim for at least 60 bits for everyday accounts and 80+ bits for sensitive ones.
        </p>

        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
          How is crack time estimated?
        </h2>
        <p className="mb-3">
          The estimated crack time assumes a brute-force attack at 10 billion guesses per second —
          a realistic rate for a modern GPU rig attacking offline hashed passwords. The calculation
          uses the total number of possible combinations divided by 2 (average case) and divided
          by the guessing speed. Online attacks are far slower, making even shorter passwords
          relatively safe with rate limiting and lockouts.
        </p>

        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
          Is my password safe to enter here?
        </h2>
        <p className="mb-3">
          Yes. This tool runs entirely in your browser using JavaScript. Your password is never
          sent to any server, logged, or stored anywhere. You can verify this by checking the
          network tab in your browser's developer tools — no requests are made while you type.
        </p>

        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
          Best practices for password security
        </h2>
        <ul className="mb-3 list-disc space-y-1 pl-5">
          <li>Use a unique password for every account — never reuse passwords.</li>
          <li>Use a password manager (Bitwarden, KeePass, 1Password) to generate and store passwords.</li>
          <li>Enable two-factor authentication (2FA) wherever possible.</li>
          <li>Prefer passphrases (e.g., four random words) for passwords you must memorize.</li>
          <li>Change passwords immediately if a service you use reports a data breach.</li>
        </ul>
      </div>
    
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The Password Strength Checker is a free online tool available on CodeUtilo. Analyze password strength with detailed scoring. Get tips to improve security. All processing happens directly in your browser — no data is ever sent to any server, ensuring your privacy and security. No signup or installation is required.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> — All password strength checker operations run locally in your browser using JavaScript. Your data never leaves your device.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Instant Results</strong> — Get results immediately as you type or paste your input. No waiting for server responses or page reloads.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> — Use the password strength checker as many times as you need without creating an account or paying anything.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Mobile Friendly</strong> — Works on desktop, tablet, and mobile browsers. Access this tool from any device with an internet connection.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Using the password strength checker for day-to-day development tasks</li>
          <li>Saving time on repetitive tasks by using a browser-based tool instead of writing custom code</li>
          <li>Working on projects where installing software is not an option (school, work, shared computers)</li>
          <li>Quick prototyping and debugging without switching to a terminal or IDE</li>
          <li>Sharing the tool link with colleagues who need the same functionality</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Enter your input in the text area provided and the password strength checker will process it instantly. Use the Copy button to copy the result to your clipboard. All operations are performed locally in your browser — no data is transmitted to any server.
        </p>
      </div>
    </ToolLayout>
  );
}
