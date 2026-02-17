import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aspect Ratio Calculator — Resize & Scale Dimensions",
  description:
    "Calculate aspect ratios, resize dimensions proportionally, and find equivalent sizes. Free online calculator for designers and developers.",
  keywords: [
    "aspect ratio calculator",
    "image resize calculator",
    "16:9 calculator",
    "ratio calculator",
    "proportional resize",
    "screen resolution calculator",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
