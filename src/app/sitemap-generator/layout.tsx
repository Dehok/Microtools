import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "XML Sitemap Generator — Create Sitemaps for SEO",
  description: "Generate XML sitemaps for your website. Add URLs individually or in bulk. Set priorities, change frequencies, and dates. Download sitemap.xml.",
  keywords: ["sitemap generator","xml sitemap creator","sitemap builder","sitemap maker","generate sitemap xml"],
  openGraph: {
    title: "XML Sitemap Generator — Create Sitemaps for SEO | CodeUtilo",
    description: "Generate XML sitemaps for your website. Add URLs individually or in bulk. Set priorities, change frequencies, and dates. Download sitemap.xml.",
    url: "https://codeutilo.com/sitemap-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "XML Sitemap Generator — Create Sitemaps for SEO | CodeUtilo",
    description: "Generate XML sitemaps for your website. Add URLs individually or in bulk. Set priorities, change frequencies, and dates. Download sitemap.xml.",
  },
  alternates: {
    canonical: "https://codeutilo.com/sitemap-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Sitemap Generator"
        description="Generate XML sitemaps for your website. Add URLs individually or in bulk. Set priorities, change frequencies, and dates. Download sitemap.xml."
        slug="sitemap-generator"
      />
      {children}
    </>
  );
}
