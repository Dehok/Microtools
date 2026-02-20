import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Prompt Red-Team Generator",
  description:
    "Generate adversarial prompt test sets to evaluate jailbreak resistance, policy adherence, and format robustness.",
  keywords: ["prompt red team", "jailbreak testing", "ai safety eval", "prompt adversarial testing"],
  openGraph: {
    title: "Prompt Red-Team Generator | CodeUtilo",
    description:
      "Generate adversarial prompt test sets to evaluate jailbreak resistance, policy adherence, and format robustness.",
    url: "https://codeutilo.com/prompt-red-team-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Prompt Red-Team Generator | CodeUtilo",
    description:
      "Generate adversarial prompt test sets to evaluate jailbreak resistance, policy adherence, and format robustness.",
  },
  alternates: {
    canonical: "https://codeutilo.com/prompt-red-team-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Prompt Red-Team Generator"
        description="Create deterministic adversarial prompt tests for safety and robustness evaluation."
        slug="prompt-red-team-generator"
      />
      {children}
    </>
  );
}
