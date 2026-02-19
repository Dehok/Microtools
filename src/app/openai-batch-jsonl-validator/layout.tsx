import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "OpenAI Batch JSONL Validator",
  description:
    "Validate Batch API JSONL files in your browser. Detect parse errors, missing fields, and duplicate custom_id values.",
  keywords: [
    "openai batch jsonl",
    "jsonl validator",
    "batch api validator",
    "openai batch file checker",
  ],
  openGraph: {
    title: "OpenAI Batch JSONL Validator | CodeUtilo",
    description:
      "Validate Batch API JSONL files in your browser. Detect parse errors, missing fields, and duplicate custom_id values.",
    url: "https://codeutilo.com/openai-batch-jsonl-validator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "OpenAI Batch JSONL Validator | CodeUtilo",
    description:
      "Validate Batch API JSONL files in your browser. Detect parse errors, missing fields, and duplicate custom_id values.",
  },
  alternates: {
    canonical: "https://codeutilo.com/openai-batch-jsonl-validator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="OpenAI Batch JSONL Validator"
        description="Validate JSONL input for OpenAI Batch API requests, fully in-browser."
        slug="openai-batch-jsonl-validator"
      />
      {children}
    </>
  );
}
