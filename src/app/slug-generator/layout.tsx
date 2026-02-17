import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "URL Slug Generator Online — Free SEO-Friendly Slug Tool",
  description:
    "Convert any text into a clean, URL-friendly slug. Removes special characters, diacritics, and spaces. Free online slug generator.",
  keywords: ["slug generator", "url slug", "seo slug", "permalink generator", "url friendly"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
