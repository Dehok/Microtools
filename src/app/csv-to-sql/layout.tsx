import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
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
        <FAQSchema faqs={[{"question":"Is the CSV to SQL Converter free to use?","answer":"Yes, the CSV to SQL Converter is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The CSV to SQL Converter is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The CSV to SQL Converter runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
