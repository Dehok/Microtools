import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "PDF to JPG Converter Online",
  description:
    "Convert PDF pages to JPG images directly in your browser with quality and scale controls.",
  keywords: ["pdf to jpg", "convert pdf to jpg", "pdf to jpeg", "pdf page to image"],
  openGraph: {
    title: "PDF to JPG Converter Online | CodeUtilo",
    description:
      "Convert PDF pages to JPG images directly in your browser with quality and scale controls.",
    url: "https://codeutilo.com/pdf-to-jpg",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "PDF to JPG Converter Online | CodeUtilo",
    description:
      "Convert PDF pages to JPG images directly in your browser with quality and scale controls.",
  },
  alternates: {
    canonical: "https://codeutilo.com/pdf-to-jpg",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="PDF to JPG Converter"
        description="Convert PDF pages to JPG images in your browser with adjustable quality."
        slug="pdf-to-jpg"
      />
      {children}
    </>
  );
}
