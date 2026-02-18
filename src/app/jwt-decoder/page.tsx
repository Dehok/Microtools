"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function decodeJwt(token: string) {
  const parts = token.trim().split(".");
  if (parts.length !== 3) throw new Error("Invalid JWT: must have 3 parts separated by dots.");

  const decode = (str: string) => {
    const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    return JSON.parse(atob(padded));
  };

  const header = decode(parts[0]);
  const payload = decode(parts[1]);

  return { header, payload, signature: parts[2] };
}

const SAMPLE = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik1pY3JvVG9vbHMgVXNlciIsImlhdCI6MTcwODAwMDAwMCwiZXhwIjoxNzA4MDg2NDAwLCJyb2xlIjoiYWRtaW4ifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

export default function JwtDecoder() {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ header: Record<string, unknown>; payload: Record<string, unknown>; signature: string } | null>(null);

  const handleDecode = () => {
    setError("");
    if (!token.trim()) { setError("Please enter a JWT token."); return; }
    try {
      setResult(decodeJwt(token));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to decode JWT.";
      setError(msg);
      setResult(null);
    }
  };

  const isExpired = result?.payload?.exp
    ? (result.payload.exp as number) * 1000 < Date.now()
    : null;

  return (
    <ToolLayout
      title="JWT Decoder Online — Decode JSON Web Tokens"
      description="Decode and inspect JSON Web Tokens (JWT). View header, payload, expiration, and claims. No data is sent to any server."
      relatedTools={["base64-encode-decode", "hash-generator", "json-formatter"]}
    >
      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">JWT Token</label>
      <textarea
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="Paste your JWT token here..."
        className="mb-4 h-24 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 font-mono text-xs focus:border-blue-500 dark:border-blue-400 focus:outline-none"
        spellCheck={false}
      />

      <div className="mb-4 flex gap-2">
        <button
          onClick={handleDecode}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Decode
        </button>
        <button
          onClick={() => { setToken(SAMPLE); setResult(null); setError(""); }}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
        >
          Sample
        </button>
        <button
          onClick={() => { setToken(""); setResult(null); setError(""); }}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
        >
          Clear
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 px-4 py-2 text-sm text-red-700 dark:text-red-300">{error}</div>
      )}

      {result && (
        <div className="space-y-4">
          {/* Expiration badge */}
          {isExpired !== null && (
            <div className={`rounded-lg px-4 py-2 text-sm font-medium ${isExpired ? "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800" : "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800"}`}>
              {isExpired ? "Token is EXPIRED" : "Token is valid (not expired)"}
              {typeof result.payload.exp === "number" && (
                <span className="ml-2 font-normal">
                  — expires {new Date(result.payload.exp * 1000).toLocaleString()}
                </span>
              )}
            </div>
          )}

          {/* Header */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-red-600 dark:text-red-400">Header</span>
              <CopyButton text={JSON.stringify(result.header, null, 2)} />
            </div>
            <pre className="text-sm font-mono whitespace-pre-wrap">{JSON.stringify(result.header, null, 2)}</pre>
          </div>

          {/* Payload */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">Payload</span>
              <CopyButton text={JSON.stringify(result.payload, null, 2)} />
            </div>
            <pre className="text-sm font-mono whitespace-pre-wrap">{JSON.stringify(result.payload, null, 2)}</pre>
          </div>

          {/* Signature */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 p-4">
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">Signature</span>
            <div className="mt-1 break-all font-mono text-xs text-gray-600 dark:text-gray-400">{result.signature}</div>
          </div>
        </div>
      )}

      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">What is a JWT?</h2>
        <p className="mb-3">
          A JSON Web Token (JWT) is a compact, URL-safe token format used for authentication
          and information exchange. It consists of three Base64-encoded parts: header, payload,
          and signature, separated by dots.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Is this tool secure?</h2>
        <p>
          Yes. JWT decoding happens entirely in your browser. No tokens are sent to any server.
          Never share your tokens with untrusted online tools.
        </p>
      </div>
    
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The JWT Decoder lets you decode and inspect JSON Web Tokens (JWTs) without needing the secret key. JWTs are widely used in authentication and authorization systems (OAuth 2.0, OpenID Connect) to securely transmit information between parties. This tool displays the header, payload, and signature sections of any JWT.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Header Inspection</strong> — Decodes and displays the JWT header showing the algorithm and token type.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Payload Display</strong> — Shows all claims in the payload including standard claims (iss, sub, exp, iat) and custom data.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Expiration Check</strong> — Automatically checks if the token has expired based on the exp claim.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Pretty Formatting</strong> — Displays the decoded header and payload as formatted, readable JSON.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Debugging authentication issues by inspecting JWT contents and expiration times</li>
          <li>Verifying JWT payload data during API development and testing</li>
          <li>Inspecting tokens received from OAuth 2.0 and OpenID Connect providers</li>
          <li>Checking token claims for authorization and access control debugging</li>
          <li>Learning about JWT structure and claims for educational purposes</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Paste your JWT token into the input field. The tool automatically decodes and displays the header, payload, and signature information. The expiration status is shown if the token contains an exp claim.
        </p>
      </div>
    </ToolLayout>
  );
}
