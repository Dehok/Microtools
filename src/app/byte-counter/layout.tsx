import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Byte Counter — String Size Calculator Online",
  description: "Count bytes, characters, and code points in any text. Shows UTF-8, UTF-16, and ASCII sizes. Free online byte counter.",
  keywords: ["byte counter","string size calculator","utf-8 byte count","character byte size","string length bytes"],
  openGraph: {
    title: "Byte Counter — String Size Calculator Online | CodeUtilo",
    description: "Count bytes, characters, and code points in any text. Shows UTF-8, UTF-16, and ASCII sizes. Free online byte counter.",
    url: "https://codeutilo.com/byte-counter",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Byte Counter — String Size Calculator Online | CodeUtilo",
    description: "Count bytes, characters, and code points in any text. Shows UTF-8, UTF-16, and ASCII sizes. Free online byte counter.",
  },
  alternates: {
    canonical: "https://codeutilo.com/byte-counter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Byte Counter"
        description="Count bytes, characters, and code points in any text. Shows UTF-8, UTF-16, and ASCII sizes. Free online byte counter."
        slug="byte-counter"
      />
        <FAQSchema faqs={[{"question":"Is the Byte Counter free to use?","answer":"Yes, the Byte Counter is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The Byte Counter is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The Byte Counter runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
