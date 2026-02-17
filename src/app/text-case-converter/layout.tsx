import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Text Case Converter Online — camelCase, UPPERCASE, snake_case & More",
  description:
    "Convert text between uppercase, lowercase, title case, camelCase, PascalCase, snake_case, kebab-case, and more. Free online text case converter tool.",
  keywords: [
    "text case converter",
    "uppercase lowercase converter",
    "camelCase converter",
    "snake_case converter",
    "title case converter",
    "kebab-case",
    "text transform",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
