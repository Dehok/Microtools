import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Word Counter & Character Counter Online",
  description: "Count words, characters, sentences, and paragraphs in any text. Free online word counter tool.",
  keywords: ["word counter","character counter","word count online","text counter","count words"],
  openGraph: {
    title: "Word Counter & Character Counter Online | CodeUtilo",
    description: "Count words, characters, sentences, and paragraphs in any text. Free online word counter tool.",
    url: "https://codeutilo.com/word-counter",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Word Counter & Character Counter Online | CodeUtilo",
    description: "Count words, characters, sentences, and paragraphs in any text. Free online word counter tool.",
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
        description="Count words, characters, sentences, and paragraphs in any text. Free online word counter tool."
        slug="word-counter"
      />
      {children}
    </>
  );
}
