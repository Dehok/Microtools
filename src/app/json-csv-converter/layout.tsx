import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "JSON to CSV Converter Online",
  description: "Convert JSON arrays to CSV format and CSV back to JSON. Free online JSON/CSV converter.",
  keywords: ["json to csv","csv to json","json csv converter","convert json to csv online","json to csv online"],
  openGraph: {
    title: "JSON to CSV Converter Online | CodeUtilo",
    description: "Convert JSON arrays to CSV format and CSV back to JSON. Free online JSON/CSV converter.",
    url: "https://codeutilo.com/json-csv-converter",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "JSON to CSV Converter Online | CodeUtilo",
    description: "Convert JSON arrays to CSV format and CSV back to JSON. Free online JSON/CSV converter.",
  },
  alternates: {
    canonical: "https://codeutilo.com/json-csv-converter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="JSON to CSV Converter"
        description="Convert JSON arrays to CSV format and CSV back to JSON. Free online JSON/CSV converter."
        slug="json-csv-converter"
      />
      {children}
    </>
  );
}
