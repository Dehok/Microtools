import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Hallucination Risk Checklist",
  description:
    "Estimate hallucination risk from prompt and context quality with deterministic checks and mitigation guidance.",
  keywords: ["hallucination risk", "prompt guardrails", "llm reliability", "ai safety checklist"],
  openGraph: {
    title: "Hallucination Risk Checklist | CodeUtilo",
    description:
      "Estimate hallucination risk from prompt and context quality with deterministic checks and mitigation guidance.",
    url: "https://codeutilo.com/hallucination-risk-checklist",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Hallucination Risk Checklist | CodeUtilo",
    description:
      "Estimate hallucination risk from prompt and context quality with deterministic checks and mitigation guidance.",
  },
  alternates: {
    canonical: "https://codeutilo.com/hallucination-risk-checklist",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Hallucination Risk Checklist"
        description="Run deterministic checks for prompt ambiguity, weak context, and grounding guardrails."
        slug="hallucination-risk-checklist"
      />
      {children}
    </>
  );
}
