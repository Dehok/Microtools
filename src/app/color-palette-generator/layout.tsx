import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Color Palette Generator — Random & Harmonious Color Schemes",
  description: "Generate beautiful color palettes with one click. Create harmonious, complementary, and random color schemes. Copy HEX, RGB, or HSL values.",
  keywords: ["color palette generator","color scheme","random colors","color generator","color palette maker"],
  openGraph: {
    title: "Color Palette Generator — Random & Harmonious Color Schemes | CodeUtilo",
    description: "Generate beautiful color palettes with one click. Create harmonious, complementary, and random color schemes. Copy HEX, RGB, or HSL values.",
    url: "https://codeutilo.com/color-palette-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Color Palette Generator — Random & Harmonious Color Schemes | CodeUtilo",
    description: "Generate beautiful color palettes with one click. Create harmonious, complementary, and random color schemes. Copy HEX, RGB, or HSL values.",
  },
  alternates: {
    canonical: "https://codeutilo.com/color-palette-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Color Palette Generator"
        description="Generate beautiful color palettes with one click. Create harmonious, complementary, and random color schemes. Copy HEX, RGB, or HSL values."
        slug="color-palette-generator"
      />
        <FAQSchema faqs={[{"question":"Is the Color Palette Generator free to use?","answer":"Yes, the Color Palette Generator is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The Color Palette Generator is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The Color Palette Generator runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
