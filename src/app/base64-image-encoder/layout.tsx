import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Base64 Image Encoder — Convert Images to Base64",
  description: "Convert images to Base64 strings. Supports PNG, JPG, GIF, SVG, and WebP formats. Free tool.",
  keywords: ["base64 image encoder","image to base64","convert image to base64","base64 image","png to base64"],
  openGraph: {
    title: "Base64 Image Encoder — Convert Images to Base64 | CodeUtilo",
    description: "Convert images to Base64 strings. Supports PNG, JPG, GIF, SVG, and WebP formats. Free tool.",
    url: "https://codeutilo.com/base64-image-encoder",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Base64 Image Encoder — Convert Images to Base64 | CodeUtilo",
    description: "Convert images to Base64 strings. Supports PNG, JPG, GIF, SVG, and WebP formats. Free tool.",
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
        description="Convert images to Base64 strings. Supports PNG, JPG, GIF, SVG, and WebP formats. Free tool."
        slug="base64-image-encoder"
      />
      {children}
    </>
  );
}
