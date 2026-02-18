import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Regex Tester Online — Free Regular Expression Tester",
  description: "Test regular expressions against text with real-time match highlighting. Supports JavaScript regex flags.",
  keywords: ["regex tester","regex online","regular expression tester","regex101","regex checker"],
  openGraph: {
    title: "Regex Tester Online — Free Regular Expression Tester | CodeUtilo",
    description: "Test regular expressions against text with real-time match highlighting. Supports JavaScript regex flags.",
    url: "https://codeutilo.com/regex-tester",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Regex Tester Online — Free Regular Expression Tester | CodeUtilo",
    description: "Test regular expressions against text with real-time match highlighting. Supports JavaScript regex flags.",
  },
  alternates: {
    canonical: "https://codeutilo.com/regex-tester",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Regex Tester"
        description="Test regular expressions against text with real-time match highlighting. Supports JavaScript regex flags."
        slug="regex-tester"
      />
      {children}
    </>
  );
}
