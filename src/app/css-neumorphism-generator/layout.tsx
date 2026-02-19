import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "CSS Neumorphism Generator — Soft UI CSS Generator",
  description: "Generate neumorphism (soft UI) CSS with live preview. Flat, concave, convex, and pressed shapes. Copy ready CSS code.",
  keywords: ["neumorphism generator","neumorphism css","soft ui generator","neumorphic design","neumorphism maker"],
  openGraph: {
    title: "CSS Neumorphism Generator — Soft UI CSS Generator | CodeUtilo",
    description: "Generate neumorphism (soft UI) CSS with live preview. Flat, concave, convex, and pressed shapes. Copy ready CSS code.",
    url: "https://codeutilo.com/css-neumorphism-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "CSS Neumorphism Generator — Soft UI CSS Generator | CodeUtilo",
    description: "Generate neumorphism (soft UI) CSS with live preview. Flat, concave, convex, and pressed shapes. Copy ready CSS code.",
  },
  alternates: {
    canonical: "https://codeutilo.com/css-neumorphism-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="CSS Neumorphism Generator"
        description="Generate neumorphism (soft UI) CSS with live preview. Flat, concave, convex, and pressed shapes. Copy ready CSS code."
        slug="css-neumorphism-generator"
      />
      {children}
    </>
  );
}
