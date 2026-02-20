import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Answer Consistency Checker",
  description:
    "Compare multiple AI answer variants for the same task and detect conflicts, drift, and consistency stability.",
  keywords: ["answer consistency", "llm output stability", "response comparison", "ai contradiction checker"],
  openGraph: {
    title: "Answer Consistency Checker | CodeUtilo",
    description:
      "Compare multiple AI answer variants for the same task and detect conflicts, drift, and consistency stability.",
    url: "https://codeutilo.com/answer-consistency-checker",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Answer Consistency Checker | CodeUtilo",
    description:
      "Compare multiple AI answer variants for the same task and detect conflicts, drift, and consistency stability.",
  },
  alternates: {
    canonical: "https://codeutilo.com/answer-consistency-checker",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Answer Consistency Checker"
        description="Evaluate response stability by comparing multiple AI answers for conflicts and overlap."
        slug="answer-consistency-checker"
      />
      {children}
    </>
  );
}
