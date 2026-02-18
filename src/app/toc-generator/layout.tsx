import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
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
        <FAQSchema faqs={[{"question":"Is the Table of Contents Generator free to use?","answer":"Yes, the Table of Contents Generator is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The Table of Contents Generator is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The Table of Contents Generator runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
