import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
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
        <FAQSchema faqs={[{"question":"What is a hash function?","answer":"A hash function takes any input and produces a fixed-length output (the hash). The same input always produces the same hash, but it's computationally infeasible to reverse the process or find two inputs with the same hash."},{"question":"Which hash algorithm should I use?","answer":"For general purposes, use SHA-256. MD5 and SHA-1 are considered insecure for cryptographic use. For password hashing, use bcrypt, scrypt, or Argon2 instead."},{"question":"Is MD5 secure?","answer":"No. MD5 is cryptographically broken — collision attacks are practical and fast. Don't use MD5 for security purposes. It's still acceptable for checksums and non-security data integrity checks."},{"question":"Can I reverse a hash to get the original text?","answer":"Hash functions are one-way by design. You cannot mathematically reverse a hash. However, short or common inputs can be found using rainbow tables or brute force, which is why strong passwords are important."}]} />
      {children}
    </>
  );
}
