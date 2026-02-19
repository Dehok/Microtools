import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Reading Time Calculator — Estimate Read Time Online",
  description: "Estimate reading time and speaking time for any text. Word and character stats included. Free tool.",
  keywords: ["reading time calculator","read time estimator","reading time","speaking time calculator","text reading time"],
  openGraph: {
    title: "Reading Time Calculator — Estimate Read Time Online | CodeUtilo",
    description: "Estimate reading time and speaking time for any text. Word and character stats included. Free tool.",
    url: "https://codeutilo.com/reading-time-calculator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Reading Time Calculator — Estimate Read Time Online | CodeUtilo",
    description: "Estimate reading time and speaking time for any text. Word and character stats included. Free tool.",
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
        description="Estimate reading time and speaking time for any text. Word and character stats included. Free tool."
        slug="reading-time-calculator"
      />
      {children}
    </>
  );
}
