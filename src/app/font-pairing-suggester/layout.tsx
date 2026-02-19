import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Font Pairing Suggester — Google Fonts Combinations",
  description: "Find beautiful Google Font pairings for your project. 15 curated heading + body combinations across 7 categories with live preview.",
  keywords: ["font pairing","google font combinations","font pairing tool","best font pairs","heading body font pairing"],
  openGraph: {
    title: "Font Pairing Suggester — Google Fonts Combinations | CodeUtilo",
    description: "Find beautiful Google Font pairings for your project. 15 curated heading + body combinations across 7 categories with live preview.",
    url: "https://codeutilo.com/font-pairing-suggester",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Font Pairing Suggester — Google Fonts Combinations | CodeUtilo",
    description: "Find beautiful Google Font pairings for your project. 15 curated heading + body combinations across 7 categories with live preview.",
  },
  alternates: {
    canonical: "https://codeutilo.com/font-pairing-suggester",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Font Pairing Suggester"
        description="Find beautiful Google Font pairings for your project. 15 curated heading + body combinations across 7 categories with live preview."
        slug="font-pairing-suggester"
      />
      {children}
    </>
  );
}
