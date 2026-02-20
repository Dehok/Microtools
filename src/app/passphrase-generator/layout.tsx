import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Passphrase Generator",
  description:
    "Generate strong memorable passphrases with random words, custom separators, and entropy estimates.",
  keywords: ["passphrase generator", "diceware", "memorable password", "secure passphrase"],
  openGraph: {
    title: "Passphrase Generator | CodeUtilo",
    description:
      "Generate strong memorable passphrases with random words, custom separators, and entropy estimates.",
    url: "https://codeutilo.com/passphrase-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Passphrase Generator | CodeUtilo",
    description:
      "Generate strong memorable passphrases with random words, custom separators, and entropy estimates.",
  },
  alternates: {
    canonical: "https://codeutilo.com/passphrase-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Passphrase Generator"
        description="Generate secure passphrases using browser-side cryptographic randomness."
        slug="passphrase-generator"
      />
      {children}
    </>
  );
}
