import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HTML Table Generator — Create Tables Visually",
  description:
    "Create HTML tables with a visual editor. Set rows, columns, headers, and styling. Copy clean HTML table code. Free table generator.",
  keywords: ["html table generator", "create html table", "table generator", "html table builder", "table code generator"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
