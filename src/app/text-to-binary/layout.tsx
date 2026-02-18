import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Text to Binary Converter — Binary, Hex, Octal, Decimal",
  description: "Convert text to binary, hexadecimal, octal, or decimal. Decode binary back to text. Free online converter.",
  keywords: ["text to binary","binary converter","text to hex","binary to text","ascii to binary"],
  openGraph: {
    title: "Text to Binary Converter — Binary, Hex, Octal, Decimal | CodeUtilo",
    description: "Convert text to binary, hexadecimal, octal, or decimal. Decode binary back to text. Free online converter.",
    url: "https://codeutilo.com/text-to-binary",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Text to Binary Converter — Binary, Hex, Octal, Decimal | CodeUtilo",
    description: "Convert text to binary, hexadecimal, octal, or decimal. Decode binary back to text. Free online converter.",
  },
  alternates: {
    canonical: "https://codeutilo.com/text-to-binary",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Text To Binary"
        description="Convert text to binary, hexadecimal, octal, or decimal. Decode binary back to text. Free online converter."
        slug="text-to-binary"
      />
        <FAQSchema faqs={[{"question":"Is the Text to Binary free to use?","answer":"Yes, the Text to Binary is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The Text to Binary is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The Text to Binary runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
