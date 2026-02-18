import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "XML Formatter Online — Beautify & Validate XML",
  description: "Format, beautify, and validate XML data online. Minify or pretty-print XML with custom indentation. Free XML formatter tool.",
  keywords: ["xml formatter","xml beautifier","xml validator","format xml","xml pretty print"],
  openGraph: {
    title: "XML Formatter Online — Beautify & Validate XML | CodeUtilo",
    description: "Format, beautify, and validate XML data online. Minify or pretty-print XML with custom indentation. Free XML formatter tool.",
    url: "https://codeutilo.com/xml-formatter",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "XML Formatter Online — Beautify & Validate XML | CodeUtilo",
    description: "Format, beautify, and validate XML data online. Minify or pretty-print XML with custom indentation. Free XML formatter tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/xml-formatter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Xml Formatter"
        description="Format, beautify, and validate XML data online. Minify or pretty-print XML with custom indentation. Free XML formatter tool."
        slug="xml-formatter"
      />
      {children}
    </>
  );
}
