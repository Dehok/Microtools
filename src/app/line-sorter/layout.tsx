import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Line Sorter & Deduplicator — Sort Lines Online",
  description:
    "Sort lines alphabetically, numerically, or by length. Remove duplicates and empty lines. Free online line sorter tool.",
  keywords: [
    "line sorter",
    "sort lines online",
    "remove duplicate lines",
    "alphabetical sort",
    "line deduplicator",
    "text sorter",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
