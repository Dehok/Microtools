import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Regex Tester Online — Free Regular Expression Tester",
  description: "Test regular expressions against text with real-time match highlighting. Supports JavaScript regex flags.",
  keywords: ["regex tester", "regex online", "regular expression tester", "regex101", "regex checker"],
};

export default function Layout({ children }: { children: React.ReactNode }) { return children; }
