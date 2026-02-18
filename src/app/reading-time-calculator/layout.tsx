import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reading Time Calculator — Estimate Read Time",
  description:
    "Estimate reading time and speaking time for any text. Get word count, character count, and paragraph stats. Free reading time estimator.",
  keywords: ["reading time calculator", "estimate reading time", "word count", "reading speed", "speaking time calculator"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
