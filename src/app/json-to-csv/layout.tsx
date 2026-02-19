import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "JSON to CSV Converter Online — Convert JSON to CSV Free",
  description: "Convert JSON arrays to CSV format. Custom delimiters, file upload, proper escaping. Download CSV or copy to clipboard.",
  keywords: ["json to csv","convert json to csv","json to csv online","json to csv converter","json csv tool"],
  openGraph: {
    title: "JSON to CSV Converter Online — Convert JSON to CSV Free | CodeUtilo",
    description: "Convert JSON arrays to CSV format. Custom delimiters, file upload, proper escaping. Download CSV or copy to clipboard.",
    url: "https://codeutilo.com/json-to-csv",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "JSON to CSV Converter Online — Convert JSON to CSV Free | CodeUtilo",
    description: "Convert JSON arrays to CSV format. Custom delimiters, file upload, proper escaping. Download CSV or copy to clipboard.",
  },
  alternates: {
    canonical: "https://codeutilo.com/json-to-csv",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="JSON to CSV Converter"
        description="Convert JSON arrays to CSV format. Custom delimiters, file upload, proper escaping. Download CSV or copy to clipboard."
        slug="json-to-csv"
      />
      {children}
    </>
  );
}
