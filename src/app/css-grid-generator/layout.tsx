import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "CSS Grid Generator — Visual Grid Layout Builder",
  description: "Create CSS Grid layouts with a visual editor. Set columns, rows, and gap. Free online grid tool.",
  keywords: ["css grid generator","grid layout generator","css grid builder","css grid online","grid template generator"],
  openGraph: {
    title: "CSS Grid Generator — Visual Grid Layout Builder | CodeUtilo",
    description: "Create CSS Grid layouts with a visual editor. Set columns, rows, and gap. Free online grid tool.",
    url: "https://codeutilo.com/css-grid-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "CSS Grid Generator — Visual Grid Layout Builder | CodeUtilo",
    description: "Create CSS Grid layouts with a visual editor. Set columns, rows, and gap. Free online grid tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/css-grid-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="CSS Grid Generator"
        description="Create CSS Grid layouts with a visual editor. Set columns, rows, and gap. Free online grid tool."
        slug="css-grid-generator"
      />
      {children}
    </>
  );
}
