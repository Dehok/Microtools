import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Regex Tester — Test Regular Expressions Online",
  description: "Test regular expressions against text with real-time highlighting of matches. Free online regex tester.",
  keywords: ["regex tester","regex online","test regex","regular expression tester","regex matcher"],
  openGraph: {
    title: "Regex Tester — Test Regular Expressions Online | CodeUtilo",
    description: "Test regular expressions against text with real-time highlighting of matches. Free online regex tester.",
    url: "https://codeutilo.com/regex-tester",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Regex Tester — Test Regular Expressions Online | CodeUtilo",
    description: "Test regular expressions against text with real-time highlighting of matches. Free online regex tester.",
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
        description="Test regular expressions against text with real-time highlighting of matches. Free online regex tester."
        slug="regex-tester"
      />
      {children}
    </>
  );
}
