import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "HMAC Generator — Generate HMAC Signatures Online",
  description: "Generate HMAC signatures using SHA-256, SHA-512, SHA-1, and MD5. Enter a message and secret key. Free online HMAC generator.",
  keywords: ["hmac generator","hmac sha256","hmac signature","generate hmac","hmac online","hmac calculator"],
  openGraph: {
    title: "HMAC Generator — Generate HMAC Signatures Online | CodeUtilo",
    description: "Generate HMAC signatures using SHA-256, SHA-512, SHA-1, and MD5. Enter a message and secret key. Free online HMAC generator.",
    url: "https://codeutilo.com/hmac-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "HMAC Generator — Generate HMAC Signatures Online | CodeUtilo",
    description: "Generate HMAC signatures using SHA-256, SHA-512, SHA-1, and MD5. Enter a message and secret key. Free online HMAC generator.",
  },
  alternates: {
    canonical: "https://codeutilo.com/hmac-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Hmac Generator"
        description="Generate HMAC signatures using SHA-256, SHA-512, SHA-1, and MD5. Enter a message and secret key. Free online HMAC generator."
        slug="hmac-generator"
      />
        <FAQSchema faqs={[{"question":"Is the HMAC Generator free to use?","answer":"Yes, the HMAC Generator is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The HMAC Generator is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The HMAC Generator runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
