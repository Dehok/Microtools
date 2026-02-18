import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "CSV to SQL Converter — Generate INSERT Statements",
  description: "Convert CSV data to SQL INSERT statements or CREATE TABLE queries. Set table name and column types. Free CSV to SQL tool.",
  keywords: ["csv to sql","csv to sql converter","csv to insert","csv to create table","generate sql from csv"],
  openGraph: {
    title: "CSV to SQL Converter — Generate INSERT Statements | CodeUtilo",
    description: "Convert CSV data to SQL INSERT statements or CREATE TABLE queries. Set table name and column types. Free CSV to SQL tool.",
    url: "https://codeutilo.com/csv-to-sql",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "CSV to SQL Converter — Generate INSERT Statements | CodeUtilo",
    description: "Convert CSV data to SQL INSERT statements or CREATE TABLE queries. Set table name and column types. Free CSV to SQL tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/csv-to-sql",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Csv To Sql"
        description="Convert CSV data to SQL INSERT statements or CREATE TABLE queries. Set table name and column types. Free CSV to SQL tool."
        slug="csv-to-sql"
      />
      {children}
    </>
  );
}
