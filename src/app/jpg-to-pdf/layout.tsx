import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "JPG to PDF Converter Online",
  description:
    "Merge JPG and JPEG images into a PDF in your browser. Reorder pages, set margins, and download instantly.",
  keywords: ["jpg to pdf", "jpeg to pdf", "image to pdf", "merge jpg to pdf"],
  openGraph: {
    title: "JPG to PDF Converter Online | CodeUtilo",
    description:
      "Merge JPG and JPEG images into a PDF in your browser. Reorder pages, set margins, and download instantly.",
    url: "https://codeutilo.com/jpg-to-pdf",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "JPG to PDF Converter Online | CodeUtilo",
    description:
      "Merge JPG and JPEG images into a PDF in your browser. Reorder pages, set margins, and download instantly.",
  },
  alternates: {
    canonical: "https://codeutilo.com/jpg-to-pdf",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="JPG to PDF Converter"
        description="Convert and merge JPG/JPEG images to PDF with browser-based processing."
        slug="jpg-to-pdf"
      />
      {children}
    </>
  );
}
