import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
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
        <FAQSchema faqs={[{"question":"What is a URL slug?","answer":"A URL slug is the human-readable part of a URL that identifies a specific page. For example, in 'example.com/blog/my-first-post', the slug is 'my-first-post'. Good slugs are lowercase, hyphenated, and descriptive."},{"question":"Why are slugs important for SEO?","answer":"Search engines use URL slugs as a ranking signal. URLs containing relevant keywords rank slightly better than generic ones. Clean, descriptive slugs also improve click-through rates in search results."},{"question":"What characters are allowed in a URL slug?","answer":"Best practice is to use only lowercase letters (a-z), numbers (0-9), and hyphens (-). Avoid underscores, spaces, special characters, and uppercase letters for maximum compatibility."},{"question":"How does this tool handle special characters?","answer":"The tool transliterates accented characters (é → e, ü → u), removes non-alphanumeric characters, converts spaces to hyphens, and removes consecutive or trailing hyphens."}]} />
      {children}
    </>
  );
}
