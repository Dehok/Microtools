"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

// Common domain typo corrections
const DOMAIN_TYPOS: Record<string, string> = {
  "gmial.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gmali.com": "gmail.com",
  "gnail.com": "gmail.com",
  "gmail.co": "gmail.com",
  "yaho.com": "yahoo.com",
  "yahooo.com": "yahoo.com",
  "yahoo.co": "yahoo.com",
  "yaho.co.uk": "yahoo.co.uk",
  "hotmal.com": "hotmail.com",
  "hotmai.com": "hotmail.com",
  "hotmial.com": "hotmail.com",
  "hotmil.com": "hotmail.com",
  "outlok.com": "outlook.com",
  "outloo.com": "outlook.com",
  "outlookk.com": "outlook.com",
  "iclould.com": "icloud.com",
  "icoud.com": "icloud.com",
  "protonmai.com": "protonmail.com",
  "protonmal.com": "protonmail.com",
};

interface ValidationResult {
  hasAt: boolean;
  noSpaces: boolean;
  noConsecutiveDots: boolean;
  validLength: boolean;
  validLocalPart: boolean;
  validDomain: boolean;
  validTLD: boolean;
  validFormat: boolean;
  typoSuggestion: string | null;
}

interface EmailResult {
  email: string;
  isValid: boolean;
  checks: ValidationResult;
  issue: string;
}

