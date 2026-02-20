import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Prompt Compressor",
  description:
    "Compress AI prompts by removing filler, duplicates, and unnecessary whitespace to save tokens and context.",
  keywords: ["prompt compressor", "prompt optimizer", "reduce prompt tokens", "ai prompt cleanup"],
  openGraph: {
    title: "Prompt Compressor | CodeUtilo",
    description:
      "Compress AI prompts by removing filler, duplicates, and unnecessary whitespace to save tokens and context.",
    url: "https://codeutilo.com/prompt-compressor",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Prompt Compressor | CodeUtilo",
    description:
      "Compress AI prompts by removing filler, duplicates, and unnecessary whitespace to save tokens and context.",
  },
  alternates: {
    canonical: "https://codeutilo.com/prompt-compressor",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Prompt Compressor"
        description="Compress verbose prompts with deterministic browser-side cleanup rules."
        slug="prompt-compressor"
      />
      {children}
    </>
  );
}
