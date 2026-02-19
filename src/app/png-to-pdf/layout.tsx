import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "PNG to PDF Converter Online",
  description:
    "Convert PNG images to PDF in your browser. Keep transparency or flatten to a custom background color.",
  keywords: ["png to pdf", "convert png to pdf", "image to pdf", "merge png to pdf"],
  openGraph: {
    title: "PNG to PDF Converter Online | CodeUtilo",
    description:
      "Convert PNG images to PDF in your browser. Keep transparency or flatten to a custom background color.",
    url: "https://codeutilo.com/png-to-pdf",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "PNG to PDF Converter Online | CodeUtilo",
    description:
      "Convert PNG images to PDF in your browser. Keep transparency or flatten to a custom background color.",
  },
  alternates: {
    canonical: "https://codeutilo.com/png-to-pdf",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="PNG to PDF Converter"
        description="Convert PNG images to PDF files in-browser with optional transparency flattening."
        slug="png-to-pdf"
      />
      {children}
    </>
  );
}
