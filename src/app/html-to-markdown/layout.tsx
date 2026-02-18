import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "HTML to Markdown Converter — Convert HTML to MD Online",
  description: "Convert HTML to Markdown format. Handles headings, lists, links, bold, italic, code blocks, and more. Free online tool.",
  keywords: ["html to markdown","convert html to md","html markdown converter","html to md online"],
  openGraph: {
    title: "HTML to Markdown Converter — Convert HTML to MD Online | CodeUtilo",
    description: "Convert HTML to Markdown format. Handles headings, lists, links, bold, italic, code blocks, and more. Free online tool.",
    url: "https://codeutilo.com/html-to-markdown",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "HTML to Markdown Converter — Convert HTML to MD Online | CodeUtilo",
    description: "Convert HTML to Markdown format. Handles headings, lists, links, bold, italic, code blocks, and more. Free online tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/html-to-markdown",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Html To Markdown"
        description="Convert HTML to Markdown format. Handles headings, lists, links, bold, italic, code blocks, and more. Free online tool."
        slug="html-to-markdown"
      />
      {children}
    </>
  );
}
