import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "HTML Table Generator — Visual Table Builder",
  description: "Create HTML tables with a visual editor. Set rows, columns, headers, and styling. Free online tool.",
  keywords: ["html table generator","html table builder","create html table","table generator online","html table maker"],
  openGraph: {
    title: "HTML Table Generator — Visual Table Builder | CodeUtilo",
    description: "Create HTML tables with a visual editor. Set rows, columns, headers, and styling. Free online tool.",
    url: "https://codeutilo.com/html-table-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "HTML Table Generator — Visual Table Builder | CodeUtilo",
    description: "Create HTML tables with a visual editor. Set rows, columns, headers, and styling. Free online tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/html-table-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="HTML Table Generator"
        description="Create HTML tables with a visual editor. Set rows, columns, headers, and styling. Free online tool."
        slug="html-table-generator"
      />
      {children}
    </>
  );
}
