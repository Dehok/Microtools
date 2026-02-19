import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "CSS Glassmorphism Generator — Frosted Glass CSS",
  description: "Generate CSS glassmorphism (frosted glass) effects with live preview. Customize blur, opacity, and border. Copy ready-to-use CSS.",
  keywords: ["glassmorphism generator","glassmorphism css","frosted glass css","glass effect css","glassmorphism maker"],
  openGraph: {
    title: "CSS Glassmorphism Generator — Frosted Glass CSS | CodeUtilo",
    description: "Generate CSS glassmorphism (frosted glass) effects with live preview. Customize blur, opacity, and border. Copy ready-to-use CSS.",
    url: "https://codeutilo.com/css-glassmorphism-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "CSS Glassmorphism Generator — Frosted Glass CSS | CodeUtilo",
    description: "Generate CSS glassmorphism (frosted glass) effects with live preview. Customize blur, opacity, and border. Copy ready-to-use CSS.",
  },
  alternates: {
    canonical: "https://codeutilo.com/css-glassmorphism-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="CSS Glassmorphism Generator"
        description="Generate CSS glassmorphism (frosted glass) effects with live preview. Customize blur, opacity, and border. Copy ready-to-use CSS."
        slug="css-glassmorphism-generator"
      />
      {children}
    </>
  );
}
