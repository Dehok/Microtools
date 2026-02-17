import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON Stringify / Parse — Escape & Unescape JSON Online",
  description: "Convert between formatted and stringified JSON. Escape and unescape JSON strings. Free online tool.",
  keywords: ["json stringify", "json parse", "json escape", "json unescape", "stringify json online"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
