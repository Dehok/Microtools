import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Morse Code Translator — Text to Morse & Morse to Text",
  description: "Translate text to Morse code and Morse code back to text. Full reference chart included. Free online tool.",
  keywords: ["morse code translator","text to morse","morse to text","morse code converter","morse code online"],
  openGraph: {
    title: "Morse Code Translator — Text to Morse & Morse to Text | CodeUtilo",
    description: "Translate text to Morse code and Morse code back to text. Full reference chart included. Free online tool.",
    url: "https://codeutilo.com/morse-code",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Morse Code Translator — Text to Morse & Morse to Text | CodeUtilo",
    description: "Translate text to Morse code and Morse code back to text. Full reference chart included. Free online tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/morse-code",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Morse Code"
        description="Translate text to Morse code and Morse code back to text. Full reference chart included. Free online tool."
        slug="morse-code"
      />
        <FAQSchema faqs={[{"question":"Is the Morse Code Translator free to use?","answer":"Yes, the Morse Code Translator is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The Morse Code Translator is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The Morse Code Translator runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
