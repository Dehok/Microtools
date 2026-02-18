import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Table of Contents Generator — Markdown TOC Maker",
  description: "Generate a table of contents from Markdown headings. Create linked TOC for README files, docs, and articles. Free online tool.",
  keywords: ["table of contents generator","toc generator","markdown toc","readme toc","generate table of contents"],
  openGraph: {
    title: "Table of Contents Generator — Markdown TOC Maker | CodeUtilo",
    description: "Generate a table of contents from Markdown headings. Create linked TOC for README files, docs, and articles. Free online tool.",
    url: "https://codeutilo.com/toc-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Table of Contents Generator — Markdown TOC Maker | CodeUtilo",
    description: "Generate a table of contents from Markdown headings. Create linked TOC for README files, docs, and articles. Free online tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/toc-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Toc Generator"
        description="Generate a table of contents from Markdown headings. Create linked TOC for README files, docs, and articles. Free online tool."
        slug="toc-generator"
      />
      {children}
    </>
  );
}
