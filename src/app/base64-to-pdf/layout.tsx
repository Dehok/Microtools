import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Base64 to PDF Converter Online",
  description:
    "Decode Base64 strings and download them as PDF files in your browser. Supports raw Base64 and data URLs.",
  keywords: ["base64 to pdf", "decode base64 pdf", "data url to pdf", "base64 decoder"],
  openGraph: {
    title: "Base64 to PDF Converter Online | CodeUtilo",
    description:
      "Decode Base64 strings and download them as PDF files in your browser. Supports raw Base64 and data URLs.",
    url: "https://codeutilo.com/base64-to-pdf",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Base64 to PDF Converter Online | CodeUtilo",
    description:
      "Decode Base64 strings and download them as PDF files in your browser. Supports raw Base64 and data URLs.",
  },
  alternates: {
    canonical: "https://codeutilo.com/base64-to-pdf",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Base64 to PDF Converter"
        description="Decode Base64 text into a PDF file in your browser."
        slug="base64-to-pdf"
      />
      {children}
    </>
  );
}
