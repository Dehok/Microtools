import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "JSON Diff — Compare JSON Objects Online",
  description: "Compare two JSON objects and highlight differences. Find added, removed, and modified keys. Free online JSON diff tool.",
  keywords: ["json diff","json compare","compare json","json difference","json diff tool"],
  openGraph: {
    title: "JSON Diff — Compare JSON Objects Online | CodeUtilo",
    description: "Compare two JSON objects and highlight differences. Find added, removed, and modified keys. Free online JSON diff tool.",
    url: "https://codeutilo.com/json-diff",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "JSON Diff — Compare JSON Objects Online | CodeUtilo",
    description: "Compare two JSON objects and highlight differences. Find added, removed, and modified keys. Free online JSON diff tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/json-diff",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Json Diff"
        description="Compare two JSON objects and highlight differences. Find added, removed, and modified keys. Free online JSON diff tool."
        slug="json-diff"
      />
        <FAQSchema faqs={[{"question":"Is the JSON Diff free to use?","answer":"Yes, the JSON Diff is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The JSON Diff is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The JSON Diff runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
