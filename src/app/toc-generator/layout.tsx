import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Table of Contents Generator — Markdown TOC Maker",
  description:
    "Generate a table of contents from Markdown headings. Create linked TOC for README files, docs, and articles. Free online tool.",
  keywords: ["table of contents generator", "toc generator", "markdown toc", "readme toc", "generate table of contents"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
