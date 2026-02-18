import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Placeholder Image Generator — SVG Placeholder Images",
  description: "Generate lightweight SVG placeholder images with custom dimensions, colors, and text. No external service needed. Free online tool.",
  keywords: ["placeholder image generator","SVG placeholder","dummy image generator","placeholder image","test image generator","placeholder.com alternative"],
  openGraph: {
    title: "Placeholder Image Generator — SVG Placeholder Images | CodeUtilo",
    description: "Generate lightweight SVG placeholder images with custom dimensions, colors, and text. No external service needed. Free online tool.",
    url: "https://codeutilo.com/placeholder-image",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Placeholder Image Generator — SVG Placeholder Images | CodeUtilo",
    description: "Generate lightweight SVG placeholder images with custom dimensions, colors, and text. No external service needed. Free online tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/placeholder-image",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Placeholder Image"
        description="Generate lightweight SVG placeholder images with custom dimensions, colors, and text. No external service needed. Free online tool."
        slug="placeholder-image"
      />
      {children}
    </>
  );
}
