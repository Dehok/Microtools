import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Agent Safety Checklist",
  description:
    "Audit AI agent runbooks for safety controls like tool allowlists, confirmation gates, budgets, fallbacks, and logging.",
  keywords: ["agent safety checklist", "ai agent guardrails", "agent runbook audit", "llm agent policy"],
  openGraph: {
    title: "Agent Safety Checklist | CodeUtilo",
    description:
      "Audit AI agent runbooks for safety controls like tool allowlists, confirmation gates, budgets, fallbacks, and logging.",
    url: "https://codeutilo.com/agent-safety-checklist",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Agent Safety Checklist | CodeUtilo",
    description:
      "Audit AI agent runbooks for safety controls like tool allowlists, confirmation gates, budgets, fallbacks, and logging.",
  },
  alternates: {
    canonical: "https://codeutilo.com/agent-safety-checklist",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Agent Safety Checklist"
        description="Checklist audit for AI agent runbook safety controls before production use."
        slug="agent-safety-checklist"
      />
      {children}
    </>
  );
}
