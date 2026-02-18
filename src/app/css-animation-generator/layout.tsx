import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "CSS Animation Generator — @keyframes Builder",
  description: "Generate CSS @keyframes animations visually. Configure timing, easing, direction, keyframes, and copy the ready-to-use CSS code. Free online tool.",
  keywords: ["css animation generator","keyframes generator","css keyframes","animation builder","css transitions","web animation tool"],
  openGraph: {
    title: "CSS Animation Generator — @keyframes Builder | CodeUtilo",
    description: "Generate CSS @keyframes animations visually. Configure timing, easing, direction, keyframes, and copy the ready-to-use CSS code. Free online tool.",
    url: "https://codeutilo.com/css-animation-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "CSS Animation Generator — @keyframes Builder | CodeUtilo",
    description: "Generate CSS @keyframes animations visually. Configure timing, easing, direction, keyframes, and copy the ready-to-use CSS code. Free online tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/css-animation-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Css Animation Generator"
        description="Generate CSS @keyframes animations visually. Configure timing, easing, direction, keyframes, and copy the ready-to-use CSS code. Free online tool."
        slug="css-animation-generator"
      />
        <FAQSchema faqs={[{"question":"Is the CSS Animation Generator free to use?","answer":"Yes, the CSS Animation Generator is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The CSS Animation Generator is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The CSS Animation Generator runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
