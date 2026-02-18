import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "robots.txt Generator Online — Create Robots.txt File",
  description: "Generate a robots.txt file for your website. Set crawl rules for search engines, add sitemaps, and control bot access. Free online tool.",
  keywords: ["robots.txt generator","robots txt","create robots.txt","seo robots","crawl rules"],
  openGraph: {
    title: "robots.txt Generator Online — Create Robots.txt File | CodeUtilo",
    description: "Generate a robots.txt file for your website. Set crawl rules for search engines, add sitemaps, and control bot access. Free online tool.",
    url: "https://codeutilo.com/robots-txt-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "robots.txt Generator Online — Create Robots.txt File | CodeUtilo",
    description: "Generate a robots.txt file for your website. Set crawl rules for search engines, add sitemaps, and control bot access. Free online tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/robots-txt-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Robots Txt Generator"
        description="Generate a robots.txt file for your website. Set crawl rules for search engines, add sitemaps, and control bot access. Free online tool."
        slug="robots-txt-generator"
      />
      {children}
    </>
  );
}
