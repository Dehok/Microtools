import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "AI Token Counter Online",
  description:
    "Estimate AI prompt token usage for different context windows. Plan prompts and avoid context overflow.",
  keywords: ["token counter", "ai token estimator", "prompt token count", "llm token calculator"],
  openGraph: {
    title: "AI Token Counter Online | CodeUtilo",
    description:
      "Estimate AI prompt token usage for different context windows. Plan prompts and avoid context overflow.",
    url: "https://codeutilo.com/token-counter",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "AI Token Counter Online | CodeUtilo",
    description:
      "Estimate AI prompt token usage for different context windows. Plan prompts and avoid context overflow.",
  },
  alternates: {
    canonical: "https://codeutilo.com/token-counter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="AI Token Counter"
        description="Estimate token usage for prompts and text across popular AI context windows."
        slug="token-counter"
      />
      {children}
    </>
  );
}

