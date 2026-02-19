import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Slug Generator — URL-Friendly Text Converter",
  description: "Convert any text into a URL-friendly slug. Clean, lowercase, hyphenated. Free online slug generator.",
  keywords: ["slug generator","url slug","slugify text","url friendly text","generate slug online"],
  openGraph: {
    title: "Slug Generator — URL-Friendly Text Converter | CodeUtilo",
    description: "Convert any text into a URL-friendly slug. Clean, lowercase, hyphenated. Free online slug generator.",
    url: "https://codeutilo.com/slug-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Slug Generator — URL-Friendly Text Converter | CodeUtilo",
    description: "Convert any text into a URL-friendly slug. Clean, lowercase, hyphenated. Free online slug generator.",
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
        description="Convert any text into a URL-friendly slug. Clean, lowercase, hyphenated. Free online slug generator."
        slug="slug-generator"
      />
      {children}
    </>
  );
}
