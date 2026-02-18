import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "JSON to Go Struct — Generate Go Types from JSON",
  description: "Convert JSON data to Go struct definitions. Handles nested objects, arrays, and null values. Free JSON to Go converter.",
  keywords: ["json to go","json to go struct","go struct generator","json to golang","convert json to go"],
  openGraph: {
    title: "JSON to Go Struct — Generate Go Types from JSON | CodeUtilo",
    description: "Convert JSON data to Go struct definitions. Handles nested objects, arrays, and null values. Free JSON to Go converter.",
    url: "https://codeutilo.com/json-to-go",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "JSON to Go Struct — Generate Go Types from JSON | CodeUtilo",
    description: "Convert JSON data to Go struct definitions. Handles nested objects, arrays, and null values. Free JSON to Go converter.",
  },
  alternates: {
    canonical: "https://codeutilo.com/json-to-go",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Json To Go"
        description="Convert JSON data to Go struct definitions. Handles nested objects, arrays, and null values. Free JSON to Go converter."
        slug="json-to-go"
      />
        <FAQSchema faqs={[{"question":"Is the JSON to Go Struct free to use?","answer":"Yes, the JSON to Go Struct is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The JSON to Go Struct is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The JSON to Go Struct runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
