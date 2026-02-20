import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "RAG Chunking Simulator",
  description:
    "Simulate chunk size and overlap for retrieval pipelines. Estimate chunk counts, duplication, and token footprint.",
  keywords: ["rag chunking", "chunk size simulator", "retrieval chunk overlap", "vector indexing prep"],
  openGraph: {
    title: "RAG Chunking Simulator | CodeUtilo",
    description:
      "Simulate chunk size and overlap for retrieval pipelines. Estimate chunk counts, duplication, and token footprint.",
    url: "https://codeutilo.com/rag-chunking-simulator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "RAG Chunking Simulator | CodeUtilo",
    description:
      "Simulate chunk size and overlap for retrieval pipelines. Estimate chunk counts, duplication, and token footprint.",
  },
  alternates: {
    canonical: "https://codeutilo.com/rag-chunking-simulator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="RAG Chunking Simulator"
        description="Simulate document chunking strategies for retrieval-augmented generation pipelines."
        slug="rag-chunking-simulator"
      />
      {children}
    </>
  );
}
