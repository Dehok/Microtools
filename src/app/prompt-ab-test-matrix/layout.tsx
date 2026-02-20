import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Prompt A/B Test Matrix",
  description:
    "Generate deterministic prompt variant matrices across tone, length, and format for repeatable A/B experiments.",
  keywords: ["prompt ab testing", "prompt variants", "llm experiment matrix", "prompt optimization"],
  openGraph: {
    title: "Prompt A/B Test Matrix | CodeUtilo",
    description:
      "Generate deterministic prompt variant matrices across tone, length, and format for repeatable A/B experiments.",
    url: "https://codeutilo.com/prompt-ab-test-matrix",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Prompt A/B Test Matrix | CodeUtilo",
    description:
      "Generate deterministic prompt variant matrices across tone, length, and format for repeatable A/B experiments.",
  },
  alternates: {
    canonical: "https://codeutilo.com/prompt-ab-test-matrix",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Prompt A/B Test Matrix"
        description="Create structured prompt variant matrices for deterministic A/B evaluations."
        slug="prompt-ab-test-matrix"
      />
      {children}
    </>
  );
}
