import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "WebP to PNG Converter Online",
  description:
    "Convert WEBP images to PNG online in your browser. Free, private, and fast. No uploads and no signup.",
  keywords: ["webp to png", "convert webp to png", "webp converter", "webp image converter"],
  openGraph: {
    title: "WebP to PNG Converter Online | CodeUtilo",
    description:
      "Convert WEBP images to PNG online in your browser. Free, private, and fast. No uploads and no signup.",
    url: "https://codeutilo.com/webp-to-png",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "WebP to PNG Converter Online | CodeUtilo",
    description:
      "Convert WEBP images to PNG online in your browser. Free, private, and fast. No uploads and no signup.",
  },
  alternates: {
    canonical: "https://codeutilo.com/webp-to-png",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="WebP to PNG Converter"
        description="Convert WEBP images to PNG online in your browser. Free, private, and fast."
        slug="webp-to-png"
      />
      {children}
    </>
  );
}

