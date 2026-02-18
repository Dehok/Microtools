import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "HTML Minifier & Beautifier Online",
  description: "Minify or beautify HTML code. Remove whitespace and comments to reduce file size. Free tool.",
  keywords: ["html minifier","minify html","html compressor","html beautifier","compress html online"],
  openGraph: {
    title: "HTML Minifier & Beautifier Online | CodeUtilo",
    description: "Minify or beautify HTML code. Remove whitespace and comments to reduce file size. Free tool.",
    url: "https://codeutilo.com/html-minifier",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "HTML Minifier & Beautifier Online | CodeUtilo",
    description: "Minify or beautify HTML code. Remove whitespace and comments to reduce file size. Free tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/html-minifier",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="HTML Minifier"
        description="Minify or beautify HTML code. Remove whitespace and comments to reduce file size. Free tool."
        slug="html-minifier"
      />
      {children}
    </>
  );
}
