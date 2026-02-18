import type { Metadata } from "next";
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
      {children}
    </>
  );
}
