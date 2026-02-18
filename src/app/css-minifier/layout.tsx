import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "CSS Minifier & Beautifier Online",
  description: "Minify or beautify CSS code. Remove whitespace or format for readability. Free online CSS tool.",
  keywords: ["css minifier","css beautifier","minify css online","css formatter","compress css"],
  openGraph: {
    title: "CSS Minifier & Beautifier Online | CodeUtilo",
    description: "Minify or beautify CSS code. Remove whitespace or format for readability. Free online CSS tool.",
    url: "https://codeutilo.com/css-minifier",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "CSS Minifier & Beautifier Online | CodeUtilo",
    description: "Minify or beautify CSS code. Remove whitespace or format for readability. Free online CSS tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/css-minifier",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="CSS Minifier / Beautifier"
        description="Minify or beautify CSS code. Remove whitespace or format for readability. Free online CSS tool."
        slug="css-minifier"
      />
      {children}
    </>
  );
}
