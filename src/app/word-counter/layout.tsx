import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
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
        <FAQSchema faqs={[{"question":"How does the word counter count words?","answer":"The tool counts words by splitting text on whitespace boundaries (spaces, tabs, newlines). It handles multiple consecutive spaces correctly and ignores leading/trailing whitespace."},{"question":"Does it count characters with or without spaces?","answer":"Both. The tool shows total characters (including spaces) and characters without spaces, so you can use whichever metric you need."},{"question":"Can I use this for essay word count requirements?","answer":"Yes. The word count is accurate and matches the counting method used by most word processors. It's ideal for checking essay, blog post, and assignment word limits."},{"question":"What is the average reading time calculation based on?","answer":"Reading time is estimated at approximately 200-250 words per minute, which is the average adult reading speed. Speaking time uses approximately 130-150 words per minute."}]} />
      {children}
    </>
  );
}
