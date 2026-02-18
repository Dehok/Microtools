import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "SQL Formatter & Beautifier Online",
  description: "Format and beautify SQL queries with proper indentation and keywords. Free online SQL formatter.",
  keywords: ["sql formatter","sql beautifier","format sql online","sql pretty print","sql query formatter"],
  openGraph: {
    title: "SQL Formatter & Beautifier Online | CodeUtilo",
    description: "Format and beautify SQL queries with proper indentation and keywords. Free online SQL formatter.",
    url: "https://codeutilo.com/sql-formatter",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "SQL Formatter & Beautifier Online | CodeUtilo",
    description: "Format and beautify SQL queries with proper indentation and keywords. Free online SQL formatter.",
  },
  alternates: {
    canonical: "https://codeutilo.com/sql-formatter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="SQL Formatter"
        description="Format and beautify SQL queries with proper indentation and keywords. Free online SQL formatter."
        slug="sql-formatter"
      />
      {children}
    </>
  );
}
