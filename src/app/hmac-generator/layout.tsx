import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "HMAC Generator — Generate HMAC Signatures Online",
  description: "Generate HMAC signatures using SHA-256, SHA-512, SHA-1, and MD5. Enter a message and secret key. Free online HMAC generator.",
  keywords: ["hmac generator","hmac sha256","hmac signature","generate hmac","hmac online","hmac calculator"],
  openGraph: {
    title: "HMAC Generator — Generate HMAC Signatures Online | CodeUtilo",
    description: "Generate HMAC signatures using SHA-256, SHA-512, SHA-1, and MD5. Enter a message and secret key. Free online HMAC generator.",
    url: "https://codeutilo.com/hmac-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "HMAC Generator — Generate HMAC Signatures Online | CodeUtilo",
    description: "Generate HMAC signatures using SHA-256, SHA-512, SHA-1, and MD5. Enter a message and secret key. Free online HMAC generator.",
  },
  alternates: {
    canonical: "https://codeutilo.com/hmac-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Hmac Generator"
        description="Generate HMAC signatures using SHA-256, SHA-512, SHA-1, and MD5. Enter a message and secret key. Free online HMAC generator."
        slug="hmac-generator"
      />
      {children}
    </>
  );
}
