import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Hallucination Guardrail Builder",
  description:
    "Build reusable guardrail instruction blocks for grounded answers, uncertainty handling, and safer AI outputs.",
  keywords: ["hallucination guardrails", "prompt guardrail builder", "grounded ai instructions", "llm safety prompts"],
  openGraph: {
    title: "Hallucination Guardrail Builder | CodeUtilo",
    description:
      "Build reusable guardrail instruction blocks for grounded answers, uncertainty handling, and safer AI outputs.",
    url: "https://codeutilo.com/hallucination-guardrail-builder",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Hallucination Guardrail Builder | CodeUtilo",
    description:
      "Build reusable guardrail instruction blocks for grounded answers, uncertainty handling, and safer AI outputs.",
  },
  alternates: {
    canonical: "https://codeutilo.com/hallucination-guardrail-builder",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Hallucination Guardrail Builder"
        description="Generate model-agnostic guardrail blocks for safer, grounded responses."
        slug="hallucination-guardrail-builder"
      />
      {children}
    </>
  );
}
