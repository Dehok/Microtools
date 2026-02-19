import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Age Calculator Online — Exact Age in Years, Months, Days",
  description: "Calculate your exact age in years, months, and days. Find zodiac sign, day of birth, and days until next birthday.",
  keywords: ["age calculator","how old am i","calculate age","exact age calculator","birthday calculator"],
  openGraph: {
    title: "Age Calculator Online — Exact Age in Years, Months, Days | CodeUtilo",
    description: "Calculate your exact age in years, months, and days. Find zodiac sign, day of birth, and days until next birthday.",
    url: "https://codeutilo.com/age-calculator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Age Calculator Online — Exact Age in Years, Months, Days | CodeUtilo",
    description: "Calculate your exact age in years, months, and days. Find zodiac sign, day of birth, and days until next birthday.",
  },
  alternates: {
    canonical: "https://codeutilo.com/age-calculator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Age Calculator"
        description="Calculate your exact age in years, months, and days. Find zodiac sign, day of birth, and days until next birthday."
        slug="age-calculator"
      />
      {children}
    </>
  );
}
