import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Base64 Encode & Decode Online",
  description: "Encode text to Base64 or decode Base64 to plain text instantly. Supports UTF-8 characters. Free online tool.",
  keywords: ["base64 encode","base64 decode","base64 converter","base64 online","encode to base64"],
  openGraph: {
    title: "Base64 Encode & Decode Online | CodeUtilo",
    description: "Encode text to Base64 or decode Base64 to plain text instantly. Supports UTF-8 characters. Free online tool.",
    url: "https://codeutilo.com/base64-encode-decode",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Base64 Encode & Decode Online | CodeUtilo",
    description: "Encode text to Base64 or decode Base64 to plain text instantly. Supports UTF-8 characters. Free online tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/base64-encode-decode",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Base64 Encode / Decode"
        description="Encode text to Base64 or decode Base64 to plain text instantly. Supports UTF-8 characters. Free online tool."
        slug="base64-encode-decode"
      />
      {children}
    </>
  );
}
