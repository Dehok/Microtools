import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSV to SQL Converter — Generate INSERT Statements",
  description:
    "Convert CSV data to SQL INSERT statements or CREATE TABLE queries. Set table name and column types. Free CSV to SQL tool.",
  keywords: ["csv to sql", "csv to sql converter", "csv to insert", "csv to create table", "generate sql from csv"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
