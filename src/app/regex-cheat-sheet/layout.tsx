import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Regex Cheat Sheet — Regular Expression Quick Reference",
  description:
    "Complete regex cheat sheet with syntax, character classes, quantifiers, anchors, groups, and lookaheads. Searchable quick reference.",
  keywords: ["regex cheat sheet", "regular expression", "regex reference", "regex syntax", "regex guide"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
