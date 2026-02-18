import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "JSON to CSV Converter Online — Free JSON/CSV Tool",
  description: "Convert JSON arrays to CSV format and CSV back to JSON instantly. Free online converter with copy and download.",
  keywords: ["json to csv","csv to json","json csv converter","convert json to csv online"],
  openGraph: {
    title: "JSON to CSV Converter Online — Free JSON/CSV Tool | CodeUtilo",
    description: "Convert JSON arrays to CSV format and CSV back to JSON instantly. Free online converter with copy and download.",
    url: "https://codeutilo.com/json-csv-converter",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "JSON to CSV Converter Online — Free JSON/CSV Tool | CodeUtilo",
    description: "Convert JSON arrays to CSV format and CSV back to JSON instantly. Free online converter with copy and download.",
  },
  alternates: {
    canonical: "https://codeutilo.com/json-csv-converter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Json Csv Converter"
        description="Convert JSON arrays to CSV format and CSV back to JSON instantly. Free online converter with copy and download."
        slug="json-csv-converter"
      />
      {children}
    </>
  );
}
