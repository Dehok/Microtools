import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Prompt Policy Firewall",
  description:
    "Scan prompts for policy violations such as PII, secrets, and injection patterns before sending them to AI models.",
  keywords: ["prompt policy", "ai prompt firewall", "prompt security", "pii prompt scanner"],
  openGraph: {
    title: "Prompt Policy Firewall | CodeUtilo",
    description:
      "Scan prompts for policy violations such as PII, secrets, and injection patterns before sending them to AI models.",
    url: "https://codeutilo.com/prompt-policy-firewall",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Prompt Policy Firewall | CodeUtilo",
    description:
      "Scan prompts for policy violations such as PII, secrets, and injection patterns before sending them to AI models.",
  },
  alternates: {
    canonical: "https://codeutilo.com/prompt-policy-firewall",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Prompt Policy Firewall"
        description="Enforce prompt policy checks for sensitive data and injection phrases locally."
        slug="prompt-policy-firewall"
      />
      {children}
    </>
  );
}
