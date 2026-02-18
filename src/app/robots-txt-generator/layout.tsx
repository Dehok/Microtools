import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "robots.txt Generator — Create Robots.txt Online",
  description: "Generate robots.txt files with crawl rules, sitemaps, and bot-specific directives. Free online tool.",
  keywords: ["robots.txt generator","robots txt","create robots.txt","robots file generator","seo robots.txt"],
  openGraph: {
    title: "robots.txt Generator — Create Robots.txt Online | CodeUtilo",
    description: "Generate robots.txt files with crawl rules, sitemaps, and bot-specific directives. Free online tool.",
    url: "https://codeutilo.com/robots-txt-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "robots.txt Generator — Create Robots.txt Online | CodeUtilo",
    description: "Generate robots.txt files with crawl rules, sitemaps, and bot-specific directives. Free online tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/robots-txt-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="robots.txt Generator"
        description="Generate robots.txt files with crawl rules, sitemaps, and bot-specific directives. Free online tool."
        slug="robots-txt-generator"
      />
      {children}
    </>
  );
}
