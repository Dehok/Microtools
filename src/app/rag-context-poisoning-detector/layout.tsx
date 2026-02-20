import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "RAG Context Poisoning Detector",
  description:
    "Detect poisoned retrieval chunks with injection markers, secret patterns, and suspicious instruction payloads before generation.",
  keywords: ["rag context poisoning detector", "rag injection detection", "poisoned chunk detection", "retrieval security"],
  openGraph: {
    title: "RAG Context Poisoning Detector | CodeUtilo",
    description:
      "Detect poisoned retrieval chunks with injection markers, secret patterns, and suspicious instruction payloads before generation.",
    url: "https://codeutilo.com/rag-context-poisoning-detector",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "RAG Context Poisoning Detector | CodeUtilo",
    description:
      "Detect poisoned retrieval chunks with injection markers, secret patterns, and suspicious instruction payloads before generation.",
  },
  alternates: {
    canonical: "https://codeutilo.com/rag-context-poisoning-detector",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="RAG Context Poisoning Detector"
        description="Analyze retrieval chunks for context poisoning and prompt-injection signals in-browser."
        slug="rag-context-poisoning-detector"
      />
      {children}
    </>
  );
}

