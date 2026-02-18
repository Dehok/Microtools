import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Random Number Generator — Generate Random Numbers Online",
  description: "Generate random numbers within a custom range. Support for multiple numbers, no duplicates, and sorting. Free online tool.",
  keywords: ["random number generator","random number online","random number picker","number randomizer","dice roller"],
  openGraph: {
    title: "Random Number Generator — Generate Random Numbers Online | CodeUtilo",
    description: "Generate random numbers within a custom range. Support for multiple numbers, no duplicates, and sorting. Free online tool.",
    url: "https://codeutilo.com/random-number-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Random Number Generator — Generate Random Numbers Online | CodeUtilo",
    description: "Generate random numbers within a custom range. Support for multiple numbers, no duplicates, and sorting. Free online tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/random-number-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Random Number Generator"
        description="Generate random numbers within a custom range. Support for multiple numbers, no duplicates, and sorting. Free online tool."
        slug="random-number-generator"
      />
      {children}
    </>
  );
}
