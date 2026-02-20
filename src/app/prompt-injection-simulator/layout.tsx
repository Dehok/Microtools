import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Prompt Injection Simulator",
  description:
    "Simulate common prompt-injection attacks, score defense coverage, and generate guardrail recommendations before release.",
  keywords: ["prompt injection simulator", "jailbreak simulation", "prompt security testing", "llm red team"],
  openGraph: {
    title: "Prompt Injection Simulator | CodeUtilo",
    description:
      "Simulate common prompt-injection attacks, score defense coverage, and generate guardrail recommendations before release.",
    url: "https://codeutilo.com/prompt-injection-simulator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Prompt Injection Simulator | CodeUtilo",
    description:
      "Simulate common prompt-injection attacks, score defense coverage, and generate guardrail recommendations before release.",
  },
  alternates: {
    canonical: "https://codeutilo.com/prompt-injection-simulator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Prompt Injection Simulator"
        description="Run deterministic prompt-injection attack simulations and review guardrail coverage in-browser."
        slug="prompt-injection-simulator"
      />
      {children}
    </>
  );
}

