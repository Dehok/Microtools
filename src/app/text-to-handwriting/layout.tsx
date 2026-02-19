import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Text to Handwriting Converter — Generate Handwriting Images",
  description: "Convert typed text to realistic handwriting images. 8 fonts, custom ink color, notebook lines. Download as PNG.",
  keywords: ["text to handwriting","handwriting generator","text to handwriting converter","handwriting maker online","convert text to handwriting"],
  openGraph: {
    title: "Text to Handwriting Converter — Generate Handwriting Images | CodeUtilo",
    description: "Convert typed text to realistic handwriting images. 8 fonts, custom ink color, notebook lines. Download as PNG.",
    url: "https://codeutilo.com/text-to-handwriting",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Text to Handwriting Converter — Generate Handwriting Images | CodeUtilo",
    description: "Convert typed text to realistic handwriting images. 8 fonts, custom ink color, notebook lines. Download as PNG.",
  },
  alternates: {
    canonical: "https://codeutilo.com/text-to-handwriting",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Text to Handwriting"
        description="Convert typed text to realistic handwriting images. 8 fonts, custom ink color, notebook lines. Download as PNG."
        slug="text-to-handwriting"
      />
      {children}
    </>
  );
}
