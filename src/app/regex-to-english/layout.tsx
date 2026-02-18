import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Regex to English — Explain Regular Expressions",
  description: "Translate regular expressions to plain English explanations. Understand any regex pattern instantly. Free regex explainer tool.",
  keywords: ["regex to english","regex explain","regex translator","understand regex","regex explainer","regex to text"],
  openGraph: {
    title: "Regex to English — Explain Regular Expressions | CodeUtilo",
    description: "Translate regular expressions to plain English explanations. Understand any regex pattern instantly. Free regex explainer tool.",
    url: "https://codeutilo.com/regex-to-english",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Regex to English — Explain Regular Expressions | CodeUtilo",
    description: "Translate regular expressions to plain English explanations. Understand any regex pattern instantly. Free regex explainer tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/regex-to-english",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Regex To English"
        description="Translate regular expressions to plain English explanations. Understand any regex pattern instantly. Free regex explainer tool."
        slug="regex-to-english"
      />
        <FAQSchema faqs={[{"question":"Is the Regex to English free to use?","answer":"Yes, the Regex to English is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The Regex to English is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The Regex to English runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
