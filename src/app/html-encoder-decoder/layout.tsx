import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "HTML Encoder & Decoder Online — Free HTML Entity Tool",
  description: "Encode special characters to HTML entities or decode HTML entities back to text. Free online HTML encoder and decoder.",
  keywords: ["html encoder","html decoder","html entities","html encode online","html special characters"],
  openGraph: {
    title: "HTML Encoder & Decoder Online — Free HTML Entity Tool | CodeUtilo",
    description: "Encode special characters to HTML entities or decode HTML entities back to text. Free online HTML encoder and decoder.",
    url: "https://codeutilo.com/html-encoder-decoder",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "HTML Encoder & Decoder Online — Free HTML Entity Tool | CodeUtilo",
    description: "Encode special characters to HTML entities or decode HTML entities back to text. Free online HTML encoder and decoder.",
  },
  alternates: {
    canonical: "https://codeutilo.com/html-encoder-decoder",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Html Encoder Decoder"
        description="Encode special characters to HTML entities or decode HTML entities back to text. Free online HTML encoder and decoder."
        slug="html-encoder-decoder"
      />
      {children}
    </>
  );
}
