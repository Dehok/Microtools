import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Prompt Security Scanner",
  description:
    "Scan prompts for secret leakage, PII, and injection-style phrases before sending text to AI tools.",
  keywords: ["prompt security scanner", "prompt injection checker", "secret leak detector", "ai prompt privacy"],
  openGraph: {
    title: "Prompt Security Scanner | CodeUtilo",
    description:
      "Scan prompts for secret leakage, PII, and injection-style phrases before sending text to AI tools.",
    url: "https://codeutilo.com/prompt-security-scanner",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Prompt Security Scanner | CodeUtilo",
    description:
      "Scan prompts for secret leakage, PII, and injection-style phrases before sending text to AI tools.",
  },
  alternates: {
    canonical: "https://codeutilo.com/prompt-security-scanner",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Prompt Security Scanner"
        description="Analyze AI prompts for privacy and injection risks locally in-browser."
        slug="prompt-security-scanner"
      />
      {children}
    </>
  );
}
