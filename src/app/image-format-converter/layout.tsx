import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Image Format Converter — PNG, JPG, WebP, BMP",
  description: "Convert images between PNG, JPG, WebP, and BMP formats instantly in your browser. Free, fast, private.",
  keywords: ["image format converter","convert png to jpg","convert jpg to webp","image converter online","change image format"],
  openGraph: {
    title: "Image Format Converter — PNG, JPG, WebP, BMP | CodeUtilo",
    description: "Convert images between PNG, JPG, WebP, and BMP formats instantly in your browser. Free, fast, private.",
    url: "https://codeutilo.com/image-format-converter",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Image Format Converter — PNG, JPG, WebP, BMP | CodeUtilo",
    description: "Convert images between PNG, JPG, WebP, and BMP formats instantly in your browser. Free, fast, private.",
  },
  alternates: {
    canonical: "https://codeutilo.com/image-format-converter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Image Format Converter"
        description="Convert images between PNG, JPG, WebP, and BMP formats instantly in your browser. Free, fast, private."
        slug="image-format-converter"
      />
      {children}
    </>
  );
}
