import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Lorem Ipsum Generator — Placeholder Text",
  description: "Generate placeholder text in paragraphs, sentences, or words. Free Lorem Ipsum generator for designers and developers.",
  keywords: ["lorem ipsum generator","placeholder text","dummy text generator","lorem ipsum online"],
  openGraph: {
    title: "Lorem Ipsum Generator — Placeholder Text | CodeUtilo",
    description: "Generate placeholder text in paragraphs, sentences, or words. Free Lorem Ipsum generator for designers and developers.",
    url: "https://codeutilo.com/lorem-ipsum-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Lorem Ipsum Generator — Placeholder Text | CodeUtilo",
    description: "Generate placeholder text in paragraphs, sentences, or words. Free Lorem Ipsum generator for designers and developers.",
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
        description="Generate placeholder text in paragraphs, sentences, or words. Free Lorem Ipsum generator for designers and developers."
        slug="lorem-ipsum-generator"
      />
      {children}
    </>
  );
}
