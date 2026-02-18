import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Text Case Converter Online — camelCase, UPPERCASE, snake_case & More",
  description: "Convert text between uppercase, lowercase, title case, camelCase, PascalCase, snake_case, kebab-case, and more. Free online text case converter tool.",
  keywords: ["text case converter","uppercase lowercase converter","camelCase converter","snake_case converter","title case converter","kebab-case","text transform"],
  openGraph: {
    title: "Text Case Converter Online — camelCase, UPPERCASE, snake_case & More | CodeUtilo",
    description: "Convert text between uppercase, lowercase, title case, camelCase, PascalCase, snake_case, kebab-case, and more. Free online text case converter tool.",
    url: "https://codeutilo.com/text-case-converter",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Text Case Converter Online — camelCase, UPPERCASE, snake_case & More | CodeUtilo",
    description: "Convert text between uppercase, lowercase, title case, camelCase, PascalCase, snake_case, kebab-case, and more. Free online text case converter tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/text-case-converter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Text Case Converter"
        description="Convert text between uppercase, lowercase, title case, camelCase, PascalCase, snake_case, kebab-case, and more. Free online text case converter tool."
        slug="text-case-converter"
      />
        <FAQSchema faqs={[{"question":"Is the Text Case Converter free to use?","answer":"Yes, the Text Case Converter is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The Text Case Converter is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The Text Case Converter runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
