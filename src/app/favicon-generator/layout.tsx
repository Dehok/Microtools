import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Favicon Generator — Create Favicons from Emoji or Text",
  description: "Generate SVG favicons with emoji, text, or initials. No upload needed. Free online favicon maker.",
  keywords: ["favicon generator","favicon maker","create favicon","svg favicon","emoji favicon generator"],
  openGraph: {
    title: "Favicon Generator — Create Favicons from Emoji or Text | CodeUtilo",
    description: "Generate SVG favicons with emoji, text, or initials. No upload needed. Free online favicon maker.",
    url: "https://codeutilo.com/favicon-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Favicon Generator — Create Favicons from Emoji or Text | CodeUtilo",
    description: "Generate SVG favicons with emoji, text, or initials. No upload needed. Free online favicon maker.",
  },
  alternates: {
    canonical: "https://codeutilo.com/favicon-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Favicon Generator"
        description="Generate SVG favicons with emoji, text, or initials. No upload needed. Free online favicon maker."
        slug="favicon-generator"
      />
      {children}
    </>
  );
}
