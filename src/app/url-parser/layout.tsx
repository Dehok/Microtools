import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "URL Parser — Break Down URLs Into Components",
  description: "Parse URLs into protocol, hostname, port, path, query parameters, and hash. Free online URL parser.",
  keywords: ["url parser","parse url online","url components","query string parser","url breakdown"],
  openGraph: {
    title: "URL Parser — Break Down URLs Into Components | CodeUtilo",
    description: "Parse URLs into protocol, hostname, port, path, query parameters, and hash. Free online URL parser.",
    url: "https://codeutilo.com/url-parser",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "URL Parser — Break Down URLs Into Components | CodeUtilo",
    description: "Parse URLs into protocol, hostname, port, path, query parameters, and hash. Free online URL parser.",
  },
  alternates: {
    canonical: "https://codeutilo.com/url-parser",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Url Parser"
        description="Parse URLs into protocol, hostname, port, path, query parameters, and hash. Free online URL parser."
        slug="url-parser"
      />
        <FAQSchema faqs={[{"question":"Is the URL Parser free to use?","answer":"Yes, the URL Parser is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The URL Parser is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The URL Parser runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
