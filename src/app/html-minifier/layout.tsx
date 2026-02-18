import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "HTML Minifier & Beautifier — Minify HTML Online",
  description: "Minify or beautify HTML code online. Remove whitespace, comments, and redundant attributes to reduce file size. Free HTML minifier tool.",
  keywords: ["html minifier","minify html","html beautifier","html compressor","html formatter"],
  openGraph: {
    title: "HTML Minifier & Beautifier — Minify HTML Online | CodeUtilo",
    description: "Minify or beautify HTML code online. Remove whitespace, comments, and redundant attributes to reduce file size. Free HTML minifier tool.",
    url: "https://codeutilo.com/html-minifier",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "HTML Minifier & Beautifier — Minify HTML Online | CodeUtilo",
    description: "Minify or beautify HTML code online. Remove whitespace, comments, and redundant attributes to reduce file size. Free HTML minifier tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/html-minifier",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Html Minifier"
        description="Minify or beautify HTML code online. Remove whitespace, comments, and redundant attributes to reduce file size. Free HTML minifier tool."
        slug="html-minifier"
      />
      {children}
    </>
  );
}
