import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "HEX to RGB & RGB to HEX Converter — Color Converter Online",
  description: "Convert between HEX and RGB color values. Also shows HSL. Free online color converter for web developers and designers.",
  keywords: ["hex to rgb","rgb to hex","color converter","hex color converter","rgb converter","css color converter"],
  openGraph: {
    title: "HEX to RGB & RGB to HEX Converter — Color Converter Online | CodeUtilo",
    description: "Convert between HEX and RGB color values. Also shows HSL. Free online color converter for web developers and designers.",
    url: "https://codeutilo.com/hex-rgb-converter",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "HEX to RGB & RGB to HEX Converter — Color Converter Online | CodeUtilo",
    description: "Convert between HEX and RGB color values. Also shows HSL. Free online color converter for web developers and designers.",
  },
  alternates: {
    canonical: "https://codeutilo.com/hex-rgb-converter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Hex Rgb Converter"
        description="Convert between HEX and RGB color values. Also shows HSL. Free online color converter for web developers and designers."
        slug="hex-rgb-converter"
      />
      {children}
    </>
  );
}
