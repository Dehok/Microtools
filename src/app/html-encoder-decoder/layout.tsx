import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
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
        <FAQSchema faqs={[{"question":"Why do I need to encode HTML entities?","answer":"HTML encoding prevents special characters like <, >, and & from being interpreted as HTML tags or entities. This is essential for displaying code snippets and preventing cross-site scripting (XSS) attacks."},{"question":"What is XSS and how does HTML encoding prevent it?","answer":"XSS (Cross-Site Scripting) is an attack where malicious scripts are injected into web pages. HTML encoding user input ensures that < and > are displayed as text rather than interpreted as HTML tags, preventing script execution."},{"question":"What is the difference between &amp; and &#38;?","answer":"&amp; is a named HTML entity, while &#38; is its numeric equivalent. Both represent the ampersand (&) character. Named entities are more readable, while numeric entities work for any Unicode character."},{"question":"Should I encode all special characters?","answer":"At minimum, encode these five characters: < (&lt;), > (&gt;), & (&amp;), \" (&quot;), and ' (&#39;). These are the characters that can cause interpretation issues or security vulnerabilities in HTML."}]} />
      {children}
    </>
  );
}
