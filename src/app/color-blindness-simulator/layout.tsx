import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Color Blindness Simulator — Preview Color Vision Deficiency",
  description: "Simulate how colors appear with different types of color blindness. Test protanopia, deuteranopia, tritanopia, and more. Free accessibility tool.",
  keywords: ["color blindness simulator","color vision deficiency","protanopia","deuteranopia","accessibility tool","color blind test"],
  openGraph: {
    title: "Color Blindness Simulator — Preview Color Vision Deficiency | CodeUtilo",
    description: "Simulate how colors appear with different types of color blindness. Test protanopia, deuteranopia, tritanopia, and more. Free accessibility tool.",
    url: "https://codeutilo.com/color-blindness-simulator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Color Blindness Simulator — Preview Color Vision Deficiency | CodeUtilo",
    description: "Simulate how colors appear with different types of color blindness. Test protanopia, deuteranopia, tritanopia, and more. Free accessibility tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/color-blindness-simulator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Color Blindness Simulator"
        description="Simulate how colors appear with different types of color blindness. Test protanopia, deuteranopia, tritanopia, and more. Free accessibility tool."
        slug="color-blindness-simulator"
      />
        <FAQSchema faqs={[{"question":"Is the Color Blindness Simulator free to use?","answer":"Yes, the Color Blindness Simulator is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The Color Blindness Simulator is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The Color Blindness Simulator runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
