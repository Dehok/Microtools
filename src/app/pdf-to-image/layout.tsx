import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "PDF to Image Converter Online",
  description:
    "Convert PDF pages to images (PNG, JPG, WebP) in your browser with quality, scale, and page-range controls.",
  keywords: ["pdf to image", "pdf to png", "pdf to jpg", "pdf page converter"],
  openGraph: {
    title: "PDF to Image Converter Online | CodeUtilo",
    description:
      "Convert PDF pages to images (PNG, JPG, WebP) in your browser with quality, scale, and page-range controls.",
    url: "https://codeutilo.com/pdf-to-image",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "PDF to Image Converter Online | CodeUtilo",
    description:
      "Convert PDF pages to images (PNG, JPG, WebP) in your browser with quality, scale, and page-range controls.",
  },
  alternates: {
    canonical: "https://codeutilo.com/pdf-to-image",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="PDF to Image Converter"
        description="Convert PDF pages to PNG, JPG, or WebP in-browser with no uploads."
        slug="pdf-to-image"
      />
      {children}
    </>
  );
}
