import type { Metadata } from "next";
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
      {children}
    </>
  );
}
