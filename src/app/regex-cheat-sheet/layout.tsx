import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Regex Cheat Sheet — Regular Expression Quick Reference",
  description: "Complete regex cheat sheet with syntax, character classes, quantifiers, anchors, groups, and lookaheads. Searchable quick reference.",
  keywords: ["regex cheat sheet","regular expression","regex reference","regex syntax","regex guide"],
  openGraph: {
    title: "Regex Cheat Sheet — Regular Expression Quick Reference | CodeUtilo",
    description: "Complete regex cheat sheet with syntax, character classes, quantifiers, anchors, groups, and lookaheads. Searchable quick reference.",
    url: "https://codeutilo.com/regex-cheat-sheet",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Regex Cheat Sheet — Regular Expression Quick Reference | CodeUtilo",
    description: "Complete regex cheat sheet with syntax, character classes, quantifiers, anchors, groups, and lookaheads. Searchable quick reference.",
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
        description="Complete regex cheat sheet with syntax, character classes, quantifiers, anchors, groups, and lookaheads. Searchable quick reference."
        slug="regex-cheat-sheet"
      />
      {children}
    </>
  );
}
