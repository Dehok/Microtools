import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "XML to JSON Converter Online",
  description: "Convert XML data to JSON format. Handles nested elements, attributes, and arrays. Free converter.",
  keywords: ["xml to json","convert xml to json","xml json converter","xml2json","xml to json online"],
  openGraph: {
    title: "XML to JSON Converter Online | CodeUtilo",
    description: "Convert XML data to JSON format. Handles nested elements, attributes, and arrays. Free converter.",
    url: "https://codeutilo.com/xml-to-json",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "XML to JSON Converter Online | CodeUtilo",
    description: "Convert XML data to JSON format. Handles nested elements, attributes, and arrays. Free converter.",
  },
  alternates: {
    canonical: "https://codeutilo.com/xml-to-json",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="XML to JSON Converter"
        description="Convert XML data to JSON format. Handles nested elements, attributes, and arrays. Free converter."
        slug="xml-to-json"
      />
      {children}
    </>
  );
}
