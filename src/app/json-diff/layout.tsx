import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON Diff — Compare JSON Objects Online",
  description:
    "Compare two JSON objects and highlight differences. Find added, removed, and modified keys. Free online JSON diff tool.",
  keywords: ["json diff", "json compare", "compare json", "json difference", "json diff tool"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
