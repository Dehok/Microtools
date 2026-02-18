import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "URL Encoder & Decoder Online — Free Percent Encoding Tool",
  description: "Encode or decode URLs and query string parameters instantly. Handles special characters, spaces, and unicode. Free online tool.",
  keywords: ["url encoder","url decoder","percent encoding","url encode online","urlencode"],
  openGraph: {
    title: "URL Encoder & Decoder Online — Free Percent Encoding Tool | CodeUtilo",
    description: "Encode or decode URLs and query string parameters instantly. Handles special characters, spaces, and unicode. Free online tool.",
    url: "https://codeutilo.com/url-encoder-decoder",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "URL Encoder & Decoder Online — Free Percent Encoding Tool | CodeUtilo",
    description: "Encode or decode URLs and query string parameters instantly. Handles special characters, spaces, and unicode. Free online tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/url-encoder-decoder",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Url Encoder Decoder"
        description="Encode or decode URLs and query string parameters instantly. Handles special characters, spaces, and unicode. Free online tool."
        slug="url-encoder-decoder"
      />
      {children}
    </>
  );
}
