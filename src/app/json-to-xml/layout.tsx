import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "JSON to XML Converter Online — Convert JSON to XML",
  description: "Convert JSON data to XML format instantly. Handles nested objects, arrays, and attributes. Free online JSON to XML converter.",
  keywords: ["json to xml","json to xml converter","convert json xml","json xml online","json to xml tool"],
  openGraph: {
    title: "JSON to XML Converter Online — Convert JSON to XML | CodeUtilo",
    description: "Convert JSON data to XML format instantly. Handles nested objects, arrays, and attributes. Free online JSON to XML converter.",
    url: "https://codeutilo.com/json-to-xml",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "JSON to XML Converter Online — Convert JSON to XML | CodeUtilo",
    description: "Convert JSON data to XML format instantly. Handles nested objects, arrays, and attributes. Free online JSON to XML converter.",
  },
  alternates: {
    canonical: "https://codeutilo.com/json-to-xml",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Json To Xml"
        description="Convert JSON data to XML format instantly. Handles nested objects, arrays, and attributes. Free online JSON to XML converter."
        slug="json-to-xml"
      />
        <FAQSchema faqs={[{"question":"Is the JSON to XML Converter free to use?","answer":"Yes, the JSON to XML Converter is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The JSON to XML Converter is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The JSON to XML Converter runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
