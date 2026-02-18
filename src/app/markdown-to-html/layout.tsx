import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Markdown to HTML Converter — Convert MD to HTML Online",
  description: "Convert Markdown to clean, semantic HTML. Supports headings, bold, italic, links, images, code blocks, lists, blockquotes, and more. Free online tool.",
  keywords: ["markdown to html","convert markdown to html","md to html converter","markdown html online","markdown converter"],
  openGraph: {
    title: "Markdown to HTML Converter — Convert MD to HTML Online | CodeUtilo",
    description: "Convert Markdown to clean, semantic HTML. Supports headings, bold, italic, links, images, code blocks, lists, blockquotes, and more. Free online tool.",
    url: "https://codeutilo.com/markdown-to-html",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Markdown to HTML Converter — Convert MD to HTML Online | CodeUtilo",
    description: "Convert Markdown to clean, semantic HTML. Supports headings, bold, italic, links, images, code blocks, lists, blockquotes, and more. Free online tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/markdown-to-html",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Markdown To Html"
        description="Convert Markdown to clean, semantic HTML. Supports headings, bold, italic, links, images, code blocks, lists, blockquotes, and more. Free online tool."
        slug="markdown-to-html"
      />
      {children}
    </>
  );
}
