import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "HTML Encoder & Decoder Online",
  description: "Encode special characters to HTML entities or decode them back to text. Free online HTML encoding tool.",
  keywords: ["html encoder","html decoder","html entities","encode html","html entity converter"],
  openGraph: {
    title: "HTML Encoder & Decoder Online | CodeUtilo",
    description: "Encode special characters to HTML entities or decode them back to text. Free online HTML encoding tool.",
    url: "https://codeutilo.com/html-encoder-decoder",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "HTML Encoder & Decoder Online | CodeUtilo",
    description: "Encode special characters to HTML entities or decode them back to text. Free online HTML encoding tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/html-encoder-decoder",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="HTML Encoder / Decoder"
        description="Encode special characters to HTML entities or decode them back to text. Free online HTML encoding tool."
        slug="html-encoder-decoder"
      />
      {children}
    </>
  );
}
