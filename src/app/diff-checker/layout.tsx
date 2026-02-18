import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Diff Checker — Compare Two Texts Online Free",
  description: "Compare two texts and highlight the differences line by line. Free online diff checker and text comparison tool.",
  keywords: ["diff checker","text compare","text diff","compare two texts","online diff tool"],
  openGraph: {
    title: "Diff Checker — Compare Two Texts Online Free | CodeUtilo",
    description: "Compare two texts and highlight the differences line by line. Free online diff checker and text comparison tool.",
    url: "https://codeutilo.com/diff-checker",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Diff Checker — Compare Two Texts Online Free | CodeUtilo",
    description: "Compare two texts and highlight the differences line by line. Free online diff checker and text comparison tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/diff-checker",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Diff Checker"
        description="Compare two texts and highlight the differences line by line. Free online diff checker and text comparison tool."
        slug="diff-checker"
      />
      {children}
    </>
  );
}
