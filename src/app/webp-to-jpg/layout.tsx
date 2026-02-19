import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "WebP to JPG Converter Online",
  description:
    "Convert WEBP to JPG (JPEG) online with adjustable quality. Browser-based and private. No uploads required.",
  keywords: ["webp to jpg", "webp to jpeg", "convert webp to jpg", "webp converter"],
  openGraph: {
    title: "WebP to JPG Converter Online | CodeUtilo",
    description:
      "Convert WEBP to JPG (JPEG) online with adjustable quality. Browser-based and private. No uploads required.",
    url: "https://codeutilo.com/webp-to-jpg",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "WebP to JPG Converter Online | CodeUtilo",
    description:
      "Convert WEBP to JPG (JPEG) online with adjustable quality. Browser-based and private. No uploads required.",
  },
  alternates: {
    canonical: "https://codeutilo.com/webp-to-jpg",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="WebP to JPG Converter"
        description="Convert WEBP images to JPG online with adjustable quality. Browser-based and private."
        slug="webp-to-jpg"
      />
      {children}
    </>
  );
}

