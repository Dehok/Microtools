import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Color Palette Generator — Random & Harmonious Color Schemes",
  description: "Generate beautiful color palettes with one click. Create harmonious, complementary, and random color schemes. Copy HEX, RGB, or HSL values.",
  keywords: ["color palette generator","color scheme","random colors","color generator","color palette maker"],
  openGraph: {
    title: "Color Palette Generator — Random & Harmonious Color Schemes | CodeUtilo",
    description: "Generate beautiful color palettes with one click. Create harmonious, complementary, and random color schemes. Copy HEX, RGB, or HSL values.",
    url: "https://codeutilo.com/color-palette-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Color Palette Generator — Random & Harmonious Color Schemes | CodeUtilo",
    description: "Generate beautiful color palettes with one click. Create harmonious, complementary, and random color schemes. Copy HEX, RGB, or HSL values.",
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
        description="Generate beautiful color palettes with one click. Create harmonious, complementary, and random color schemes. Copy HEX, RGB, or HSL values."
        slug="color-palette-generator"
      />
      {children}
    </>
  );
}
