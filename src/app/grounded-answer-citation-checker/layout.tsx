import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Grounded Answer Citation Checker",
  description:
    "Verify whether answer claims are supported by supplied sources and detect citation mismatches with deterministic checks.",
  keywords: ["citation checker", "grounded answer", "hallucination detection", "source attribution"],
  openGraph: {
    title: "Grounded Answer Citation Checker | CodeUtilo",
    description:
      "Verify whether answer claims are supported by supplied sources and detect citation mismatches with deterministic checks.",
    url: "https://codeutilo.com/grounded-answer-citation-checker",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Grounded Answer Citation Checker | CodeUtilo",
    description:
      "Verify whether answer claims are supported by supplied sources and detect citation mismatches with deterministic checks.",
  },
  alternates: {
    canonical: "https://codeutilo.com/grounded-answer-citation-checker",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Grounded Answer Citation Checker"
        description="Check claim grounding and citation consistency against provided context sources."
        slug="grounded-answer-citation-checker"
      />
      {children}
    </>
  );
}
