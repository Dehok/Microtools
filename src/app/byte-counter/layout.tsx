import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Byte Counter — UTF-8 & UTF-16 Size Calculator",
  description: "Count bytes, characters, and code points. Shows UTF-8 and UTF-16 sizes. Free online byte counter.",
  keywords: ["byte counter","string byte count","utf8 size","character byte size","text byte counter"],
  openGraph: {
    title: "Byte Counter — UTF-8 & UTF-16 Size Calculator | CodeUtilo",
    description: "Count bytes, characters, and code points. Shows UTF-8 and UTF-16 sizes. Free online byte counter.",
    url: "https://codeutilo.com/byte-counter",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Byte Counter — UTF-8 & UTF-16 Size Calculator | CodeUtilo",
    description: "Count bytes, characters, and code points. Shows UTF-8 and UTF-16 sizes. Free online byte counter.",
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
        description="Count bytes, characters, and code points. Shows UTF-8 and UTF-16 sizes. Free online byte counter."
        slug="byte-counter"
      />
      {children}
    </>
  );
}
