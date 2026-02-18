import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Regex to English — Explain Regular Expressions",
  description:
    "Translate regular expressions to plain English explanations. Understand any regex pattern instantly. Free regex explainer tool.",
  keywords: ["regex to english", "regex explain", "regex translator", "understand regex", "regex explainer", "regex to text"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
