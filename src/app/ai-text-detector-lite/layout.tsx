import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "AI Text Detector (Lite)",
  description:
    "Estimate AI-likeness of text using local stylometric heuristics. Browser-only analysis with no uploads.",
  keywords: ["ai text detector", "ai writing checker", "ai content detection", "stylometry"],
  openGraph: {
    title: "AI Text Detector (Lite) | CodeUtilo",
    description:
      "Estimate AI-likeness of text using local stylometric heuristics. Browser-only analysis with no uploads.",
    url: "https://codeutilo.com/ai-text-detector-lite",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "AI Text Detector (Lite) | CodeUtilo",
    description:
      "Estimate AI-likeness of text using local stylometric heuristics. Browser-only analysis with no uploads.",
  },
  alternates: {
    canonical: "https://codeutilo.com/ai-text-detector-lite",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="AI Text Detector Lite"
        description="Run a local heuristic AI-likeness analysis for text."
        slug="ai-text-detector-lite"
      />
      {children}
    </>
  );
}
