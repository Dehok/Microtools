import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: ".env Editor & Validator — Edit Environment Files Online",
  description: "Edit and validate .env files online. Check for duplicate keys, empty values, syntax errors, and formatting issues. Free .env editor tool.",
  keywords: ["env editor","env file validator","dotenv editor","environment variables editor","env file checker"],
  openGraph: {
    title: ".env Editor & Validator — Edit Environment Files Online | CodeUtilo",
    description: "Edit and validate .env files online. Check for duplicate keys, empty values, syntax errors, and formatting issues. Free .env editor tool.",
    url: "https://codeutilo.com/env-editor",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: ".env Editor & Validator — Edit Environment Files Online | CodeUtilo",
    description: "Edit and validate .env files online. Check for duplicate keys, empty values, syntax errors, and formatting issues. Free .env editor tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/env-editor",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Env Editor"
        description="Edit and validate .env files online. Check for duplicate keys, empty values, syntax errors, and formatting issues. Free .env editor tool."
        slug="env-editor"
      />
        <FAQSchema faqs={[{"question":"Is the .env Editor & Validator free to use?","answer":"Yes, the .env Editor & Validator is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The .env Editor & Validator is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The .env Editor & Validator runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
