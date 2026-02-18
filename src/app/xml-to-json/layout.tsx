import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "XML to JSON Converter — Convert XML Online",
  description: "Convert XML data to JSON format online. Handles nested elements, attributes, and arrays. Free XML to JSON converter tool.",
  keywords: ["xml to json","xml to json converter","convert xml to json","xml parser","xml json online"],
  openGraph: {
    title: "XML to JSON Converter — Convert XML Online | CodeUtilo",
    description: "Convert XML data to JSON format online. Handles nested elements, attributes, and arrays. Free XML to JSON converter tool.",
    url: "https://codeutilo.com/xml-to-json",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "XML to JSON Converter — Convert XML Online | CodeUtilo",
    description: "Convert XML data to JSON format online. Handles nested elements, attributes, and arrays. Free XML to JSON converter tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/xml-to-json",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Xml To Json"
        description="Convert XML data to JSON format online. Handles nested elements, attributes, and arrays. Free XML to JSON converter tool."
        slug="xml-to-json"
      />
      {children}
    </>
  );
}
