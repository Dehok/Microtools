import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Open Graph Meta Tag Generator Online",
  description: "Generate Open Graph and Twitter Card meta tags for social media previews. Free online OG generator.",
  keywords: ["open graph generator","og tag generator","twitter card generator","meta tag generator","social media tags"],
  openGraph: {
    title: "Open Graph Meta Tag Generator Online | CodeUtilo",
    description: "Generate Open Graph and Twitter Card meta tags for social media previews. Free online OG generator.",
    url: "https://codeutilo.com/og-meta-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Open Graph Meta Tag Generator Online | CodeUtilo",
    description: "Generate Open Graph and Twitter Card meta tags for social media previews. Free online OG generator.",
  },
  alternates: {
    canonical: "https://codeutilo.com/og-meta-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Open Graph Generator"
        description="Generate Open Graph and Twitter Card meta tags for social media previews. Free online OG generator."
        slug="og-meta-generator"
      />
      {children}
    </>
  );
}
