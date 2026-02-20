import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "RAG Noise Pruner",
  description:
    "Prune noisy and redundant RAG chunks by scoring relevance, information density, and duplication penalties.",
  keywords: ["rag noise pruning", "retrieval chunk filter", "rag deduplication", "context pruning"],
  openGraph: {
    title: "RAG Noise Pruner | CodeUtilo",
    description:
      "Prune noisy and redundant RAG chunks by scoring relevance, information density, and duplication penalties.",
    url: "https://codeutilo.com/rag-noise-pruner",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "RAG Noise Pruner | CodeUtilo",
    description:
      "Prune noisy and redundant RAG chunks by scoring relevance, information density, and duplication penalties.",
  },
  alternates: {
    canonical: "https://codeutilo.com/rag-noise-pruner",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="RAG Noise Pruner"
        description="Filter and rank RAG chunks to remove noise and redundant context before retrieval."
        slug="rag-noise-pruner"
      />
      {children}
    </>
  );
}
