import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "ROT13 Encoder & Caesar Cipher Tool Online",
  description: "Encode/decode text with ROT13, ROT47, or custom Caesar cipher shift. Free online tool.",
  keywords: ["rot13","caesar cipher","rot13 encoder","rot13 decoder","caesar cipher online"],
  openGraph: {
    title: "ROT13 Encoder & Caesar Cipher Tool Online | CodeUtilo",
    description: "Encode/decode text with ROT13, ROT47, or custom Caesar cipher shift. Free online tool.",
    url: "https://codeutilo.com/rot13",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "ROT13 Encoder & Caesar Cipher Tool Online | CodeUtilo",
    description: "Encode/decode text with ROT13, ROT47, or custom Caesar cipher shift. Free online tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/rot13",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="ROT13 / Caesar Cipher"
        description="Encode/decode text with ROT13, ROT47, or custom Caesar cipher shift. Free online tool."
        slug="rot13"
      />
      {children}
    </>
  );
}
