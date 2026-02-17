import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Markdown Table Generator — Create Tables Visually",
  description: "Generate Markdown tables with a visual editor. Set alignment, add rows/columns, and copy the result. Free online tool.",
  keywords: ["markdown table generator", "markdown table", "create markdown table", "table to markdown", "md table generator"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
