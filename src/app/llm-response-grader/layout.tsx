import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "LLM Response Grader",
  description:
    "Grade model outputs against weighted rubric rules and banned-term penalties for consistent AI response QA.",
  keywords: ["llm response grader", "ai output evaluation", "rubric scoring", "prompt qa tool"],
  openGraph: {
    title: "LLM Response Grader | CodeUtilo",
    description:
      "Grade model outputs against weighted rubric rules and banned-term penalties for consistent AI response QA.",
    url: "https://codeutilo.com/llm-response-grader",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "LLM Response Grader | CodeUtilo",
    description:
      "Grade model outputs against weighted rubric rules and banned-term penalties for consistent AI response QA.",
  },
  alternates: {
    canonical: "https://codeutilo.com/llm-response-grader",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="LLM Response Grader"
        description="Evaluate AI responses against custom weighted rubric checks locally."
        slug="llm-response-grader"
      />
      {children}
    </>
  );
}
