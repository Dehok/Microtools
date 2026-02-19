import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Percentage Calculator Online — Quick & Free",
  description: "Calculate percentages instantly. Find percentage of a number, percentage change, increases, and decreases.",
  keywords: ["percentage calculator","calculate percentage","percent calculator","percentage change calculator","find percentage"],
  openGraph: {
    title: "Percentage Calculator Online — Quick & Free | CodeUtilo",
    description: "Calculate percentages instantly. Find percentage of a number, percentage change, increases, and decreases.",
    url: "https://codeutilo.com/percentage-calculator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Percentage Calculator Online — Quick & Free | CodeUtilo",
    description: "Calculate percentages instantly. Find percentage of a number, percentage change, increases, and decreases.",
  },
  alternates: {
    canonical: "https://codeutilo.com/percentage-calculator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Percentage Calculator"
        description="Calculate percentages instantly. Find percentage of a number, percentage change, increases, and decreases."
        slug="percentage-calculator"
      />
      {children}
    </>
  );
}
