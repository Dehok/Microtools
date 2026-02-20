import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "AI Reliability Scorecard",
  description:
    "Score AI prompt and response reliability across quality, safety, output contract fit, and replay-test risk in one browser-only dashboard.",
  keywords: [
    "ai reliability score",
    "prompt release gate",
    "llm safety scorecard",
    "ai qa dashboard",
  ],
  openGraph: {
    title: "AI Reliability Scorecard | CodeUtilo",
    description:
      "Score AI prompt and response reliability across quality, safety, output contract fit, and replay-test risk in one browser-only dashboard.",
    url: "https://codeutilo.com/ai-reliability-scorecard",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "AI Reliability Scorecard | CodeUtilo",
    description:
      "Score AI prompt and response reliability across quality, safety, output contract fit, and replay-test risk in one browser-only dashboard.",
  },
  alternates: {
    canonical: "https://codeutilo.com/ai-reliability-scorecard",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="AI Reliability Scorecard"
        description="Compute release-readiness score from prompt quality, safety checks, output compliance, and replay-test risk."
        slug="ai-reliability-scorecard"
      />
      {children}
    </>
  );
}
