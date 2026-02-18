import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "CSS Flexbox Generator — Visual Flexbox Playground",
  description: "Generate CSS flexbox layouts with a visual editor. Set direction, alignment, wrapping, gap, and more. Copy CSS code instantly.",
  keywords: ["flexbox generator","css flexbox","flexbox playground","flex layout generator","css flex"],
  openGraph: {
    title: "CSS Flexbox Generator — Visual Flexbox Playground | CodeUtilo",
    description: "Generate CSS flexbox layouts with a visual editor. Set direction, alignment, wrapping, gap, and more. Copy CSS code instantly.",
    url: "https://codeutilo.com/flexbox-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "CSS Flexbox Generator — Visual Flexbox Playground | CodeUtilo",
    description: "Generate CSS flexbox layouts with a visual editor. Set direction, alignment, wrapping, gap, and more. Copy CSS code instantly.",
  },
  alternates: {
    canonical: "https://codeutilo.com/flexbox-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Flexbox Generator"
        description="Generate CSS flexbox layouts with a visual editor. Set direction, alignment, wrapping, gap, and more. Copy CSS code instantly."
        slug="flexbox-generator"
      />
      {children}
    </>
  );
}
