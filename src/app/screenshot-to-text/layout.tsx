import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Screenshot to Text (OCR) — Extract Text from Images",
  description: "Extract text from images and screenshots using OCR. Supports 100+ languages. Free, fast, and runs entirely in your browser.",
  keywords: ["screenshot to text","ocr online","image to text","extract text from image","ocr tool free"],
  openGraph: {
    title: "Screenshot to Text (OCR) — Extract Text from Images | CodeUtilo",
    description: "Extract text from images and screenshots using OCR. Supports 100+ languages. Free, fast, and runs entirely in your browser.",
    url: "https://codeutilo.com/screenshot-to-text",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Screenshot to Text (OCR) — Extract Text from Images | CodeUtilo",
    description: "Extract text from images and screenshots using OCR. Supports 100+ languages. Free, fast, and runs entirely in your browser.",
  },
  alternates: {
    canonical: "https://codeutilo.com/screenshot-to-text",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Screenshot to Text (OCR)"
        description="Extract text from images and screenshots using OCR. Supports 100+ languages. Free, fast, and runs entirely in your browser."
        slug="screenshot-to-text"
      />
      {children}
    </>
  );
}
