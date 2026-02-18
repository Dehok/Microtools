import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "ROT13 Encoder/Decoder — Caesar Cipher Online",
  description: "Encode and decode text with ROT13, ROT47, or custom Caesar cipher shift. Free online cipher tool.",
  keywords: ["rot13","rot13 encoder","rot13 decoder","caesar cipher","rot47","cipher online"],
  openGraph: {
    title: "ROT13 Encoder/Decoder — Caesar Cipher Online | CodeUtilo",
    description: "Encode and decode text with ROT13, ROT47, or custom Caesar cipher shift. Free online cipher tool.",
    url: "https://codeutilo.com/rot13",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "ROT13 Encoder/Decoder — Caesar Cipher Online | CodeUtilo",
    description: "Encode and decode text with ROT13, ROT47, or custom Caesar cipher shift. Free online cipher tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/rot13",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Rot13"
        description="Encode and decode text with ROT13, ROT47, or custom Caesar cipher shift. Free online cipher tool."
        slug="rot13"
      />
        <FAQSchema faqs={[{"question":"Is the ROT13 / Caesar Cipher free to use?","answer":"Yes, the ROT13 / Caesar Cipher is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The ROT13 / Caesar Cipher is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The ROT13 / Caesar Cipher runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
