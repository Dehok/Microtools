import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "JSON to CSV Converter Online — Free JSON/CSV Tool",
  description: "Convert JSON arrays to CSV format and CSV back to JSON instantly. Free online converter with copy and download.",
  keywords: ["json to csv","csv to json","json csv converter","convert json to csv online"],
  openGraph: {
    title: "JSON to CSV Converter Online — Free JSON/CSV Tool | CodeUtilo",
    description: "Convert JSON arrays to CSV format and CSV back to JSON instantly. Free online converter with copy and download.",
    url: "https://codeutilo.com/json-csv-converter",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "JSON to CSV Converter Online — Free JSON/CSV Tool | CodeUtilo",
    description: "Convert JSON arrays to CSV format and CSV back to JSON instantly. Free online converter with copy and download.",
  },
  alternates: {
    canonical: "https://codeutilo.com/json-csv-converter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Json Csv Converter"
        description="Convert JSON arrays to CSV format and CSV back to JSON instantly. Free online converter with copy and download."
        slug="json-csv-converter"
      />
        <FAQSchema faqs={[{"question":"Is the JSON to CSV Converter free to use?","answer":"Yes, the JSON to CSV Converter is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The JSON to CSV Converter is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The JSON to CSV Converter runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
