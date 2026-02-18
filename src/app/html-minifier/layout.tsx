import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HTML Minifier & Beautifier — Minify HTML Online",
  description:
    "Minify or beautify HTML code online. Remove whitespace, comments, and redundant attributes to reduce file size. Free HTML minifier tool.",
  keywords: ["html minifier", "minify html", "html beautifier", "html compressor", "html formatter"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
