import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Markdown Preview & Editor Online — Free Markdown Tool",
  description:
    "Write Markdown and see the rendered preview in real time. Supports headings, bold, italic, code blocks, lists, links, and more.",
  keywords: ["markdown preview", "markdown editor", "markdown online", "markdown to html"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
