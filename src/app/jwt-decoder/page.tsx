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
      <label className="mb-1 block text-sm font-medium text-gray-700">JWT Token</label>
      <textarea
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="Paste your JWT token here..."
        className="mb-4 h-24 w-full rounded-lg border border-gray-300 bg-gray-50 p-3 font-mono text-xs focus:border-blue-500 focus:outline-none"
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
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Sample
        </button>
        <button
          onClick={() => { setToken(""); setResult(null); setError(""); }}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Clear
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>
      )}

      {result && (
        <div className="space-y-4">
          {/* Expiration badge */}
          {isExpired !== null && (
            <div className={`rounded-lg px-4 py-2 text-sm font-medium ${isExpired ? "bg-red-50 text-red-700 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"}`}>
              {isExpired ? "Token is EXPIRED" : "Token is valid (not expired)"}
              {typeof result.payload.exp === "number" && (
                <span className="ml-2 font-normal">
                  — expires {new Date(result.payload.exp * 1000).toLocaleString()}
                </span>
              )}
            </div>
          )}

          {/* Header */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-red-600">Header</span>
              <CopyButton text={JSON.stringify(result.header, null, 2)} />
            </div>
            <pre className="text-sm font-mono whitespace-pre-wrap">{JSON.stringify(result.header, null, 2)}</pre>
          </div>

          {/* Payload */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-purple-600">Payload</span>
              <CopyButton text={JSON.stringify(result.payload, null, 2)} />
            </div>
            <pre className="text-sm font-mono whitespace-pre-wrap">{JSON.stringify(result.payload, null, 2)}</pre>
          </div>

          {/* Signature */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <span className="text-sm font-semibold text-blue-600">Signature</span>
            <div className="mt-1 break-all font-mono text-xs text-gray-600">{result.signature}</div>
          </div>
        </div>
      )}

      <div className="mt-8 border-t border-gray-200 pt-6 text-sm text-gray-600">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">What is a JWT?</h2>
        <p className="mb-3">
          A JSON Web Token (JWT) is a compact, URL-safe token format used for authentication
          and information exchange. It consists of three Base64-encoded parts: header, payload,
          and signature, separated by dots.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Is this tool secure?</h2>
        <p>
          Yes. JWT decoding happens entirely in your browser. No tokens are sent to any server.
          Never share your tokens with untrusted online tools.
        </p>
      </div>
    </ToolLayout>
  );
}
