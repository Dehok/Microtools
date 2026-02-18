import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Hash Generator Online — SHA-256, SHA-1, SHA-512",
  description: "Generate SHA-1, SHA-256, SHA-384, and SHA-512 hashes from any text. All hashing happens in your browser. Free and secure.",
  keywords: ["hash generator","sha256 generator","sha1 hash","sha512","hash online"],
  openGraph: {
    title: "Hash Generator Online — SHA-256, SHA-1, SHA-512 | CodeUtilo",
    description: "Generate SHA-1, SHA-256, SHA-384, and SHA-512 hashes from any text. All hashing happens in your browser. Free and secure.",
    url: "https://codeutilo.com/hash-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Hash Generator Online — SHA-256, SHA-1, SHA-512 | CodeUtilo",
    description: "Generate SHA-1, SHA-256, SHA-384, and SHA-512 hashes from any text. All hashing happens in your browser. Free and secure.",
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
        description="Generate SHA-1, SHA-256, SHA-384, and SHA-512 hashes from any text. All hashing happens in your browser. Free and secure."
        slug="hash-generator"
      />
      {children}
    </>
  );
}
