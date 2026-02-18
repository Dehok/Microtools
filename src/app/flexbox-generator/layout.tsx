import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "CSS Flexbox Generator — Visual Flexbox Playground",
  description: "Generate CSS flexbox layouts with a visual editor. Set direction, alignment, wrapping, gap, and more. Copy CSS code instantly.",
  keywords: ["flexbox generator","css flexbox","flexbox playground","flex layout generator","css flex"],
  openGraph: {
    title: "CSS Flexbox Generator — Visual Flexbox Playground | CodeUtilo",
    description: "Generate CSS flexbox layouts with a visual editor. Set direction, alignment, wrapping, gap, and more. Copy CSS code instantly.",
    url: "https://codeutilo.com/flexbox-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "CSS Flexbox Generator — Visual Flexbox Playground | CodeUtilo",
    description: "Generate CSS flexbox layouts with a visual editor. Set direction, alignment, wrapping, gap, and more. Copy CSS code instantly.",
  },
  alternates: {
    canonical: "https://codeutilo.com/flexbox-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Flexbox Generator"
        description="Generate CSS flexbox layouts with a visual editor. Set direction, alignment, wrapping, gap, and more. Copy CSS code instantly."
        slug="flexbox-generator"
      />
        <FAQSchema faqs={[{"question":"Is the CSS Flexbox Generator free to use?","answer":"Yes, the CSS Flexbox Generator is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The CSS Flexbox Generator is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The CSS Flexbox Generator runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
