import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "PDF to Text Converter Online — Extract Text from PDFs",
  description: "Extract text from PDF files directly in your browser. No upload required. Free, fast, and private PDF text extraction.",
  keywords: ["pdf to text","extract text from pdf","pdf text extractor","convert pdf to text","pdf to txt online"],
  openGraph: {
    title: "PDF to Text Converter Online — Extract Text from PDFs | CodeUtilo",
    description: "Extract text from PDF files directly in your browser. No upload required. Free, fast, and private PDF text extraction.",
    url: "https://codeutilo.com/pdf-to-text",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "PDF to Text Converter Online — Extract Text from PDFs | CodeUtilo",
    description: "Extract text from PDF files directly in your browser. No upload required. Free, fast, and private PDF text extraction.",
  },
  alternates: {
    canonical: "https://codeutilo.com/pdf-to-text",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="PDF to Text"
        description="Extract text from PDF files directly in your browser. No upload required. Free, fast, and private PDF text extraction."
        slug="pdf-to-text"
      />
      {children}
    </>
  );
}
