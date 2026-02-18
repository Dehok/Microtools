import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Text Repeater — Repeat Text Online Free",
  description: "Repeat any text multiple times with custom separators. Copy the result instantly. Free online text repeater tool.",
  keywords: ["text repeater","repeat text online","text multiplier","repeat string","text generator"],
  openGraph: {
    title: "Text Repeater — Repeat Text Online Free | CodeUtilo",
    description: "Repeat any text multiple times with custom separators. Copy the result instantly. Free online text repeater tool.",
    url: "https://codeutilo.com/text-repeater",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Text Repeater — Repeat Text Online Free | CodeUtilo",
    description: "Repeat any text multiple times with custom separators. Copy the result instantly. Free online text repeater tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/text-repeater",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Text Repeater"
        description="Repeat any text multiple times with custom separators. Copy the result instantly. Free online text repeater tool."
        slug="text-repeater"
      />
        <FAQSchema faqs={[{"question":"Is the Text Repeater free to use?","answer":"Yes, the Text Repeater is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The Text Repeater is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The Text Repeater runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
