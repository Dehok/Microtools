import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "UUID Generator Online — Generate Random UUIDs",
  description: "Generate random UUIDs (v4) with one click. Bulk generation supported. Free online UUID/GUID generator.",
  keywords: ["uuid generator","guid generator","random uuid","uuid v4","generate uuid online"],
  openGraph: {
    title: "UUID Generator Online — Generate Random UUIDs | CodeUtilo",
    description: "Generate random UUIDs (v4) with one click. Bulk generation supported. Free online UUID/GUID generator.",
    url: "https://codeutilo.com/uuid-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "UUID Generator Online — Generate Random UUIDs | CodeUtilo",
    description: "Generate random UUIDs (v4) with one click. Bulk generation supported. Free online UUID/GUID generator.",
  },
  alternates: {
    canonical: "https://codeutilo.com/uuid-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="UUID Generator"
        description="Generate random UUIDs (v4) with one click. Bulk generation supported. Free online UUID/GUID generator."
        slug="uuid-generator"
      />
      {children}
    </>
  );
}
