import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Regex to English — Explain Regular Expressions",
  description: "Translate regular expressions to plain English explanations. Understand any regex pattern. Free tool.",
  keywords: ["regex to english","explain regex","regex explainer","understand regex","regex translator"],
  openGraph: {
    title: "Regex to English — Explain Regular Expressions | CodeUtilo",
    description: "Translate regular expressions to plain English explanations. Understand any regex pattern. Free tool.",
    url: "https://codeutilo.com/regex-to-english",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Regex to English — Explain Regular Expressions | CodeUtilo",
    description: "Translate regular expressions to plain English explanations. Understand any regex pattern. Free tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/regex-to-english",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Regex to English"
        description="Translate regular expressions to plain English explanations. Understand any regex pattern. Free tool."
        slug="regex-to-english"
      />
      {children}
    </>
  );
}
