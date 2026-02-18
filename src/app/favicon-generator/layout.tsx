import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Favicon Generator — SVG Favicon Maker Online",
  description: "Generate SVG favicons with emoji, text, or initials. Copy the SVG or data URI. No upload needed. Free online tool.",
  keywords: ["favicon generator","svg favicon","favicon maker","emoji favicon","favicon creator"],
  openGraph: {
    title: "Favicon Generator — SVG Favicon Maker Online | CodeUtilo",
    description: "Generate SVG favicons with emoji, text, or initials. Copy the SVG or data URI. No upload needed. Free online tool.",
    url: "https://codeutilo.com/favicon-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Favicon Generator — SVG Favicon Maker Online | CodeUtilo",
    description: "Generate SVG favicons with emoji, text, or initials. Copy the SVG or data URI. No upload needed. Free online tool.",
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
        description="Generate SVG favicons with emoji, text, or initials. Copy the SVG or data URI. No upload needed. Free online tool."
        slug="favicon-generator"
      />
      {children}
    </>
  );
}
