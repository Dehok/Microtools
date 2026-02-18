import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Base64 Image Encoder — Convert Images to Base64 Online",
  description: "Convert images to Base64 encoded strings. Supports PNG, JPG, GIF, SVG, and WebP. Get data URI, raw Base64, or HTML img tag.",
  keywords: ["base64 image encoder","image to base64","convert image base64","data uri generator","base64 encode image"],
  openGraph: {
    title: "Base64 Image Encoder — Convert Images to Base64 Online | CodeUtilo",
    description: "Convert images to Base64 encoded strings. Supports PNG, JPG, GIF, SVG, and WebP. Get data URI, raw Base64, or HTML img tag.",
    url: "https://codeutilo.com/base64-image-encoder",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Base64 Image Encoder — Convert Images to Base64 Online | CodeUtilo",
    description: "Convert images to Base64 encoded strings. Supports PNG, JPG, GIF, SVG, and WebP. Get data URI, raw Base64, or HTML img tag.",
  },
  alternates: {
    canonical: "https://codeutilo.com/base64-image-encoder",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Base64 Image Encoder"
        description="Convert images to Base64 encoded strings. Supports PNG, JPG, GIF, SVG, and WebP. Get data URI, raw Base64, or HTML img tag."
        slug="base64-image-encoder"
      />
        <FAQSchema faqs={[{"question":"Is the Base64 Image Encoder free to use?","answer":"Yes, the Base64 Image Encoder is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The Base64 Image Encoder is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The Base64 Image Encoder runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
