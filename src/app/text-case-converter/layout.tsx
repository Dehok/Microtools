import type { Metadata } from "next";
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
      {children}
    </>
  );
}
