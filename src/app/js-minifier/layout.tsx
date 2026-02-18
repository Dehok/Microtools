import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "JavaScript Minifier — Minify JS Code Online",
  description: "Minify JavaScript code by removing comments and whitespace. Free online JS minifier.",
  keywords: ["javascript minifier","js minifier","minify javascript","minify js online","compress javascript"],
  openGraph: {
    title: "JavaScript Minifier — Minify JS Code Online | CodeUtilo",
    description: "Minify JavaScript code by removing comments and whitespace. Free online JS minifier.",
    url: "https://codeutilo.com/js-minifier",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "JavaScript Minifier — Minify JS Code Online | CodeUtilo",
    description: "Minify JavaScript code by removing comments and whitespace. Free online JS minifier.",
  },
  alternates: {
    canonical: "https://codeutilo.com/js-minifier",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="JavaScript Minifier"
        description="Minify JavaScript code by removing comments and whitespace. Free online JS minifier."
        slug="js-minifier"
      />
      {children}
    </>
  );
}
