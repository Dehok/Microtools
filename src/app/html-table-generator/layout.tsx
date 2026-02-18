import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "HTML Table Generator — Create Tables Visually",
  description: "Create HTML tables with a visual editor. Set rows, columns, headers, and styling. Copy clean HTML table code. Free table generator.",
  keywords: ["html table generator","create html table","table generator","html table builder","table code generator"],
  openGraph: {
    title: "HTML Table Generator — Create Tables Visually | CodeUtilo",
    description: "Create HTML tables with a visual editor. Set rows, columns, headers, and styling. Copy clean HTML table code. Free table generator.",
    url: "https://codeutilo.com/html-table-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "HTML Table Generator — Create Tables Visually | CodeUtilo",
    description: "Create HTML tables with a visual editor. Set rows, columns, headers, and styling. Copy clean HTML table code. Free table generator.",
  },
  alternates: {
    canonical: "https://codeutilo.com/html-table-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Html Table Generator"
        description="Create HTML tables with a visual editor. Set rows, columns, headers, and styling. Copy clean HTML table code. Free table generator."
        slug="html-table-generator"
      />
      {children}
    </>
  );
}
