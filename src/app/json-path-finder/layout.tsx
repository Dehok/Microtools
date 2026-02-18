import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "JSON Path Finder — Extract All Paths from JSON",
  description: "Extract all paths from a JSON object. Filter and copy JSONPath expressions. Free online tool for developers.",
  keywords: ["json path finder","jsonpath extractor","json path online","json key finder","json navigator","json path tool"],
  openGraph: {
    title: "JSON Path Finder — Extract All Paths from JSON | CodeUtilo",
    description: "Extract all paths from a JSON object. Filter and copy JSONPath expressions. Free online tool for developers.",
    url: "https://codeutilo.com/json-path-finder",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "JSON Path Finder — Extract All Paths from JSON | CodeUtilo",
    description: "Extract all paths from a JSON object. Filter and copy JSONPath expressions. Free online tool for developers.",
  },
  alternates: {
    canonical: "https://codeutilo.com/json-path-finder",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Json Path Finder"
        description="Extract all paths from a JSON object. Filter and copy JSONPath expressions. Free online tool for developers."
        slug="json-path-finder"
      />
        <FAQSchema faqs={[{"question":"Is the JSON Path Finder free to use?","answer":"Yes, the JSON Path Finder is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The JSON Path Finder is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The JSON Path Finder runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
