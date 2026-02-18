import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Color Picker — HEX, RGB & HSL Converter Online",
  description: "Pick colors visually and convert between HEX, RGB, and HSL formats. Copy CSS-ready color values instantly. Free online color picker.",
  keywords: ["color picker","hex to rgb","rgb to hex","hsl converter","css color picker"],
  openGraph: {
    title: "Color Picker — HEX, RGB & HSL Converter Online | CodeUtilo",
    description: "Pick colors visually and convert between HEX, RGB, and HSL formats. Copy CSS-ready color values instantly. Free online color picker.",
    url: "https://codeutilo.com/color-picker",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Color Picker — HEX, RGB & HSL Converter Online | CodeUtilo",
    description: "Pick colors visually and convert between HEX, RGB, and HSL formats. Copy CSS-ready color values instantly. Free online color picker.",
  },
  alternates: {
    canonical: "https://codeutilo.com/color-picker",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Color Picker"
        description="Pick colors visually and convert between HEX, RGB, and HSL formats. Copy CSS-ready color values instantly. Free online color picker."
        slug="color-picker"
      />
      {children}
    </>
  );
}
