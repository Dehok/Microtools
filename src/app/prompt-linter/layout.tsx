import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Prompt Linter",
  description:
    "Lint AI prompts for ambiguity, missing constraints, and conflicting instructions before running expensive calls.",
  keywords: ["prompt linter", "prompt quality checker", "ai prompt validator", "prompt optimization"],
  openGraph: {
    title: "Prompt Linter | CodeUtilo",
    description:
      "Lint AI prompts for ambiguity, missing constraints, and conflicting instructions before running expensive calls.",
    url: "https://codeutilo.com/prompt-linter",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Prompt Linter | CodeUtilo",
    description:
      "Lint AI prompts for ambiguity, missing constraints, and conflicting instructions before running expensive calls.",
  },
  alternates: {
    canonical: "https://codeutilo.com/prompt-linter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Prompt Linter"
        description="Lint prompts with local rule-based checks for clarity and constraint quality."
        slug="prompt-linter"
      />
      {children}
    </>
  );
}
