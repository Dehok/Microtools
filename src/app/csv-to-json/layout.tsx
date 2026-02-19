import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "CSV to JSON Converter Online — Convert CSV to JSON Free",
  description: "Convert CSV files to JSON format. Custom delimiters, quoted fields, auto number detection. Upload files or paste data.",
  keywords: ["csv to json","convert csv to json","csv to json online","csv to json converter","csv json tool"],
  openGraph: {
    title: "CSV to JSON Converter Online — Convert CSV to JSON Free | CodeUtilo",
    description: "Convert CSV files to JSON format. Custom delimiters, quoted fields, auto number detection. Upload files or paste data.",
    url: "https://codeutilo.com/csv-to-json",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "CSV to JSON Converter Online — Convert CSV to JSON Free | CodeUtilo",
    description: "Convert CSV files to JSON format. Custom delimiters, quoted fields, auto number detection. Upload files or paste data.",
  },
  alternates: {
    canonical: "https://codeutilo.com/csv-to-json",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="CSV to JSON Converter"
        description="Convert CSV files to JSON format. Custom delimiters, quoted fields, auto number detection. Upload files or paste data."
        slug="csv-to-json"
      />
      {children}
    </>
  );
}
