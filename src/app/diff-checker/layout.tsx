import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Diff Checker — Compare Two Texts Online Free",
  description:
    "Compare two texts and highlight the differences line by line. Free online diff checker and text comparison tool.",
  keywords: ["diff checker", "text compare", "text diff", "compare two texts", "online diff tool"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
