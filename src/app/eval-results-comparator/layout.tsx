import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Eval Results Comparator",
  description:
    "Compare two evaluation runs from JSON or JSONL, measure score and pass-rate deltas, and detect improved or regressed cases.",
  keywords: [
    "eval results comparator",
    "jsonl eval diff",
    "llm evaluation delta",
    "prompt regression metrics",
  ],
  openGraph: {
    title: "Eval Results Comparator | CodeUtilo",
    description:
      "Compare two evaluation runs from JSON or JSONL, measure score and pass-rate deltas, and detect improved or regressed cases.",
    url: "https://codeutilo.com/eval-results-comparator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Eval Results Comparator | CodeUtilo",
    description:
      "Compare two evaluation runs from JSON or JSONL, measure score and pass-rate deltas, and detect improved or regressed cases.",
  },
  alternates: {
    canonical: "https://codeutilo.com/eval-results-comparator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Eval Results Comparator"
        description="Compare two LLM eval runs and compute deltas for score, pass rate, and case-level drift."
        slug="eval-results-comparator"
      />
      {children}
    </>
  );
}
