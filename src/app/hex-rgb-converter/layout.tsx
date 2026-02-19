import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "HEX to RGB Converter & RGB to HEX Online",
  description: "Convert between HEX, RGB, and HSL color values. Free online color converter.",
  keywords: ["hex to rgb","rgb to hex","color converter","hex rgb converter","hex color to rgb"],
  openGraph: {
    title: "HEX to RGB Converter & RGB to HEX Online | CodeUtilo",
    description: "Convert between HEX, RGB, and HSL color values. Free online color converter.",
    url: "https://codeutilo.com/hex-rgb-converter",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "HEX to RGB Converter & RGB to HEX Online | CodeUtilo",
    description: "Convert between HEX, RGB, and HSL color values. Free online color converter.",
  },
  alternates: {
    canonical: "https://codeutilo.com/hex-rgb-converter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="HEX ↔ RGB Converter"
        description="Convert between HEX, RGB, and HSL color values. Free online color converter."
        slug="hex-rgb-converter"
      />
      {children}
    </>
  );
}
