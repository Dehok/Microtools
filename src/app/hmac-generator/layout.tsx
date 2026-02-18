import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HMAC Generator — Generate HMAC Signatures Online",
  description:
    "Generate HMAC signatures using SHA-256, SHA-512, SHA-1, and MD5. Enter a message and secret key. Free online HMAC generator.",
  keywords: ["hmac generator", "hmac sha256", "hmac signature", "generate hmac", "hmac online", "hmac calculator"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
