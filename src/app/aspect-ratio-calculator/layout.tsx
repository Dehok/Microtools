import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Aspect Ratio Calculator — Resize Proportionally",
  description: "Calculate aspect ratios and resize dimensions proportionally. Free online aspect ratio calculator.",
  keywords: ["aspect ratio calculator","ratio calculator","image aspect ratio","16:9 calculator","resize proportionally"],
  openGraph: {
    title: "Aspect Ratio Calculator — Resize Proportionally | CodeUtilo",
    description: "Calculate aspect ratios and resize dimensions proportionally. Free online aspect ratio calculator.",
    url: "https://codeutilo.com/aspect-ratio-calculator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Aspect Ratio Calculator — Resize Proportionally | CodeUtilo",
    description: "Calculate aspect ratios and resize dimensions proportionally. Free online aspect ratio calculator.",
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
        description="Calculate aspect ratios and resize dimensions proportionally. Free online aspect ratio calculator."
        slug="aspect-ratio-calculator"
      />
      {children}
    </>
  );
}
