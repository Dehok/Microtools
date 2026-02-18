import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
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
        <FAQSchema faqs={[{"question":"What is Markdown?","answer":"Markdown is a lightweight markup language created by John Gruber in 2004. It uses simple syntax like # for headings, ** for bold, and - for lists to format text. It's widely used for README files, documentation, and content writing."},{"question":"What Markdown syntax is supported?","answer":"This tool supports standard Markdown including headings (#), bold (**), italic (*), links, images, ordered and unordered lists, blockquotes, code blocks, horizontal rules, and tables (GitHub Flavored Markdown)."},{"question":"Can I export the HTML output?","answer":"Yes. The tool generates clean HTML from your Markdown. You can copy the rendered HTML and use it in your web pages, emails, or documentation."},{"question":"What is GitHub Flavored Markdown (GFM)?","answer":"GFM is GitHub's extended version of Markdown that adds support for tables, task lists, strikethrough text, autolinked URLs, and syntax-highlighted code blocks."}]} />
      {children}
    </>
  );
}
