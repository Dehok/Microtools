import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HTML to Markdown Converter — Convert HTML to MD Online",
  description: "Convert HTML to Markdown format. Handles headings, lists, links, bold, italic, code blocks, and more. Free online tool.",
  keywords: ["html to markdown", "convert html to md", "html markdown converter", "html to md online"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
