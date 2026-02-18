import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "HTTP Status Codes Reference — Complete List with Descriptions",
  description: "Complete reference of all HTTP status codes (1xx-5xx). Search and filter status codes with descriptions and usage examples.",
  keywords: ["http status codes","http codes","status code list","http 404","http response codes"],
  openGraph: {
    title: "HTTP Status Codes Reference — Complete List with Descriptions | CodeUtilo",
    description: "Complete reference of all HTTP status codes (1xx-5xx). Search and filter status codes with descriptions and usage examples.",
    url: "https://codeutilo.com/http-status-codes",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "HTTP Status Codes Reference — Complete List with Descriptions | CodeUtilo",
    description: "Complete reference of all HTTP status codes (1xx-5xx). Search and filter status codes with descriptions and usage examples.",
  },
  alternates: {
    canonical: "https://codeutilo.com/http-status-codes",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Http Status Codes"
        description="Complete reference of all HTTP status codes (1xx-5xx). Search and filter status codes with descriptions and usage examples."
        slug="http-status-codes"
      />
        <FAQSchema faqs={[{"question":"Is the HTTP Status Codes free to use?","answer":"Yes, the HTTP Status Codes is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The HTTP Status Codes is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The HTTP Status Codes runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