function validateEmail(email: string): EmailResult {
  const checks: ValidationResult = {
    hasAt: false,
    noSpaces: false,
    noConsecutiveDots: false,
    validLength: false,
    validLocalPart: false,
    validDomain: false,
    validTLD: false,
    validFormat: false,
    typoSuggestion: null,
  };

  // No spaces
  checks.noSpaces = !/\s/.test(email);

  // Length check (RFC 5321: max 254 chars)
  checks.validLength = email.length > 0 && email.length <= 254;

  // Has @ symbol
  const atCount = (email.match(/@/g) || []).length;
  checks.hasAt = atCount === 1;

  // No consecutive dots in whole address
  checks.noConsecutiveDots = !/\.{2,}/.test(email);

  if (!checks.hasAt) {
    const issue = !checks.hasAt ? "Missing or multiple @ symbols" : "Invalid format";
    return { email, isValid: false, checks, issue };
  }

  const [local, domain] = email.split("@");

  // Validate local part (before @)
  // RFC 5321: max 64 chars, allowed chars: a-z A-Z 0-9 ! # $ % & ' * + - / = ? ^ _ ` { | } ~ .
  // Cannot start or end with a dot
  const localValid =
    local.length > 0 &&
    local.length <= 64 &&
    /^[a-zA-Z0-9!#$%&'*+\-/=?^_`{|}~.]+$/.test(local) &&
    !local.startsWith(".") &&
    !local.endsWith(".");
  checks.validLocalPart = localValid;

  // Validate domain part (after @)
  // Must have at least one dot, each label 1-63 chars, only alnum and hyphens, no leading/trailing hyphens
  const domainParts = domain ? domain.split(".") : [];
  const domainValid =
    domain &&
    domain.length > 0 &&
    domain.length <= 253 &&
    domainParts.length >= 2 &&
    domainParts.every(
      (part) =>
        part.length > 0 &&
        part.length <= 63 &&
        /^[a-zA-Z0-9-]+$/.test(part) &&
        !part.startsWith("-") &&
        !part.endsWith("-")
    );
  checks.validDomain = !!domainValid;

  // Valid TLD: last part must be at least 2 alpha chars
  const tld = domainParts[domainParts.length - 1] || "";
  checks.validTLD = tld.length >= 2 && /^[a-zA-Z]+$/.test(tld);

  // Overall RFC 5322 basic format check
  checks.validFormat =
    checks.hasAt &&
    checks.noSpaces &&
    checks.noConsecutiveDots &&
    checks.validLength &&
    checks.validLocalPart &&
    checks.validDomain &&
    checks.validTLD;

  // Typo detection
  const lowerDomain = domain ? domain.toLowerCase() : "";
  if (DOMAIN_TYPOS[lowerDomain]) {
    checks.typoSuggestion = `${local}@${DOMAIN_TYPOS[lowerDomain]}`;
  }

  // Determine the main issue for display
  let issue = "";
  if (!checks.noSpaces) issue = "Contains spaces";
  else if (!checks.validLength) issue = "Invalid length";
  else if (!checks.hasAt) issue = "Missing @ symbol";
  else if (!checks.noConsecutiveDots) issue = "Consecutive dots found";
  else if (!checks.validLocalPart) issue = "Invalid local part (before @)";
  else if (!checks.validDomain) issue = "Invalid domain part (after @)";
  else if (!checks.validTLD) issue = "Invalid or missing TLD";

  const isValid = checks.validFormat;

  return { email, isValid, checks, issue };
}

const CHECK_LABELS: { key: keyof ValidationResult; label: string }[] = [
  { key: "hasAt", label: "Has @ symbol" },
  { key: "noSpaces", label: "No spaces" },
  { key: "noConsecutiveDots", label: "No consecutive dots" },
  { key: "validLength", label: "Reasonable length (≤254 chars)" },
  { key: "validLocalPart", label: "Valid local part (before @)" },
  { key: "validDomain", label: "Valid domain part (after @)" },
  { key: "validTLD", label: "Valid TLD (≥2 alpha chars)" },
  { key: "validFormat", label: "Valid RFC 5322 format" },
];

export default function EmailValidator() {
  const [mode, setMode] = useState<"single" | "bulk">("single");
  const [singleEmail, setSingleEmail] = useState("");
  const [bulkInput, setBulkInput] = useState("");

  // Single email result computed via useMemo (no setState inside)
  const singleResult = useMemo<EmailResult | null>(() => {
    const trimmed = singleEmail.trim();
    if (!trimmed) return null;
    return validateEmail(trimmed);
  }, [singleEmail]);

  // Bulk results computed via useMemo (no setState inside)
  const bulkResults = useMemo<EmailResult[]>(() => {
    if (!bulkInput.trim()) return [];
    const lines = bulkInput
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    return lines.map((email) => validateEmail(email));
  }, [bulkInput]);

  const bulkStats = useMemo(() => {
    const total = bulkResults.length;
    const valid = bulkResults.filter((r) => r.isValid).length;
    const invalid = total - valid;
    return { total, valid, invalid };
  }, [bulkResults]);

  const validEmailsText = useMemo(
    () => bulkResults.filter((r) => r.isValid).map((r) => r.email).join("\n"),
    [bulkResults]
  );

  const invalidEmailsText = useMemo(
    () => bulkResults.filter((r) => !r.isValid).map((r) => r.email).join("\n"),
    [bulkResults]
  );

  return (
    <ToolLayout
      title="Email Validator"
      description="Validate single or bulk email addresses against RFC 5322 rules. Detects format errors, invalid domains, and common typos like gmial.com or hotmal.com."
      relatedTools={["regex-tester", "text-case-converter", "slug-generator"]}
    >
      {/* Mode toggle */}
      <div className="mb-5 flex gap-2">
        <button
          onClick={() => setMode("single")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            mode === "single"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:bg-gray-700"
          }`}
        >
          Single Email
        </button>
        <button
          onClick={() => setMode("bulk")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            mode === "bulk"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:bg-gray-700"
          }`}
        >
          Bulk Validation
        </button>
      </div>

      {/* Single mode */}
      {mode === "single" && (
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email Address
          </label>
          <input
            type="text"
            value={singleEmail}
            onChange={(e) => setSingleEmail(e.target.value)}
            placeholder="example@domain.com"
            className="mb-4 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-2 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
            spellCheck={false}
            autoComplete="off"
          />

          {singleResult && (
            <div>
              {/* Overall status banner */}
              <div
                className={`mb-4 flex items-center gap-2 rounded-lg border px-4 py-3 ${
                  singleResult.isValid
                    ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950 text-green-800"
                    : "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 text-red-800"
                }`}
              >
                <span className="text-lg">
                  {singleResult.isValid ? "✓" : "✗"}
                </span>
                <span className="font-medium">
                  {singleResult.isValid ? "Valid email address" : "Invalid email address"}
                </span>
                {!singleResult.isValid && singleResult.issue && (
                  <span className="ml-1 text-sm opacity-80">— {singleResult.issue}</span>
                )}
              </div>

              {/* Typo suggestion */}
              {singleResult.checks.typoSuggestion && (
                <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  <span className="font-medium">Did you mean:</span>{" "}
                  <span className="font-mono">{singleResult.checks.typoSuggestion}</span>?
                </div>
              )}

              {/* Checks list */}
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 p-4">
                <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Validation Checks</div>
                <div className="space-y-2">
                  {CHECK_LABELS.map(({ key, label }) => {
                    const passed = key === "typoSuggestion" ? true : singleResult.checks[key];
                    if (key === "typoSuggestion") return null;
                    return (
                      <div key={key} className="flex items-center gap-2 text-sm">
                        <span
                          className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                            passed
                              ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                              : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                          }`}
                        >
                          {passed ? "✓" : "✗"}
                        </span>
                        <span className={passed ? "text-gray-700 dark:text-gray-300" : "text-red-700 dark:text-red-300"}>
                          {label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {!singleEmail.trim() && (
            <p className="text-sm text-gray-400 dark:text-gray-500">Enter an email address to validate it.</p>
          )}
        </div>
      )}

      {/* Bulk mode */}
      {mode === "bulk" && (
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email Addresses (one per line)
          </label>
          <textarea
            value={bulkInput}
            onChange={(e) => setBulkInput(e.target.value)}
            placeholder={"user@example.com\nhello@domain.org\nbad-email@\n..."}
            className="mb-4 h-36 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
            spellCheck={false}
          />

          {bulkResults.length > 0 && (
            <div>
              {/* Stats */}
              <div className="mb-4 grid grid-cols-3 gap-3">
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 p-3 text-center">
                  <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">{bulkStats.total}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
                </div>
                <div className="rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950 p-3 text-center">
                  <div className="text-2xl font-bold text-green-700 dark:text-green-300">{bulkStats.valid}</div>
                  <div className="text-xs text-green-600 dark:text-green-400">Valid</div>
                </div>
                <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 p-3 text-center">
                  <div className="text-2xl font-bold text-red-700 dark:text-red-300">{bulkStats.invalid}</div>
                  <div className="text-xs text-red-600 dark:text-red-400">Invalid</div>
                </div>
              </div>

              {/* Copy buttons */}
              <div className="mb-4 flex flex-wrap gap-2">
                {validEmailsText && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600 dark:text-gray-400">Valid ({bulkStats.valid}):</span>
                    <CopyButton text={validEmailsText} />
                  </div>
                )}
                {invalidEmailsText && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600 dark:text-gray-400">Invalid ({bulkStats.invalid}):</span>
                    <CopyButton text={invalidEmailsText} />
                  </div>
                )}
              </div>

              {/* Results table */}
              <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950">
                      <th className="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300">#</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300">Email</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300">Status</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300">Issue / Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bulkResults.map((result, i) => (
                      <tr
                        key={i}
                        className={`border-b border-gray-100 dark:border-gray-800 last:border-0 ${
                          result.isValid ? "bg-white dark:bg-gray-900" : "bg-red-50 dark:bg-red-950"
                        }`}
                      >
                        <td className="px-3 py-2 text-gray-400 dark:text-gray-500">{i + 1}</td>
                        <td className="px-3 py-2 font-mono text-gray-800 dark:text-gray-200 break-all">
                          {result.email}
                        </td>
                        <td className="px-3 py-2">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                              result.isValid
                                ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                                : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                            }`}
                          >
                            {result.isValid ? "✓ Valid" : "✗ Invalid"}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-gray-500 dark:text-gray-400">
                          {result.checks.typoSuggestion ? (
                            <span className="text-amber-700">
                              Did you mean: <span className="font-mono">{result.checks.typoSuggestion}</span>?
                            </span>
                          ) : result.issue ? (
                            result.issue
                          ) : (
                            <span className="text-green-600 dark:text-green-400">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!bulkInput.trim() && (
            <p className="text-sm text-gray-400 dark:text-gray-500">Paste email addresses above, one per line.</p>
          )}
        </div>
      )}

      {/* SEO content */}
      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">What is Email Validation?</h2>
        <p className="mb-3">
          Email validation is the process of checking whether an email address is correctly
          formatted according to internet standards (RFC 5321 and RFC 5322). A valid email
          consists of a local part, an @ symbol, and a domain with a valid top-level domain (TLD).
          This tool performs client-side syntax validation only — it does not send any network
          requests or confirm whether a mailbox actually exists.
        </p>

        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">What Gets Validated?</h2>
        <p className="mb-3">
          The validator checks eight rules for each email: presence of exactly one @ symbol,
          absence of spaces, no consecutive dots, a total length of at most 254 characters,
          a valid local part (at most 64 characters using RFC-allowed characters), a valid
          domain (labels separated by dots, hyphens allowed but not at start/end), and a
          TLD of at least two alphabetic characters.
        </p>

        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Typo Detection</h2>
        <p className="mb-3">
          A common source of invalid emails is a simple domain typo — for example typing
          <strong> gmial.com</strong> instead of gmail.com, or <strong>hotmal.com</strong>{" "}
          instead of hotmail.com. This tool detects the most frequent domain typos and
          suggests the correct spelling so users can fix their address before submitting a form.
        </p>

        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Bulk Email Validation</h2>
        <p>
          Switch to Bulk mode to validate entire mailing lists at once. Paste up to hundreds
          of addresses (one per line), and the tool instantly shows a results table with the
          status and issue for each entry. Use the copy buttons to extract only the valid or
          only the invalid addresses for further processing.
        </p>
      </div>
    
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The Email Validator is a free online tool available on CodeUtilo. Validate email address format and syntax. Check for common mistakes and typos. All processing happens directly in your browser — no data is ever sent to any server, ensuring your privacy and security. No signup or installation is required.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> — All email validator operations run locally in your browser using JavaScript. Your data never leaves your device.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Instant Results</strong> — Get results immediately as you type or paste your input. No waiting for server responses or page reloads.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> — Use the email validator as many times as you need without creating an account or paying anything.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Mobile Friendly</strong> — Works on desktop, tablet, and mobile browsers. Access this tool from any device with an internet connection.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Using the email validator for day-to-day development tasks</li>
          <li>Saving time on repetitive tasks by using a browser-based tool instead of writing custom code</li>
          <li>Working on projects where installing software is not an option (school, work, shared computers)</li>
          <li>Quick prototyping and debugging without switching to a terminal or IDE</li>
          <li>Sharing the tool link with colleagues who need the same functionality</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Enter your input in the text area provided and the email validator will process it instantly. Use the Copy button to copy the result to your clipboard. All operations are performed locally in your browser — no data is transmitted to any server.
        </p>
      
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Is the Email Validator free to use?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes, the Email Validator is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need.
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
              Yes. The Email Validator is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Do I need to install anything?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. The Email Validator runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately.
            </p>
          </details>
        </div>
</div>
    </ToolLayout>
  );
}
