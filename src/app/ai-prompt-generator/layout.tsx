import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "AI Prompt Generator — ChatGPT & Claude Prompt Templates",
  description: "Generate effective AI prompts for ChatGPT, Claude, Gemini, and more. 17 templates for writing, coding, marketing, business, and creative use.",
  keywords: ["ai prompt generator","chatgpt prompt templates","prompt engineering","ai prompt maker","chatgpt prompts"],
  openGraph: {
    title: "AI Prompt Generator — ChatGPT & Claude Prompt Templates | CodeUtilo",
    description: "Generate effective AI prompts for ChatGPT, Claude, Gemini, and more. 17 templates for writing, coding, marketing, business, and creative use.",
    url: "https://codeutilo.com/ai-prompt-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "AI Prompt Generator — ChatGPT & Claude Prompt Templates | CodeUtilo",
    description: "Generate effective AI prompts for ChatGPT, Claude, Gemini, and more. 17 templates for writing, coding, marketing, business, and creative use.",
  },
  alternates: {
    canonical: "https://codeutilo.com/ai-prompt-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="AI Prompt Generator"
        description="Generate effective AI prompts for ChatGPT, Claude, Gemini, and more. 17 templates for writing, coding, marketing, business, and creative use."
        slug="ai-prompt-generator"
      />
      {children}
    </>
  );
}
