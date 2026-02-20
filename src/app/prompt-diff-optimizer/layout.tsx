import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Prompt Diff Optimizer",
  description:
    "Compare prompt versions, estimate token deltas, and detect removed instruction constraints during optimization.",
  keywords: ["prompt diff", "prompt optimizer", "token delta", "prompt version compare"],
  openGraph: {
    title: "Prompt Diff Optimizer | CodeUtilo",
    description:
      "Compare prompt versions, estimate token deltas, and detect removed instruction constraints during optimization.",
    url: "https://codeutilo.com/prompt-diff-optimizer",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Prompt Diff Optimizer | CodeUtilo",
    description:
      "Compare prompt versions, estimate token deltas, and detect removed instruction constraints during optimization.",
  },
  alternates: {
    canonical: "https://codeutilo.com/prompt-diff-optimizer",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Prompt Diff Optimizer"
        description="Compare prompt revisions and estimate token impact locally in the browser."
        slug="prompt-diff-optimizer"
      />
      {children}
    </>
  );
}
