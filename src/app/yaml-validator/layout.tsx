import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "YAML Validator Online — Check YAML Syntax",
  description: "Validate YAML syntax online. Find errors with line numbers and helpful messages. Supports YAML 1.1 and 1.2. Free YAML validator.",
  keywords: ["yaml validator","yaml checker","validate yaml","yaml syntax checker","yaml lint"],
  openGraph: {
    title: "YAML Validator Online — Check YAML Syntax | CodeUtilo",
    description: "Validate YAML syntax online. Find errors with line numbers and helpful messages. Supports YAML 1.1 and 1.2. Free YAML validator.",
    url: "https://codeutilo.com/yaml-validator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "YAML Validator Online — Check YAML Syntax | CodeUtilo",
    description: "Validate YAML syntax online. Find errors with line numbers and helpful messages. Supports YAML 1.1 and 1.2. Free YAML validator.",
  },
  alternates: {
    canonical: "https://codeutilo.com/yaml-validator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Yaml Validator"
        description="Validate YAML syntax online. Find errors with line numbers and helpful messages. Supports YAML 1.1 and 1.2. Free YAML validator."
        slug="yaml-validator"
      />
        <FAQSchema faqs={[{"question":"Is the YAML Validator free to use?","answer":"Yes, the YAML Validator is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The YAML Validator is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The YAML Validator runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
