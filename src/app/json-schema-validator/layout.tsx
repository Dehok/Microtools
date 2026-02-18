import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "JSON Schema Validator Online — Validate JSON Against Schema",
  description: "Validate JSON data against a JSON Schema. Check types, required fields, patterns, and constraints. Free online JSON schema validator.",
  keywords: ["json schema validator","json validation","json schema","validate json","json schema online"],
  openGraph: {
    title: "JSON Schema Validator Online — Validate JSON Against Schema | CodeUtilo",
    description: "Validate JSON data against a JSON Schema. Check types, required fields, patterns, and constraints. Free online JSON schema validator.",
    url: "https://codeutilo.com/json-schema-validator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "JSON Schema Validator Online — Validate JSON Against Schema | CodeUtilo",
    description: "Validate JSON data against a JSON Schema. Check types, required fields, patterns, and constraints. Free online JSON schema validator.",
  },
  alternates: {
    canonical: "https://codeutilo.com/json-schema-validator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Json Schema Validator"
        description="Validate JSON data against a JSON Schema. Check types, required fields, patterns, and constraints. Free online JSON schema validator."
        slug="json-schema-validator"
      />
        <FAQSchema faqs={[{"question":"Is the JSON Schema Validator free to use?","answer":"Yes, the JSON Schema Validator is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The JSON Schema Validator is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The JSON Schema Validator runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
