import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Placeholder Image Generator — SVG Placeholder Images",
  description: "Generate lightweight SVG placeholder images with custom dimensions, colors, and text. No external service needed. Free online tool.",
  keywords: ["placeholder image generator","SVG placeholder","dummy image generator","placeholder image","test image generator","placeholder.com alternative"],
  openGraph: {
    title: "Placeholder Image Generator — SVG Placeholder Images | CodeUtilo",
    description: "Generate lightweight SVG placeholder images with custom dimensions, colors, and text. No external service needed. Free online tool.",
    url: "https://codeutilo.com/placeholder-image",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Placeholder Image Generator — SVG Placeholder Images | CodeUtilo",
    description: "Generate lightweight SVG placeholder images with custom dimensions, colors, and text. No external service needed. Free online tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/placeholder-image",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Placeholder Image"
        description="Generate lightweight SVG placeholder images with custom dimensions, colors, and text. No external service needed. Free online tool."
        slug="placeholder-image"
      />
        <FAQSchema faqs={[{"question":"Is the Placeholder Image Generator free to use?","answer":"Yes, the Placeholder Image Generator is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The Placeholder Image Generator is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The Placeholder Image Generator runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
