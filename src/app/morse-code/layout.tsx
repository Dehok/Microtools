import type { Metadata } from "next";
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
      {children}
    </>
  );
}
