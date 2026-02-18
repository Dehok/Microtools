import type { Metadata } from "next";
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
      {children}
    </>
  );
}
