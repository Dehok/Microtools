import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JavaScript Minifier Online — Minify JS Code Free",
  description:
    "Minify JavaScript code by removing comments, whitespace, and unnecessary characters. Reduce file size instantly. Free online tool.",
  keywords: [
    "javascript minifier",
    "js minifier",
    "minify javascript online",
    "compress javascript",
    "js compressor",
    "uglify javascript",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
