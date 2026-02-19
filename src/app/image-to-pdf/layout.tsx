import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Image to PDF Converter Online — Free & Private",
  description: "Convert one or more images to a PDF document directly in your browser. Combine multiple images, set page size and margins.",
  keywords: ["image to pdf","jpg to pdf","png to pdf","convert image to pdf","photo to pdf online"],
  openGraph: {
    title: "Image to PDF Converter Online — Free & Private | CodeUtilo",
    description: "Convert one or more images to a PDF document directly in your browser. Combine multiple images, set page size and margins.",
    url: "https://codeutilo.com/image-to-pdf",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Image to PDF Converter Online — Free & Private | CodeUtilo",
    description: "Convert one or more images to a PDF document directly in your browser. Combine multiple images, set page size and margins.",
  },
  alternates: {
    canonical: "https://codeutilo.com/image-to-pdf",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Image to PDF"
        description="Convert one or more images to a PDF document directly in your browser. Combine multiple images, set page size and margins."
        slug="image-to-pdf"
      />
      {children}
    </>
  );
}
