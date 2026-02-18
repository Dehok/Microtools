import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Color Picker — HEX, RGB & HSL Converter",
  description: "Pick colors and convert between HEX, RGB, and HSL formats. Free online color picker tool.",
  keywords: ["color picker","hex color picker","rgb color picker","color converter","pick color online"],
  openGraph: {
    title: "Color Picker — HEX, RGB & HSL Converter | CodeUtilo",
    description: "Pick colors and convert between HEX, RGB, and HSL formats. Free online color picker tool.",
    url: "https://codeutilo.com/color-picker",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Color Picker — HEX, RGB & HSL Converter | CodeUtilo",
    description: "Pick colors and convert between HEX, RGB, and HSL formats. Free online color picker tool.",
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
        description="Pick colors and convert between HEX, RGB, and HSL formats. Free online color picker tool."
        slug="color-picker"
      />
      {children}
    </>
  );
}
