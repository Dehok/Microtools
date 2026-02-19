import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "HEIC to JPG Converter Online",
  description:
    "Convert HEIC and HEIF photos to JPG online in your browser. Private processing with no file upload.",
  keywords: ["heic to jpg", "heif to jpg", "convert heic", "iphone photo converter"],
  openGraph: {
    title: "HEIC to JPG Converter Online | CodeUtilo",
    description:
      "Convert HEIC and HEIF photos to JPG online in your browser. Private processing with no file upload.",
    url: "https://codeutilo.com/heic-to-jpg",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "HEIC to JPG Converter Online | CodeUtilo",
    description:
      "Convert HEIC and HEIF photos to JPG online in your browser. Private processing with no file upload.",
  },
  alternates: {
    canonical: "https://codeutilo.com/heic-to-jpg",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="HEIC to JPG Converter"
        description="Convert HEIC and HEIF photos to JPG in your browser without uploading files."
        slug="heic-to-jpg"
      />
      {children}
    </>
  );
}

