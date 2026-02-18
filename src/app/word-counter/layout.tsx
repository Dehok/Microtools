import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Word Counter & Character Counter Online — Free Text Tool",
  description: "Count words, characters, sentences, and paragraphs in any text. Includes reading and speaking time estimates. Free online tool.",
  keywords: ["word counter","character counter","letter counter","word count online"],
  openGraph: {
    title: "Word Counter & Character Counter Online — Free Text Tool | CodeUtilo",
    description: "Count words, characters, sentences, and paragraphs in any text. Includes reading and speaking time estimates. Free online tool.",
    url: "https://codeutilo.com/word-counter",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Word Counter & Character Counter Online — Free Text Tool | CodeUtilo",
    description: "Count words, characters, sentences, and paragraphs in any text. Includes reading and speaking time estimates. Free online tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/word-counter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Word Counter"
        description="Count words, characters, sentences, and paragraphs in any text. Includes reading and speaking time estimates. Free online tool."
        slug="word-counter"
      />
      {children}
    </>
  );
}
