import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "URL Encoder & Decoder Online",
  description: "Encode or decode URLs and query strings. Handles special characters. Free online URL encoding tool.",
  keywords: ["url encoder","url decoder","url encode online","percent encoding","encode url"],
  openGraph: {
    title: "URL Encoder & Decoder Online | CodeUtilo",
    description: "Encode or decode URLs and query strings. Handles special characters. Free online URL encoding tool.",
    url: "https://codeutilo.com/url-encoder-decoder",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "URL Encoder & Decoder Online | CodeUtilo",
    description: "Encode or decode URLs and query strings. Handles special characters. Free online URL encoding tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/url-encoder-decoder",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="URL Encoder / Decoder"
        description="Encode or decode URLs and query strings. Handles special characters. Free online URL encoding tool."
        slug="url-encoder-decoder"
      />
      {children}
    </>
  );
}
