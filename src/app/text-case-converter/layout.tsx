import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Text Case Converter — UPPER, lower, camelCase & More",
  description: "Convert text between uppercase, lowercase, camelCase, snake_case, and more. Free online tool.",
  keywords: ["text case converter","uppercase converter","lowercase converter","camelcase converter","snake case converter"],
  openGraph: {
    title: "Text Case Converter — UPPER, lower, camelCase & More | CodeUtilo",
    description: "Convert text between uppercase, lowercase, camelCase, snake_case, and more. Free online tool.",
    url: "https://codeutilo.com/text-case-converter",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Text Case Converter — UPPER, lower, camelCase & More | CodeUtilo",
    description: "Convert text between uppercase, lowercase, camelCase, snake_case, and more. Free online tool.",
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
        description="Convert text between uppercase, lowercase, camelCase, snake_case, and more. Free online tool."
        slug="text-case-converter"
      />
      {children}
    </>
  );
}
