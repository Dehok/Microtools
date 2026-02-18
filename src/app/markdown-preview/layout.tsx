import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Markdown Preview & Editor Online — Free Markdown Tool",
  description: "Write Markdown and see the rendered preview in real time. Supports headings, bold, italic, code blocks, lists, links, and more.",
  keywords: ["markdown preview","markdown editor","markdown online","markdown to html"],
  openGraph: {
    title: "Markdown Preview & Editor Online — Free Markdown Tool | CodeUtilo",
    description: "Write Markdown and see the rendered preview in real time. Supports headings, bold, italic, code blocks, lists, links, and more.",
    url: "https://codeutilo.com/markdown-preview",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Markdown Preview & Editor Online — Free Markdown Tool | CodeUtilo",
    description: "Write Markdown and see the rendered preview in real time. Supports headings, bold, italic, code blocks, lists, links, and more.",
  },
  alternates: {
    canonical: "https://codeutilo.com/markdown-preview",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Markdown Preview"
        description="Write Markdown and see the rendered preview in real time. Supports headings, bold, italic, code blocks, lists, links, and more."
        slug="markdown-preview"
      />
      {children}
    </>
  );
}
