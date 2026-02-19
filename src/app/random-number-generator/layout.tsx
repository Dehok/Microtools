import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Random Number Generator Online",
  description: "Generate random numbers within a custom range with various options. Free online random number tool.",
  keywords: ["random number generator","random number","rng online","generate random number","number generator"],
  openGraph: {
    title: "Random Number Generator Online | CodeUtilo",
    description: "Generate random numbers within a custom range with various options. Free online random number tool.",
    url: "https://codeutilo.com/random-number-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Random Number Generator Online | CodeUtilo",
    description: "Generate random numbers within a custom range with various options. Free online random number tool.",
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
        description="Generate random numbers within a custom range with various options. Free online random number tool."
        slug="random-number-generator"
      />
      {children}
    </>
  );
}
