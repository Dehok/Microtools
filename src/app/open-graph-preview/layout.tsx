import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Open Graph Preview — Social Media Link Preview Tool",
  description: "Preview how your website looks when shared on Facebook, Twitter/X, LinkedIn, and Discord. Test your Open Graph meta tags.",
  keywords: ["open graph preview","og preview tool","social media preview","facebook link preview","twitter card preview"],
  openGraph: {
    title: "Open Graph Preview — Social Media Link Preview Tool | CodeUtilo",
    description: "Preview how your website looks when shared on Facebook, Twitter/X, LinkedIn, and Discord. Test your Open Graph meta tags.",
    url: "https://codeutilo.com/open-graph-preview",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Open Graph Preview — Social Media Link Preview Tool | CodeUtilo",
    description: "Preview how your website looks when shared on Facebook, Twitter/X, LinkedIn, and Discord. Test your Open Graph meta tags.",
  },
  alternates: {
    canonical: "https://codeutilo.com/open-graph-preview",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Open Graph Preview"
        description="Preview how your website looks when shared on Facebook, Twitter/X, LinkedIn, and Discord. Test your Open Graph meta tags."
        slug="open-graph-preview"
      />
      {children}
    </>
  );
}
