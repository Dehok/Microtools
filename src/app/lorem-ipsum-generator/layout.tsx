import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
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
        <FAQSchema faqs={[{"question":"What is Lorem Ipsum?","answer":"Lorem Ipsum is dummy text used in the printing and typesetting industry since the 1500s. It is derived from a scrambled section of 'De Finibus Bonorum et Malorum' by Cicero, written in 45 BC."},{"question":"Why use Lorem Ipsum instead of real text?","answer":"Lorem Ipsum helps focus on visual design without the distraction of readable content. Real text can bias viewers toward reading rather than evaluating layout, typography, and spacing."},{"question":"Is Lorem Ipsum real Latin?","answer":"Lorem Ipsum is based on Latin but is not standard Latin. It is a scrambled and altered version of a passage by Cicero. Some words are real Latin, while others are modified or made up."},{"question":"Can I use Lorem Ipsum in my projects commercially?","answer":"Yes. Lorem Ipsum is in the public domain and can be used freely in any project. It is meant as placeholder text and should be replaced with real content before publishing."}]} />
      {children}
    </>
  );
}
