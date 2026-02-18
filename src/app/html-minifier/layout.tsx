import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "HTML Minifier & Beautifier — Minify HTML Online",
  description: "Minify or beautify HTML code online. Remove whitespace, comments, and redundant attributes to reduce file size. Free HTML minifier tool.",
  keywords: ["html minifier","minify html","html beautifier","html compressor","html formatter"],
  openGraph: {
    title: "HTML Minifier & Beautifier — Minify HTML Online | CodeUtilo",
    description: "Minify or beautify HTML code online. Remove whitespace, comments, and redundant attributes to reduce file size. Free HTML minifier tool.",
    url: "https://codeutilo.com/html-minifier",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "HTML Minifier & Beautifier — Minify HTML Online | CodeUtilo",
    description: "Minify or beautify HTML code online. Remove whitespace, comments, and redundant attributes to reduce file size. Free HTML minifier tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/html-minifier",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Html Minifier"
        description="Minify or beautify HTML code online. Remove whitespace, comments, and redundant attributes to reduce file size. Free HTML minifier tool."
        slug="html-minifier"
      />
        <FAQSchema faqs={[{"question":"Is the HTML Minifier free to use?","answer":"Yes, the HTML Minifier is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The HTML Minifier is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The HTML Minifier runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
