import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "JavaScript Minifier Online — Minify JS Code Free",
  description: "Minify JavaScript code by removing comments, whitespace, and unnecessary characters. Reduce file size instantly. Free online tool.",
  keywords: ["javascript minifier","js minifier","minify javascript online","compress javascript","js compressor","uglify javascript"],
  openGraph: {
    title: "JavaScript Minifier Online — Minify JS Code Free | CodeUtilo",
    description: "Minify JavaScript code by removing comments, whitespace, and unnecessary characters. Reduce file size instantly. Free online tool.",
    url: "https://codeutilo.com/js-minifier",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "JavaScript Minifier Online — Minify JS Code Free | CodeUtilo",
    description: "Minify JavaScript code by removing comments, whitespace, and unnecessary characters. Reduce file size instantly. Free online tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/js-minifier",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Js Minifier"
        description="Minify JavaScript code by removing comments, whitespace, and unnecessary characters. Reduce file size instantly. Free online tool."
        slug="js-minifier"
      />
      {children}
    </>
  );
}
