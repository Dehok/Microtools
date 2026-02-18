import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Markdown Table Generator — Create Tables Visually",
  description: "Generate Markdown tables with a visual editor. Set alignment, add rows/columns, and copy the result. Free online tool.",
  keywords: ["markdown table generator","markdown table","create markdown table","table to markdown","md table generator"],
  openGraph: {
    title: "Markdown Table Generator — Create Tables Visually | CodeUtilo",
    description: "Generate Markdown tables with a visual editor. Set alignment, add rows/columns, and copy the result. Free online tool.",
    url: "https://codeutilo.com/markdown-table-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Markdown Table Generator — Create Tables Visually | CodeUtilo",
    description: "Generate Markdown tables with a visual editor. Set alignment, add rows/columns, and copy the result. Free online tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/markdown-table-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Markdown Table Generator"
        description="Generate Markdown tables with a visual editor. Set alignment, add rows/columns, and copy the result. Free online tool."
        slug="markdown-table-generator"
      />
      {children}
    </>
  );
}
