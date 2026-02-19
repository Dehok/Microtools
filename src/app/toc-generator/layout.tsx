import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Table of Contents Generator for Markdown",
  description: "Generate a table of contents from Markdown headings. Create linked TOC for README files. Free tool.",
  keywords: ["table of contents generator","toc generator","markdown toc","readme table of contents","generate toc"],
  openGraph: {
    title: "Table of Contents Generator for Markdown | CodeUtilo",
    description: "Generate a table of contents from Markdown headings. Create linked TOC for README files. Free tool.",
    url: "https://codeutilo.com/toc-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Table of Contents Generator for Markdown | CodeUtilo",
    description: "Generate a table of contents from Markdown headings. Create linked TOC for README files. Free tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/toc-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Table of Contents Generator"
        description="Generate a table of contents from Markdown headings. Create linked TOC for README files. Free tool."
        slug="toc-generator"
      />
      {children}
    </>
  );
}
