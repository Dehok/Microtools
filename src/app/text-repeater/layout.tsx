import type { Metadata } from "next";
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
      {children}
    </>
  );
}
