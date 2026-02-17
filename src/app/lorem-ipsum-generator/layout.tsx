import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lorem Ipsum Generator Online — Free Placeholder Text",
  description:
    "Generate lorem ipsum placeholder text in paragraphs, sentences, or words. Classic or randomized latin text for designers and developers.",
  keywords: ["lorem ipsum generator", "placeholder text", "dummy text", "lorem ipsum"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
