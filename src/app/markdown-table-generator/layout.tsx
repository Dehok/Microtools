import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Markdown Table Generator — Visual Table Editor",
  description: "Create Markdown tables with a visual editor and column alignment. Free online table generator.",
  keywords: ["markdown table generator","markdown table","create markdown table","markdown table editor","md table generator"],
  openGraph: {
    title: "Markdown Table Generator — Visual Table Editor | CodeUtilo",
    description: "Create Markdown tables with a visual editor and column alignment. Free online table generator.",
    url: "https://codeutilo.com/markdown-table-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Markdown Table Generator — Visual Table Editor | CodeUtilo",
    description: "Create Markdown tables with a visual editor and column alignment. Free online table generator.",
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
        description="Create Markdown tables with a visual editor and column alignment. Free online table generator."
        slug="markdown-table-generator"
      />
      {children}
    </>
  );
}
