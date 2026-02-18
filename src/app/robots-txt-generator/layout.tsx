import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "robots.txt Generator Online — Create Robots.txt File",
  description:
    "Generate a robots.txt file for your website. Set crawl rules for search engines, add sitemaps, and control bot access. Free online tool.",
  keywords: ["robots.txt generator", "robots txt", "create robots.txt", "seo robots", "crawl rules"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
