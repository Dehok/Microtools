import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Regex to English — Explain Regular Expressions",
  description: "Translate regular expressions to plain English explanations. Understand any regex pattern instantly. Free regex explainer tool.",
  keywords: ["regex to english","regex explain","regex translator","understand regex","regex explainer","regex to text"],
  openGraph: {
    title: "Regex to English — Explain Regular Expressions | CodeUtilo",
    description: "Translate regular expressions to plain English explanations. Understand any regex pattern instantly. Free regex explainer tool.",
    url: "https://codeutilo.com/regex-to-english",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Regex to English — Explain Regular Expressions | CodeUtilo",
    description: "Translate regular expressions to plain English explanations. Understand any regex pattern instantly. Free regex explainer tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/regex-to-english",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Regex To English"
        description="Translate regular expressions to plain English explanations. Understand any regex pattern instantly. Free regex explainer tool."
        slug="regex-to-english"
      />
      {children}
    </>
  );
}
