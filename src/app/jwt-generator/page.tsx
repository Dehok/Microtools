"use client";

import { useState, useMemo, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

/* ── Base64url helpers ─────────────────────────────────────────── */

function base64urlEncode(data: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < data.length; i++) {
    binary += String.fromCharCode(data[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function utf8ToBase64url(str: string): string {
  const bytes = new TextEncoder().encode(str);
  return base64urlEncode(bytes);
}

/* ── HMAC-SHA256 via Web Crypto API ────────────────────────────── */

async function hmacSha256(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return base64urlEncode(new Uint8Array(sig));
}

/* ── Claim quick-add definitions ──────────────────────────────── */

interface ClaimDef {
  key: string;
  label: string;
  description: string;
}

const CLAIMS: ClaimDef[] = [
  { key: "iss", label: "iss", description: "Issuer" },
  { key: "sub", label: "sub", description: "Subject" },
  { key: "aud", label: "aud", description: "Audience" },
  { key: "exp", label: "exp", description: "Expiration" },
  { key: "iat", label: "iat", description: "Issued At" },
  { key: "nbf", label: "nbf", description: "Not Before" },
  { key: "jti", label: "jti", description: "JWT ID" },
];

const EXPIRATION_OPTIONS = [
  { label: "1 hour", seconds: 3600 },
  { label: "1 day", seconds: 86400 },
  { label: "7 days", seconds: 604800 },
  { label: "30 days", seconds: 2592000 },
  { label: "1 year", seconds: 31536000 },
];

/* ── Default payload ──────────────────────────────────────────── */

function makeDefaultPayload(): string {
  const now = Math.floor(Date.now() / 1000);
  return JSON.stringify(
    {
      sub: "1234567890",
      name: "CodeUtilo User",
      iat: now,
    },
    null,
    2
  );
}

/* ── Component ────────────────────────────────────────────────── */

export default function JwtGenerator() {
  const [payload, setPayload] = useState(makeDefaultPayload);
  const [secret, setSecret] = useState("your-256-bit-secret");
  const [jwt, setJwt] = useState("");
  const [error, setError] = useState("");
  const [customExpMinutes, setCustomExpMinutes] = useState(60);

  /* Validate payload JSON synchronously with useMemo (no setState inside) */
  const payloadValid = useMemo(() => {
    try {
      JSON.parse(payload);
      return { ok: true as const, error: null };
    } catch {
      return { ok: false as const, error: "Invalid JSON in payload" };
    }
  }, [payload]);

  /* Header is always the same for HS256 */
  const headerJson = JSON.stringify({ alg: "HS256", typ: "JWT" });

  /* Generate JWT asynchronously whenever inputs change */
  useEffect(() => {
    let cancelled = false;

    async function generate() {
      if (!payloadValid.ok) {
        setJwt("");
        setError(payloadValid.error);
        return;
      }
      if (!secret) {
        setJwt("");
        setError("Secret key is required.");
        return;
      }

      try {
        const headerB64 = utf8ToBase64url(headerJson);
        /* Normalize JSON: parse then re-stringify without whitespace */
        const compactPayload = JSON.stringify(JSON.parse(payload));
        const payloadB64 = utf8ToBase64url(compactPayload);
        const signingInput = `${headerB64}.${payloadB64}`;
        const signature = await hmacSha256(secret, signingInput);
        if (!cancelled) {
          setJwt(`${signingInput}.${signature}`);
          setError("");
        }
      } catch (e: unknown) {
        if (!cancelled) {
          const msg = e instanceof Error ? e.message : "Failed to generate JWT.";
          setError(msg);
          setJwt("");
        }
      }
    }

    generate();
    return () => { cancelled = true; };
  }, [payload, secret, payloadValid, headerJson]);

  /* ── Quick-add claim helpers ──────────────────────────────── */

  function addClaim(claim: ClaimDef) {
    try {
      const obj = JSON.parse(payload);
      const now = Math.floor(Date.now() / 1000);

      switch (claim.key) {
        case "iss":
          obj.iss = obj.iss ?? "https://codeutilo.com";
          break;
        case "sub":
          obj.sub = obj.sub ?? "user-id-123";
          break;
        case "aud":
          obj.aud = obj.aud ?? "https://api.example.com";
          break;
        case "exp":
          obj.exp = now + 3600;
          break;
        case "iat":
          obj.iat = now;
          break;
        case "nbf":
          obj.nbf = now;
          break;
        case "jti":
          obj.jti = crypto.randomUUID();
          break;
      }

      setPayload(JSON.stringify(obj, null, 2));
    } catch {
      /* payload is invalid JSON, ignore */
    }
  }

  function setExpiration(seconds: number) {
    try {
      const obj = JSON.parse(payload);
      const now = Math.floor(Date.now() / 1000);
      obj.iat = now;
      obj.exp = now + seconds;
      setPayload(JSON.stringify(obj, null, 2));
    } catch {
      /* ignore if invalid JSON */
    }
  }

  function handleClear() {
    setPayload(makeDefaultPayload());
    setSecret("your-256-bit-secret");
  }

  /* ── Split JWT for colored display ──────────────────────── */
  const jwtParts = jwt.split(".");

  /* Decoded sections for display */
  const decodedHeader = useMemo(() => {
    try {
      return JSON.stringify(JSON.parse(headerJson), null, 2);
    } catch {
      return headerJson;
    }
  }, [headerJson]);

  const decodedPayload = useMemo(() => {
    try {
      return JSON.stringify(JSON.parse(payload), null, 2);
    } catch {
      return payload;
    }
  }, [payload]);

  return (
    <ToolLayout
      title="JWT Generator Online — Create JSON Web Tokens"
      description="Generate JSON Web Tokens (JWT) with HMAC-SHA256 signing. Build payloads with standard claims, set expiration, and copy your token. All processing happens in your browser."
      relatedTools={["jwt-decoder", "hash-generator", "base64-encode-decode"]}
    >
      {/* Warning banner */}
      <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <strong>Note:</strong> This JWT is for testing/educational purposes only. Do not use client-side generated tokens in production.
      </div>

      {/* Algorithm */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">Algorithm</label>
        <select
          value="HS256"
          disabled
          className="w-full rounded-lg border border-gray-300 bg-gray-100 p-2.5 text-sm text-gray-700 sm:w-48"
        >
          <option value="HS256">HS256 (HMAC-SHA256)</option>
        </select>
        <p className="mt-1 text-xs text-gray-500">
          Only HS256 is supported for client-side signing.
        </p>
      </div>

      {/* Secret key */}
      <div className="mb-5">
        <label className="mb-1 block text-sm font-medium text-gray-700">Secret Key</label>
        <input
          type="text"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          placeholder="Enter your secret key..."
          className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 font-mono text-sm focus:border-blue-500 focus:outline-none"
          spellCheck={false}
        />
      </div>

      {/* Payload */}
      <div className="mb-2">
        <label className="mb-1 block text-sm font-medium text-gray-700">Payload (JSON)</label>
      </div>

      {/* Quick-add claim buttons */}
      <div className="mb-2 flex flex-wrap gap-1.5">
        {CLAIMS.map((c) => (
          <button
            key={c.key}
            onClick={() => addClaim(c)}
            title={c.description}
            className="rounded-md border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 transition-colors hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700"
          >
            + {c.label}
          </button>
        ))}
      </div>

      {/* Expiration picker */}
      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        <span className="text-xs font-medium text-gray-500">Expiration:</span>
        {EXPIRATION_OPTIONS.map((opt) => (
          <button
            key={opt.label}
            onClick={() => setExpiration(opt.seconds)}
            className="rounded-md border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 transition-colors hover:border-green-400 hover:bg-green-50 hover:text-green-700"
          >
            {opt.label}
          </button>
        ))}
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={customExpMinutes}
            onChange={(e) => setCustomExpMinutes(Number(e.target.value))}
            min={1}
            className="w-20 rounded-md border border-gray-300 bg-white px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
          />
          <span className="text-xs text-gray-500">min</span>
          <button
            onClick={() => setExpiration(customExpMinutes * 60)}
            className="rounded-md border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 transition-colors hover:border-green-400 hover:bg-green-50 hover:text-green-700"
          >
            Set
          </button>
        </div>
      </div>

      <textarea
        value={payload}
        onChange={(e) => setPayload(e.target.value)}
        placeholder='{"sub":"1234567890","name":"Test","iat":1708000000}'
        className={`mb-4 h-48 w-full rounded-lg border bg-gray-50 p-3 font-mono text-xs focus:outline-none ${
          payloadValid.ok
            ? "border-gray-300 focus:border-blue-500"
            : "border-red-400 focus:border-red-500"
        }`}
        spellCheck={false}
      />

      {!payloadValid.ok && (
        <div className="mb-4 -mt-2 text-xs text-red-600">{payloadValid.error}</div>
      )}

      <div className="mb-5 flex gap-2">
        <button
          onClick={handleClear}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Reset
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Generated JWT — colored display */}
      {jwt && (
        <div className="space-y-4">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-700">Generated JWT</label>
              <CopyButton text={jwt} />
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-900 p-4 font-mono text-sm leading-relaxed break-all">
              <span className="text-red-400">{jwtParts[0]}</span>
              <span className="text-gray-500">.</span>
              <span className="text-purple-400">{jwtParts[1]}</span>
              <span className="text-gray-500">.</span>
              <span className="text-cyan-400">{jwtParts[2]}</span>
            </div>
            <div className="mt-2 flex gap-4 text-xs">
              <span className="flex items-center gap-1">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-400"></span>
                Header
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-purple-400"></span>
                Payload
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-cyan-400"></span>
                Signature
              </span>
            </div>
          </div>

          {/* Decoded view */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-red-600">Header</span>
                <CopyButton text={decodedHeader} />
              </div>
              <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800">{decodedHeader}</pre>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-purple-600">Payload</span>
                <CopyButton text={decodedPayload} />
              </div>
              <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800">{decodedPayload}</pre>
            </div>
          </div>
        </div>
      )}

      {/* SEO content */}
      <div className="mt-8 border-t border-gray-200 pt-6 text-sm text-gray-600">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">What is a JWT?</h2>
        <p className="mb-3">
          A JSON Web Token (JWT) is a compact, URL-safe token format defined by RFC 7519. It is
          widely used for authentication and secure information exchange between parties. A JWT
          consists of three Base64url-encoded parts separated by dots: header, payload, and signature.
        </p>

        <h2 className="mb-3 text-lg font-semibold text-gray-900">JWT Structure</h2>
        <p className="mb-3">
          The <strong>header</strong> specifies the signing algorithm (e.g., HS256) and token type.
          The <strong>payload</strong> contains claims — statements about the user and metadata such
          as issuer (iss), subject (sub), expiration (exp), and issued-at (iat) timestamps.
          The <strong>signature</strong> is created by signing the encoded header and payload with a
          secret key, ensuring the token has not been tampered with.
        </p>

        <h2 className="mb-3 text-lg font-semibold text-gray-900">Standard JWT Claims</h2>
        <ul className="mb-3 list-inside list-disc space-y-1">
          <li><strong>iss</strong> (Issuer) — identifies who issued the token</li>
          <li><strong>sub</strong> (Subject) — identifies the subject of the token</li>
          <li><strong>aud</strong> (Audience) — identifies the intended recipients</li>
          <li><strong>exp</strong> (Expiration) — Unix timestamp after which the token is invalid</li>
          <li><strong>iat</strong> (Issued At) — Unix timestamp when the token was created</li>
          <li><strong>nbf</strong> (Not Before) — Unix timestamp before which the token is not valid</li>
          <li><strong>jti</strong> (JWT ID) — unique identifier for the token</li>
        </ul>

        <h2 className="mb-3 text-lg font-semibold text-gray-900">How does this tool work?</h2>
        <p className="mb-3">
          This generator creates JWTs entirely in your browser using the Web Crypto API for
          HMAC-SHA256 signing. No data is sent to any server. The generated tokens are suitable
          for testing, learning, and development purposes.
        </p>

        <h2 className="mb-3 text-lg font-semibold text-gray-900">Is this tool secure?</h2>
        <p>
          All signing happens locally in your browser. However, client-side token generation
          should never be used in production systems, as the secret key would be exposed to the
          client. In production, JWTs should be generated on a secure server.
        </p>
      </div>
    </ToolLayout>
  );
}
