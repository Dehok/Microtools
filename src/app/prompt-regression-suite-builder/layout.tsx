import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Prompt Regression Suite Builder",
  description:
    "Compare baseline and candidate prompts, detect removed constraints, and generate deterministic regression test suites.",
  keywords: ["prompt regression", "prompt qa", "llm eval suite", "prompt version comparison"],
  openGraph: {
    title: "Prompt Regression Suite Builder | CodeUtilo",
    description:
      "Compare baseline and candidate prompts, detect removed constraints, and generate deterministic regression test suites.",
    url: "https://codeutilo.com/prompt-regression-suite-builder",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Prompt Regression Suite Builder | CodeUtilo",
    description:
      "Compare baseline and candidate prompts, detect removed constraints, and generate deterministic regression test suites.",
  },
  alternates: {
    canonical: "https://codeutilo.com/prompt-regression-suite-builder",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Prompt Regression Suite Builder"
        description="Build deterministic prompt regression suites by comparing preserved and removed constraints."
        slug="prompt-regression-suite-builder"
      />
      {children}
    </>
  );
}
