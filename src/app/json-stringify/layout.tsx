import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "JSON Stringify / Parse — Escape & Unescape JSON Online",
  description: "Convert between formatted and stringified JSON. Escape and unescape JSON strings. Free online tool.",
  keywords: ["json stringify","json parse","json escape","json unescape","stringify json online"],
  openGraph: {
    title: "JSON Stringify / Parse — Escape & Unescape JSON Online | CodeUtilo",
    description: "Convert between formatted and stringified JSON. Escape and unescape JSON strings. Free online tool.",
    url: "https://codeutilo.com/json-stringify",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "JSON Stringify / Parse — Escape & Unescape JSON Online | CodeUtilo",
    description: "Convert between formatted and stringified JSON. Escape and unescape JSON strings. Free online tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/json-stringify",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Json Stringify"
        description="Convert between formatted and stringified JSON. Escape and unescape JSON strings. Free online tool."
        slug="json-stringify"
      />
        <FAQSchema faqs={[{"question":"Is the JSON Stringify / Parse free to use?","answer":"Yes, the JSON Stringify / Parse is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The JSON Stringify / Parse is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The JSON Stringify / Parse runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
