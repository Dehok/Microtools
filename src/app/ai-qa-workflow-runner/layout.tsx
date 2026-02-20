import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "AI QA Workflow Runner",
  description:
    "Run a deterministic AI QA pipeline across lint, safety, replay, output contract, and eval deltas to get release decisions.",
  keywords: [
    "ai qa workflow",
    "prompt release checklist",
    "llm go no-go",
    "ai release gate",
  ],
  openGraph: {
    title: "AI QA Workflow Runner | CodeUtilo",
    description:
      "Run a deterministic AI QA pipeline across lint, safety, replay, output contract, and eval deltas to get release decisions.",
    url: "https://codeutilo.com/ai-qa-workflow-runner",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "AI QA Workflow Runner | CodeUtilo",
    description:
      "Run a deterministic AI QA pipeline across lint, safety, replay, output contract, and eval deltas to get release decisions.",
  },
  alternates: {
    canonical: "https://codeutilo.com/ai-qa-workflow-runner",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="AI QA Workflow Runner"
        description="Evaluate release readiness by aggregating deterministic QA stage metrics for AI workflows."
        slug="ai-qa-workflow-runner"
      />
      {children}
    </>
  );
}
