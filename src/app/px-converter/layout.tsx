import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "PX to REM / EM Converter — CSS Unit Calculator",
  description: "Convert between px, rem, em, pt, vw, vh, and percent. Quick reference table included. Free online CSS unit converter.",
  keywords: ["px to rem","rem to px","em to px","css unit converter","pixel converter","rem calculator"],
  openGraph: {
    title: "PX to REM / EM Converter — CSS Unit Calculator | CodeUtilo",
    description: "Convert between px, rem, em, pt, vw, vh, and percent. Quick reference table included. Free online CSS unit converter.",
    url: "https://codeutilo.com/px-converter",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "PX to REM / EM Converter — CSS Unit Calculator | CodeUtilo",
    description: "Convert between px, rem, em, pt, vw, vh, and percent. Quick reference table included. Free online CSS unit converter.",
  },
  alternates: {
    canonical: "https://codeutilo.com/px-converter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Px Converter"
        description="Convert between px, rem, em, pt, vw, vh, and percent. Quick reference table included. Free online CSS unit converter."
        slug="px-converter"
      />
        <FAQSchema faqs={[{"question":"Is the PX / REM / EM Converter free to use?","answer":"Yes, the PX / REM / EM Converter is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The PX / REM / EM Converter is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The PX / REM / EM Converter runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
