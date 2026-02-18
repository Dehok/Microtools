import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Open Graph Meta Tag Generator — OG Tags for Social Media",
  description: "Generate Open Graph and Twitter Card meta tags for perfect social media previews. Free online OG tag generator.",
  keywords: ["open graph generator","og tags generator","meta tag generator","twitter card generator","social media preview"],
  openGraph: {
    title: "Open Graph Meta Tag Generator — OG Tags for Social Media | CodeUtilo",
    description: "Generate Open Graph and Twitter Card meta tags for perfect social media previews. Free online OG tag generator.",
    url: "https://codeutilo.com/og-meta-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Open Graph Meta Tag Generator — OG Tags for Social Media | CodeUtilo",
    description: "Generate Open Graph and Twitter Card meta tags for perfect social media previews. Free online OG tag generator.",
  },
  alternates: {
    canonical: "https://codeutilo.com/og-meta-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Og Meta Generator"
        description="Generate Open Graph and Twitter Card meta tags for perfect social media previews. Free online OG tag generator."
        slug="og-meta-generator"
      />
      {children}
    </>
  );
}
