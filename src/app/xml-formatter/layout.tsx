import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "XML Formatter & Beautifier Online",
  description: "Format, beautify, and validate XML data with custom indentation. Free online XML formatter.",
  keywords: ["xml formatter","xml beautifier","format xml online","xml pretty print","xml viewer"],
  openGraph: {
    title: "XML Formatter & Beautifier Online | CodeUtilo",
    description: "Format, beautify, and validate XML data with custom indentation. Free online XML formatter.",
    url: "https://codeutilo.com/xml-formatter",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "XML Formatter & Beautifier Online | CodeUtilo",
    description: "Format, beautify, and validate XML data with custom indentation. Free online XML formatter.",
  },
  alternates: {
    canonical: "https://codeutilo.com/xml-formatter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="XML Formatter"
        description="Format, beautify, and validate XML data with custom indentation. Free online XML formatter."
        slug="xml-formatter"
      />
      {children}
    </>
  );
}
