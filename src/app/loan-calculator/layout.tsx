import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Loan Calculator — Monthly Payment & Interest Calculator",
  description: "Calculate monthly loan payments, total interest, and total cost. Visualize principal vs interest breakdown. Free and instant.",
  keywords: ["loan calculator","mortgage calculator","monthly payment calculator","loan interest calculator","emi calculator"],
  openGraph: {
    title: "Loan Calculator — Monthly Payment & Interest Calculator | CodeUtilo",
    description: "Calculate monthly loan payments, total interest, and total cost. Visualize principal vs interest breakdown. Free and instant.",
    url: "https://codeutilo.com/loan-calculator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Loan Calculator — Monthly Payment & Interest Calculator | CodeUtilo",
    description: "Calculate monthly loan payments, total interest, and total cost. Visualize principal vs interest breakdown. Free and instant.",
  },
  alternates: {
    canonical: "https://codeutilo.com/loan-calculator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Loan Calculator"
        description="Calculate monthly loan payments, total interest, and total cost. Visualize principal vs interest breakdown. Free and instant."
        slug="loan-calculator"
      />
      {children}
    </>
  );
}
