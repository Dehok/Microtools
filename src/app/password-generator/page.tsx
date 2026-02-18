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
    
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The Password Generator creates strong, random passwords with customizable length and character sets. Using the browser's cryptographic random number generator, it produces passwords that are virtually impossible to guess or crack through brute-force attacks.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Customizable Length</strong> — Set password length from 4 to 128 characters to meet various security requirements.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Character Set Selection</strong> — Choose which character types to include: uppercase letters, lowercase letters, numbers, and special symbols.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Strength Indicator</strong> — Visual password strength meter shows how strong the generated password is based on length and complexity.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Cryptographic Randomness</strong> — Uses crypto.getRandomValues() for true randomness, unlike Math.random() which is predictable.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Creating strong passwords for online accounts, email, and social media</li>
          <li>Generating secure API keys and secret tokens for applications</li>
          <li>Creating master passwords for password managers</li>
          <li>Generating random strings for encryption keys and salts</li>
          <li>Meeting specific password requirements (minimum length, special characters, etc.)</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Adjust the password length using the slider and select which character types to include (uppercase, lowercase, numbers, symbols). Click Generate to create a new password. The strength indicator shows how secure the password is. Copy the password to your clipboard with the Copy button.
        </p>
      
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              How strong is a generated password?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              A 16-character password with uppercase, lowercase, numbers, and symbols has approximately 95^16 possible combinations, which would take billions of years to crack with current technology.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Is it safe to generate passwords online?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes, with this tool. The password is generated entirely in your browser using the cryptographic random number generator (crypto.getRandomValues). No password is ever sent to any server.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              What makes a password strong?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Strong passwords are long (12+ characters), use all character types (uppercase, lowercase, numbers, symbols), and are randomly generated rather than based on dictionary words or personal information.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              How often should I change my passwords?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Modern security guidelines (NIST) recommend changing passwords only when there&apos;s evidence of compromise, rather than on a fixed schedule. Using unique, strong passwords with a password manager is more effective.
            </p>
          </details>
        </div>
</div>
    </ToolLayout>
  );
}
