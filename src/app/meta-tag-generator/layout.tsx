import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meta Tag Generator — SEO Meta Tags & HTML Head Builder",
  description:
    "Generate HTML meta tags for SEO, social media, and search engines. Includes title, description, viewport, charset, and canonical tags.",
  keywords: ["meta tag generator", "seo meta tags", "html meta", "meta description generator", "seo tags"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
