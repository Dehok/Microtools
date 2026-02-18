import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Reading Time Calculator — Estimate Read Time",
  description: "Estimate reading time and speaking time for any text. Get word count, character count, and paragraph stats. Free reading time estimator.",
  keywords: ["reading time calculator","estimate reading time","word count","reading speed","speaking time calculator"],
  openGraph: {
    title: "Reading Time Calculator — Estimate Read Time | CodeUtilo",
    description: "Estimate reading time and speaking time for any text. Get word count, character count, and paragraph stats. Free reading time estimator.",
    url: "https://codeutilo.com/reading-time-calculator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Reading Time Calculator — Estimate Read Time | CodeUtilo",
    description: "Estimate reading time and speaking time for any text. Get word count, character count, and paragraph stats. Free reading time estimator.",
  },
  alternates: {
    canonical: "https://codeutilo.com/reading-time-calculator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Reading Time Calculator"
        description="Estimate reading time and speaking time for any text. Get word count, character count, and paragraph stats. Free reading time estimator."
        slug="reading-time-calculator"
      />
        <FAQSchema faqs={[{"question":"Is the Reading Time Calculator free to use?","answer":"Yes, the Reading Time Calculator is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The Reading Time Calculator is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The Reading Time Calculator runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
