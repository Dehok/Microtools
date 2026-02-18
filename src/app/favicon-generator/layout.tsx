import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Favicon Generator — SVG Favicon Maker Online",
  description: "Generate SVG favicons with emoji, text, or initials. Copy the SVG or data URI. No upload needed. Free online tool.",
  keywords: ["favicon generator","svg favicon","favicon maker","emoji favicon","favicon creator"],
  openGraph: {
    title: "Favicon Generator — SVG Favicon Maker Online | CodeUtilo",
    description: "Generate SVG favicons with emoji, text, or initials. Copy the SVG or data URI. No upload needed. Free online tool.",
    url: "https://codeutilo.com/favicon-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Favicon Generator — SVG Favicon Maker Online | CodeUtilo",
    description: "Generate SVG favicons with emoji, text, or initials. Copy the SVG or data URI. No upload needed. Free online tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/favicon-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Favicon Generator"
        description="Generate SVG favicons with emoji, text, or initials. Copy the SVG or data URI. No upload needed. Free online tool."
        slug="favicon-generator"
      />
        <FAQSchema faqs={[{"question":"Is the Favicon Generator free to use?","answer":"Yes, the Favicon Generator is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The Favicon Generator is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The Favicon Generator runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
