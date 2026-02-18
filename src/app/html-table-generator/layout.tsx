import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "HTML Table Generator — Create Tables Visually",
  description: "Create HTML tables with a visual editor. Set rows, columns, headers, and styling. Copy clean HTML table code. Free table generator.",
  keywords: ["html table generator","create html table","table generator","html table builder","table code generator"],
  openGraph: {
    title: "HTML Table Generator — Create Tables Visually | CodeUtilo",
    description: "Create HTML tables with a visual editor. Set rows, columns, headers, and styling. Copy clean HTML table code. Free table generator.",
    url: "https://codeutilo.com/html-table-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "HTML Table Generator — Create Tables Visually | CodeUtilo",
    description: "Create HTML tables with a visual editor. Set rows, columns, headers, and styling. Copy clean HTML table code. Free table generator.",
  },
  alternates: {
    canonical: "https://codeutilo.com/html-table-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Html Table Generator"
        description="Create HTML tables with a visual editor. Set rows, columns, headers, and styling. Copy clean HTML table code. Free table generator."
        slug="html-table-generator"
      />
        <FAQSchema faqs={[{"question":"Is the HTML Table Generator free to use?","answer":"Yes, the HTML Table Generator is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The HTML Table Generator is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The HTML Table Generator runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
