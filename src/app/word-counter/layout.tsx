import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Word Counter & Character Counter Online — Free Text Tool",
  description:
    "Count words, characters, sentences, and paragraphs in any text. Includes reading and speaking time estimates. Free online tool.",
  keywords: ["word counter", "character counter", "letter counter", "word count online"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
