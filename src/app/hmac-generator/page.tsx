"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

type Algorithm = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";
type OutputFormat = "hex-lower" | "hex-upper" | "base64";

const ALGORITHMS: { id: Algorithm; label: string; bits: number }[] = [
  { id: "SHA-1", label: "SHA-1", bits: 160 },
  { id: "SHA-256", label: "SHA-256", bits: 256 },
  { id: "SHA-384", label: "SHA-384", bits: 384 },
  { id: "SHA-512", label: "SHA-512", bits: 512 },
];

const OUTPUT_FORMATS: { id: OutputFormat; label: string }[] = [
  { id: "hex-lower", label: "Hex (lowercase)" },
  { id: "hex-upper", label: "Hex (uppercase)" },
  { id: "base64", label: "Base64" },
];

function arrayBufferToHex(buffer: ArrayBuffer, upper: boolean): string {
  const bytes = Array.from(new Uint8Array(buffer));
  const hex = bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
  return upper ? hex.toUpperCase() : hex;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function computeHmac(
  message: string,
  secretKey: string,
  algorithm: Algorithm,
  outputFormat: OutputFormat
): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secretKey);
  const messageData = encoder.encode(message);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: algorithm },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", cryptoKey, messageData);

  if (outputFormat === "hex-lower") return arrayBufferToHex(signature, false);
  if (outputFormat === "hex-upper") return arrayBufferToHex(signature, true);
  return arrayBufferToBase64(signature);
}

export default function HmacGenerator() {
  const [message, setMessage] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [algorithm, setAlgorithm] = useState<Algorithm>("SHA-256");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("hex-lower");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const selectedAlgo = useMemo(
    () => ALGORITHMS.find((a) => a.id === algorithm) ?? ALGORITHMS[1],
    [algorithm]
  );

  const handleGenerate = async () => {
    if (!message) {
      setError("Please enter a message.");
      setResult("");
      return;
    }
    if (!secretKey) {
      setError("Please enter a secret key.");
      setResult("");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      const hmac = await computeHmac(message, secretKey, algorithm, outputFormat);
      setResult(hmac);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate HMAC.");
      setResult("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessage("");
    setSecretKey("");
    setResult("");
    setError("");
  };

  return (
    <ToolLayout
      title="HMAC Generator Online — SHA-256, SHA-512, SHA-1"
      description="Generate HMAC signatures using SHA-1, SHA-256, SHA-384, or SHA-512. Output as hex or Base64. All computation happens in your browser — no data is sent to any server."
      relatedTools={["hash-generator", "jwt-generator", "password-strength-checker"]}
    >
      {/* Message */}
      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
        Message
      </label>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter the message to sign..."
        className="mb-4 h-28 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
        spellCheck={false}
      />

      {/* Secret Key */}
      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
        Secret Key
      </label>
      <input
        type="text"
        value={secretKey}
        onChange={(e) => setSecretKey(e.target.value)}
        placeholder="Enter the secret key..."
        className="mb-4 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
        spellCheck={false}
      />

      {/* Algorithm + Output Format */}
      <div className="mb-4 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[160px]">
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Algorithm
          </label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value as Algorithm)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-2.5 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
          >
            {ALGORITHMS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label} ({a.bits} bits)
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[160px]">
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Output Format
          </label>
          <select
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value as OutputFormat)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-2.5 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
          >
            {OUTPUT_FORMATS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Algorithm Info Badge */}
      <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950 px-3 py-1.5 text-xs text-blue-700 dark:text-blue-300">
        <span className="font-semibold">{selectedAlgo.label}</span>
        <span>— output length: {selectedAlgo.bits} bits ({selectedAlgo.bits / 8} bytes)</span>
      </div>

      {/* Buttons */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
        >
          {isLoading ? "Generating..." : "Generate HMAC"}
        </button>
        <button
          onClick={handleClear}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
        >
          Clear
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 p-3 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              HMAC-{algorithm} Result
            </span>
            <CopyButton text={result} />
          </div>
          <div className="select-all break-all font-mono text-sm text-gray-800 dark:text-gray-200">
            {result}
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Format: {OUTPUT_FORMATS.find((f) => f.id === outputFormat)?.label} &middot;{" "}
            Length: {result.length} characters
          </div>
        </div>
      )}

      {/* Privacy note */}
      <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
        Everything runs in your browser using the Web Crypto API. No message or key is ever sent to a server.
      </p>

      {/* SEO Content */}
      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">What is HMAC?</h2>
        <p className="mb-3">
          HMAC (Hash-based Message Authentication Code) is a cryptographic mechanism that combines
          a secret key with a hash function (such as SHA-256) to produce an authentication code.
          It is used to verify both the data integrity and the authenticity of a message. Unlike a
          plain hash, HMAC requires the secret key to produce or verify the signature, making it
          resistant to forgery.
        </p>

        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Which HMAC algorithm should I use?</h2>
        <p className="mb-3">
          <strong>HMAC-SHA-256</strong> is the industry standard and is suitable for the vast
          majority of applications, including API authentication (e.g., AWS Signature v4, JWT HS256)
          and webhook verification. <strong>HMAC-SHA-512</strong> offers a larger output and
          higher security margin for very sensitive contexts. <strong>HMAC-SHA-1</strong> is
          considered legacy — avoid it in new systems unless required for compatibility.
        </p>

        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Common uses of HMAC</h2>
        <ul className="mb-3 list-disc pl-5 space-y-1">
          <li>API request signing (e.g., AWS, Stripe webhook verification)</li>
          <li>JWT signing with HS256, HS384, or HS512 algorithms</li>
          <li>Password-based key derivation (PBKDF2 uses HMAC internally)</li>
          <li>TLS/SSL handshake authentication</li>
          <li>Message integrity checks in secure messaging protocols</li>
        </ul>

        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Output formats explained</h2>
        <p className="mb-3">
          <strong>Hex (lowercase / uppercase)</strong> represents each byte as two hexadecimal
          digits (0–9, a–f). This is the most common format for displaying hashes and HMACs.
          HMAC-SHA-256 produces a 64-character hex string.{" "}
          <strong>Base64</strong> encodes the raw bytes using the Base64 alphabet, producing a
          shorter string (HMAC-SHA-256 = 44 characters). Base64 is often used in HTTP headers
          and JWT tokens.
        </p>

        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Is this tool secure?</h2>
        <p>
          Yes. This HMAC Generator runs entirely in your browser using the native Web Crypto API
          (<code className="rounded bg-gray-100 dark:bg-gray-800 px-1">crypto.subtle</code>). Your message and
          secret key are never transmitted over the network or stored anywhere. You can even use
          this tool offline after the page has loaded.
        </p>
      </div>
    </ToolLayout>
  );
}
