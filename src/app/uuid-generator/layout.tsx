import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "UUID Generator Online — Free Random UUID v4 Generator",
  description: "Generate random UUIDs (v4) instantly. Bulk generation, uppercase, and no-dash options. Free online UUID generator.",
  keywords: ["uuid generator","guid generator","random uuid","uuid v4","bulk uuid"],
  openGraph: {
    title: "UUID Generator Online — Free Random UUID v4 Generator | CodeUtilo",
    description: "Generate random UUIDs (v4) instantly. Bulk generation, uppercase, and no-dash options. Free online UUID generator.",
    url: "https://codeutilo.com/uuid-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "UUID Generator Online — Free Random UUID v4 Generator | CodeUtilo",
    description: "Generate random UUIDs (v4) instantly. Bulk generation, uppercase, and no-dash options. Free online UUID generator.",
  },
  alternates: {
    canonical: "https://codeutilo.com/uuid-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Uuid Generator"
        description="Generate random UUIDs (v4) instantly. Bulk generation, uppercase, and no-dash options. Free online UUID generator."
        slug="uuid-generator"
      />
        <FAQSchema faqs={[{"question":"What is a UUID?","answer":"A UUID (Universally Unique Identifier) is a 128-bit identifier that is unique across space and time. It looks like: 550e8400-e29b-41d4-a716-446655440000. UUIDs are used as primary keys in databases, API identifiers, and session tokens."},{"question":"What is the difference between UUID v1 and v4?","answer":"UUID v1 uses a timestamp and MAC address, making it sequential but potentially exposing hardware information. UUID v4 is fully random, providing better privacy and unpredictability. This tool generates v4 UUIDs."},{"question":"Are UUIDs truly unique?","answer":"For all practical purposes, yes. The probability of generating two identical v4 UUIDs is astronomically small — about 1 in 5.3 × 10^36. You'd need to generate 1 billion UUIDs per second for about 85 years to have a 50% chance of one collision."},{"question":"Can I use UUIDs as database primary keys?","answer":"Yes, UUIDs are commonly used as primary keys in databases like PostgreSQL, MongoDB, and MySQL. They enable distributed systems to generate unique IDs without coordination."}]} />
      {children}
    </>
  );
}
