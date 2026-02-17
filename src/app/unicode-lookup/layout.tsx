import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unicode Character Lookup & Inspector — Online Tool",
  description:
    "Inspect Unicode characters: code points, HTML entities, CSS escapes, and UTF-8 bytes. Browse common character sets. Free online tool.",
  keywords: [
    "unicode lookup",
    "unicode character finder",
    "character code point",
    "HTML entity lookup",
    "unicode inspector",
    "UTF-8 bytes",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
