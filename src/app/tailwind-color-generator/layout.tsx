import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Tailwind CSS Color Generator — Custom Color Palette Maker",
  description: "Generate Tailwind CSS color palettes from any base color. Get shades 50-950 with ready-to-use config. Free online tool.",
  keywords: ["tailwind color generator","tailwind colors","tailwind palette","css color palette","tailwind custom colors"],
  openGraph: {
    title: "Tailwind CSS Color Generator — Custom Color Palette Maker | CodeUtilo",
    description: "Generate Tailwind CSS color palettes from any base color. Get shades 50-950 with ready-to-use config. Free online tool.",
    url: "https://codeutilo.com/tailwind-color-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Tailwind CSS Color Generator — Custom Color Palette Maker | CodeUtilo",
    description: "Generate Tailwind CSS color palettes from any base color. Get shades 50-950 with ready-to-use config. Free online tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/tailwind-color-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Tailwind Color Generator"
        description="Generate Tailwind CSS color palettes from any base color. Get shades 50-950 with ready-to-use config. Free online tool."
        slug="tailwind-color-generator"
      />
        <FAQSchema faqs={[{"question":"Is the Tailwind Color Generator free to use?","answer":"Yes, the Tailwind Color Generator is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The Tailwind Color Generator is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The Tailwind Color Generator runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
