import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
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
        <FAQSchema faqs={[{"question":"What is Base64 encoding?","answer":"Base64 is a method of encoding binary data into ASCII text using 64 characters (A-Z, a-z, 0-9, +, /). It's commonly used to embed images in HTML, transmit data in URLs, and encode email attachments."},{"question":"Is Base64 encoding the same as encryption?","answer":"No. Base64 is an encoding scheme, not encryption. Anyone can decode Base64 text back to its original form. It provides no security — it's only used to safely transmit binary data as text."},{"question":"Why does Base64 increase the size of data?","answer":"Base64 encoding increases data size by approximately 33% because it represents 3 bytes of binary data using 4 ASCII characters. This trade-off is necessary for safe text-based transmission."},{"question":"Does this tool handle Unicode characters?","answer":"Yes. The tool encodes text as UTF-8 before Base64 conversion, ensuring that special characters, emojis, and non-Latin scripts are handled correctly."}]} />
      {children}
    </>
  );
}
