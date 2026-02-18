import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Color Palette Generator — Beautiful Color Schemes",
  description: "Generate beautiful color palettes. Random, analogous, complementary, and triadic schemes. Free tool.",
  keywords: ["color palette generator","color scheme generator","random color palette","complementary colors","color harmony"],
  openGraph: {
    title: "Color Palette Generator — Beautiful Color Schemes | CodeUtilo",
    description: "Generate beautiful color palettes. Random, analogous, complementary, and triadic schemes. Free tool.",
    url: "https://codeutilo.com/color-palette-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Color Palette Generator — Beautiful Color Schemes | CodeUtilo",
    description: "Generate beautiful color palettes. Random, analogous, complementary, and triadic schemes. Free tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/color-palette-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Color Palette Generator"
        description="Generate beautiful color palettes. Random, analogous, complementary, and triadic schemes. Free tool."
        slug="color-palette-generator"
      />
      {children}
    </>
  );
}
