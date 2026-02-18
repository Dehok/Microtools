import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "CSS Gradient Generator — Linear & Radial Gradients",
  description: "Create beautiful CSS gradients with a visual editor. Linear and radial gradients with multiple color stops. Free online tool.",
  keywords: ["css gradient generator","linear gradient","radial gradient","css gradient","gradient maker","background gradient"],
  openGraph: {
    title: "CSS Gradient Generator — Linear & Radial Gradients | CodeUtilo",
    description: "Create beautiful CSS gradients with a visual editor. Linear and radial gradients with multiple color stops. Free online tool.",
    url: "https://codeutilo.com/css-gradient-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "CSS Gradient Generator — Linear & Radial Gradients | CodeUtilo",
    description: "Create beautiful CSS gradients with a visual editor. Linear and radial gradients with multiple color stops. Free online tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/css-gradient-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Css Gradient Generator"
        description="Create beautiful CSS gradients with a visual editor. Linear and radial gradients with multiple color stops. Free online tool."
        slug="css-gradient-generator"
      />
        <FAQSchema faqs={[{"question":"Is the CSS Gradient Generator free to use?","answer":"Yes, the CSS Gradient Generator is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The CSS Gradient Generator is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The CSS Gradient Generator runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
