import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "HTML to Markdown Converter — Convert HTML to MD Online",
  description: "Convert HTML to Markdown format. Handles headings, lists, links, bold, italic, code blocks, and more. Free online tool.",
  keywords: ["html to markdown","convert html to md","html markdown converter","html to md online"],
  openGraph: {
    title: "HTML to Markdown Converter — Convert HTML to MD Online | CodeUtilo",
    description: "Convert HTML to Markdown format. Handles headings, lists, links, bold, italic, code blocks, and more. Free online tool.",
    url: "https://codeutilo.com/html-to-markdown",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "HTML to Markdown Converter — Convert HTML to MD Online | CodeUtilo",
    description: "Convert HTML to Markdown format. Handles headings, lists, links, bold, italic, code blocks, and more. Free online tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/html-to-markdown",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Html To Markdown"
        description="Convert HTML to Markdown format. Handles headings, lists, links, bold, italic, code blocks, and more. Free online tool."
        slug="html-to-markdown"
      />
        <FAQSchema faqs={[{"question":"Is the HTML to Markdown free to use?","answer":"Yes, the HTML to Markdown is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The HTML to Markdown is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The HTML to Markdown runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
