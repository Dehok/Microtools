import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "PDF to Word Converter Online (Text)",
  description:
    "Extract text from PDF and export to a Word-compatible DOC file in your browser. No uploads required.",
  keywords: ["pdf to word", "pdf to doc", "convert pdf to word", "pdf text extractor"],
  openGraph: {
    title: "PDF to Word Converter Online (Text) | CodeUtilo",
    description:
      "Extract text from PDF and export to a Word-compatible DOC file in your browser. No uploads required.",
    url: "https://codeutilo.com/pdf-to-word",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "PDF to Word Converter Online (Text) | CodeUtilo",
    description:
      "Extract text from PDF and export to a Word-compatible DOC file in your browser. No uploads required.",
  },
  alternates: {
    canonical: "https://codeutilo.com/pdf-to-word",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="PDF to Word Converter"
        description="Extract text from PDF and export to a Word-compatible DOC file in-browser."
        slug="pdf-to-word"
      />
      {children}
    </>
  );
}
