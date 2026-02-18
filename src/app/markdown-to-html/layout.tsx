import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Markdown to HTML Converter — Convert MD to HTML Online",
  description: "Convert Markdown to clean, semantic HTML. Supports headings, bold, italic, links, images, code blocks, lists, blockquotes, and more. Free online tool.",
  keywords: ["markdown to html","convert markdown to html","md to html converter","markdown html online","markdown converter"],
  openGraph: {
    title: "Markdown to HTML Converter — Convert MD to HTML Online | CodeUtilo",
    description: "Convert Markdown to clean, semantic HTML. Supports headings, bold, italic, links, images, code blocks, lists, blockquotes, and more. Free online tool.",
    url: "https://codeutilo.com/markdown-to-html",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Markdown to HTML Converter — Convert MD to HTML Online | CodeUtilo",
    description: "Convert Markdown to clean, semantic HTML. Supports headings, bold, italic, links, images, code blocks, lists, blockquotes, and more. Free online tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/markdown-to-html",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Markdown To Html"
        description="Convert Markdown to clean, semantic HTML. Supports headings, bold, italic, links, images, code blocks, lists, blockquotes, and more. Free online tool."
        slug="markdown-to-html"
      />
        <FAQSchema faqs={[{"question":"Is the Markdown to HTML free to use?","answer":"Yes, the Markdown to HTML is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The Markdown to HTML is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The Markdown to HTML runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
