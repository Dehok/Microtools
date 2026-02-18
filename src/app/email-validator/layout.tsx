import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Email Validator — Check Email Address Format",
  description: "Validate email address format and syntax. Detect common typos and mistakes. Bulk validation supported. Free email validator tool.",
  keywords: ["email validator","validate email","email checker","email syntax checker","email format validator"],
  openGraph: {
    title: "Email Validator — Check Email Address Format | CodeUtilo",
    description: "Validate email address format and syntax. Detect common typos and mistakes. Bulk validation supported. Free email validator tool.",
    url: "https://codeutilo.com/email-validator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Email Validator — Check Email Address Format | CodeUtilo",
    description: "Validate email address format and syntax. Detect common typos and mistakes. Bulk validation supported. Free email validator tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/email-validator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Email Validator"
        description="Validate email address format and syntax. Detect common typos and mistakes. Bulk validation supported. Free email validator tool."
        slug="email-validator"
      />
        <FAQSchema faqs={[{"question":"Is the Email Validator free to use?","answer":"Yes, the Email Validator is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The Email Validator is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The Email Validator runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
