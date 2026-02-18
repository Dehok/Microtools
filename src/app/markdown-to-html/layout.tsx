import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Markdown to HTML Converter — Convert MD to HTML Online",
  description: "Convert Markdown to clean, semantic HTML. Supports headings, bold, italic, links, images, code blocks, lists, blockquotes, and more. Free online tool.",
  keywords: ["markdown to html", "convert markdown to html", "md to html converter", "markdown html online", "markdown converter"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
