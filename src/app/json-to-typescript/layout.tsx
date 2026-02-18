import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "JSON to TypeScript — Generate Interfaces from JSON",
  description: "Convert JSON data to TypeScript interfaces automatically. Supports nested objects and arrays. Free online tool.",
  keywords: ["json to typescript","json to interface","typescript interface generator","json to ts","typescript types from json"],
  openGraph: {
    title: "JSON to TypeScript — Generate Interfaces from JSON | CodeUtilo",
    description: "Convert JSON data to TypeScript interfaces automatically. Supports nested objects and arrays. Free online tool.",
    url: "https://codeutilo.com/json-to-typescript",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "JSON to TypeScript — Generate Interfaces from JSON | CodeUtilo",
    description: "Convert JSON data to TypeScript interfaces automatically. Supports nested objects and arrays. Free online tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/json-to-typescript",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Json To Typescript"
        description="Convert JSON data to TypeScript interfaces automatically. Supports nested objects and arrays. Free online tool."
        slug="json-to-typescript"
      />
        <FAQSchema faqs={[{"question":"Is the JSON to TypeScript free to use?","answer":"Yes, the JSON to TypeScript is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The JSON to TypeScript is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The JSON to TypeScript runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
