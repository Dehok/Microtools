import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "TOML to JSON Converter — Convert TOML ↔ JSON Online",
  description: "Convert between TOML and JSON formats instantly. Validate TOML syntax and see parsed output. Free online TOML to JSON converter.",
  keywords: ["toml to json","json to toml","toml converter","toml validator","toml parser online"],
  openGraph: {
    title: "TOML to JSON Converter — Convert TOML ↔ JSON Online | CodeUtilo",
    description: "Convert between TOML and JSON formats instantly. Validate TOML syntax and see parsed output. Free online TOML to JSON converter.",
    url: "https://codeutilo.com/toml-to-json",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "TOML to JSON Converter — Convert TOML ↔ JSON Online | CodeUtilo",
    description: "Convert between TOML and JSON formats instantly. Validate TOML syntax and see parsed output. Free online TOML to JSON converter.",
  },
  alternates: {
    canonical: "https://codeutilo.com/toml-to-json",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Toml To Json"
        description="Convert between TOML and JSON formats instantly. Validate TOML syntax and see parsed output. Free online TOML to JSON converter."
        slug="toml-to-json"
      />
        <FAQSchema faqs={[{"question":"Is the TOML ↔ JSON Converter free to use?","answer":"Yes, the TOML ↔ JSON Converter is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The TOML ↔ JSON Converter is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The TOML ↔ JSON Converter runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
