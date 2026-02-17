import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hash Generator Online — SHA-256, SHA-1, SHA-512",
  description:
    "Generate SHA-1, SHA-256, SHA-384, and SHA-512 hashes from any text. All hashing happens in your browser. Free and secure.",
  keywords: ["hash generator", "sha256 generator", "sha1 hash", "sha512", "hash online"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
