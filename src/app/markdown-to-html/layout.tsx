import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Markdown to HTML Converter Online",
  description: "Convert Markdown text to clean HTML code. Supports headings, lists, links, and code blocks. Free tool.",
  keywords: ["markdown to html","convert markdown to html","md to html","markdown html converter","markdown compiler"],
  openGraph: {
    title: "Markdown to HTML Converter Online | CodeUtilo",
    description: "Convert Markdown text to clean HTML code. Supports headings, lists, links, and code blocks. Free tool.",
    url: "https://codeutilo.com/markdown-to-html",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Markdown to HTML Converter Online | CodeUtilo",
    description: "Convert Markdown text to clean HTML code. Supports headings, lists, links, and code blocks. Free tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/markdown-to-html",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Markdown to HTML"
        description="Convert Markdown text to clean HTML code. Supports headings, lists, links, and code blocks. Free tool."
        slug="markdown-to-html"
      />
      {children}
    </>
  );
}
