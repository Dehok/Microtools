import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Reading Time Calculator — Estimate Read Time",
  description: "Estimate reading time and speaking time for any text. Get word count, character count, and paragraph stats. Free reading time estimator.",
  keywords: ["reading time calculator","estimate reading time","word count","reading speed","speaking time calculator"],
  openGraph: {
    title: "Reading Time Calculator — Estimate Read Time | CodeUtilo",
    description: "Estimate reading time and speaking time for any text. Get word count, character count, and paragraph stats. Free reading time estimator.",
    url: "https://codeutilo.com/reading-time-calculator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Reading Time Calculator — Estimate Read Time | CodeUtilo",
    description: "Estimate reading time and speaking time for any text. Get word count, character count, and paragraph stats. Free reading time estimator.",
  },
  alternates: {
    canonical: "https://codeutilo.com/reading-time-calculator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Reading Time Calculator"
        description="Estimate reading time and speaking time for any text. Get word count, character count, and paragraph stats. Free reading time estimator."
        slug="reading-time-calculator"
      />
      {children}
    </>
  );
}
