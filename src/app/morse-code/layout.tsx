import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Morse Code Translator — Text to Morse & Back",
  description: "Translate text to Morse code and Morse code back to text. Free online Morse code translator.",
  keywords: ["morse code translator","text to morse","morse to text","morse code converter","morse code online"],
  openGraph: {
    title: "Morse Code Translator — Text to Morse & Back | CodeUtilo",
    description: "Translate text to Morse code and Morse code back to text. Free online Morse code translator.",
    url: "https://codeutilo.com/morse-code",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Morse Code Translator — Text to Morse & Back | CodeUtilo",
    description: "Translate text to Morse code and Morse code back to text. Free online Morse code translator.",
  },
  alternates: {
    canonical: "https://codeutilo.com/morse-code",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Morse Code Translator"
        description="Translate text to Morse code and Morse code back to text. Free online Morse code translator."
        slug="morse-code"
      />
      {children}
    </>
  );
}
