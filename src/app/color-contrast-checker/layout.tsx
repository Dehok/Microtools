import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Color Contrast Checker — WCAG Accessibility Validator",
  description: "Check color contrast ratios for WCAG 2.1 compliance. Test text and background colors for AA and AAA accessibility standards.",
  keywords: ["color contrast checker","wcag contrast","accessibility checker","contrast ratio","color accessibility"],
  openGraph: {
    title: "Color Contrast Checker — WCAG Accessibility Validator | CodeUtilo",
    description: "Check color contrast ratios for WCAG 2.1 compliance. Test text and background colors for AA and AAA accessibility standards.",
    url: "https://codeutilo.com/color-contrast-checker",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Color Contrast Checker — WCAG Accessibility Validator | CodeUtilo",
    description: "Check color contrast ratios for WCAG 2.1 compliance. Test text and background colors for AA and AAA accessibility standards.",
  },
  alternates: {
    canonical: "https://codeutilo.com/color-contrast-checker",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Color Contrast Checker"
        description="Check color contrast ratios for WCAG 2.1 compliance. Test text and background colors for AA and AAA accessibility standards."
        slug="color-contrast-checker"
      />
        <FAQSchema faqs={[{"question":"Is the Color Contrast Checker free to use?","answer":"Yes, the Color Contrast Checker is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The Color Contrast Checker is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The Color Contrast Checker runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
