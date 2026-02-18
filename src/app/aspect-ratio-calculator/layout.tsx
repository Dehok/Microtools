import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Aspect Ratio Calculator — Resize & Scale Dimensions",
  description: "Calculate aspect ratios, resize dimensions proportionally, and find equivalent sizes. Free online calculator for designers and developers.",
  keywords: ["aspect ratio calculator","image resize calculator","16:9 calculator","ratio calculator","proportional resize","screen resolution calculator"],
  openGraph: {
    title: "Aspect Ratio Calculator — Resize & Scale Dimensions | CodeUtilo",
    description: "Calculate aspect ratios, resize dimensions proportionally, and find equivalent sizes. Free online calculator for designers and developers.",
    url: "https://codeutilo.com/aspect-ratio-calculator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Aspect Ratio Calculator — Resize & Scale Dimensions | CodeUtilo",
    description: "Calculate aspect ratios, resize dimensions proportionally, and find equivalent sizes. Free online calculator for designers and developers.",
  },
  alternates: {
    canonical: "https://codeutilo.com/aspect-ratio-calculator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Aspect Ratio Calculator"
        description="Calculate aspect ratios, resize dimensions proportionally, and find equivalent sizes. Free online calculator for designers and developers."
        slug="aspect-ratio-calculator"
      />
      {children}
    </>
  );
}
