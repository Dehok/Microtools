import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Text Reverser — Reverse Text, Words & Lines",
  description: "Reverse text characters, words, or lines instantly. Create mirror text, flip text upside down, and check palindromes. Free text reverser.",
  keywords: ["text reverser","reverse text","backwards text","mirror text","flip text","reverse words"],
  openGraph: {
    title: "Text Reverser — Reverse Text, Words & Lines | CodeUtilo",
    description: "Reverse text characters, words, or lines instantly. Create mirror text, flip text upside down, and check palindromes. Free text reverser.",
    url: "https://codeutilo.com/text-reverser",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Text Reverser — Reverse Text, Words & Lines | CodeUtilo",
    description: "Reverse text characters, words, or lines instantly. Create mirror text, flip text upside down, and check palindromes. Free text reverser.",
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
        description="Reverse text characters, words, or lines instantly. Create mirror text, flip text upside down, and check palindromes. Free text reverser."
        slug="text-reverser"
      />
      {children}
    </>
  );
}
