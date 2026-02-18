import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "CSS Grid Generator — Visual Grid Layout Builder",
  description: "Create CSS Grid layouts with a visual editor. Set columns, rows, gap, and areas. Copy CSS code instantly. Free online tool.",
  keywords: ["css grid generator","grid layout generator","css grid builder","grid template generator","css grid tool"],
  openGraph: {
    title: "CSS Grid Generator — Visual Grid Layout Builder | CodeUtilo",
    description: "Create CSS Grid layouts with a visual editor. Set columns, rows, gap, and areas. Copy CSS code instantly. Free online tool.",
    url: "https://codeutilo.com/css-grid-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "CSS Grid Generator — Visual Grid Layout Builder | CodeUtilo",
    description: "Create CSS Grid layouts with a visual editor. Set columns, rows, gap, and areas. Copy CSS code instantly. Free online tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/css-grid-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Css Grid Generator"
        description="Create CSS Grid layouts with a visual editor. Set columns, rows, gap, and areas. Copy CSS code instantly. Free online tool."
        slug="css-grid-generator"
      />
      {children}
    </>
  );
}
