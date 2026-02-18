import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
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
        <FAQSchema faqs={[{"question":"Why do URLs need encoding?","answer":"URLs can only contain a limited set of ASCII characters. Special characters like spaces, &, =, and non-ASCII characters must be percent-encoded (e.g., space → %20) to be valid in URLs."},{"question":"What is the difference between encodeURI and encodeURIComponent?","answer":"encodeURI() encodes a complete URI, preserving characters like :, /, ?, and #. encodeURIComponent() encodes everything except letters, digits, and a few special characters — use it for encoding individual query parameter values."},{"question":"What does %20 mean in a URL?","answer":"%20 is the percent-encoded representation of a space character. Sometimes you'll also see + used for spaces in query strings (application/x-www-form-urlencoded), but %20 is the standard URL encoding."},{"question":"Is URL encoding reversible?","answer":"Yes. URL encoding is a simple, reversible transformation. Any percent-encoded string can be decoded back to its original characters using this tool or the decodeURIComponent() function in JavaScript."}]} />
      {children}
    </>
  );
}
