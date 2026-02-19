import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "HEIC to PNG Converter Online",
  description:
    "Convert HEIC and HEIF photos to PNG online in your browser. Private processing with no upload required.",
  keywords: ["heic to png", "heif to png", "convert heic photo", "heic converter online"],
  openGraph: {
    title: "HEIC to PNG Converter Online | CodeUtilo",
    description:
      "Convert HEIC and HEIF photos to PNG online in your browser. Private processing with no upload required.",
    url: "https://codeutilo.com/heic-to-png",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "HEIC to PNG Converter Online | CodeUtilo",
    description:
      "Convert HEIC and HEIF photos to PNG online in your browser. Private processing with no upload required.",
  },
  alternates: {
    canonical: "https://codeutilo.com/heic-to-png",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="HEIC to PNG Converter"
        description="Convert HEIC and HEIF photos to PNG in your browser without uploading files."
        slug="heic-to-png"
      />
      {children}
    </>
  );
}

