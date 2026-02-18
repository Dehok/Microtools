import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Aspect Ratio Calculator — Resize & Scale Dimensions",
  description: "Calculate aspect ratios, resize dimensions proportionally, and find equivalent sizes. Free online calculator for designers and developers.",
  keywords: ["aspect ratio calculator","image resize calculator","16:9 calculator","ratio calculator","proportional resize","screen resolution calculator"],
  openGraph: {
    title: "Aspect Ratio Calculator — Resize & Scale Dimensions | CodeUtilo",
    description: "Calculate aspect ratios, resize dimensions proportionally, and find equivalent sizes. Free online calculator for designers and developers.",
    url: "https://codeutilo.com/aspect-ratio-calculator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Aspect Ratio Calculator — Resize & Scale Dimensions | CodeUtilo",
    description: "Calculate aspect ratios, resize dimensions proportionally, and find equivalent sizes. Free online calculator for designers and developers.",
  },
  alternates: {
    canonical: "https://codeutilo.com/aspect-ratio-calculator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Aspect Ratio Calculator"
        description="Calculate aspect ratios, resize dimensions proportionally, and find equivalent sizes. Free online calculator for designers and developers."
        slug="aspect-ratio-calculator"
      />
        <FAQSchema faqs={[{"question":"Is the Aspect Ratio Calculator free to use?","answer":"Yes, the Aspect Ratio Calculator is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The Aspect Ratio Calculator is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The Aspect Ratio Calculator runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
