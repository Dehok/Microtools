import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Regex Cheat Sheet — Regular Expression Reference",
  description: "Quick reference for regular expressions. Character classes, quantifiers, groups, and common patterns.",
  keywords: ["regex cheat sheet","regular expression cheat sheet","regex reference","regex patterns","regex syntax"],
  openGraph: {
    title: "Regex Cheat Sheet — Regular Expression Reference | CodeUtilo",
    description: "Quick reference for regular expressions. Character classes, quantifiers, groups, and common patterns.",
    url: "https://codeutilo.com/regex-cheat-sheet",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Regex Cheat Sheet — Regular Expression Reference | CodeUtilo",
    description: "Quick reference for regular expressions. Character classes, quantifiers, groups, and common patterns.",
  },
  alternates: {
    canonical: "https://codeutilo.com/regex-cheat-sheet",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Regex Cheat Sheet"
        description="Quick reference for regular expressions. Character classes, quantifiers, groups, and common patterns."
        slug="regex-cheat-sheet"
      />
      {children}
    </>
  );
}
