import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Base64 Encode & Decode Online — Free Base64 Converter",
  description: "Encode text to Base64 or decode Base64 to plain text instantly. Supports UTF-8 characters. Free online tool, no signup required.",
  keywords: ["base64 encode","base64 decode","base64 converter","base64 online"],
  openGraph: {
    title: "Base64 Encode & Decode Online — Free Base64 Converter | CodeUtilo",
    description: "Encode text to Base64 or decode Base64 to plain text instantly. Supports UTF-8 characters. Free online tool, no signup required.",
    url: "https://codeutilo.com/base64-encode-decode",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Base64 Encode & Decode Online — Free Base64 Converter | CodeUtilo",
    description: "Encode text to Base64 or decode Base64 to plain text instantly. Supports UTF-8 characters. Free online tool, no signup required.",
  },
  alternates: {
    canonical: "https://codeutilo.com/base64-encode-decode",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Base64 Encode Decode"
        description="Encode text to Base64 or decode Base64 to plain text instantly. Supports UTF-8 characters. Free online tool, no signup required."
        slug="base64-encode-decode"
      />
      {children}
    </>
  );
}
