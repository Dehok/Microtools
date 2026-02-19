import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Meta Tag Generator — SEO HTML Meta Tags",
  description: "Generate HTML meta tags for SEO. Title, description, viewport, robots, and canonical tags. Free tool.",
  keywords: ["meta tag generator","html meta tags","seo meta tags","meta description generator","meta tags online"],
  openGraph: {
    title: "Meta Tag Generator — SEO HTML Meta Tags | CodeUtilo",
    description: "Generate HTML meta tags for SEO. Title, description, viewport, robots, and canonical tags. Free tool.",
    url: "https://codeutilo.com/meta-tag-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Meta Tag Generator — SEO HTML Meta Tags | CodeUtilo",
    description: "Generate HTML meta tags for SEO. Title, description, viewport, robots, and canonical tags. Free tool.",
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
        description="Generate HTML meta tags for SEO. Title, description, viewport, robots, and canonical tags. Free tool."
        slug="meta-tag-generator"
      />
      {children}
    </>
  );
}
