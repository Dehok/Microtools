import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "HMAC Generator — SHA-256 & SHA-512 Signatures",
  description: "Generate HMAC signatures using SHA-256, SHA-512, and other hash algorithms. Free online tool.",
  keywords: ["hmac generator","hmac sha256","hmac sha512","hmac online","generate hmac signature"],
  openGraph: {
    title: "HMAC Generator — SHA-256 & SHA-512 Signatures | CodeUtilo",
    description: "Generate HMAC signatures using SHA-256, SHA-512, and other hash algorithms. Free online tool.",
    url: "https://codeutilo.com/hmac-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "HMAC Generator — SHA-256 & SHA-512 Signatures | CodeUtilo",
    description: "Generate HMAC signatures using SHA-256, SHA-512, and other hash algorithms. Free online tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/hmac-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="HMAC Generator"
        description="Generate HMAC signatures using SHA-256, SHA-512, and other hash algorithms. Free online tool."
        slug="hmac-generator"
      />
      {children}
    </>
  );
}
