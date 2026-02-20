import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Sensitive Data Pseudonymizer",
  description:
    "Pseudonymize personal and sensitive data with reversible placeholders before sharing text with AI models.",
  keywords: ["data pseudonymizer", "pii masking", "reversible redaction", "ai privacy preprocessing"],
  openGraph: {
    title: "Sensitive Data Pseudonymizer | CodeUtilo",
    description:
      "Pseudonymize personal and sensitive data with reversible placeholders before sharing text with AI models.",
    url: "https://codeutilo.com/sensitive-data-pseudonymizer",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Sensitive Data Pseudonymizer | CodeUtilo",
    description:
      "Pseudonymize personal and sensitive data with reversible placeholders before sharing text with AI models.",
  },
  alternates: {
    canonical: "https://codeutilo.com/sensitive-data-pseudonymizer",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Sensitive Data Pseudonymizer"
        description="Replace PII-like data with reversible placeholders locally before AI usage."
        slug="sensitive-data-pseudonymizer"
      />
      {children}
    </>
  );
}
