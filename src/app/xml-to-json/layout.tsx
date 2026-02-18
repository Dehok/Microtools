import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "XML to JSON Converter — Convert XML Online",
  description: "Convert XML data to JSON format online. Handles nested elements, attributes, and arrays. Free XML to JSON converter tool.",
  keywords: ["xml to json","xml to json converter","convert xml to json","xml parser","xml json online"],
  openGraph: {
    title: "XML to JSON Converter — Convert XML Online | CodeUtilo",
    description: "Convert XML data to JSON format online. Handles nested elements, attributes, and arrays. Free XML to JSON converter tool.",
    url: "https://codeutilo.com/xml-to-json",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "XML to JSON Converter — Convert XML Online | CodeUtilo",
    description: "Convert XML data to JSON format online. Handles nested elements, attributes, and arrays. Free XML to JSON converter tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/xml-to-json",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Xml To Json"
        description="Convert XML data to JSON format online. Handles nested elements, attributes, and arrays. Free XML to JSON converter tool."
        slug="xml-to-json"
      />
        <FAQSchema faqs={[{"question":"Is the XML to JSON Converter free to use?","answer":"Yes, the XML to JSON Converter is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The XML to JSON Converter is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The XML to JSON Converter runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
