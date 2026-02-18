import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "CSS Minifier & Beautifier Online — Free CSS Formatter",
  description: "Minify CSS to reduce file size or beautify compressed CSS for readability. Free online CSS minifier and formatter.",
  keywords: ["css minifier","css beautifier","css formatter","minify css online","css compressor"],
  openGraph: {
    title: "CSS Minifier & Beautifier Online — Free CSS Formatter | CodeUtilo",
    description: "Minify CSS to reduce file size or beautify compressed CSS for readability. Free online CSS minifier and formatter.",
    url: "https://codeutilo.com/css-minifier",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "CSS Minifier & Beautifier Online — Free CSS Formatter | CodeUtilo",
    description: "Minify CSS to reduce file size or beautify compressed CSS for readability. Free online CSS minifier and formatter.",
  },
  alternates: {
    canonical: "https://codeutilo.com/css-minifier",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Css Minifier"
        description="Minify CSS to reduce file size or beautify compressed CSS for readability. Free online CSS minifier and formatter."
        slug="css-minifier"
      />
      {children}
    </>
  );
}
