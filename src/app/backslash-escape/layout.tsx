import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Backslash Escape / Unescape — Online String Escaper",
  description:
    "Escape or unescape special characters in strings. Handles newlines, tabs, quotes, and backslashes. Free online escape tool for developers.",
  keywords: [
    "backslash escape",
    "string escape online",
    "unescape string",
    "escape newline",
    "escape quotes",
    "string escape tool",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
