import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Hash Generator Online — MD5, SHA-256, SHA-512",
  description: "Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from any text. Free online hash generator.",
  keywords: ["hash generator","md5 hash","sha256 generator","sha512 hash","online hash tool"],
  openGraph: {
    title: "Hash Generator Online — MD5, SHA-256, SHA-512 | CodeUtilo",
    description: "Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from any text. Free online hash generator.",
    url: "https://codeutilo.com/hash-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Hash Generator Online — MD5, SHA-256, SHA-512 | CodeUtilo",
    description: "Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from any text. Free online hash generator.",
  },
  alternates: {
    canonical: "https://codeutilo.com/hash-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Hash Generator"
        description="Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from any text. Free online hash generator."
        slug="hash-generator"
      />
      {children}
    </>
  );
}
