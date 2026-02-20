"use client";

import { useMemo, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const WORDS = [
  "amber", "anchor", "apple", "arrow", "atlas", "autumn", "badge", "bamboo", "beacon", "berry", "blossom", "breeze",
  "cactus", "candle", "canvas", "captain", "cedar", "cherry", "circuit", "cloud", "comet", "copper", "coral", "crimson",
  "dawn", "desert", "diamond", "drift", "echo", "ember", "falcon", "feather", "forest", "frost", "galaxy", "garden",
  "glacier", "glow", "granite", "harbor", "hazel", "horizon", "island", "jade", "jungle", "keeper", "kingfisher", "lagoon",
  "lantern", "leaf", "legend", "lemon", "lotus", "lunar", "maple", "meadow", "meteor", "mint", "moon", "mountain",
  "nebula", "nectar", "night", "north", "oasis", "ocean", "olive", "opal", "orchid", "orbit", "panda", "paper", "pearl",
  "pepper", "phoenix", "pine", "planet", "plaza", "pocket", "polar", "prairie", "quantum", "quartz", "raven", "reef",
  "river", "rocket", "rose", "saffron", "sailor", "sand", "sapphire", "scarlet", "shadow", "signal", "silver", "sky",
  "snow", "solar", "sparrow", "spice", "spirit", "spring", "star", "stone", "storm", "summit", "sunset", "tango",
  "thunder", "tiger", "timber", "topaz", "torch", "traveler", "tulip", "valley", "velvet", "violet", "voyage", "water",
  "willow", "winter", "wolf", "zenith",
] as const;

type SeparatorType = "dash" | "space" | "dot" | "underscore";

function secureRandomInt(max: number) {
  if (max <= 1) return 0;
  const maxUint = 0xffffffff;
  const limit = Math.floor(maxUint / max) * max;
  const array = new Uint32Array(1);
  let value = 0;
  do {
    crypto.getRandomValues(array);
    value = array[0];
  } while (value >= limit);
  return value % max;
}

function separatorValue(separator: SeparatorType) {
  if (separator === "space") return " ";
  if (separator === "dot") return ".";
  if (separator === "underscore") return "_";
  return "-";
}

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function generatePassphrase({
  wordCount,
  separator,
  capitalize,
  includeNumber,
}: {
  wordCount: number;
  separator: SeparatorType;
  capitalize: boolean;
  includeNumber: boolean;
}) {
  const words: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    const selected = WORDS[secureRandomInt(WORDS.length)];
    words.push(capitalize ? titleCase(selected) : selected);
  }

  let phrase = words.join(separatorValue(separator));
  if (includeNumber) {
    const number = String(secureRandomInt(100)).padStart(2, "0");
    phrase = `${phrase}${separatorValue(separator)}${number}`;
  }
  return phrase;
}

function entropyBits(wordCount: number, includeNumber: boolean) {
  const base = wordCount * Math.log2(WORDS.length);
  const numberBonus = includeNumber ? Math.log2(100) : 0;
  return base + numberBonus;
}

function entropyLabel(bits: number) {
  if (bits < 45) return "Basic";
  if (bits < 65) return "Strong";
  return "Very strong";
}

export default function PassphraseGeneratorPage() {
  const [wordCount, setWordCount] = useState(5);
  const [separator, setSeparator] = useState<SeparatorType>("dash");
  const [capitalize, setCapitalize] = useState(false);
  const [includeNumber, setIncludeNumber] = useState(true);
  const [passphrase, setPassphrase] = useState(() =>
    generatePassphrase({ wordCount: 5, separator: "dash", capitalize: false, includeNumber: true })
  );

  const bits = useMemo(() => entropyBits(wordCount, includeNumber), [wordCount, includeNumber]);
  const bitsLabel = useMemo(() => entropyLabel(bits), [bits]);

  return (
    <ToolLayout
      title="Passphrase Generator"
      description="Generate memorable high-entropy passphrases using browser-side cryptographic randomness."
      relatedTools={["password-generator", "password-strength-checker", "hash-generator"]}
    >
      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-sm text-gray-700 dark:text-gray-300">
          Word count
          <input
            type="number"
            min={3}
            max={10}
            value={wordCount}
            onChange={(event) => setWordCount(Math.max(3, Math.min(10, Number(event.target.value) || 3)))}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-900"
          />
        </label>

        <label className="text-sm text-gray-700 dark:text-gray-300">
          Separator
          <select
            value={separator}
            onChange={(event) => setSeparator(event.target.value as SeparatorType)}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-900"
          >
            <option value="dash">Dash (-)</option>
            <option value="space">Space</option>
            <option value="dot">Dot (.)</option>
            <option value="underscore">Underscore (_)</option>
          </select>
        </label>

        <label className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={capitalize}
            onChange={(event) => setCapitalize(event.target.checked)}
            className="accent-blue-600"
          />
          Capitalize words
        </label>

        <label className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={includeNumber}
            onChange={(event) => setIncludeNumber(event.target.checked)}
            className="accent-blue-600"
          />
          Add 2-digit suffix
        </label>
      </div>

      <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-950">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Generated passphrase</p>
          <CopyButton text={passphrase} />
        </div>
        <p className="break-all rounded-lg bg-white p-3 font-mono text-lg text-gray-900 dark:bg-gray-900 dark:text-gray-100">
          {passphrase}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            onClick={() =>
              setPassphrase(
                generatePassphrase({
                  wordCount,
                  separator,
                  capitalize,
                  includeNumber,
                })
              )
            }
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Generate new passphrase
          </button>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Wordlist size: {WORDS.length} | Estimated entropy: {bits.toFixed(1)} bits ({bitsLabel})
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Words" value={wordCount} />
        <StatCard label="Estimated Entropy" value={`${bits.toFixed(1)} bits`} />
        <StatCard label="Strength" value={bitsLabel} />
      </div>

      <div className="mt-12 space-y-6 border-t border-gray-200 pt-8 text-sm leading-relaxed text-gray-600 dark:border-gray-700 dark:text-gray-400">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
        <p>
          Passphrase Generator creates readable password phrases using cryptographically secure randomness from the
          browser. It is designed for strong passwords you can still type and remember.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is this stronger than a short random password?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Usually yes. A longer multi-word passphrase can provide higher entropy while being easier to memorize.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is my passphrase sent anywhere?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. Generation happens locally in your browser.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              What should I do after generating?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Store it in a password manager and enable multi-factor authentication where possible.
            </p>
          </details>
        </div>
      </div>
    </ToolLayout>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-gray-200 p-3 text-center dark:border-gray-700">
      <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  );
}
