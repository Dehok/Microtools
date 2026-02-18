import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "SQL Formatter & Beautifier Online — Format SQL Queries",
  description: "Format and beautify SQL queries with proper indentation and keyword uppercasing. Minify SQL for production. Free online tool.",
  keywords: ["sql formatter","sql beautifier","format sql online","sql pretty print","sql minifier","sql query formatter"],
  openGraph: {
    title: "SQL Formatter & Beautifier Online — Format SQL Queries | CodeUtilo",
    description: "Format and beautify SQL queries with proper indentation and keyword uppercasing. Minify SQL for production. Free online tool.",
    url: "https://codeutilo.com/sql-formatter",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "SQL Formatter & Beautifier Online — Format SQL Queries | CodeUtilo",
    description: "Format and beautify SQL queries with proper indentation and keyword uppercasing. Minify SQL for production. Free online tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/sql-formatter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Sql Formatter"
        description="Format and beautify SQL queries with proper indentation and keyword uppercasing. Minify SQL for production. Free online tool."
        slug="sql-formatter"
      />
      {children}
    </>
  );
}
