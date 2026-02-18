import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Number Base Converter — Decimal, Binary, Hex, Octal",
  description: "Convert numbers between decimal, binary, octal, and hexadecimal instantly. Free online number base converter.",
  keywords: ["number base converter","binary converter","hex converter","decimal to binary","octal converter"],
  openGraph: {
    title: "Number Base Converter — Decimal, Binary, Hex, Octal | CodeUtilo",
    description: "Convert numbers between decimal, binary, octal, and hexadecimal instantly. Free online number base converter.",
    url: "https://codeutilo.com/number-base-converter",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Number Base Converter — Decimal, Binary, Hex, Octal | CodeUtilo",
    description: "Convert numbers between decimal, binary, octal, and hexadecimal instantly. Free online number base converter.",
  },
  alternates: {
    canonical: "https://codeutilo.com/number-base-converter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Number Base Converter"
        description="Convert numbers between decimal, binary, octal, and hexadecimal instantly. Free online number base converter."
        slug="number-base-converter"
      />
        <FAQSchema faqs={[{"question":"Is the Number Base Converter free to use?","answer":"Yes, the Number Base Converter is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The Number Base Converter is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The Number Base Converter runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
