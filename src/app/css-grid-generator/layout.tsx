import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSS Grid Generator — Visual Grid Layout Builder",
  description:
    "Create CSS Grid layouts with a visual editor. Set columns, rows, gap, and areas. Copy CSS code instantly. Free online tool.",
  keywords: ["css grid generator", "grid layout generator", "css grid builder", "grid template generator", "css grid tool"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
