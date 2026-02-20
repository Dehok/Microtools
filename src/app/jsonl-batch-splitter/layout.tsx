import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "JSONL Batch Splitter",
  description:
    "Split JSONL files into smaller chunks by max lines or max bytes for batch processing workflows.",
  keywords: ["jsonl splitter", "batch jsonl chunker", "split jsonl", "openai batch prep"],
  openGraph: {
    title: "JSONL Batch Splitter | CodeUtilo",
    description:
      "Split JSONL files into smaller chunks by max lines or max bytes for batch processing workflows.",
    url: "https://codeutilo.com/jsonl-batch-splitter",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "JSONL Batch Splitter | CodeUtilo",
    description:
      "Split JSONL files into smaller chunks by max lines or max bytes for batch processing workflows.",
  },
  alternates: {
    canonical: "https://codeutilo.com/jsonl-batch-splitter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="JSONL Batch Splitter"
        description="Split JSONL records into multiple chunks locally in your browser."
        slug="jsonl-batch-splitter"
      />
      {children}
    </>
  );
}
