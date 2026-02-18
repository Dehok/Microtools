import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Timestamp Converter — ISO 8601, Unix, UTC Online",
  description: "Convert between ISO 8601, Unix timestamps (seconds & milliseconds), UTC, and human-readable formats. Free online timestamp converter.",
  keywords: ["timestamp converter","ISO 8601 converter","unix timestamp to date","date to unix timestamp","UTC converter","epoch to date"],
  openGraph: {
    title: "Timestamp Converter — ISO 8601, Unix, UTC Online | CodeUtilo",
    description: "Convert between ISO 8601, Unix timestamps (seconds & milliseconds), UTC, and human-readable formats. Free online timestamp converter.",
    url: "https://codeutilo.com/timestamp-converter",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Timestamp Converter — ISO 8601, Unix, UTC Online | CodeUtilo",
    description: "Convert between ISO 8601, Unix timestamps (seconds & milliseconds), UTC, and human-readable formats. Free online timestamp converter.",
  },
  alternates: {
    canonical: "https://codeutilo.com/timestamp-converter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Timestamp Converter"
        description="Convert between ISO 8601, Unix timestamps (seconds & milliseconds), UTC, and human-readable formats. Free online timestamp converter."
        slug="timestamp-converter"
      />
        <FAQSchema faqs={[{"question":"Is the Timestamp Converter free to use?","answer":"Yes, the Timestamp Converter is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The Timestamp Converter is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The Timestamp Converter runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
