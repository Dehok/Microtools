import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSS Flexbox Generator — Visual Flexbox Playground",
  description:
    "Generate CSS flexbox layouts with a visual editor. Set direction, alignment, wrapping, gap, and more. Copy CSS code instantly.",
  keywords: ["flexbox generator", "css flexbox", "flexbox playground", "flex layout generator", "css flex"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
