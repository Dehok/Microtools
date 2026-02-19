import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "PII Redactor (Privacy Text Sanitizer)",
  description:
    "Detect and redact personal/sensitive data in text locally in your browser: emails, phones, cards, IBAN, IPs, and keys.",
  keywords: ["pii redactor", "remove personal data", "text anonymizer", "privacy sanitizer"],
  openGraph: {
    title: "PII Redactor | CodeUtilo",
    description:
      "Detect and redact personal/sensitive data in text locally in your browser: emails, phones, cards, IBAN, IPs, and keys.",
    url: "https://codeutilo.com/pii-redactor",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "PII Redactor | CodeUtilo",
    description:
      "Detect and redact personal/sensitive data in text locally in your browser: emails, phones, cards, IBAN, IPs, and keys.",
  },
  alternates: {
    canonical: "https://codeutilo.com/pii-redactor",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="PII Redactor"
        description="Detect and redact sensitive data in text with local browser-only processing."
        slug="pii-redactor"
      />
      {children}
    </>
  );
}
