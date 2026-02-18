import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Placeholder Image Generator — SVG Placeholders",
  description: "Generate lightweight SVG placeholder images with custom dimensions and colors. Free online tool.",
  keywords: ["placeholder image","placeholder image generator","svg placeholder","dummy image","image placeholder online"],
  openGraph: {
    title: "Placeholder Image Generator — SVG Placeholders | CodeUtilo",
    description: "Generate lightweight SVG placeholder images with custom dimensions and colors. Free online tool.",
    url: "https://codeutilo.com/placeholder-image",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Placeholder Image Generator — SVG Placeholders | CodeUtilo",
    description: "Generate lightweight SVG placeholder images with custom dimensions and colors. Free online tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/placeholder-image",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Placeholder Image Generator"
        description="Generate lightweight SVG placeholder images with custom dimensions and colors. Free online tool."
        slug="placeholder-image"
      />
      {children}
    </>
  );
}
