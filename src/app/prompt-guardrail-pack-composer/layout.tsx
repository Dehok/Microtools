import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Prompt Guardrail Pack Composer",
  description:
    "Compose reusable AI guardrail packs for refusal policy, citation rules, uncertainty handling, tool boundaries, and output contracts.",
  keywords: [
    "prompt guardrails",
    "ai safety prompt",
    "llm guardrail composer",
    "prompt policy blocks",
  ],
  openGraph: {
    title: "Prompt Guardrail Pack Composer | CodeUtilo",
    description:
      "Compose reusable AI guardrail packs for refusal policy, citation rules, uncertainty handling, tool boundaries, and output contracts.",
    url: "https://codeutilo.com/prompt-guardrail-pack-composer",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Prompt Guardrail Pack Composer | CodeUtilo",
    description:
      "Compose reusable AI guardrail packs for refusal policy, citation rules, uncertainty handling, tool boundaries, and output contracts.",
  },
  alternates: {
    canonical: "https://codeutilo.com/prompt-guardrail-pack-composer",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Prompt Guardrail Pack Composer"
        description="Build reusable guardrail prompt blocks with deterministic policy modules."
        slug="prompt-guardrail-pack-composer"
      />
      {children}
    </>
  );
}
