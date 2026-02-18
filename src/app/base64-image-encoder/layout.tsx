import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Base64 Image Encoder — Convert Images to Base64 Online",
  description: "Convert images to Base64 encoded strings. Supports PNG, JPG, GIF, SVG, and WebP. Get data URI, raw Base64, or HTML img tag.",
  keywords: ["base64 image encoder","image to base64","convert image base64","data uri generator","base64 encode image"],
  openGraph: {
    title: "Base64 Image Encoder — Convert Images to Base64 Online | CodeUtilo",
    description: "Convert images to Base64 encoded strings. Supports PNG, JPG, GIF, SVG, and WebP. Get data URI, raw Base64, or HTML img tag.",
    url: "https://codeutilo.com/base64-image-encoder",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Base64 Image Encoder — Convert Images to Base64 Online | CodeUtilo",
    description: "Convert images to Base64 encoded strings. Supports PNG, JPG, GIF, SVG, and WebP. Get data URI, raw Base64, or HTML img tag.",
  },
  alternates: {
    canonical: "https://codeutilo.com/base64-image-encoder",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Base64 Image Encoder"
        description="Convert images to Base64 encoded strings. Supports PNG, JPG, GIF, SVG, and WebP. Get data URI, raw Base64, or HTML img tag."
        slug="base64-image-encoder"
      />
      {children}
    </>
  );
}
