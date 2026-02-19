import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "PDF to PNG Converter Online",
  description:
    "Convert PDF pages to high-quality PNG images directly in your browser with adjustable render scale.",
  keywords: ["pdf to png", "convert pdf to png", "pdf page to image", "pdf image converter"],
  openGraph: {
    title: "PDF to PNG Converter Online | CodeUtilo",
    description:
      "Convert PDF pages to high-quality PNG images directly in your browser with adjustable render scale.",
    url: "https://codeutilo.com/pdf-to-png",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "PDF to PNG Converter Online | CodeUtilo",
    description:
      "Convert PDF pages to high-quality PNG images directly in your browser with adjustable render scale.",
  },
  alternates: {
    canonical: "https://codeutilo.com/pdf-to-png",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="PDF to PNG Converter"
        description="Convert PDF pages to PNG images in-browser without uploading files."
        slug="pdf-to-png"
      />
      {children}
    </>
  );
}
