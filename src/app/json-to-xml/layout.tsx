import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "JSON to XML Converter Online — Convert JSON to XML",
  description: "Convert JSON data to XML format instantly. Handles nested objects, arrays, and attributes. Free online JSON to XML converter.",
  keywords: ["json to xml","json to xml converter","convert json xml","json xml online","json to xml tool"],
  openGraph: {
    title: "JSON to XML Converter Online — Convert JSON to XML | CodeUtilo",
    description: "Convert JSON data to XML format instantly. Handles nested objects, arrays, and attributes. Free online JSON to XML converter.",
    url: "https://codeutilo.com/json-to-xml",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "JSON to XML Converter Online — Convert JSON to XML | CodeUtilo",
    description: "Convert JSON data to XML format instantly. Handles nested objects, arrays, and attributes. Free online JSON to XML converter.",
  },
  alternates: {
    canonical: "https://codeutilo.com/json-to-xml",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Json To Xml"
        description="Convert JSON data to XML format instantly. Handles nested objects, arrays, and attributes. Free online JSON to XML converter."
        slug="json-to-xml"
      />
      {children}
    </>
  );
}
