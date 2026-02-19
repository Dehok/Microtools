import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "JSON to XML Converter Online",
  description: "Convert JSON data to XML format. Handles nested objects, arrays, and attributes. Free converter.",
  keywords: ["json to xml","convert json to xml","json xml converter","json2xml","json to xml online"],
  openGraph: {
    title: "JSON to XML Converter Online | CodeUtilo",
    description: "Convert JSON data to XML format. Handles nested objects, arrays, and attributes. Free converter.",
    url: "https://codeutilo.com/json-to-xml",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "JSON to XML Converter Online | CodeUtilo",
    description: "Convert JSON data to XML format. Handles nested objects, arrays, and attributes. Free converter.",
  },
  alternates: {
    canonical: "https://codeutilo.com/json-to-xml",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="JSON to XML Converter"
        description="Convert JSON data to XML format. Handles nested objects, arrays, and attributes. Free converter."
        slug="json-to-xml"
      />
      {children}
    </>
  );
}
