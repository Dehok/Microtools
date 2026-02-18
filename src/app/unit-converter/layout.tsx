import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Unit Converter — Length, Weight, Temperature & More",
  description: "Convert between units of length, weight, temperature, speed, area, and volume. Free online tool.",
  keywords: ["unit converter","measurement converter","length converter","weight converter","temperature converter"],
  openGraph: {
    title: "Unit Converter — Length, Weight, Temperature & More | CodeUtilo",
    description: "Convert between units of length, weight, temperature, speed, area, and volume. Free online tool.",
    url: "https://codeutilo.com/unit-converter",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Unit Converter — Length, Weight, Temperature & More | CodeUtilo",
    description: "Convert between units of length, weight, temperature, speed, area, and volume. Free online tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/unit-converter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Unit Converter"
        description="Convert between units of length, weight, temperature, speed, area, and volume. Free online tool."
        slug="unit-converter"
      />
      {children}
    </>
  );
}
