import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Unicode Character Lookup & Inspector — Online Tool",
  description: "Inspect Unicode characters: code points, HTML entities, CSS escapes, and UTF-8 bytes. Browse common character sets. Free online tool.",
  keywords: ["unicode lookup","unicode character finder","character code point","HTML entity lookup","unicode inspector","UTF-8 bytes"],
  openGraph: {
    title: "Unicode Character Lookup & Inspector — Online Tool | CodeUtilo",
    description: "Inspect Unicode characters: code points, HTML entities, CSS escapes, and UTF-8 bytes. Browse common character sets. Free online tool.",
    url: "https://codeutilo.com/unicode-lookup",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Unicode Character Lookup & Inspector — Online Tool | CodeUtilo",
    description: "Inspect Unicode characters: code points, HTML entities, CSS escapes, and UTF-8 bytes. Browse common character sets. Free online tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/unicode-lookup",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Unicode Lookup"
        description="Inspect Unicode characters: code points, HTML entities, CSS escapes, and UTF-8 bytes. Browse common character sets. Free online tool."
        slug="unicode-lookup"
      />
        <FAQSchema faqs={[{"question":"Is the Unicode Character Lookup free to use?","answer":"Yes, the Unicode Character Lookup is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The Unicode Character Lookup is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The Unicode Character Lookup runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
