import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "YAML to JSON Converter & JSON to YAML — Online Tool",
  description: "Convert between YAML and JSON formats instantly. Free online YAML to JSON and JSON to YAML converter.",
  keywords: ["yaml to json","json to yaml","yaml converter","yaml json online","convert yaml","yaml parser"],
  openGraph: {
    title: "YAML to JSON Converter & JSON to YAML — Online Tool | CodeUtilo",
    description: "Convert between YAML and JSON formats instantly. Free online YAML to JSON and JSON to YAML converter.",
    url: "https://codeutilo.com/yaml-json-converter",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "YAML to JSON Converter & JSON to YAML — Online Tool | CodeUtilo",
    description: "Convert between YAML and JSON formats instantly. Free online YAML to JSON and JSON to YAML converter.",
  },
  alternates: {
    canonical: "https://codeutilo.com/yaml-json-converter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Yaml Json Converter"
        description="Convert between YAML and JSON formats instantly. Free online YAML to JSON and JSON to YAML converter."
        slug="yaml-json-converter"
      />
        <FAQSchema faqs={[{"question":"Is the YAML ↔ JSON Converter free to use?","answer":"Yes, the YAML ↔ JSON Converter is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The YAML ↔ JSON Converter is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The YAML ↔ JSON Converter runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
