import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "RAG Context Relevance Scorer",
  description:
    "Score and rank context chunks for retrieval using lexical overlap, phrase hits, and redundancy penalties.",
  keywords: ["rag relevance scorer", "retrieval ranking", "context scoring", "rag chunk ranking"],
  openGraph: {
    title: "RAG Context Relevance Scorer | CodeUtilo",
    description:
      "Score and rank context chunks for retrieval using lexical overlap, phrase hits, and redundancy penalties.",
    url: "https://codeutilo.com/rag-context-relevance-scorer",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "RAG Context Relevance Scorer | CodeUtilo",
    description:
      "Score and rank context chunks for retrieval using lexical overlap, phrase hits, and redundancy penalties.",
  },
  alternates: {
    canonical: "https://codeutilo.com/rag-context-relevance-scorer",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="RAG Context Relevance Scorer"
        description="Rank context chunks for retrieval with deterministic relevance and redundancy scoring."
        slug="rag-context-relevance-scorer"
      />
      {children}
    </>
  );
}
