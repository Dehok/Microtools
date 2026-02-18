import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "XML Formatter Online — Beautify & Validate XML",
  description: "Format, beautify, and validate XML data online. Minify or pretty-print XML with custom indentation. Free XML formatter tool.",
  keywords: ["xml formatter","xml beautifier","xml validator","format xml","xml pretty print"],
  openGraph: {
    title: "XML Formatter Online — Beautify & Validate XML | CodeUtilo",
    description: "Format, beautify, and validate XML data online. Minify or pretty-print XML with custom indentation. Free XML formatter tool.",
    url: "https://codeutilo.com/xml-formatter",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "XML Formatter Online — Beautify & Validate XML | CodeUtilo",
    description: "Format, beautify, and validate XML data online. Minify or pretty-print XML with custom indentation. Free XML formatter tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/xml-formatter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Xml Formatter"
        description="Format, beautify, and validate XML data online. Minify or pretty-print XML with custom indentation. Free XML formatter tool."
        slug="xml-formatter"
      />
        <FAQSchema faqs={[{"question":"Is the XML Formatter free to use?","answer":"Yes, the XML Formatter is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The XML Formatter is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The XML Formatter runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
