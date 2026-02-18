import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "CSS Flexbox Generator — Visual Layout Builder",
  description: "Generate CSS flexbox layouts with a visual editor. Set direction, alignment, and wrapping. Free tool.",
  keywords: ["flexbox generator","css flexbox","flexbox layout generator","flexbox builder","css flex generator"],
  openGraph: {
    title: "CSS Flexbox Generator — Visual Layout Builder | CodeUtilo",
    description: "Generate CSS flexbox layouts with a visual editor. Set direction, alignment, and wrapping. Free tool.",
    url: "https://codeutilo.com/flexbox-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "CSS Flexbox Generator — Visual Layout Builder | CodeUtilo",
    description: "Generate CSS flexbox layouts with a visual editor. Set direction, alignment, and wrapping. Free tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/flexbox-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="CSS Flexbox Generator"
        description="Generate CSS flexbox layouts with a visual editor. Set direction, alignment, and wrapping. Free tool."
        slug="flexbox-generator"
      />
      {children}
    </>
  );
}
