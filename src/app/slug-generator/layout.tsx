import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "URL Slug Generator Online — Free SEO-Friendly Slug Tool",
  description: "Convert any text into a clean, URL-friendly slug. Removes special characters, diacritics, and spaces. Free online slug generator.",
  keywords: ["slug generator","url slug","seo slug","permalink generator","url friendly"],
  openGraph: {
    title: "URL Slug Generator Online — Free SEO-Friendly Slug Tool | CodeUtilo",
    description: "Convert any text into a clean, URL-friendly slug. Removes special characters, diacritics, and spaces. Free online slug generator.",
    url: "https://codeutilo.com/slug-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "URL Slug Generator Online — Free SEO-Friendly Slug Tool | CodeUtilo",
    description: "Convert any text into a clean, URL-friendly slug. Removes special characters, diacritics, and spaces. Free online slug generator.",
  },
  alternates: {
    canonical: "https://codeutilo.com/slug-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Slug Generator"
        description="Convert any text into a clean, URL-friendly slug. Removes special characters, diacritics, and spaces. Free online slug generator."
        slug="slug-generator"
      />
      {children}
    </>
  );
}
