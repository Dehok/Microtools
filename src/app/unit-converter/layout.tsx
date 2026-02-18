import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Unit Converter — Length, Weight, Temperature & More",
  description: "Convert between units of length, weight, temperature, speed, area, and volume. Free online unit converter with instant results.",
  keywords: ["unit converter","convert units","length converter","weight converter","temperature converter","metric converter"],
  openGraph: {
    title: "Unit Converter — Length, Weight, Temperature & More | CodeUtilo",
    description: "Convert between units of length, weight, temperature, speed, area, and volume. Free online unit converter with instant results.",
    url: "https://codeutilo.com/unit-converter",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Unit Converter — Length, Weight, Temperature & More | CodeUtilo",
    description: "Convert between units of length, weight, temperature, speed, area, and volume. Free online unit converter with instant results.",
  },
  alternates: {
    canonical: "https://codeutilo.com/unit-converter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Unit Converter"
        description="Convert between units of length, weight, temperature, speed, area, and volume. Free online unit converter with instant results."
        slug="unit-converter"
      />
        <FAQSchema faqs={[{"question":"Is the Unit Converter free to use?","answer":"Yes, the Unit Converter is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The Unit Converter is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The Unit Converter runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
