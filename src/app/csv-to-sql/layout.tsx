import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "CSV to SQL Converter — Generate INSERT Statements",
  description: "Convert CSV data to SQL INSERT statements or CREATE TABLE queries. Free online converter.",
  keywords: ["csv to sql","csv to sql converter","csv insert statements","csv to create table","convert csv to sql"],
  openGraph: {
    title: "CSV to SQL Converter — Generate INSERT Statements | CodeUtilo",
    description: "Convert CSV data to SQL INSERT statements or CREATE TABLE queries. Free online converter.",
    url: "https://codeutilo.com/csv-to-sql",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "CSV to SQL Converter — Generate INSERT Statements | CodeUtilo",
    description: "Convert CSV data to SQL INSERT statements or CREATE TABLE queries. Free online converter.",
  },
  alternates: {
    canonical: "https://codeutilo.com/csv-to-sql",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="CSV to SQL Converter"
        description="Convert CSV data to SQL INSERT statements or CREATE TABLE queries. Free online converter."
        slug="csv-to-sql"
      />
      {children}
    </>
  );
}
