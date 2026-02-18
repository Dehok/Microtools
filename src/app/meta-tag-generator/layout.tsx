import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Meta Tag Generator — SEO Meta Tags & HTML Head Builder",
  description: "Generate HTML meta tags for SEO, social media, and search engines. Includes title, description, viewport, charset, and canonical tags.",
  keywords: ["meta tag generator","seo meta tags","html meta","meta description generator","seo tags"],
  openGraph: {
    title: "Meta Tag Generator — SEO Meta Tags & HTML Head Builder | CodeUtilo",
    description: "Generate HTML meta tags for SEO, social media, and search engines. Includes title, description, viewport, charset, and canonical tags.",
    url: "https://codeutilo.com/meta-tag-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Meta Tag Generator — SEO Meta Tags & HTML Head Builder | CodeUtilo",
    description: "Generate HTML meta tags for SEO, social media, and search engines. Includes title, description, viewport, charset, and canonical tags.",
  },
  alternates: {
    canonical: "https://codeutilo.com/meta-tag-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Meta Tag Generator"
        description="Generate HTML meta tags for SEO, social media, and search engines. Includes title, description, viewport, charset, and canonical tags."
        slug="meta-tag-generator"
      />
      {children}
    </>
  );
}
