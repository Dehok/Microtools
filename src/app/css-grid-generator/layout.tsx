import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "CSS Grid Generator — Visual Grid Layout Builder",
  description: "Create CSS Grid layouts with a visual editor. Set columns, rows, gap, and areas. Copy CSS code instantly. Free online tool.",
  keywords: ["css grid generator","grid layout generator","css grid builder","grid template generator","css grid tool"],
  openGraph: {
    title: "CSS Grid Generator — Visual Grid Layout Builder | CodeUtilo",
    description: "Create CSS Grid layouts with a visual editor. Set columns, rows, gap, and areas. Copy CSS code instantly. Free online tool.",
    url: "https://codeutilo.com/css-grid-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "CSS Grid Generator — Visual Grid Layout Builder | CodeUtilo",
    description: "Create CSS Grid layouts with a visual editor. Set columns, rows, gap, and areas. Copy CSS code instantly. Free online tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/css-grid-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Css Grid Generator"
        description="Create CSS Grid layouts with a visual editor. Set columns, rows, gap, and areas. Copy CSS code instantly. Free online tool."
        slug="css-grid-generator"
      />
        <FAQSchema faqs={[{"question":"Is the CSS Grid Generator free to use?","answer":"Yes, the CSS Grid Generator is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The CSS Grid Generator is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The CSS Grid Generator runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
