import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Text Reverser — Reverse Characters, Words & Lines",
  description: "Reverse text characters, words, or lines. Create mirror text and palindromes. Free online tool.",
  keywords: ["text reverser","reverse text","backwards text","mirror text","reverse string online"],
  openGraph: {
    title: "Text Reverser — Reverse Characters, Words & Lines | CodeUtilo",
    description: "Reverse text characters, words, or lines. Create mirror text and palindromes. Free online tool.",
    url: "https://codeutilo.com/text-reverser",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Text Reverser — Reverse Characters, Words & Lines | CodeUtilo",
    description: "Reverse text characters, words, or lines. Create mirror text and palindromes. Free online tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/text-reverser",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Text Reverser"
        description="Reverse text characters, words, or lines. Create mirror text and palindromes. Free online tool."
        slug="text-reverser"
      />
      {children}
    </>
  );
}
