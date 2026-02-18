import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Lorem Ipsum Generator Online — Free Placeholder Text",
  description: "Generate lorem ipsum placeholder text in paragraphs, sentences, or words. Classic or randomized latin text for designers and developers.",
  keywords: ["lorem ipsum generator","placeholder text","dummy text","lorem ipsum"],
  openGraph: {
    title: "Lorem Ipsum Generator Online — Free Placeholder Text | CodeUtilo",
    description: "Generate lorem ipsum placeholder text in paragraphs, sentences, or words. Classic or randomized latin text for designers and developers.",
    url: "https://codeutilo.com/lorem-ipsum-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Lorem Ipsum Generator Online — Free Placeholder Text | CodeUtilo",
    description: "Generate lorem ipsum placeholder text in paragraphs, sentences, or words. Classic or randomized latin text for designers and developers.",
  },
  alternates: {
    canonical: "https://codeutilo.com/lorem-ipsum-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Lorem Ipsum Generator"
        description="Generate lorem ipsum placeholder text in paragraphs, sentences, or words. Classic or randomized latin text for designers and developers."
        slug="lorem-ipsum-generator"
      />
      {children}
    </>
  );
}
