import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "HTML to Markdown Converter Online",
  description: "Convert HTML to Markdown format. Handles headings, lists, links, and more. Free online converter.",
  keywords: ["html to markdown","convert html to markdown","html markdown converter","html2md","html to md"],
  openGraph: {
    title: "HTML to Markdown Converter Online | CodeUtilo",
    description: "Convert HTML to Markdown format. Handles headings, lists, links, and more. Free online converter.",
    url: "https://codeutilo.com/html-to-markdown",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "HTML to Markdown Converter Online | CodeUtilo",
    description: "Convert HTML to Markdown format. Handles headings, lists, links, and more. Free online converter.",
  },
  alternates: {
    canonical: "https://codeutilo.com/html-to-markdown",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="HTML to Markdown"
        description="Convert HTML to Markdown format. Handles headings, lists, links, and more. Free online converter."
        slug="html-to-markdown"
      />
      {children}
    </>
  );
}
