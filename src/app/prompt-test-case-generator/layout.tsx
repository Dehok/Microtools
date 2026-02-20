import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Prompt Test Case Generator",
  description:
    "Generate deterministic prompt evaluation test cases and JSONL exports for repeatable AI QA workflows.",
  keywords: ["prompt test case generator", "prompt eval cases", "llm qa", "jsonl eval dataset"],
  openGraph: {
    title: "Prompt Test Case Generator | CodeUtilo",
    description:
      "Generate deterministic prompt evaluation test cases and JSONL exports for repeatable AI QA workflows.",
    url: "https://codeutilo.com/prompt-test-case-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Prompt Test Case Generator | CodeUtilo",
    description:
      "Generate deterministic prompt evaluation test cases and JSONL exports for repeatable AI QA workflows.",
  },
  alternates: {
    canonical: "https://codeutilo.com/prompt-test-case-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Prompt Test Case Generator"
        description="Create reusable prompt QA test cases and JSONL eval rows locally in your browser."
        slug="prompt-test-case-generator"
      />
      {children}
    </>
  );
}
