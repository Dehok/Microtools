import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "CSS Border Radius Generator — Visual Radius Editor",
  description: "Create CSS border-radius values with a visual editor. Adjust each corner individually. Copy CSS code instantly. Free online tool.",
  keywords: ["border radius generator","css border radius","rounded corners css","border radius editor","css radius tool"],
  openGraph: {
    title: "CSS Border Radius Generator — Visual Radius Editor | CodeUtilo",
    description: "Create CSS border-radius values with a visual editor. Adjust each corner individually. Copy CSS code instantly. Free online tool.",
    url: "https://codeutilo.com/border-radius-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "CSS Border Radius Generator — Visual Radius Editor | CodeUtilo",
    description: "Create CSS border-radius values with a visual editor. Adjust each corner individually. Copy CSS code instantly. Free online tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/border-radius-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Border Radius Generator"
        description="Create CSS border-radius values with a visual editor. Adjust each corner individually. Copy CSS code instantly. Free online tool."
        slug="border-radius-generator"
      />
        <FAQSchema faqs={[{"question":"Is the CSS Border Radius Generator free to use?","answer":"Yes, the CSS Border Radius Generator is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The CSS Border Radius Generator is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The CSS Border Radius Generator runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
